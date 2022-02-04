from django.http.response import HttpResponse
from django.core.mail import send_mail
from main.models import User
from dotenv import load_dotenv
from main.helper import generateEmailOTP
import os

load_dotenv()

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

def emailChecker(request):
    if request.method == "POST":
        return HttpResponse(len(User.objects.filter(email=request.POST["email"])))

def phoneChecker(request):
    if request.method == "POST":
        return HttpResponse(len(User.objects.filter(phone_number=request.POST["phno"])))