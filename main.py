import requests
import re
import os
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

r = requests.get('https://www.theworlds50best.com/list/1-50')
soup = BeautifulSoup(r.text, 'html.parser')
# fetch items
items = soup.select("div[data-list]:not([data-list*='Individual']) .item")

# generate list of restaurants
data = []
for item in items:
    name = item.find('h2')
    entry = {
        'name': name.text,
        'location': name.find_next_sibling('p').text,
    }
    data.append(entry)


# GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID')
# SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
# STORAGE_BUCKET_NAME = os.getenv('STORAGE_BUCKET_NAME')
