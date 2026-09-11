#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
collecte_tailleurs_dakar.py
===========================

Collecte des ateliers de couture / tailleurs de la région de Dakar
via l'API Google Places (New), pour la prospection AZ-TAILORS.

Objectif : ~800 à 1500 fiches réelles (nom, quartier, commune, adresse,
GPS, téléphone, note Google, lien Maps).

Stratégie en 2 étapes pour minimiser le coût :
  ETAPE 1 (découverte) : on ne demande QUE les identifiants (places.id).
      C'est le SKU "Essentials", le moins cher de tous.
      - Nearby Search sur le type officiel Google "tailor"
      - Text Search sur les mots-clés locaux (couturier, tailleur, brodeur...)
      - Subdivision automatique des zones saturées (20 résultats = on redécoupe)
  ETAPE 2 (détails) : un seul appel Place Details par fiche UNIQUE,
      qui récupère le téléphone et l'adresse.
      => on ne paie jamais deux fois pour le même atelier.

Le script est REPRENABLE : tout est mis en cache dans ./cache_dakar/.
Si tu l'interromps (Ctrl+C) ou s'il plante, relance-le : il ne refera
aucun appel déjà payé.

------------------------------------------------------------------
INSTALLATION
------------------------------------------------------------------
    pip install requests openpyxl

------------------------------------------------------------------
CLÉ API — 5 minutes
------------------------------------------------------------------
 1. https://console.cloud.google.com/  -> créer un projet (ex. "az-tailors")
 2. Menu "APIs & Services" > "Library" > activer **Places API (New)**
    (bien la "(New)", pas l'ancienne)
 3. "Credentials" > "Create credentials" > "API key" > copier la clé
 4. Activer la facturation (obligatoire, mais le crédit mensuel gratuit
    de Google couvre très largement cette collecte)
 5. Recommandé : restreindre la clé à "Places API (New)" uniquement.

Puis, dans ton terminal :
    export GOOGLE_MAPS_API_KEY="AIza...ta_cle"      # Linux / macOS
    setx GOOGLE_MAPS_API_KEY "AIza...ta_cle"        # Windows (rouvrir le terminal)

------------------------------------------------------------------
LANCEMENT
------------------------------------------------------------------
    python collecte_tailleurs_dakar.py                    # collecte complète
    python collecte_tailleurs_dakar.py --dry-run          # compte les appels, ne dépense RIEN
    python collecte_tailleurs_dakar.py --zones pikine     # une seule zone
    python collecte_tailleurs_dakar.py --export-only      # ré-exporte depuis le cache
    python collecte_tailleurs_dakar.py --max-details 300  # plafonne l'étape 2

------------------------------------------------------------------
SORTIES
------------------------------------------------------------------
    tailleurs_dakar.csv    -> import Supabase / CRM
    tailleurs_dakar.xlsx   -> feuille de prospection (colonnes de suivi)
"""

import argparse
import csv
import json
import math
import os
import re
import sys
import time
import unicodedata
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("Il manque une dépendance :  pip install requests openpyxl")

# ------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------

API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "").strip()

BASE = "https://places.googleapis.com/v1"
CACHE_DIR = Path("cache_dakar")
IDS_FILE = CACHE_DIR / "place_ids.json"
DETAILS_FILE = CACHE_DIR / "details.json"
PROGRESS_FILE = CACHE_DIR / "tiles_done.json"

OUT_CSV = "tailleurs_dakar.csv"
OUT_XLSX = "tailleurs_dakar.xlsx"

# Zones de la région de Dakar, en boîtes lat/lon.
# Découpées pour coller à la terre ferme et éviter de brûler des appels
# sur l'océan (la presqu'île du Cap-Vert est très découpée).
ZONES = {
    "dakar-plateau-medina": (14.655, -17.450, 14.695, -17.410),
    "fann-point-e-sicap":   (14.680, -17.480, 14.715, -17.440),
    "grand-dakar-hlm":      (14.695, -17.460, 14.725, -17.425),
    "ouakam-ngor-almadies": (14.715, -17.520, 14.760, -17.470),
    "yoff-foire":           (14.735, -17.490, 14.765, -17.440),
    "grand-yoff-patte-doie":(14.720, -17.470, 14.750, -17.435),
    "parcelles-assainies":  (14.745, -17.450, 14.775, -17.400),
    "hann-bel-air-dalifort":(14.700, -17.430, 14.740, -17.390),
    "pikine":               (14.735, -17.415, 14.780, -17.360),
    "guediawaye":           (14.765, -17.415, 14.795, -17.355),
    "thiaroye-yeumbeul":    (14.740, -17.380, 14.790, -17.310),
    "keur-massar-malika":   (14.760, -17.340, 14.810, -17.270),
    "rufisque":             (14.690, -17.310, 14.740, -17.240),
    "bargny-diamniadio":    (14.680, -17.245, 14.760, -17.150),
}

# Mots-clés Text Search. Le vocabulaire local compte plus que le français
# standard : à Dakar une enseigne s'appelle presque toujours "couture".
KEYWORDS = [
    "couturier",
    "tailleur",
    "atelier de couture",
    "couture",
    "brodeur broderie",
    "styliste modéliste",
]

# Taille de tuile pour le Nearby Search, en mètres (rayon du cercle).
NEARBY_RADIUS_M = 900.0
NEARBY_STEP_M = 1300.0        # pas de la grille (< 2*rayon => recouvrement)
NEARBY_MAX_DEPTH = 2          # subdivisions successives d'une tuile saturée

SLEEP_BETWEEN_CALLS = 0.06    # politesse / anti-429
MAX_RETRIES = 4

# Champs demandés à l'étape 2. C'est ici que se trouve le téléphone.
DETAIL_FIELDS = ",".join([
    "id",
    "displayName",
    "formattedAddress",
    "shortFormattedAddress",
    "addressComponents",
    "location",
    "nationalPhoneNumber",
    "internationalPhoneNumber",
    "websiteUri",
    "googleMapsUri",
    "rating",
    "userRatingCount",
    "businessStatus",
    "primaryTypeDisplayName",
    "types",
    "regularOpeningHours.weekdayDescriptions",
])

# ------------------------------------------------------------------
# COMPTEURS
# ------------------------------------------------------------------

STATS = {
    "nearby_calls": 0,
    "text_calls": 0,
    "detail_calls": 0,
    "cache_hits": 0,
    "errors": 0,
}
DRY_RUN = False


# ------------------------------------------------------------------
# UTILITAIRES
# ------------------------------------------------------------------

def log(msg):
    print(msg, flush=True)


def load_json(path, default):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            log(f"  ! cache illisible ({path}), on repart de zéro pour ce fichier")
    return default


def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(path)   # écriture atomique : pas de cache corrompu si Ctrl+C


def post(url, body, fieldmask):
    """Appel POST à l'API Places avec retry exponentiel."""
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": fieldmask,
    }
    for attempt in range(MAX_RETRIES):
        try:
            r = requests.post(url, headers=headers, json=body, timeout=30)
        except requests.RequestException as e:
            log(f"  ! réseau: {e} (tentative {attempt+1})")
            time.sleep(2 ** attempt)
            continue

        if r.status_code == 200:
            time.sleep(SLEEP_BETWEEN_CALLS)
            return r.json()
        if r.status_code == 429:
            wait = 2 ** attempt
            log(f"  . quota atteint, pause {wait}s")
            time.sleep(wait)
            continue
        if r.status_code in (401, 403):
            sys.exit(
                f"\nERREUR {r.status_code} — clé API refusée.\n"
                f"Vérifie que 'Places API (New)' est activée, que la facturation\n"
                f"est active, et que la clé n'est pas restreinte à un autre usage.\n"
                f"Réponse Google : {r.text[:400]}"
            )
        log(f"  ! HTTP {r.status_code}: {r.text[:200]}")
        STATS["errors"] += 1
        return None
    STATS["errors"] += 1
    return None


def get(url, params, fieldmask):
    headers = {"X-Goog-Api-Key": API_KEY, "X-Goog-FieldMask": fieldmask}
    for attempt in range(MAX_RETRIES):
        try:
            r = requests.get(url, headers=headers, params=params, timeout=30)
        except requests.RequestException as e:
            log(f"  ! réseau: {e} (tentative {attempt+1})")
            time.sleep(2 ** attempt)
            continue
        if r.status_code == 200:
            time.sleep(SLEEP_BETWEEN_CALLS)
            return r.json()
        if r.status_code == 429:
            time.sleep(2 ** attempt)
            continue
        if r.status_code == 404:
            return None
        if r.status_code in (401, 403):
            sys.exit(f"ERREUR {r.status_code} — clé API refusée : {r.text[:300]}")
        STATS["errors"] += 1
        return None
    STATS["errors"] += 1
    return None


def grid_points(bbox, step_m):
    """Génère les centres de tuiles couvrant une bbox (lat_min, lon_min, lat_max, lon_max)."""
    lat_min, lon_min, lat_max, lon_max = bbox
    dlat = step_m / 111_320.0
    mid_lat = (lat_min + lat_max) / 2.0
    dlon = step_m / (111_320.0 * math.cos(math.radians(mid_lat)))
    pts = []
    lat = lat_min
    while lat <= lat_max + 1e-9:
        lon = lon_min
        while lon <= lon_max + 1e-9:
            pts.append((round(lat, 6), round(lon, 6)))
            lon += dlon
        lat += dlat
    return pts


# ------------------------------------------------------------------
# ETAPE 1 — DECOUVERTE DES IDENTIFIANTS (SKU le moins cher)
# ------------------------------------------------------------------

def nearby_ids(lat, lon, radius, ids, depth=0):
    """Nearby Search sur le type Google 'tailor'. Subdivise si la tuile sature."""
    if DRY_RUN:
        STATS["nearby_calls"] += 1
        return

    body = {
        "includedTypes": ["tailor"],
        "maxResultCount": 20,
        "languageCode": "fr",
        "regionCode": "SN",
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lon},
                "radius": radius,
            }
        },
    }
    data = post(f"{BASE}/places:searchNearby", body, "places.id")
    STATS["nearby_calls"] += 1
    if not data:
        return

    places = data.get("places", [])
    for p in places:
        pid = p.get("id")
        if pid:
            ids.setdefault(pid, "nearby:tailor")

    # 20 résultats = la tuile est pleine, il y en a sûrement plus -> on redécoupe
    if len(places) >= 20 and depth < NEARBY_MAX_DEPTH:
        half = radius / 2.0
        off_lat = half / 111_320.0
        off_lon = half / (111_320.0 * math.cos(math.radians(lat)))
        for dla in (-off_lat, off_lat):
            for dlo in (-off_lon, off_lon):
                nearby_ids(lat + dla, lon + dlo, half, ids, depth + 1)


def text_ids(bbox, keyword, ids):
    """Text Search restreint à une bbox, jusqu'à 3 pages (60 résultats)."""
    if DRY_RUN:
        STATS["text_calls"] += 1
        return

    lat_min, lon_min, lat_max, lon_max = bbox
    body = {
        "textQuery": keyword,
        "pageSize": 20,
        "languageCode": "fr",
        "regionCode": "SN",
        "locationRestriction": {
            "rectangle": {
                "low": {"latitude": lat_min, "longitude": lon_min},
                "high": {"latitude": lat_max, "longitude": lon_max},
            }
        },
    }

    token = None
    for _ in range(3):
        if token:
            body["pageToken"] = token
        data = post(f"{BASE}/places:searchText", body, "places.id,nextPageToken")
        STATS["text_calls"] += 1
        if not data:
            return
        for p in data.get("places", []):
            pid = p.get("id")
            if pid:
                ids.setdefault(pid, f"text:{keyword}")
        token = data.get("nextPageToken")
        if not token:
            return


def discover(selected_zones):
    ids = load_json(IDS_FILE, {})
    done = set(load_json(PROGRESS_FILE, []))
    start_count = len(ids)

    def checkpoint():
        # En simulation on n'écrit RIEN : sinon la vraie collecte croirait
        # que les tuiles ont déjà été faites et sauterait tout.
        if DRY_RUN:
            return
        save_json(IDS_FILE, ids)
        save_json(PROGRESS_FILE, sorted(done))

    for zname in selected_zones:
        bbox = ZONES[zname]

        # -- Text Search : une passe par mot-clé sur la zone entière
        for kw in KEYWORDS:
            key = f"text|{zname}|{kw}"
            if key in done:
                STATS["cache_hits"] += 1
                continue
            text_ids(bbox, kw, ids)
            done.add(key)

        # -- Nearby Search : grille fine sur le type officiel "tailor"
        pts = grid_points(bbox, NEARBY_STEP_M)
        log(f"  [{zname}] {len(pts)} tuiles + {len(KEYWORDS)} recherches texte")
        for i, (lat, lon) in enumerate(pts, 1):
            key = f"near|{zname}|{lat}|{lon}"
            if key in done:
                STATS["cache_hits"] += 1
                continue
            nearby_ids(lat, lon, NEARBY_RADIUS_M, ids)
            done.add(key)
            if i % 20 == 0:
                checkpoint()
                log(f"      {i}/{len(pts)} tuiles — {len(ids)} fiches uniques")

        checkpoint()
        log(f"  [{zname}] terminé — {len(ids)} fiches uniques au total")

    log(f"\nÉTAPE 1 terminée : {len(ids)} fiches uniques "
        f"(+{len(ids) - start_count} nouvelles)")
    return ids


# ------------------------------------------------------------------
# ETAPE 2 — DETAILS (téléphone, adresse) — 1 appel par fiche unique
# ------------------------------------------------------------------

def fetch_details(ids, max_details=None):
    details = load_json(DETAILS_FILE, {})
    todo = [pid for pid in ids if pid not in details]
    if max_details:
        todo = todo[:max_details]

    if DRY_RUN:
        STATS["detail_calls"] += len(todo)
        return details

    log(f"\nÉTAPE 2 : {len(todo)} fiches à détailler "
        f"({len(details)} déjà en cache)")

    for i, pid in enumerate(todo, 1):
        data = get(f"{BASE}/places/{pid}", {"languageCode": "fr"}, DETAIL_FIELDS)
        STATS["detail_calls"] += 1
        if data:
            details[pid] = data
        if i % 25 == 0:
            save_json(DETAILS_FILE, details)
            log(f"   {i}/{len(todo)} — {len(details)} fiches complètes")

    save_json(DETAILS_FILE, details)
    log(f"ÉTAPE 2 terminée : {len(details)} fiches complètes")
    return details


# ------------------------------------------------------------------
# NORMALISATION & EXPORT
# ------------------------------------------------------------------

def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def clean_phone(raw):
    """Normalise en format international sénégalais +221XXXXXXXXX."""
    if not raw:
        return ""
    d = re.sub(r"\D", "", raw)
    if d.startswith("221"):
        d = d[3:]
    d = d.lstrip("0")
    if len(d) == 9 and d[0] in "3789":
        return "+221" + d
    if d:
        return "+" + d if raw.strip().startswith("+") else raw.strip()
    return raw.strip()


def phone_kind(phone):
    """77/78/76/70/75 = mobile (donc WhatsApp probable). 33 = fixe."""
    if not phone.startswith("+221"):
        return ""
    p = phone[4:]
    if p.startswith(("77", "78", "76", "70", "75")):
        return "mobile"
    if p.startswith("33"):
        return "fixe"
    return "autre"


def extract_area(comp_list, addr):
    """Déduit commune et quartier depuis les composants d'adresse Google."""
    commune, quartier = "", ""
    for c in comp_list or []:
        types = c.get("types", [])
        name = c.get("longText") or c.get("shortText") or ""
        if "locality" in types and not commune:
            commune = name
        elif "sublocality" in types or "sublocality_level_1" in types:
            if not quartier:
                quartier = name
        elif "neighborhood" in types and not quartier:
            quartier = name
    if not commune and addr:
        parts = [p.strip() for p in addr.split(",")]
        if len(parts) >= 2:
            commune = parts[-2]
    return commune, quartier


def build_rows(ids, details):
    rows = []
    for pid, d in details.items():
        name = (d.get("displayName") or {}).get("text", "").strip()
        if not name:
            continue
        addr = d.get("formattedAddress", "") or d.get("shortFormattedAddress", "")
        commune, quartier = extract_area(d.get("addressComponents"), addr)
        loc = d.get("location") or {}
        phone = clean_phone(d.get("nationalPhoneNumber")
                            or d.get("internationalPhoneNumber") or "")
        hours = (d.get("regularOpeningHours") or {}).get("weekdayDescriptions") or []

        rows.append({
            "nom": name,
            "telephone": phone,
            "type_ligne": phone_kind(phone),
            "quartier": quartier,
            "commune": commune,
            "adresse": addr,
            "latitude": loc.get("latitude", ""),
            "longitude": loc.get("longitude", ""),
            "note_google": d.get("rating", ""),
            "nb_avis": d.get("userRatingCount", ""),
            "statut_google": d.get("businessStatus", ""),
            "categorie": (d.get("primaryTypeDisplayName") or {}).get("text", ""),
            "horaires": " | ".join(hours),
            "site_web": d.get("websiteUri", ""),
            "lien_maps": d.get("googleMapsUri", ""),
            "place_id": pid,
            "source": ids.get(pid, "google_places"),
            # colonnes de suivi pour la prospection AZ-TAILORS
            "statut_prospection": "à contacter",
            "date_contact": "",
            "notes": "",
        })

    # Doublons d'enseigne au même endroit (Google en a beaucoup) :
    # même nom normalisé + même point GPS arrondi à ~30 m
    seen, unique = set(), []
    for r in rows:
        try:
            key = (strip_accents(r["nom"].lower()).strip(),
                   round(float(r["latitude"]), 4),
                   round(float(r["longitude"]), 4))
        except (ValueError, TypeError):
            key = (strip_accents(r["nom"].lower()).strip(), r["adresse"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(r)

    # Les fiches avec mobile d'abord : ce sont les seules vraiment appelables
    prio = {"mobile": 0, "autre": 1, "fixe": 2, "": 3}
    unique.sort(key=lambda r: (prio.get(r["type_ligne"], 3),
                               r["commune"], r["nom"]))
    return unique


COLUMNS = ["nom", "telephone", "type_ligne", "quartier", "commune", "adresse",
           "latitude", "longitude", "note_google", "nb_avis", "statut_google",
           "categorie", "horaires", "site_web", "lien_maps", "place_id",
           "source", "statut_prospection", "date_contact", "notes"]


def export_csv(rows):
    with open(OUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(rows)
    log(f"  -> {OUT_CSV} ({len(rows)} lignes)")


def export_xlsx(rows):
    try:
        from openpyxl import Workbook
        from openpyxl.styles import Font, PatternFill, Alignment
        from openpyxl.utils import get_column_letter
    except ImportError:
        log("  (openpyxl absent — pas de XLSX. pip install openpyxl)")
        return

    wb = Workbook()
    ws = wb.active
    ws.title = "Tailleurs Dakar"

    head_fill = PatternFill("solid", fgColor="1F3A5F")
    head_font = Font(color="FFFFFF", bold=True, size=11)
    for i, col in enumerate(COLUMNS, 1):
        c = ws.cell(row=1, column=i, value=col.replace("_", " ").title())
        c.fill = head_fill
        c.font = head_font
        c.alignment = Alignment(vertical="center")

    for r in rows:
        ws.append([r.get(c, "") for c in COLUMNS])

    widths = {"nom": 34, "telephone": 16, "type_ligne": 11, "quartier": 20,
              "commune": 18, "adresse": 46, "horaires": 40, "lien_maps": 16,
              "site_web": 26, "place_id": 30, "source": 20, "notes": 30}
    for i, col in enumerate(COLUMNS, 1):
        ws.column_dimensions[get_column_letter(i)].width = widths.get(col, 13)

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(COLUMNS))}{ws.max_row}"

    # Feuille de synthèse par commune
    ws2 = wb.create_sheet("Synthèse")
    counts, mobiles = {}, {}
    for r in rows:
        k = r["commune"] or "(non renseignée)"
        counts[k] = counts.get(k, 0) + 1
        if r["type_ligne"] == "mobile":
            mobiles[k] = mobiles.get(k, 0) + 1
    ws2.append(["Commune", "Ateliers", "Dont mobile joignable"])
    for i in range(1, 4):
        ws2.cell(row=1, column=i).fill = head_fill
        ws2.cell(row=1, column=i).font = head_font
    for k in sorted(counts, key=lambda x: -counts[x]):
        ws2.append([k, counts[k], mobiles.get(k, 0)])
    ws2.append(["TOTAL", len(rows), sum(mobiles.values())])
    ws2.cell(row=ws2.max_row, column=1).font = Font(bold=True)
    ws2.column_dimensions["A"].width = 28
    ws2.column_dimensions["B"].width = 12
    ws2.column_dimensions["C"].width = 22

    wb.save(OUT_XLSX)
    log(f"  -> {OUT_XLSX}")


# ------------------------------------------------------------------
# MAIN
# ------------------------------------------------------------------

def main():
    global DRY_RUN

    ap = argparse.ArgumentParser(
        description="Collecte des tailleurs/couturiers de Dakar via Google Places API (New)")
    ap.add_argument("--dry-run", action="store_true",
                    help="compte les appels prévus sans rien dépenser")
    ap.add_argument("--zones", default="all",
                    help="zones séparées par des virgules, ou 'all' (défaut). "
                         "Liste : " + ", ".join(ZONES))
    ap.add_argument("--export-only", action="store_true",
                    help="régénère CSV/XLSX depuis le cache, sans appel API")
    ap.add_argument("--max-details", type=int, default=None,
                    help="plafonne le nombre d'appels Place Details")
    args = ap.parse_args()

    DRY_RUN = args.dry_run

    if args.zones == "all":
        selected = list(ZONES)
    else:
        selected = [z.strip() for z in args.zones.split(",") if z.strip()]
        bad = [z for z in selected if z not in ZONES]
        if bad:
            sys.exit(f"Zone(s) inconnue(s) : {bad}\nDisponibles : {list(ZONES)}")

    CACHE_DIR.mkdir(exist_ok=True)

    if args.export_only:
        ids = load_json(IDS_FILE, {})
        details = load_json(DETAILS_FILE, {})
        if not details:
            sys.exit("Cache vide — lance d'abord la collecte.")
        rows = build_rows(ids, details)
        log(f"\nExport de {len(rows)} fiches depuis le cache :")
        export_csv(rows)
        export_xlsx(rows)
        return

    if not API_KEY and not DRY_RUN:
        sys.exit(
            "Aucune clé API trouvée.\n"
            "  export GOOGLE_MAPS_API_KEY=\"AIza...\"   (Linux/macOS)\n"
            "  setx GOOGLE_MAPS_API_KEY \"AIza...\"     (Windows, puis rouvrir le terminal)\n"
            "Astuce : lance d'abord  python collecte_tailleurs_dakar.py --dry-run")

    log("=" * 62)
    log("  COLLECTE TAILLEURS — RÉGION DE DAKAR")
    log(f"  Zones : {len(selected)}   |   Mots-clés : {len(KEYWORDS)}")
    if DRY_RUN:
        log("  MODE SIMULATION — aucun appel réel, aucune dépense")
    log("=" * 62)

    t0 = time.time()
    ids = discover(selected)

    if DRY_RUN:
        # en simulation on estime l'étape 2 : ~1 fiche unique par tuile-résultat
        est = STATS["nearby_calls"] * 3 + STATS["text_calls"] * 8
        log("\n--- SIMULATION ---")
        log(f"  Étape 1 : {STATS['nearby_calls']} appels Nearby "
            f"+ {STATS['text_calls']} appels Text  (SKU Essentials, IDs seuls)")
        log(f"  Étape 2 : ~{est} appels Place Details estimés (fiches uniques)")
        log("  Aucun euro dépensé. Fixe un plafond dans Cloud Console, "
            "puis relance sans --dry-run.")
        return

    details = fetch_details(ids, args.max_details)
    rows = build_rows(ids, details)

    log(f"\nExport de {len(rows)} fiches :")
    export_csv(rows)
    export_xlsx(rows)

    with_phone = sum(1 for r in rows if r["telephone"])
    mobile = sum(1 for r in rows if r["type_ligne"] == "mobile")
    log("\n" + "=" * 62)
    log(f"  {len(rows)} ateliers collectés")
    log(f"  {with_phone} avec téléphone  ({mobile} mobiles — appelables/WhatsApp)")
    log(f"  Appels API : {STATS['nearby_calls']} nearby, "
        f"{STATS['text_calls']} text, {STATS['detail_calls']} détails")
    log(f"  Erreurs : {STATS['errors']}   |   Durée : {time.time()-t0:.0f}s")
    log("=" * 62)
    log("\nRelance le script quand tu veux : le cache évite de re-payer.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("\n\nInterrompu. Le cache est sauvegardé — relance pour reprendre.")
