from collections import defaultdict

from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, Max
from django.forms import model_to_dict
from django.http import JsonResponse
from ninja.errors import HttpError

from db.models import (Cpu, Favorites, Gpu, Igpu, Mobo, PartRegistry, Prices,
                       Psu, Ram, Storage, Stores)


def add(data, user):
    type = data.type
    added = []

    if type == "cpu":
        for item in data.products:
            try:
                cpu = Cpu(**item)
                added.append(model_to_dict(cpu))
                registry = PartRegistry(
                    content_type=ContentType.objects.get_for_model(cpu),
                    object_id=cpu.uid,
                    part_type=type,
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
                added.append(model_to_dict(igpu))
                igpu.save()
                registry = PartRegistry(
                    content_type=ContentType.objects.get_for_model(igpu),
                    object_id=igpu.uid,
                    part_type=type,
                )
        except KeyError as e:
            raise HttpError(400, str(e))
        except ValueError as e:
            raise HttpError(400, str(e))

    elif type == "gpu":
        for item in data.products:
            try:
                gpu = Gpu(**item)
                added.append(model_to_dict(gpu))
                registry = PartRegistry(
                    content_type=ContentType.objects.get_for_model(gpu),
                    object_id=gpu.uid,
                    part_type=type,
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
                added.append(model_to_dict(psu))
                registry = PartRegistry(
                    content_type=ContentType.objects.get_for_model(psu),
                    object_id=psu.uid,
                    part_type=type,
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
                added.append(model_to_dict(mobo))
                registry = PartRegistry(
                    content_type=ContentType.objects.get_for_model(mobo),
                    object_id=mobo.uid,
                    part_type=type,
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
                added.append(model_to_dict(ram))
                registry = PartRegistry(
                    content_type=ContentType.objects.get_for_model(ram),
                    object_id=ram.uid,
                    part_type=type,
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
                added.append(model_to_dict(storage))
                registry = PartRegistry(
                    content_type=ContentType.objects.get_for_model(storage),
                    object_id=storage.uid,
                    part_type=type,
                )
                storage.save()
                registry.save()
            except KeyError as e:
                raise HttpError(400, str(e))
            except ValueError as e:
                raise HttpError(400, str(e))

    elif type == "prices":
        for item in data.products:
            try:
                store = Stores.objects.get(pk=item["store"])
            except Stores.DoesNotExist:
                raise HttpError(404, "Loja não encontrada")

            try:
                content_type = ContentType.objects.get(
                    app_label="db", model=item["content_type"].lower()
                )
            except ContentType.DoesNotExist:
                raise HttpError(400, "Modelo invalido")
            if item["sale"]:
                price = Prices(
                    store=store,
                    content_type=content_type,
                    object_id=item["object_id"],
                    url_product=item["url_product"],
                    sale=item["sale"],
                    price=item["price"],
                    old_price=item["old_price"],
                    sale_percent=item["sale_percent"],
                    sale_end=item["sale_end"],
                )
                added.append(model_to_dict(price))
                price.save()
            else:
                price = Prices(
                    store=store,
                    content_type=content_type,
                    object_id=item["object_id"],
                    url_product=item["url_product"],
                    sale=item["sale"],
                    price=item["price"],
                )
                added.append(model_to_dict(price))
                price.save()

    elif type == "store":
        try:
            for item in data.products:
                store = Stores(**item)
                added.append(model_to_dict(store))
                store.save()
        except KeyError as e:
            raise HttpError(400, str(e))
        except ValueError as e:
            raise HttpError(400, str(e))

    else:
        raise HttpError(400, "Tipo não encontrado")

    return JsonResponse(
        {"message": f"{type}s adicionadas com sucesso!", "data": added}, status=201
    )


def get(data):
    try:
        # Get registry entry (assumes data is UUID)
        registry = PartRegistry.objects.get(object_id=data)
        product = registry.part

        # Get content type
        content_type = ContentType.objects.get_for_model(product.__class__)

        # Obtem o último colected_date por loja
        latest_by_store = Prices.objects.filter(
            content_type=content_type,
            object_id=product.uid
        ).values('store').annotate(latest_date=Max('colected_date'))

        # Constrói uma lista de pares (store_id, latest_date)
        latest_pairs = [(entry['store'], entry['latest_date']) for entry in latest_by_store]

        # Busca os preços mais recentes usando os pares acima
        filters = Q()
        for store_id, latest_date in latest_pairs:
            filters |= Q(store_id=store_id, colected_date=latest_date)

        final_prices = Prices.objects.filter(filters, content_type=content_type, object_id=product.uid).select_related("store")

        # Serializa o produto
        product_dict = model_to_dict(product)

        # Serializa os preços
        product_dict["prices"] = [
            {
                "id": p.uid,
                "price": p.price,
                "colected_date": p.colected_date,
                "url": p.url_product,
                "sale": p.sale,
                "sale_end": p.sale_end,
                "old_price": p.old_price,
                "sale_percent": p.sale_percent,
                "store": {
                    "id": p.store.uid,
                    "name": p.store.name,
                    "website": p.store.url,
                },
            }
            for p in final_prices
        ]

    except PartRegistry.DoesNotExist:
        raise HttpError(404, "Produto não encontrado.")
    except Exception as e:
        raise HttpError(500, f"Erro ao buscar produto: {str(e)}")

    return {"data": product_dict}

def getProductPrices(uid):
    try:
        query = Prices.objects.filter(object_id=uid)

        prices = [
            {
                "id": p.uid,
                "price": p.price,
                "colected_date": p.colected_date,
                "url": p.url_product,
                "sale": p.sale,
                "sale_end": p.sale_end,
                "old_price": p.old_price,
                "sale_percent": p.sale_percent,
                "store": {
                    "id": p.store.uid,
                    "name": p.store.name,
                    "website": p.store.url,
                },
            }
            for p in query
        ]
    except:
        raise HttpError(404, "Produto não encontrado")
    return prices

def delete(data):
    try:
        # Get registry entry (assumes data is UUID)
        registry = PartRegistry.objects.get(object_id=data)
        product = registry.part

        # Get related prices using content type and object ID
        content_type = ContentType.objects.get_for_model(product.__class__)
        favorites = Favorites.objects.filter(object_id=product.uid).delete()
        prices = Prices.objects.filter(
            content_type=content_type, object_id=product.uid
        ).delete()

        registry.delete()
        product.delete()

    except PartRegistry.DoesNotExist:
        raise HttpError(404, "Produto não encontrado.")
    except Exception as e:
        raise HttpError(500, f"Erro ao deletar produto: {str(e)}")

    return {"message": "Produto deletado"}


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
        prices_qs = Prices.objects.filter(
            content_type=content_type, object_id__in=object_ids
        )

        # Group prices by object_id for fast lookup
        price_map = defaultdict(list)
        for price in prices_qs:
            price_map[price.object_id].append(
                {
                    "store": price.store.name,
                    "url": price.url_product,
                    "price": price.price,
                    "old_price": price.old_price,
                    "sale": price.sale,
                    "sale_percent": price.sale_percent,
                    "sale_end": price.sale_end,
                    "collected": price.colected_date,
                }
            )

        # Convert each product to dict and attach its prices
        for product in queryset:
            product_dict = model_to_dict(product)
            product_dict["uid"] = product.uid
            product_dict["prices"] = price_map.get(product.uid, [])
            all_products.append(product_dict)

    return {
        "message": "All products with prices retrieved successfully",
        "data": all_products,
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
        return HttpError(404, "Model not found")

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
        raise HttpError(
            400, f"Invalid filter fields for {model_key}: {invalid_filters}"
        )

    # Perform filtering
    queryset = model_class.objects.filter(**filter_dict)
    object_ids = queryset.values_list("uid", flat=True)

    price_filter_kwargs = {
        "content_type": content_type,
        "object_id__in": object_ids,
        **(
            {"price__range": filter_prices.price_range}
            if filter_prices.price_range
            else {}
        ),
        **({"store": filter_prices.store} if filter_prices.store else {}),
        **({"sale": filter_prices.sale} if filter_prices.sale is not None else {}),
    }

    prices = Prices.objects.filter(**price_filter_kwargs)
    price_map = defaultdict(list)

    for price in prices:
        price_map[price.object_id].append(
            {
                "store": price.store.name,
                "url": price.url_product,
                "price": price.price,
                "old_price": price.old_price,
                "sale": price.sale,
                "sale_percent": price.sale_percent,
                "sale_end": price.sale_end,
                "collected": price.colected_date,
            }
        )

    results = []
    for item in queryset:
        if filter_prices and item.uid not in price_map:
            continue
        item_dict = model_to_dict(item)
        item_dict["uid"] = item.uid
        item_dict["prices"] = price_map.get(item.uid, [])  # pode ter vários preços
        results.append(item_dict)

    return {"message": "produtos retornados com sucesso", "data": results}


def getStore(uid):
    result = []
    if uid:
        stores = Stores.objects.get(pk=uid)
        store = model_to_dict(stores)
        store["uid"] = stores.uid
        result.append(store)
    else:
        stores = Stores.objects.all()
        for items in stores:
            store = model_to_dict(items)
            store["uid"] = items.uid
            result.append(store)

    return {"data": result}
