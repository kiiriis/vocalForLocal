from asyncio.windows_events import NULL
from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from main.models import User
import math, random
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
    if not request.user.is_anonymous:
        logout(request)
    return redirect('/')

def signUp(request):
    theme = getTheme(request)
    if request.method != "POST":
        return render(request, "signup.html", {'theme':theme,'csc_email':os.getenv('CSC_EMAIL'),'csc_token':os.getenv('CSC_API_TOKEN')})
    else :
        filepath = request.FILES.get('filepath', False)
        if not filepath:
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
                # Check if this works!
                display_pic = request.FILES['avatar'],
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
        return redirect('/loginUser')

def generateEmailOTP():
    digits = os.getenv("DIGITS")
    OTP = ""
    otp_size = (int)(os.getenv("OTP_SIZE"))
    digits_len = (int)(os.getenv("DIGITS_LEN"))
    for i in range(otp_size) :
        OTP += digits[(math.floor(random.random() * digits_len))]
    return OTP

def sendEmailOtp(request):
    email=request.POST["email"]
    OTP = generateEmailOTP()
    html = '''
    <div style='font-family:system-ui;font-size:25px;width:max-content;'>
        <p>Welcome to <span style='font-weight: 700;'>#vocalForLocal</span></p><br>
        <div style='height:max-content;width:max-content;'>
            <p style='margin:5px;font-size: 15px;'>Please use this verification code to verify your Email ID</p><br>
            <p style='font-weight: 700;margin: 5px;font-size:20px;'>'''+OTP+'''</p><br>
            <p style='margin:5px;font-size: 15px;'>If you didn't request this, you can ignore this email or <a href='mailto:vocalForLocal2022@gmail.com'>let us know</a>.</p><br>
            <p style='margin:5px;font-size: 15px;'>Thanks!</p>
        </div>
    </div>
    '''
    message = '''Welcome to #vocalForLocal\nPlease use this verification code to verify your Email ID\n'''+OTP+'''If you didn't request this, you can ignore this email or let us know.\nThanks!'''
    send_mail('Verify your OTP for #vocalForLocal',message,os.getenv('EMAIL_HOST_USER'),[email], fail_silently=False,html_message=html)
    return HttpResponse(OTP)

def unameChecker(request):
    if request.method == "POST":
        return HttpResponse(len(User.objects.filter(username=request.POST["username"])))