from xml.etree.ElementInclude import include
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name="index"),
    path('community',views.community,name="community"),
    path('login',views.loginUser,name="login"),
    path('logout',views.logoutUser,name="logout"),
    path('signup',views.signUp,name="signUp"),
]