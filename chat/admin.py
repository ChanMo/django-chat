from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls import path
from .models import *

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'show_users', 'last_message', 'updated')
    list_per_page = 12
    list_filter = ('created', 'updated')
    search_fields = ('name',)

    def show_users(self, obj):
        return ','.join(i.username for i in obj.users.all())

    def chat_view(self, request):
        context = dict(
            self.admin_site.each_context(request),
            title = 'chat',
        )
        return TemplateResponse(request, "admin/chat/chat.html", context)


    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('chat/', self.chat_view),
        ]
        return my_urls + urls


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('room', 'user', 'mtype', 'msg', 'is_read', 'created')
    list_per_page = 12
    list_filter = ('is_read', 'created', 'mtype')
    search_fields = ('room__name', 'user__username', 'msg')


@admin.register(CommonText)
class CommonTextAdmin(admin.ModelAdmin):
    list_display = ('content', 'sort', 'updated')
    list_per_page = 12
    list_filter = ('created', 'updated')
    search_fields = ('content',)
