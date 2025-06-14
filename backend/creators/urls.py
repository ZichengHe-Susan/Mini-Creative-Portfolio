from django.urls import path
from . import views

urlpatterns = [
    # Creative Fields endpoints
    path('creative-fields/', views.CreativeFieldListCreateView.as_view(), 
         name='creative-field-list-create'),
    path('creative-fields/<int:pk>/', views.CreativeFieldDetailView.as_view(), 
         name='creative-field-detail'),
    
    # Creators endpoints
    path('creators/', views.CreatorListCreateView.as_view(), 
         name='creator-list-create'),
    path('creators/<int:pk>/', views.CreatorDetailView.as_view(), 
         name='creator-detail'),
    
    # Search endpoint
    path('search/', views.search_creators, name='search-creators'),
] 