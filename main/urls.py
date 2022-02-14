from xml.etree.ElementInclude import include
from django.contrib import admin
from django.urls import path
from main import views
from main import utility

urlpatterns = [
    path('',views.index,name="index"),
    path('community',views.community,name="community"),
    path('login',views.loginUser,name="login"),
    path('logout',views.logoutUser,name="logout"),
    path('signup',views.signUp,name="signUp"),
    path('resetPassword',views.resetPassword,name="resetPassword"),
    path('sendEmailOtp',utility.sendEmailOtp,name="sendEmailOtp"),
    path('unameChecker',utility.unameChecker,name="unameChecker"),
    path('emailChecker',utility.emailChecker,name="emailChecker"),
    path('phoneChecker',utility.phoneChecker,name="phoneChecker"),
]