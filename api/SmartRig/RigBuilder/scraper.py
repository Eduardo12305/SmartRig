import requests
from bs4 import BeautifulSoup
import pandas as pd

lojas = []
precos = []
urls = []
nomes = []

peca = "placa de video rtx 4070"
headers = {"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"}
url = "https://www.google.com/search?sca_esv=c4730c0d5f6ba8e9&q=" + "+".join(peca.split(' ')) + "&tbm=shop&source=lnms&fbs=ABzOT_BYhiZpMrUAF0c9tORwPGlsASvANxUN_4u1oltdAlXXukJgrc8Sd9VQnu1m4CeFWCV1NFbj-Y0EivjyBcIM3oBQXdygbpjPSF9HYEN6uGuZwTDIFj2UgI_NuawdHxKzqELoSDFJen61l_PVbUuX9R51ZPk-ee_-85r3Uwehhb2zQR_m68rQNstXy_vSrVn-YTw-VSbwXR6vfUhqF9z7cjBj9C-c5w&ved=1t:200715&ictx=111&biw=1920&bih=917&dpr=1"

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "lxml")

lojareq = soup.find_all(class_= "aULzUe IuHnof")
precoreq = soup.find_all(class_= "a8Pemb OFFNJ")
urlreq = soup.find_all(class_= "shntl", href=True)
nomereq = soup.find_all(class_= "tAxDx")

for loja in lojareq:
    lojas.append(loja.get_text())

for preco in precoreq:
    precos.append(preco.get_text().split(";"))

for url in urlreq:
    urls.append(url["href"])

for nome in nomereq:
    nomes.append(nome.get_text())

urls = list(dict.fromkeys(urls))

table = ({
    "Nome" : nomes,
    "Preço" : precos,
    "Loja" : lojas,
    "Url" : urls
})

dataFrame = pd.DataFrame.from_dict(table, orient="index")
dataFrame = dataFrame.transpose()
dataFrame.to_csv(".\\RigBuilder\\preco.csv", index=False, header=True, sep=";", encoding="latin1")