from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rota que conecta com o api/urls.py que criamos acima
    path('api/', include('api.urls')),
    
    # Gerador do Schema da API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Visualização do Swagger
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]