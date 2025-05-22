import json

from celery import shared_task
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django_celery_beat.models import IntervalSchedule, PeriodicTask

from db.datagen import genAllPrices


@shared_task
def updatePrices():
    return genAllPrices()


@receiver(post_migrate)
def priceTaskSchedule(sender, **kwargs):
    schedule, created = IntervalSchedule.objects.get_or_create(
        every=5,
        period=IntervalSchedule.MINUTES,
    )

    PeriodicTask.objects.update_or_create(
        name="Generate prices every 5 min",
        defaults={
            "interval": schedule,
            "task": "db.tasks.updatePrices",
            "args": json.dumps([]),
        },
    )
