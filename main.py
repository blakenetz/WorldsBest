import requests
import re
import os
import googlemaps
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# env business
load_dotenv()
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

# initiate beautiful soup
r = requests.get('https://www.theworlds50best.com/list/1-50')
soup = BeautifulSoup(r.text, 'html.parser')

# fetch items and generate meaningful list
data = []
items = soup.select("div[data-list]:not([data-list*='Individual']) .item")
for item in items:
    name = item.find('h2')
    entry = {
        'name': name.text,
        'location': name.find_next_sibling('p').text,
    }
    data.append(entry)

# create google maps list
gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)


# SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
# STORAGE_BUCKET_NAME = os.getenv('STORAGE_BUCKET_NAME')
