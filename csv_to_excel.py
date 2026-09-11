import csv
from openpyxl import Workbook

def convert_to_excel():
    csv_file = 'contacts_annuaire_senegal.csv'
    excel_file = 'contacts_annuaire_senegal.xlsx'
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Contacts"
    
    with open(csv_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        for row in reader:
            ws.append(row)
            
    wb.save(excel_file)
    print(f"Conversion réussie : {excel_file} a été créé !")

if __name__ == '__main__':
    convert_to_excel()
