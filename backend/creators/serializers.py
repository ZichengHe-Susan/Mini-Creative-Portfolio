from rest_framework import serializers
from .models import Creator, CreativeField


class CreativeFieldSerializer(serializers.ModelSerializer):
    """Serializer for CreativeField model"""
    
    class Meta:
        model = CreativeField
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['created_at']


class CreatorSerializer(serializers.ModelSerializer):
    """Serializer for Creator model"""
    creative_fields = CreativeFieldSerializer(many=True, read_only=True)
    creative_field_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    portfolio_links = serializers.ReadOnlyField()
    
    class Meta:
        model = Creator
        fields = [
            'id', 'name', 'profile_picture', 'bio', 
            'creative_fields', 'creative_field_ids',
            'portfolio_link_1', 'portfolio_link_2', 'portfolio_link_3',
            'portfolio_links', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        creative_field_ids = validated_data.pop('creative_field_ids', [])
        creator = Creator.objects.create(**validated_data)
        creator.creative_fields.set(creative_field_ids)
        return creator

    def update(self, instance, validated_data):
        creative_field_ids = validated_data.pop('creative_field_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if creative_field_ids is not None:
            instance.creative_fields.set(creative_field_ids)
        
        return instance


class CreatorListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for creator listings"""
    creative_fields = CreativeFieldSerializer(many=True, read_only=True)
    bio_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Creator
        fields = [
            'id', 'name', 'profile_picture', 'bio_preview', 
            'creative_fields', 'created_at'
        ]
    
    def get_bio_preview(self, obj):
        """Return truncated bio for preview"""
        if obj.bio and len(obj.bio) > 100:
            return obj.bio[:97] + '...'
        return obj.bio 