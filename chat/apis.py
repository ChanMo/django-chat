from django.shortcuts import get_object_or_404
from django.urls import path

from rest_framework.permissions import AllowAny
from rest_framework.routers import DefaultRouter
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from .models import *
from .serializers import *
from .filters import *

class MessageViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    #permission_classes = [AllowAny]
    #pagination_class = None
    #filterset_fields = ('is_read',)
    filterset_class = MessageFilter

    def get_queryset(self):
        room = get_object_or_404(
            Room,
            uuid=self.request.GET.get('uuid', None)
        )
        qs = super().get_queryset()
        #return qs.order_by('created')
        return qs.filter(room=room).order_by('-created')


class RoomViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    pagination_class = None


class CommonTextViewSet(ModelViewSet):
    queryset = CommonText.objects.all()
    serializer_class = CommonTextSerializer
    pagination_class = None

router = DefaultRouter()
router.register('message', MessageViewSet)
router.register('common_text', CommonTextViewSet)
router.register('', RoomViewSet)
urlpatterns = router.urls

