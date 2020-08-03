import json
import logging

#from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .serializers import *
from .models import *

User = get_user_model()
logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        room = str(self.scope['url_route']['kwargs']['room'])
        self.room = room
        self.user = self.scope['user']

        async_to_sync(self.channel_layer.group_add)(
            self.room,
            self.channel_name
        )

        room = Room.objects.get(uuid=self.room)
        room.mark_read(self.user)

        self.accept()


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        logger.debug(data)
        room = Room.objects.get(uuid=self.room)
        #user = await database_sync_to_async(User.objects.get)(pk=data['user'])
        res = Message.objects.create(
            room = room,
            user = self.user,
            mtype = data['mtype'],
            msg = data['msg']
        )
        #serializer = await database_sync_to_async(MessageSerializer)(res)
        serializer = MessageSerializer(res)
        async_to_sync(self.channel_layer.group_send)(
            self.room,
            {
                **serializer.data,
                'type':'chat_message'
            }
        )

    def chat_message(self, event):
        logger.debug(event)
        self.send(text_data=json.dumps(event))
        room = Room.objects.get(uuid=self.room)
        room.mark_read(self.user)
