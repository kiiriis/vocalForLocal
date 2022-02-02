from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager

# Create your models here.
class User(AbstractUser):
    # username
    # first name
    # last name
    # email
    # password
    account_type = models.CharField(max_length=8,choices=(('private','Private'),('business','Business')),default='private')
    country = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    city = models.CharField(max_length=50, default="none")
    zip = models.CharField(max_length=32)
    phone_number = models.CharField(max_length=31)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    address = models.TextField()
    display_pic = models.ImageField(null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    objects = UserManager()