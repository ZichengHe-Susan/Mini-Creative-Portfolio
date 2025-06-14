from django.core.management.base import BaseCommand
from creators.models import CreativeField


class Command(BaseCommand):
    help = 'Populate initial creative fields'

    def handle(self, *args, **options):
        fields = [
            'Photography',
            'Graphic Design',
            'Web Design',
            'UI/UX Design',
            'Fashion Design',
            'Interior Design',
            'Architecture',
            'Cinematography',
            'Video Editing',
            'Music Production',
            'Sound Design',
            'Writing',
            'Copywriting',
            'Content Creation',
            'Social Media',
            'Digital Marketing',
            'Illustration',
            'Animation',
            '3D Modeling',
            'Game Design',
            'Product Design',
            'Branding',
            'Art Direction',
            'Creative Direction',
        ]

        created_count = 0
        for field_name in fields:
            field, created = CreativeField.objects.get_or_create(
                name=field_name
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created creative field: {field_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Creative field already exists: {field_name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} new creative fields'
            )
        )