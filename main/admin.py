from django.contrib import admin
from .models import Business, BusinessImage, Feedback, User

# Register your models here.
admin.site.register(User)
admin.site.register(Business)
admin.site.register(BusinessImage)
admin.site.register(Feedback)