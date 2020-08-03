import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings


class Room(models.Model):
    """
    聊天房间, 可多人
    """
    uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_('room name'), max_length=200)
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, verbose_name=_('room users'), blank=True)
    last_message = models.CharField(_('last message'), max_length=255, blank=True, null=True)
    created = models.DateTimeField(_('created time'), auto_now_add=True)
    updated = models.DateTimeField(_('updated time'), auto_now=True)

    def __str__(self):
        return self.name

    def unread(self, user):
        " 获取未读数量 "
        return self.message_set.exclude(user=user).filter(is_read=False).count()

    def mark_read(self, user):
        " 标记为已读 "
        return self.message_set.exclude(user=user).filter(is_read=False).update(is_read=True)

    class Meta:
        ordering = ['-updated']
        verbose_name = _('chat room')
        verbose_name_plural = _('chat room')

    def avatar(self):
        user = self.users.first()
        return user.avatar or None


class Message(models.Model):
    """
    聊天信息
    """
    uuid = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, verbose_name=_('chat room'))
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        verbose_name=_('user'))
    mtype = models.CharField(_('message type'), max_length=200, default='text')
    msg = models.TextField(_('message content'), blank=True, null=True)
    is_read = models.BooleanField(_('has read'), default=False)
    created = models.DateTimeField(_('created time'), auto_now_add=True)

    def __str__(self):
        if self.mtype == 'text':
            return self.msg
        elif self.mtype == 'product':
            from ecommerce.models import Product
            p = Product.objects.filter(pk=self.msg).first()
            if p:
                return p.name
            return self.msg
        return self.mtype

    class Meta:
        ordering = ['-created']
        verbose_name = _('chat message')
        verbose_name_plural = _('chat messages')



class CommonText(models.Model):
    """
    常用语
    """
    content = models.TextField(_('content'))
    sort = models.PositiveSmallIntegerField(_('sort'), default=0)
    created = models.DateTimeField(_('created time'), auto_now_add=True)
    updated = models.DateTimeField(_('updated time'), auto_now=True)

    def __str__(self):
        return self.content

    class Meta:
        ordering = ['-sort']
        verbose_name = _('common text')
        verbose_name_plural = _('common text')
