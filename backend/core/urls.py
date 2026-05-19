from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# 1. IMPORTANDO AS VIEWS DO JWT AQUI:
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ----------------------------------------------------
    # 2. ROTAS DE LOGIN (O Next.js vai bater aqui!)
    # ----------------------------------------------------
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rota que conecta com o api/urls.py que criamos acima
    path('api/', include('api.urls')),
    
    # Gerador do Schema da API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Visualização do Swagger
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]