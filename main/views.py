from ast import keyword
from asyncio.windows_events import NULL
import json
import xdrlib
from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from main.models import Business, BusinessImage, User, Feedback
from dotenv import load_dotenv
from main.helper import getTheme, redirector, isAnonymous
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
import os
import requests
import urllib
from django.http import JsonResponse
load_dotenv()


def index(request):
    theme = getTheme(request)
    return render(request, 'index.html', {'theme': theme})


def community(request):
    theme = getTheme(request)
    return render(request, 'community.html', {'theme': theme, 'token': os.getenv('MAP_ACCESS_TOKEN'), 'businesses': Business.objects.all()})


@user_passes_test(isAnonymous, login_url='/')
def loginUser(request):
    if request.method != "POST":
        theme = getTheme(request)
        username = ''
        if request.GET.get('username'):
            username = request.GET.get('username')
        return render(request, 'login.html', {'theme': theme, 'username': username})
    else:
        theme = request.POST['theme']
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(redirector('/dashboard', theme))
        else:
            messages.error(request, "INVALID CREDENTIALS!")
            return redirect(redirector('/login', theme, f'username={username}'))


def resetPassword(request):
    if request.method != "POST":
        theme = getTheme(request)
        return render(request, 'resetPassword.html', {'theme': theme})
    else:
        theme = request.POST['theme']
        email = request.POST['email']
        password = request.POST['password']
        u = User.objects.get(email=email)
        u.set_password(password)
        u.save()
        messages.info(request, "Your password has been reset")
        return redirect(redirector('/login', theme, f'username={u.username}'))


@login_required(login_url='/login')
def logoutUser(request):
    theme = getTheme(request)
    if not request.user.is_anonymous:
        logout(request)
    return redirect(redirector('/', theme))


@user_passes_test(isAnonymous, login_url='/')
def signUp(request):
    if request.method != "POST":
        theme = getTheme(request)
        return render(request, "signup.html", {'theme': theme, 'csc_email': os.getenv('CSC_EMAIL'), 'csc_token': os.getenv('CSC_API_TOKEN')})
    else:
        theme = request.POST['theme']
        if request.FILES.get('avatar') == None:
            u = User(
                first_name=request.POST['first_name'],
                last_name=request.POST['last_name'],
                username=request.POST['username'],
                account_type=request.POST['account'],
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
                display_pic=request.FILES.get('avatar'),
                first_name=request.POST['first_name'],
                last_name=request.POST['last_name'],
                username=request.POST['username'],
                account_type=request.POST['account'],
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
        return redirect(redirector('/login', theme, f'username={request.POST["username"]}'))


@login_required(login_url='/login')
def dashboard(request):
    if request.method == "POST":
        theme = request.POST['theme']
        dist = request.POST["distance"]
    else:
        theme = getTheme(request)
        dist = request.GET.get("distance")
    businesses = request.user.owns.all()
    allBuss = Business.objects.all()
    userlong = request.user.longitude
    userlat = request.user.latitude
    if dist == None or dist.isdigit():
        if dist == None:
            dist = 1
        else:
            dist = int(dist)
        others = []
        for b in allBuss:
            r = requests.get(
                f"https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{userlong},{userlat};{b.longitude},{b.latitude}?access_token={os.getenv('MAP_ACCESS_TOKEN')}")
            # print(json.loads(r.text))
            d = json.loads(r.text)["trips"][0]['distance']/1000
            if d <= dist:
                others.append({"business": b, "distance": round(d, 2)})
    else:
        dist = 'inf'
        others = []
        for b in allBuss:
            r = requests.get(
                f"https://api.mapbox.com/optimized-trips/v1/mapbox/driving/{userlong},{userlat};{b.longitude},{b.latitude}?access_token={os.getenv('MAP_ACCESS_TOKEN')}")
            d = json.loads(r.text)["trips"][0]['distance']/1000
            others.append({"business": b, "distance": round(d, 2)})
    images = BusinessImage.objects.all()
    return render(request, 'dashboard.html', {'theme': theme, 'businesses': businesses, 'nob': len(businesses), 'otherBusinesses': others, 'images': images, 'distance': str(dist)})


@login_required(login_url='/login')
def profile(request, username):
    if request.method == "POST":
        theme = request.POST['theme']
        u = User.objects.get(id=request.user.id)
        if request.FILES.get('avatar') != None:
            if os.path.exists(os.path.abspath(os.curdir)+u.display_pic.url):
                os.remove(os.path.abspath(os.curdir)+u.display_pic.url)
            u.display_pic = request.FILES.get('avatar')
        u.first_name = request.POST['first_name']
        u.last_name = request.POST['last_name']
        u.username = request.POST['username']
        if request.POST.get('account'):
            u.account_type = request.POST['account']
        u.country = request.POST['country']
        u.state = request.POST['state']
        u.city = request.POST['city']
        u.email = request.POST['email']
        u.phone_number = request.POST['phno']
        u.zip = request.POST['zip']
        u.address = request.POST['address']
        u.latitude = float(request.POST['latitude'])
        u.longitude = float(request.POST['longitude'])
        u.save()
        return redirect('/dashboard')
    else:
        theme = getTheme(request)
        if username == request.user.username:
            return render(request, "editProfile.html", {'theme': theme, 'csc_email': os.getenv('CSC_EMAIL'), 'csc_token': os.getenv('CSC_API_TOKEN')})
        else:
            return HttpResponse("View profile coming soon")


@login_required(login_url='/login')
def businessSignup(request):
    if(request.method == "GET"):
        theme = getTheme(request)
        return render(request, 'businessSignup.html', {'theme': theme, 'csc_email': os.getenv('CSC_EMAIL'), 'csc_token': os.getenv('CSC_API_TOKEN')})
    else:
        theme = request.POST['theme']
        if request.FILES.get('avatar') == None:
            b = Business(
                name=request.POST['business_name'],
                owner=request.user,
                country=request.POST['country'],
                state=request.POST['state'],
                city=request.POST['city'],
                email=request.POST['email'],
                latitude=float(request.POST['latitude']),
                longitude=float(request.POST['longitude']),
                description=request.POST['business_description']
            )
        else:
            b = Business(
                display_pic=request.FILES.get('avatar'),
                name=request.POST['business_name'],
                owner=request.user,
                country=request.POST['country'],
                state=request.POST['state'],
                city=request.POST['city'],
                email=request.POST['email'],
                latitude=float(request.POST['latitude']),
                longitude=float(request.POST['longitude']),
                description=request.POST['business_description']
            )
        keywords = request.POST['keywords'].split(',')
        cleanKeywords = []
        for keys in keywords:
            if len(keys) > 0:
                cleanKeywords.append(keys)
        keywords = ","
        keywords = keywords.join(cleanKeywords)
        b.keywords = keywords
        b.save()
        images = request.FILES.getlist('images')
        for image in images:
            bi = BusinessImage.objects.create(belongs_to=b)
            bi.save()
            bi.image = image
            bi.save()
        return redirect(redirector('/dashboard', theme))


@login_required(login_url='/login')
def business(request, businessname):
    if len(request.user.owns.filter(name=businessname)) > 0:
        if request.method == "POST":
            b = Business.objects.get(name=businessname)
            if(request.FILES.get('avatar') != None):
                os.remove(os.path.abspath(os.curdir) + urllib.parse.unquote(b.display_pic.url))
                b.display_pic = request.FILES.get('avatar')

            b.name = request.POST['business_name']
            b.country = request.POST['country']
            b.state = request.POST['state']
            b.city = request.POST['city']
            b.email = request.POST['email']
            b.latitude = request.POST['latitude']
            b.longitude = request.POST['longitude']
            b.description = request.POST['business_description']
            keywords = request.POST['keywords'].split(',')
            cleanKeywords = []
            for keys in keywords:
                if len(keys) > 0:
                    cleanKeywords.append(keys)
            keywords = ","
            keywords = keywords.join(cleanKeywords)
            b.keywords = keywords
            b.save()
            return redirect('/dashboard')
        else:
            b = Business.objects.get(name=businessname)
            theme = getTheme(request)
        return render(request, 'editBusinessForm.html', {'theme': theme, 'cb': b, 'csc_email': os.getenv('CSC_EMAIL'), 'csc_token': os.getenv('CSC_API_TOKEN')})
    else:
        theme = getTheme(request)
        if Business.objects.filter(name=businessname).exists() == False:
            return redirect("/dashboard")
        b = Business.objects.get(name=businessname)
        isExist = False
        ufo = NULL
        if request.user.rated.filter(business=b.id).exists():
            isExist = True
            ufo = request.user.rated.get(business=b.id)
        return render(request, 'viewBusiness.html', {'isExist': isExist, 'userFbObj': ufo, 'theme': theme, 'business': b, 'token': os.getenv('MAP_ACCESS_TOKEN'), 'images': b.has.all(), 'feedbacks': b.feedbacks.all()})


# def demo(request, businessName):
#     theme = getTheme(request)
#     if Business.objects.filter(name=businessName).exists() == False:
#         return redirect("/dashboard")
#     b = Business.objects.get(name=businessName)
#     isExist = False
#     ufo = NULL
#     if request.user.rated.filter(business=b.id).exists():
#         isExist = True
#         ufo = request.user.rated.get(business=b.id)
#     return render(request, 'viewBusiness.html', {'isExist': isExist, 'userFbObj': ufo, 'theme': theme, 'business': b, 'token': os.getenv('MAP_ACCESS_TOKEN'), 'images': b.has.all(), 'feedbacks': b.feedbacks.all()})


def feedback(request):
    print("here")
    if request.method=="POST":
        theme = request.POST['theme']
        b = Business.objects.get(id = request.POST['business_id'])
        if request.user.rated.filter(business=b.id).exists():
            f = request.user.rated.get(business = b.id)
            f.edited = True
            f.rating = request.POST['rating']
            f.description = request.POST['f_description']
        else:
            f = Feedback(user=request.user, business=b, rating = request.POST['rating'], description = request.POST['f_description'])
        f.save()
        return redirect('/business/'+b.name)
    return redirect('/')

def search_result(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        res = None
        business = request.POST.get('business')
        # query_se = Business.objects.all()
        tempquery = Business.objects.none()
        query_se = Business.objects.none()
        queryse3 = Business.objects.none()
        querse1 = Business.objects.filter(name__icontains=business)
        queryse2 = Business.objects.filter(description__icontains=business)
        for x in Business.objects.all():
            for temp in x.keywords:
                if business in temp:
                    queryse3 = Business.objects.filter(id=x.id)
                    tempquery = tempquery.union(queryse3)
        query_se = querse1.union(queryse2.union(tempquery))
        if(query_se == Business.objects.none()):
            res = 'No business found'
        else:
            data = []
            for pos in query_se:
                item = {
                    'pk': pos.pk,
                    'name': pos.name,
                    'state': pos.state,
                    'city': pos.city,
                    'image': pos.display_pic.url,
                    'country': pos.country,
                }
                data.append(item)
                print(len(data))
            res = data
        return JsonResponse({'data': res})
    return JsonResponse({})
