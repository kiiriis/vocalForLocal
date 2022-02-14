from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from main.models import User
from dotenv import load_dotenv
from main.helper import getTheme,redirector
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
    if request.method != "POST":
        theme = getTheme(request)
        username = ''
        if request.GET.get('username'):
            username = request.GET.get('username')
        return render(request,'login.html',{'theme':theme,'username':username})
    else:
        theme = request.POST['theme']
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request,user)
            return redirect(redirector('/',theme))
        else:
            messages.error(request, "INVALID CREDENTIALS!")
            return redirect(redirector('/login',theme,f'username={username}'))

def resetPassword(request):
    if request.method != "POST":
        theme = getTheme(request)
        return render(request,'resetPassword.html',{'theme':theme})
    else:
        theme = request.POST['theme']
        email = request.POST['email']
        password = request.POST['password']
        u = User.objects.get(email=email)
        u.set_password(password)
        u.save()
        messages.info(request, "Your password has been reset")
        return redirect(redirector('/login',theme,f'username={u.username}'))

def logoutUser(request):
    theme = getTheme(request)
    if not request.user.is_anonymous:
        logout(request)
    return redirect(redirector('/',theme))

def signUp(request):
    if request.method != "POST":
        theme = getTheme(request)
        return render(request, "signup.html", {'theme':theme,'csc_email':os.getenv('CSC_EMAIL'),'csc_token':os.getenv('CSC_API_TOKEN')})
    else :
        theme = request.POST['theme']
        if request.FILES.get('avatar') == None:
            u = User(
                first_name=request.POST['first_name'],
                last_name=request.POST['last_name'],
                username=request.POST['username'],
                account_type=request.POST['account'],
                # password=request.POST['password'],
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
                # password=request.POST['password'],
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
        u.set_password(request.POST['password'])
        u.save()
        messages.success(request, 'Welcome to #vocalForLocal')
        return redirect(redirector('/login',theme,f'username={request.POST["username"]}'))