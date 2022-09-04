import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.theworlds50best.com/list/1-50')
soup = BeautifulSoup(r.text, 'html.parser')
first50 = soup.find(attrs={'data-list': '1-50'})
second50 = soup.find(attrs={'data-list': '51-100'})

items = first50.find_all(class_='item')

data = []

for item in items:
    name = item.find('h2')
    entry = {
        'name': name.text,
        'location': name.find_next_sibling('p').text,
    }
    data.append(entry)

print(data)
print(len(data))
