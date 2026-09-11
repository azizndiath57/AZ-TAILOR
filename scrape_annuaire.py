import requests
from bs4 import BeautifulSoup
import csv
import re

def clean_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def scrape_annuaire():
    base_urls = [
        "https://annuaire-senegal.com/divers/couturier",
        "https://annuaire-senegal.com/divers/couturier-p2",
        "https://annuaire-senegal.com/divers/couturier-p3",
        "https://annuaire-senegal.com/divers/couturier-p4"
    ]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    results = []

    for url in base_urls:
        print(f"Scraping {url}...")
        try:
            resp = requests.get(url, headers=headers)
            resp.raise_for_status()
        except Exception as e:
            print(f"Erreur sur {url}: {e}")
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Sur l'annuaire, chaque élément de la liste est généralement dans une div ou un block 
        # On va chercher les liens vers les fiches ou extraire directement du texte.
        # En observant le markdown, le format est typiquement :
        # H3: Nom de la boutique
        # Texte: Nom à Dakar, numéro de téléphone X, adresse: Y
        
        # Cherchons les balises d'annonces
        annonces = soup.find_all("div", class_=re.compile("item|listing|annonce", re.I))
        
        # Si on ne trouve pas de div avec une classe claire, on peut iterer sur les titres h2 ou h3
        titres = soup.find_all(["h2", "h3"])
        for titre in titres:
            nom = clean_text(titre.get_text())
            # Chercher le paragraphe parent ou suivant
            parent = titre.find_parent("div")
            if not parent:
                continue
                
            texte = clean_text(parent.get_text(separator=' '))
            
            # Extraction basique avec regex
            tel_match = re.search(r'(?:téléphone|tel|contact)[\s\:]*([0-9\s\,]+)', texte, re.IGNORECASE)
            tel = tel_match.group(1).strip() if tel_match else ""
            # Nettoyage des numéros
            tel = re.sub(r'[^0-9\,]', '', tel)
            
            addr_match = re.search(r'adresse[\s\:]*(.*)', texte, re.IGNORECASE)
            addr = addr_match.group(1).strip() if addr_match else ""
            
            if "coutur" in texte.lower() or "broder" in texte.lower() or "tailleur" in texte.lower() or tel:
                if nom and len(nom) > 2 and nom != "Catégories" and nom != "Annuaire Sénégal":
                    results.append({
                        "nom": nom,
                        "telephone": tel,
                        "adresse": addr
                    })

    # Dédoublonnage
    unique_results = []
    seen = set()
    for r in results:
        if r['nom'] not in seen and r['telephone']:
            seen.add(r['nom'])
            unique_results.append(r)

    print(f"Total contacts trouvés : {len(unique_results)}")
    
    # Export CSV
    with open("contacts_annuaire_senegal.csv", "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["nom", "telephone", "adresse"])
        writer.writeheader()
        writer.writerows(unique_results)
    
    print("Fichier contacts_annuaire_senegal.csv généré avec succès !")

if __name__ == "__main__":
    scrape_annuaire()
