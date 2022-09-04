import requests
from bs4 import BeautifulSoup

r = requests.get("https://www.theworlds50best.com/list/1-50")
soup = BeautifulSoup(r.text, "html.parser")
items = soup.select(".item")

data = []

for item in items:
    name = item.find('h2')
    entry = {
        'name': name.text,
        'location': name.find_next_sibling('p').text,
    }
    data.append(entry)

print(data)
