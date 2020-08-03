import logging
from rest_framework import serializers
from accounts.serializers import BaseUserSerializer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async, async_to_sync
from .models import *

logger = logging.getLogger(__name__)

class RoomSerializer(serializers.ModelSerializer):
    users = BaseUserSerializer(many=True, read_only=True)
    class Meta:
        model = Room
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['uuid'] = str(instance.uuid)
        if 'request' in self.context.keys():
            ret['unread'] = instance.unread(self.context['request'].user)
        if 'user' in self.context.keys():
            ret['unread'] = instance.unread(self.context['user'])
        return ret


class MessageSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Message
        fields = '__all__'
        #exclude = ('room', 'uuid',)

    #@sync_to_async
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['room'] = str(instance.room.uuid)
        ret['uuid'] = str(instance.uuid)
        ret['user'] = BaseUserSerializer(instance.user).data
        if instance.mtype == 'product':
            from ecommerce.serializers import BaseProductSerializer
            from ecommerce.models import Product
            #product = await database_sync_to_async(Product.objects.filter)(pk=instance.msg).first()
            product = Product.objects.filter(pk=instance.msg).first()
            if product:
                ret['product'] = BaseProductSerializer(product).data
        return ret


class CommonTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonText
        fields = '__all__'
