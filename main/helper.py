import math, random
import os

def isAnonymous(user):
    return user.is_anonymous

def saveDp(instance, filename):
    upload_to = "users/"
    ext = filename.split('.')[-1]
    if instance.username:
        filename = f"{instance.username}.{ext}"
    return os.path.join(upload_to,filename)

def saveBDp(instance, filename):
    upload_to = f"businesses/{instance.name}"
    ext = filename.split('.')[-1]
    filename = f"dp.{ext}"
    return os.path.join(upload_to,filename)

def saveBImg(instance, filename):
    upload_to = f"businesses/{instance.belongs_to.name}"
    return os.path.join(upload_to,filename)

def getTheme(request):
    theme = "light"
    if request.GET.get('isDark'):
        if request.GET.get('isDark')=="True":
            theme = "dark"
    return theme

def redirector(link,theme,*args):
    adder = ''
    for arg in args:
        adder += '&'+arg
    if(theme == "dark"):
        return f"{link}?isDark=True"+adder
    else:
        if(len(adder)):
            return f"{link}"+'?'+adder[1:]
        return link

def generateEmailOTP():
    digits = os.getenv("DIGITS")
    OTP = ""
    otp_size = (int)(os.getenv("OTP_SIZE"))
    digits_len = (int)(os.getenv("DIGITS_LEN"))
    for i in range(otp_size) :
        OTP += digits[(math.floor(random.random() * digits_len))]
    return OTP