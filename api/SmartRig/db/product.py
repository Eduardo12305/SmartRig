import ast
from collections import defaultdict
from datetime import datetime, timezone
import json
import os
import uuid
from django.forms import model_to_dict
from dotenv import load_dotenv
import pandas as pd
from pathlib import Path
from ninja.errors import HttpError
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from db.models import Cpu, Favorites, Gpu, Igpu, Mobo, PartRegistry, Prices, Ram, Psu, Storage, Stores
import logging

def add(data):
    type = data.type

    if type == "cpu":
        for item in data.products:
            try:
                cpu = Cpu(**item)
                registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(cpu),
                    object_id = cpu.uid,
                    part_type = type
                )
                cpu.save()
                registry.save()
            except KeyError as e:
                raise HttpError(400, str(e))
            except ValueError as e:
                raise HttpError(400, str(e))
            
    elif type == "igpu":
        try:
            for item in data.products:
                igpu = Igpu(**item)
                igpu.save()
                registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(igpu),
                    object_id = igpu.uid,
                    part_type = type
                )
        except KeyError as e:
                raise HttpError(400, str(e))
        except ValueError as e:
            raise HttpError(400, str(e))
    
    elif type == "gpu":
        for item in data.products:
            try:
                gpu = Gpu(**item)
                registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(gpu),
                    object_id = gpu.uid,
                    part_type = type
                )
                gpu.save()
                registry.save()
            except KeyError as e:
                raise HttpError(400, str(e))
            except ValueError as e:
                raise HttpError(400, str(e))
    
    elif type == "psu":
        for item in data.products:
            try:
                psu = Psu(**item)
                registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(psu),
                    object_id = psu.uid,
                    part_type = type
                )
                psu.save()
                registry.save()
            except KeyError as e:
                raise HttpError(400, str(e))
            except ValueError as e:
                raise HttpError(400, str(e))
    
    elif type == "mobo":
        for item in data.products:
            try:
                mobo = Mobo(**item)
                registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(mobo),
                    object_id = mobo.uid,
                    part_type = type
                )
                mobo.save()
                registry.save()
            except KeyError as e:
                raise HttpError(400, str(e))
            except ValueError as e:
                raise HttpError(400, str(e))

    elif type == "ram":
        for item in data.products:
            try:
                ram = Ram(**item)
                registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(ram),
                    object_id = ram.uid,
                    part_type = type
                )
                ram.save()
                registry.save()
            except KeyError as e:
                raise HttpError(400, str(e))
            except ValueError as e:
                raise HttpError(400, str(e))

    elif type == "storage":
        for item in data.products:
            try:
                storage = Storage(**item)
                registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(storage),
                    object_id = storage.uid,
                    part_type = type
                )
                storage.save()
                registry.save()
            except KeyError as e:
                raise HttpError(400, str(e))
            except ValueError as e:
                raise HttpError(400, str(e))
            
    elif type == "prices":
        try:
            for item in data.products:
                item["content_type"] = ContentType.objects.get(model=type.lower())
                price = Prices(**item)
                price.save()
        except KeyError as e:
                raise HttpError(400, str(e))
        except ValueError as e:
            raise HttpError(400, str(e))
        
    elif type == "store":
        try:
            for item in data.products:
                store = Stores(**item)
                store.save()
        except KeyError as e:
                raise HttpError(400, str(e))
        except ValueError as e:
            raise HttpError(400, str(e))

    elif type == "favorites":
        try:
            for item in data.products:
                item["content_type"] = ContentType.objects.get(model=type.lower())
                favorite = Favorites(**item)
                favorite.save()
        except KeyError as e:
                raise HttpError(400, str(e))
        except ValueError as e:
            raise HttpError(400, str(e))
    
    else:
        raise HttpError(400, "Tipo não encontrado")

    return JsonResponse({
        "message": f"{type}s adicionadas com sucesso!"
    }, status=201)

def get(data):
    try:
        # Get registry entry (assumes data is UUID)
        registry = PartRegistry.objects.get(object_id=data)
        product = registry.part

        # Get related prices using content type and object ID
        content_type = ContentType.objects.get_for_model(product.__class__)
        prices = Prices.objects.filter(content_type=content_type, object_id=product.uid)

        # Serialize data
        product_dict = model_to_dict(product)
        product_dict["prices"] = list(prices.values())

    except PartRegistry.DoesNotExist:
        raise HttpError(404, "Produto não encontrado.")
    except Exception as e:
        raise HttpError(500, f"Erro ao buscar produto: {str(e)}")

    
    return {
    "message": "Produto encontrado",
    "data" : product_dict
    }

def getAll():
    # Mapping model classes for convenience
    model_classes = [Cpu, Gpu, Psu, Mobo, Ram, Storage]

    all_products = []

    for model_class in model_classes:
        # Get all products for this model
        queryset = model_class.objects.all()
        content_type = ContentType.objects.get_for_model(model_class)

        # Collect all uids to filter prices in batch
        object_ids = queryset.values_list("uid", flat=True)
        
        # Fetch all related prices for these products
        prices_qs = Prices.objects.filter(content_type=content_type, object_id__in=object_ids)

        # Group prices by object_id for fast lookup
        price_map = defaultdict(list)
        for price in prices_qs:
            price_map[price.object_id].append({
                "store": price.store.name,
                "url": price.url_product,
                "price": price.price,
                "old_price": price.old_price,
                "sale": price.sale,
                "sale_percent": price.sale_percent,
                "sale_end": price.sale_end,
                "collected": price.colected_date,
            })

        # Convert each product to dict and attach its prices
        for product in queryset:
            product_dict = model_to_dict(product)
            product_dict["prices"] = price_map.get(product.uid, [])
            all_products.append(product_dict)

    return {
        "message": "All products with prices retrieved successfully",
        "data": all_products
    }

def getFiltered(request, type, filters, filter_prices):
    filter_dict = {k: v for k, v in filters.dict().items() if v is not None}

    # Validate model existence and whitelist (you can customize this whitelist)
    allowed_models = {
        "db.cpu",
        "db.gpu",
        "db.psu",
        "db.mobo",
        "db.ram",
        "db.storage",
    }
    model_key = f"db.{type.lower()}"
    if model_key not in allowed_models:
        raise HttpError(400, "Model not allowed")

    try:
        content_type = ContentType.objects.get(app_label="db", model=type.lower())
        model_class = content_type.model_class()
    except ContentType.DoesNotExist:
        return HttpError(404,"Model not found")

    # Get actual model fields (field names only)
    valid_fields = {field.name for field in model_class._meta.get_fields()}

    # Validate filter keys exist in model fields
    invalid_filters = []
    for key in filter_dict.keys():
        # Support simple lookups (like 'field__gte'), check only 'field'
        base_key = key.split("__")[0]
        if base_key not in valid_fields:
            invalid_filters.append(key)

    if invalid_filters:
        raise HttpError(400,
            f"Invalid filter fields for {model_key}: {invalid_filters}"
        )

    # Perform filtering
    queryset = model_class.objects.filter(**filter_dict)
    object_ids = queryset.values_list("uid", flat=True)

    price_filter_kwargs = {
    "content_type": content_type,
    "object_id__in": object_ids,
    **({"price__range": filter_prices.price_range} if filter_prices.price_range else {}),
    **({"store": filter_prices.store} if filter_prices.store else {}),
    **({"sale": filter_prices.sale} if filter_prices.sale is not None else {}),
    }

    prices = Prices.objects.filter(**price_filter_kwargs)
    price_map = defaultdict(list)

    for price in prices:
        price_map[price.object_id].append({
        "store": price.store.name,
        "url": price.url_product,
        "price": price.price,
        "old_price": price.old_price,
        "sale": price.sale,
        "sale_percent": price.sale_percent,
        "sale_end": price.sale_end,
        "collected": price.colected_date,
    })

    results = []
    for item in queryset:
        if filter_prices and item.uid not in price_map:
            continue
        item_dict = model_to_dict(item)
        item_dict["prices"] = price_map.get(item.uid, [])  # pode ter vários preços
        results.append(item_dict)

    return {
        "message": "produtos retornados com sucesso",
        "data": results}
   

   
    
        


