from django.contrib import admin
from .models import Creator, CreativeField


@admin.register(CreativeField)
class CreativeFieldAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Creator)
class CreatorAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'updated_at']
    list_filter = ['creative_fields', 'created_at']
    search_fields = ['name', 'bio']
    filter_horizontal = ['creative_fields']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'profile_picture', 'bio')
        }),
        ('Creative Fields', {
            'fields': ('creative_fields',)
        }),
        ('Portfolio Links', {
            'fields': ('portfolio_link_1', 'portfolio_link_2', 'portfolio_link_3'),
            'classes': ('collapse',)
        }),
    ) 