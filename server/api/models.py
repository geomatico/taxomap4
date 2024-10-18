from django.db.models import DateTimeField

from api.auth.common.models import AbstractUser, AbstractUserManager


class TaxomapUserManager(AbstractUserManager):
    ...


class User(AbstractUser):
    registration_date = DateTimeField(auto_now_add=True)

    objects = TaxomapUserManager()

    class Meta:
        managed = True
        db_table = 'taxomap_users'
