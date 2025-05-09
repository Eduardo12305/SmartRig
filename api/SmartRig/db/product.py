from datetime import timezone
import json
import pandas as pd
from pathlib import Path
from django.http import HttpResponseBadRequest, JsonResponse
from db.models import Produtos, Tipo

path = "E:/Projetos/Atividades/TCC/api/SmartRig/RigBuilder/"

def generalize(df):
    baseCols = ["name", "price"]
    df = df.copy()
    df["specifications"] = df.drop(columns=baseCols).to_dict(orient="records")
    return df[baseCols + ["specifications"]]

cpu = generalize(pd.read_csv(path + "cpu_clean.csv"))
gpu = generalize(pd.read_csv(path + "gpu2_clean.csv"))
ram = generalize(pd.read_csv(path + "ram_clean.csv"))
mobo = generalize(pd.read_csv(path + "mobo_clean.csv"))
psu = generalize(pd.read_csv(path + "psu_clean.csv"))
storage = generalize(pd.read_csv(path + "storage_clean.csv"))

psu["category"] = "PSU"
mobo["category"] = "MOBO"
cpu["category"] = "CPU"
ram["category"] = "RAM"
gpu["category"] = "GPU"
storage["category"] = "STORAGE"

partsDB = pd.concat([cpu,gpu,ram,mobo,psu,storage], ignore_index=True)

def get(data):
    return JsonResponse({
    "message": "Produto encontrado",
    "status": 201,
    "data" : json.loads(partsDB[partsDB["name"].str.contains(data.name, case=False, na=False)].to_json(orient="records"))
    })

def getCategory(data):
    return JsonResponse({
    "message": "Produto encontrado",
    "status": 201,
    "data" : json.loads(partsDB[partsDB["category"] == data.name].to_json(orient="records"))
    }) 

def getAll():
    return JsonResponse({
    "status": 201,
    "data": json.loads(partsDB.to_json(orient="records"))         
    }) 


