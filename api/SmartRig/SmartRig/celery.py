import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SmartRig.settings")

app = Celery("SmartRig")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()