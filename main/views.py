from django.http.response import HttpResponse
from django.shortcuts import render
from dotenv import load_dotenv
import os

load_dotenv()

# Create your views here.
def getTheme(request):
    theme = "light"
    if request.GET.get('isDark'):
        if request.GET.get('isDark')=="True":
            theme = "dark"
    return theme

def index(request):
    theme = getTheme(request)
    return render(request,'index.html',{'theme':theme})

def community(request):
    theme = getTheme(request)
    return render(request,'community.html',{'theme':theme,'token':os.getenv('MAP_ACCESS_TOKEN')})

def loginUser(request):
    pass

def logoutUser(request):
    pass

def signUp(request):
    theme = getTheme(request)
    return render(request, "signup.html", {'theme':theme})