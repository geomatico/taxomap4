from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework.fields import CharField, DateTimeField, IntegerField

from api.auth.common.serialization import AbstractDjoserUserSerializer


class TaxomapUserSerializer(AbstractDjoserUserSerializer):
    id = IntegerField(required=False, read_only=True)
    firstName = CharField(required=True, source='first_name')
    lastName = CharField(required=True, source='last_name')
    registrationDate = DateTimeField(read_only=True, source='registration_date')

    class Meta(UserCreateSerializer.Meta):
        # as defined in API, to decouple from model if needed
        EMAIL_FIELD = 'email'
        USERNAME_FIELD = 'email'
        PASSWORD_FIELD = 'password'

        model = get_user_model()

        fields = ('id', 'firstName', 'lastName', 'registrationDate', EMAIL_FIELD, PASSWORD_FIELD)
        creation_only_fields = ('email', 'password')
