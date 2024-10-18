from djoser.serializers import UserCreateSerializer
from geomatico_django.serialization import AbstractSerializer
from rest_framework.exceptions import ValidationError


class AbstractDjoserUserSerializer(UserCreateSerializer, AbstractSerializer):
    def update(self, instance, validated_data):
        if not self.Meta.creation_only_fields:
            raise ValueError('Subclasses of AbstractDjoserUserSerializer must define Meta.creation_only_fields')
        errors = {}
        for creation_only_field in self.Meta.creation_only_fields:
            if creation_only_field in validated_data:
                errors[creation_only_field] = f"{creation_only_field} cannot be changed through this endpoint."

        if errors:
            raise ValidationError(errors)

        return super().update(instance, validated_data)

    class Meta:
        creation_only_fields = []
