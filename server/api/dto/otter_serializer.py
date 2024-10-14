from dataclasses import dataclass

from geomatico_django.serialization import AbstractSerializer
from geomatico_django.view import get_entity_id
from rest_framework.exceptions import ValidationError
from rest_framework.fields import FloatField, SlugField


@dataclass
class OtterDto:
    slug: str = None
    bathTime: float = None


class OtterSerializer(AbstractSerializer[OtterDto]):
    slug = SlugField(required=True)
    bathTime = FloatField(required=True)

    def validate_slug(self, data):
        existing_slug = get_entity_id(self.context['request'])
        if existing_slug and data != existing_slug:
            raise ValidationError(['Field is read only.'])
        return data
