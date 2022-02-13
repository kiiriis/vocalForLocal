from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from main.models import User
from dotenv import load_dotenv
from main.helper import getTheme
from django.contrib import messages
import os

load_dotenv()

# Create your views here.
def index(request):
    theme = getTheme(request)
    return render(request,'index.html',{'theme':theme})

def community(request):
    theme = getTheme(request)
    return render(request,'community.html',{'theme':theme,'token':os.getenv('MAP_ACCESS_TOKEN')})

def loginUser(request):
    theme = getTheme(request)
    if request.method != "POST":
        return render(request,'login.html',{'theme':theme})
    else:
        if request.method=='POST':
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                print("valid")
                login(request,user)
                return redirect('/')
            else:
                print("invalid")
                messages.error(request, "INVALID CREDENTIALS!")
                return redirect('/login')
        return redirect('/')

def logoutUser(request):
    if not request.user.is_anonymous:
        logout(request)
    return redirect('/')

def signUp(request):
    theme = getTheme(request)
    if request.method != "POST":
        return render(request, "signup.html", {'theme':theme,'csc_email':os.getenv('CSC_EMAIL'),'csc_token':os.getenv('CSC_API_TOKEN')})
    else :
        print(request.POST['account'])
        if request.FILES.get('avatar') == None:
            u = User(
                first_name=request.POST['first_name'],
                last_name=request.POST['last_name'],
                username=request.POST['username'],
                account_type=request.POST['account'],
                password=request.POST['password'],
                country=request.POST['country'],
                state=request.POST['state'],
                city=request.POST['city'],
                email=request.POST['email'],
                phone_number=request.POST['phno'],
                zip=request.POST['zip'],
                address=request.POST['address'],
                latitude=float(request.POST['latitude']),
                longitude=float(request.POST['longitude']),
            )
        else:
            u = User(
                display_pic = request.FILES.get('avatar'),
                first_name=request.POST['first_name'],
                last_name=request.POST['last_name'],
                username=request.POST['username'],
                account_type=request.POST['account'],
                password=request.POST['password'],
                country=request.POST['country'],
                state=request.POST['state'],
                city=request.POST['city'],
                email=request.POST['email'],
                phone_number=request.POST['phno'],
                zip=request.POST['zip'],
                address=request.POST['address'],
                latitude=float(request.POST['latitude']),
                longitude=float(request.POST['longitude']),
            )
        u.save()
        # message also
        return redirect('/login')