"""Script para extrair dados de faturas de energia elétrica em PDFs """
from typing import Union
import os
import re
import psycopg2
from psycopg2.extensions import cursor as cursorPG
from pdfminer.high_level import extract_text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def str_to_float(value: str) -> float:
    """Converte uma string para float"""
    try:
        return float(value.replace('.', '').replace(',', '.'))
    except ValueError:
        return 0.0

def extract_with_regex(pattern, text, default=None, to_float=False) -> Union[float, str]:
    """Extrai um valor de um texto usando uma expressão regular"""
    match: re.Match[str] = re.search(pattern, text)
    if match:
        value = match.group(1)
        return str_to_float(value) if to_float else value
    return default

def extract_energy_data(text: str, data: dict):
    """Extrai os dados de energia elétrica"""
    pattern = re.compile(
        r'kWh\s+([\d\s\.,-]+)\s+([\d\s\.,-]+)\s+([\d\s\.,-]+)\s+([\d\s\.,-]+)\s+([\d\s\.,-]+)'
    )

    matches = pattern.findall(text)

    if matches:
        match = matches[0]
        numbers = []
        for group in match:
            nums = [str_to_float(num) for num in group.split() if num.strip()]
            numbers.extend(nums)
        if len(numbers) == 5:
            data['energia_eletrica_kwh'] = numbers[0]
            data['energia_eletrica_valor'] = numbers[4]
            data['contrib_ilum_publica'] = numbers[3]
        else:
            data['energia_eletrica_kwh'] = numbers[0]
            data['energia_eletrica_valor'] = numbers[6]

            data['energia_scee_kwh'] = numbers[1]
            data['energia_scee_valor'] = numbers[7]

            data['energia_compensada_kwh'] = numbers[2]
            data['energia_compensada_valor'] = numbers[8]

            data['contrib_ilum_publica'] = numbers[9]


def extract_data_from_pdf(pdf_path: str) -> dict:
    """Extrai os dados de uma fatura de energia elétrica em PDF"""
    data = {}
    with open(pdf_path, "rb") as in_file:
        text = extract_text(in_file)
        # Extraindo dados com regex
        data['numero_cliente'] = extract_with_regex(
            r'Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\s+(\d+)\s+(\d+)',
            text
        )
        data['mes_referencia'] = extract_with_regex(
            r'Referente a\s+Vencimento\s+Valor a pagar \(R\$\)\s+(\w+/\d+)\s+(\d{2}/\d{2}/\d{4})\s+([\d,]+)',
            text
        )
        extract_energy_data(text, data)

    return data

def save_data_to_db(data: dict, cursor: cursorPG, instalation_number: str):
    """Salva os dados de uma fatura no banco de dados"""
    if ("energia_scee_kwh" not in data
        and "energia_scee_valor" not in data
        and "energia_compensada_kwh" not in data
        and "energia_compensada_valor" not in data):
        cursor.execute('''
            INSERT INTO faturas (
                instalacao, numero_cliente, mes_referencia, energia_eletrica_kwh, energia_eletrica_valor,
                contrib_ilum_publica
            ) VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            instalation_number, data['numero_cliente'], data['mes_referencia'],
            data['energia_eletrica_kwh'], data['energia_eletrica_valor'],
            data['contrib_ilum_publica']
        ))
    else:
        cursor.execute('''
            INSERT INTO faturas (
                instalacao, numero_cliente, mes_referencia, energia_eletrica_kwh, energia_eletrica_valor,
                energia_scee_kwh, energia_scee_valor, energia_compensada_kwh, energia_compensada_valor,
                contrib_ilum_publica
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            instalation_number, data['numero_cliente'], data['mes_referencia'],
            data['energia_eletrica_kwh'], data['energia_eletrica_valor'],
            data['energia_scee_kwh'], data['energia_scee_valor'],
            data['energia_compensada_kwh'], data['energia_compensada_valor'],
            data['contrib_ilum_publica']
        ))
    cursor.close()

def main():
    """Função principal"""
    print('Extraindo dados das faturas...')
    folder_path = f'{BASE_DIR}/data/Faturas'
    folders = os.listdir(folder_path)
    conn = psycopg2.connect(DATABASE_URL)
    for folder in folders:
        instalation_number = folder.split('_')[1].strip()
        print(f'Extraindo dados da pasta "{folder}" ...')
        complete_folder_path = os.path.join(folder_path, folder)
        files = os.listdir(complete_folder_path)
        for file in files:
            print(f'Extraindo dados do arquivo "{file}" ...')
            pdf_path = os.path.join(complete_folder_path, file)
            data = extract_data_from_pdf(pdf_path)
            if data['numero_cliente'] is not None:
                numero_cliente = data['numero_cliente']
                print(f"Salvando dados do cliente {numero_cliente} ...")
                cursor = conn.cursor()
                save_data_to_db(data, cursor, instalation_number)
    conn.commit()
    conn.close()
    print('Extração de dados concluída!')

if __name__ == '__main__':
    main()
    