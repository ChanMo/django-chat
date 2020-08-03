import logging
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .models import *

logger = logging.getLogger(__name__)
User = get_user_model()

@login_required
def chat_view(request):
    if Room.users.through.objects.filter(user=request.user).exists():
        room = Room.users.through.objects.filter(user=request.user).first().room
    else:
        room = Room.objects.create(name=request.user.username)
        admin = User.objects.filter(is_superuser=True).first()
        room.users.add(admin)
        room.users.add(request.user)
    #room, created = Room.users.through.objects.get_or_create(user=request.user)
    data = {
        'room': room,
        'product': request.GET.get('product', 0)
    }
    return render(request, 'chat/chat.html', data)
