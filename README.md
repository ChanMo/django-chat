# Django Chat

基于Django的通用聊天模块

## Requirements

* django3+
* djangorestframework
* django-attachments
* channels
* webpack(打包静态文件)
* storybook(可选)

## Tutorial

### update `settings.py`

```
INSTALLED_APPS = [
    ...
    'chat'
]
```

### update `urls.py`

```
urlpatterns = [
    ...
    path('api/chat/', include('chat.apis')),
    path('chat/', include('chat.urls')),
]
```

### migrations

```
$ python manage.py makemigrations chat
$ python manage.py migrate
```

### update `webpack.js`

```
module.exports = {
  entry: {
    ...
    chat: './backend/chat/components/chat.js',
    room: './backend/chat/components/room.js'
  },
  ...
}
```

### build

```
$ npm run build
```


## Next

* [ x ] 图片支持
* [ x ] 常用语
* [  ] 表情支持
* [  ] 用户信息
* [  ] 语音信息
