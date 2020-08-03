from django_filters import rest_framework as filters
from .models import *

class MessageFilter(filters.FilterSet):
    created_timestamp = filters.IsoDateTimeFilter(field_name='created', lookup_expr='gt')
    class Meta:
        model = Message
        fields = ['created_timestamp']
        # fields = {
        #     #'created_timestamp': ['gt', 'lte'],
        # }
