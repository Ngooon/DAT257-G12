import os
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = "Flush the database and create example data, then start the server."

    def add_arguments(self, parser):
        super().add_arguments(parser)

    def handle(self, *args, **options):
        if os.environ.get("RUN_MAIN") != "true":
            self.flush_and_create_data()
        call_command("runserver", *args, **options)

    def flush_and_create_data(self):
        from framework.quickstart.utils import create_example_data, flush_wardrobe_data

        self.stdout.write("Flushing database and creating example data...")
        with transaction.atomic():
            flush_wardrobe_data()
            create_example_data()
        self.stdout.write("Database flushed and example data created.")
