import csv
import webbrowser
import time
import urllib.parse
import re

# Le message de prospection avec le lien Vercel
MESSAGE = """Salam 👋, j'espère que vous allez bien et que le travail à l'atelier se passe à merveille !

Je vous contacte car nous avons créé AZ-TAILOR, une application mobile super simple spécialement conçue pour les tailleurs sénégalais.

Finis les carnets de mesures perdus ou les calculs compliqués :
📏 Vos mesures clients enregistrées à vie
💰 Suivi automatique des avances et restes à payer
🧾 Factures professionnelles envoyées direct sur WhatsApp à vos clients !

Testez l'application gratuitement ici : https://az-tailor-kqm4h8n24-abdoul-aziz1.vercel.app

Ça vous dirait de voir comment ça peut moderniser votre atelier ? 😊
Bonne journée et bon courage pour le travail !"""

encoded_message = urllib.parse.quote(MESSAGE)

def format_number(phone):
    # Nettoyer le numéro (enlever les espaces)
    clean = re.sub(r'\D', '', phone)
    
    # Si le numéro commence par 221, on le garde tel quel
    if clean.startswith('221') and len(clean) == 12:
        return clean
    
    # Vérifier que c'est un numéro mobile au Sénégal (70, 75, 76, 77, 78)
    if len(clean) == 9 and clean[0] == '7' and clean[1] in ['0', '5', '6', '7', '8']:
        return "221" + clean
        
    return None

def main():
    print("🚀 DÉMARRAGE DE LA CAMPAGNE DE PROSPECTION WHATSAPP 🚀")
    print("-" * 50)
    
    try:
        with open('contacts_annuaire_senegal.csv', mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter=';')
            
            cibles = []
            
            for row in reader:
                nom = row.get('nom', 'Tailleur')
                telephones = row.get('telephone', '').split(',')
                
                for tel in telephones:
                    formatted = format_number(tel)
                    if formatted:
                        cibles.append({
                            'nom': nom,
                            'telephone': formatted
                        })
                        break # Un seul numéro par tailleur suffit
            
            print(f"✅ {len(cibles)} numéros de téléphone mobiles (WhatsApp) trouvés sur l'annuaire.")
            print("Nous allons ouvrir WhatsApp Web pour chaque contact un par un.")
            
            for index, contact in enumerate(cibles):
                print(f"\n[{index + 1}/{len(cibles)}] Envoi à : {contact['nom']} ({contact['telephone']})")
                input("👉 Appuyez sur ENTRÉE pour ouvrir la conversation WhatsApp... (ou CTRL+C pour quitter)")
                
                url = f"https://wa.me/{contact['telephone']}?text={encoded_message}"
                webbrowser.open(url)
                
                print("Conversation ouverte ! Une fois le message envoyé sur WhatsApp, revenez ici.")
                time.sleep(1)
                
    except FileNotFoundError:
        print("❌ Erreur : Le fichier contacts_annuaire_senegal.csv est introuvable.")

if __name__ == "__main__":
    main()
