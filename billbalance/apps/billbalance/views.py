from django.shortcuts import render_to_response
from django.http import HttpResponse
from models import *

def home(request):
   return HttpResponse('It\'s working')

