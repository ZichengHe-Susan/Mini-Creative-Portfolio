from django.db.models import Q
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Creator, CreativeField
from .serializers import (
    CreatorSerializer, 
    CreatorListSerializer, 
    CreativeFieldSerializer
)


class CreativeFieldListCreateView(generics.ListCreateAPIView):
    """
    List all creative fields or create a new creative field
    """
    queryset = CreativeField.objects.all()
    serializer_class = CreativeFieldSerializer


class CreativeFieldDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a creative field
    """
    queryset = CreativeField.objects.all()
    serializer_class = CreativeFieldSerializer


class CreatorListCreateView(generics.ListCreateAPIView):
    """
    List all creators or create a new creator with search functionality
    """
    queryset = Creator.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CreatorListSerializer
        return CreatorSerializer
    
    def get_queryset(self):
        queryset = Creator.objects.all()
        
        # Search by name
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)
        
        # Filter by creative fields
        creative_fields = (
            self.request.query_params.getlist('creative_fields') or
            self.request.query_params.getlist('creative_fields[]')
        )
        if creative_fields:
            queryset = queryset.filter(creative_fields__id__in=creative_fields).distinct()
        
        return queryset


class CreatorDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a creator
    """
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer


@api_view(['GET'])
def search_creators(request):
    """
    Advanced search endpoint for creators
    """
    queryset = Creator.objects.all()
    
    # Search by name
    name_query = request.query_params.get('name', None)
    if name_query:
        queryset = queryset.filter(name__icontains=name_query)
    
    # Search by bio
    bio_query = request.query_params.get('bio', None)
    if bio_query:
        queryset = queryset.filter(bio__icontains=bio_query)
    
    # Filter by creative fields
    creative_fields = (
        request.query_params.getlist('creative_fields') or
        request.query_params.getlist('creative_fields[]')
    )
    if creative_fields:
        queryset = queryset.filter(creative_fields__id__in=creative_fields).distinct()
    
    # Combined text search across name and bio
    text_query = request.query_params.get('q', None)
    if text_query:
        queryset = queryset.filter(
            Q(name__icontains=text_query) | Q(bio__icontains=text_query)
        )
    
    serializer = CreatorListSerializer(queryset, many=True)
    return Response(serializer.data) 