import ast
from datetime import datetime, timezone
import json
import os
import uuid
from dotenv import load_dotenv
import pandas as pd
from pathlib import Path
from django.http import HttpResponseBadRequest, JsonResponse
from db.models import Products, Type

load_dotenv()
path = os.getenv("CSV_PATH")

uid_path = path + "partsDB_with_uid.csv"

# Load existing if it exists
if os.path.exists(uid_path):
    partsDB = pd.read_csv(uid_path)
else:
    # Generalize and load all CSVs
    def generalize(df):
        baseCols = ["name", "price", "image", "category"]
        df = df.copy()

        # Ensure all baseCols exist in the DataFrame (fill with None if missing)
        for col in baseCols:
            if col not in df.columns:
                df[col] = None

        # Build specifications from all non-base columns
        specCols = [col for col in df.columns if col not in baseCols]
        df["specifications"] = df[specCols].to_dict(orient="records")

        return df[baseCols + ["specifications"]]

    cpu = generalize(pd.read_csv(path + "cpu_clean.csv"))
    gpu = generalize(pd.read_csv(path + "gpu2_clean.csv"))
    ram = generalize(pd.read_csv(path + "ram_clean.csv"))
    mobo = generalize(pd.read_csv(path + "mobonew_clean.csv"))
    psu = generalize(pd.read_csv(path + "psu_clean.csv"))
    storage = generalize(pd.read_csv(path + "storage_clean.csv"))

    cpu["category"] = "CPU"
    gpu["category"] = "GPU"
    ram["category"] = "RAM"
    mobo["category"] = "MOBO"
    psu["category"] = "PSU"
    storage["category"] = "STORAGE"

    partsDB = pd.concat([cpu, gpu, ram, mobo, psu, storage], ignore_index=True)

    # Add persistent UID
    partsDB["uid"] = [str(uuid.uuid4()) for _ in range(len(partsDB))]

    # Save to CSV
    partsDB.to_csv(uid_path, index=False)


def add(file):
    parts = generalize(pd.read_csv(file.file))
    products = [ Products(
        type = Type[row["category"]].value,
        name = row["name"],
        specifications = row["specifications"],
        image = row["image"],
        date_added = datetime.now()
    )
     for index, row in parts.iterrows()
      ]
    Products.objects.bulk_create(products)
    

def get(data):
    return JsonResponse({
    "message": "Produto encontrado",
    "status": 201,
    "data" : json.loads(partsDB[partsDB["uid"] ==  data].to_json(orient="records"))
    })

def getFiltered(data):

    filtered = partsDB

    if data.name != None:
        filtered = filtered[filtered["name"].str.contains(data.name, case=False, na=False)]
    
    if data.category != None:
        filtered = filtered[filtered["category"] == data.category.upper()]
    
    if data.maxprice != None:
        filtered = filtered[filtered["price"] <= data.maxprice]

    if data.minprice != None:
        filtered = filtered[filtered["price"] >= data.minprice]

   
    if data.specifications != None:
        specs = ast.literal_eval(data.specifications)
        try:
            filtered["specifications"] = filtered["specifications"].apply(
            lambda x: ast.literal_eval(x) if isinstance(x, str) else x
        )
            for keys in specs:
                filtered = filtered[filtered["specifications"][keys] == specs[keys]]
        except:
            return JsonResponse({
                    "status": 400,
                    "message": "Não encontrado!"
                    })
        

    if len(filtered.index) == 0:
        return JsonResponse({
                    "status": 400,
                    "message": "Não encontrado!"
                    })               
 
    return JsonResponse({
    "status": 201,
    "data" : json.loads(filtered.to_json(orient="records"))
    })


