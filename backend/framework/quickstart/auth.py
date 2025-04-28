from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import User
import jwt
from django.conf import settings

# class FacebookIDAuthentication(BaseAuthentication):
#     def authenticate(self, request):
#         token = request.headers.get('Authorization', '').replace('Bearer ', '')
#         if not token:
#             return None
#         try:
#             payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
#             fb_id = payload.get("id")
#             if not fb_id:
#                 return None
#             user, _ = User.objects.get_or_create(username=fb_id)
#             return (user, None)
#         except jwt.ExpiredSignatureError:
#             return None
#         except jwt.InvalidTokenError:
#             return None
        
class FacebookIDAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        # Om inget token finns, använd en hårdkodad användare för utveckling
        if not token:
            # Hårdkodad användare för testning
            user, _ = User.objects.get_or_create(username="testuser")
            return (user, None)
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            fb_id = payload.get("id")
            if not fb_id:
                return None
            user, _ = User.objects.get_or_create(username=fb_id)
            return (user, None)
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
