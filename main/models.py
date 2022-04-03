from asyncio.windows_events import NULL
from distutils.command.upload import upload
from pickle import FALSE
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import AbstractUser
from main.manager import UserManager
from main.helper import saveBImg, saveDp, saveBDp
from django_mysql.models import ListCharField
from django.db.models import CharField
import os

# Create your models here.


class User(AbstractUser):
    # username
    # first name
    # last name
    # email
    # password
    account_type = models.CharField(max_length=8, choices=(
        ('private', 'Private'), ('business', 'Business')), default='private')
    country = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    city = models.CharField(max_length=50, default="none")
    zip = models.CharField(max_length=32)
    phone_number = models.CharField(max_length=31)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    address = models.TextField()
    display_pic = models.ImageField(
        null=True, blank=True, default="users/admin.jpg", upload_to=saveDp)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    objects = UserManager()


class Business(models.Model):
    display_pic = models.ImageField(
        null=True, blank=True, default="businesses/shop.png", upload_to=saveBDp)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owns")
    name = models.CharField(max_length=100)
    country = models.CharField(
        max_length=50, default="none", null=True, blank=True)
    state = models.CharField(
        max_length=50, default="none", null=True, blank=True)
    city = models.CharField(
        max_length=50, default="none", null=True, blank=True)
    email = models.EmailField()
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    description = models.TextField(max_length=500, blank=False, null=False)
    keywords = ListCharField(
        base_field=CharField(max_length=50),
        size=25,
        max_length=(25*51)
    )
    created_at = models.DateTimeField(auto_now_add=True)
    # Person.objects.create(name='Horatio', post_nominals=['PhD', 'Esq.', 'III'])
    # Person.objects.filter(post_nominals__contains='PhD')
    # getting multiple images # https://www.youtube.com/watch?v=Rcly7QHKYps

    def __str__(self):
        return self.name


class BusinessImage(models.Model):
    belongs_to = models.ForeignKey(
        Business, on_delete=models.CASCADE, related_name="has")
    image = models.ImageField(upload_to=saveBImg, null=True, blank=True)


class Feedback(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="rated")
    business = models.ForeignKey(
        Business, on_delete=models.CASCADE, related_name="feedbacks")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Rating(models.IntegerChoices):
        star_1 = 1, 'Disappointed'
        star_2 = 2, 'Unhappy'
        star_3 = 3, 'Works'
        star_4 = 4, 'Satisfied'
        star_5 = 5, 'Delighted'
    rating = models.PositiveSmallIntegerField(
        choices=Rating.choices, help_text="How would you rate this business?")
    description = models.TextField()
    edited = models.BooleanField(default=False)

    def __str__(self):
        return self.business.name
