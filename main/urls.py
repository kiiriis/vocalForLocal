from xml.etree.ElementInclude import include
from django.contrib import admin
from django.urls import path
from main import views
from main import utility

urlpatterns = [
    path('', views.index, name="index"),
    path('community', views.community, name="community"),
    path('login', views.loginUser, name="login"),
    path('logout', views.logoutUser, name="logout"),
    path('signup', views.signUp, name="signUp"),
    path('dashboard', views.dashboard, name="dashboard"),
    path('resetPassword', views.resetPassword, name="resetPassword"),
    path('businessSignup', views.businessSignup, name="businessSignup"),
    path('user/emailChecker', utility.emailChecker, name="emailCheckerPart2"),
    path('user/sendEmailOtp', utility.sendEmailOtp, name="sendEmailOtpPart2"),
    path('user/unameChecker', utility.unameChecker, name="unameCheckerPart2"),
    path('user/phoneChecker', utility.phoneChecker, name="phoneCheckerPart2"),
    path('emailChecker', utility.emailChecker, name="emailChecker"),
    path('sendEmailOtp', utility.sendEmailOtp, name="sendEmailOtp"),
    path('unameChecker', utility.unameChecker, name="unameChecker"),
    path('phoneChecker', utility.phoneChecker, name="phoneChecker"),
    path('user/<str:username>', views.profile, name="profile"),
    path('business/<str:businessname>', views.business, name="business"),
    path('demo/feedback', views.feedback, name="feedback"),
    path('demo/<str:businessName>', views.demo, name="demo"),
    path('search/', views.search_result, name="search"),
]
