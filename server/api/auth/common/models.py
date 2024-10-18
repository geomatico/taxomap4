from django.contrib.auth import get_user_model
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.db.models import BooleanField, CharField, EmailField
from django.utils.deconstruct import deconstructible
from rest_framework.validators import qs_exists

from api.auth.common.exceptions import BusinessError, BusinessErrorException


@deconstructible
class EmailValidator:
    def __call__(self, value):
        if qs_exists(get_user_model().objects.filter(email=value)):
            raise BusinessErrorException(BusinessError.USER_EXISTS)


class AbstractUser(AbstractBaseUser):
    # we don't want to extend django.contrib.auth.models.User since it contains more than we need
    # (such as username or date_joined); still we want to use AbstractBaseUser since it provides
    # important functionality for handling passwords

    # these fields mimic models.User
    first_name = CharField("First name", blank=True, null=False)
    last_name = CharField("Last name", blank=True, null=False)
    email = EmailField("Email", blank=False, null=False, unique=True, validators=[EmailValidator()])
    is_staff = BooleanField(null=False, default=False)
    is_active = BooleanField(null=False, default=False)

    is_superuser = BooleanField(null=False, default=False)

    # required by AbstractBaseUser
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name']
    # used below in AbstractUserManager
    PASSWORD_FIELD = "password"

    class Meta:
        abstract = True


class AbstractUserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        user = get_user_model()(**extra_fields)
        setattr(user, get_user_model().EMAIL_FIELD, self.normalize_email(email))
        setattr(user, get_user_model().PASSWORD_FIELD, make_password(password))
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_active", False)
        extra_fields.setdefault("is_staff", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)
