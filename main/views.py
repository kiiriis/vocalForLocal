from django.http.response import HttpResponse
from django.shortcuts import render

# Create your views here.
def index(request):
    theme = "light"
    if request.GET.get('isDark'):
        if request.GET.get('isDark')=="True":
            theme = "dark"
    return render(request,'index.html',{'theme':theme})

def community(request):
    theme = "light"
    if request.GET.get('isDark'):
        if request.GET.get('isDark')=="True":
            theme = "dark"
    return render(request,'community.html',{'theme':theme})