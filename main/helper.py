import math, random
import os

def saveDp(instance, filename):
    upload_to = "users/"
    ext = filename.split('.')[-1]
    if instance.username:
        filename = f"{instance.username}.{ext}"
    return os.path.join(upload_to,filename)

def getTheme(request):
    theme = "light"
    if request.GET.get('isDark'):
        if request.GET.get('isDark')=="True":
            theme = "dark"
    return theme

def generateEmailOTP():
    digits = os.getenv("DIGITS")
    OTP = ""
    otp_size = (int)(os.getenv("OTP_SIZE"))
    digits_len = (int)(os.getenv("DIGITS_LEN"))
    for i in range(otp_size) :
        OTP += digits[(math.floor(random.random() * digits_len))]
    return OTP