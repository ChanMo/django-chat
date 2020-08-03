from django.dispatch import receiver
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import *
from .models import *

@receiver(post_save, sender=Message)
def set_last_message(sender, instance=None, created=False, **kwargs):
    " 更新最新信息 "
    if not created:
        return
    room = instance.room
    room.last_message = str(instance)[0:15]
    room.save()


@receiver(post_save, sender=Room)
def send_message(sender, instance=None, **kwargs):
    " 收到新消息时, 发送room更新提醒 "
    channel_layer = get_channel_layer()
    for user in instance.users.all():
        if user.channel:
            serializer = RoomSerializer(instance, context={'user':user})
            async_to_sync(channel_layer.send)(user.channel, {
                'type': 'chat_message',
                'room': serializer.data
            })
