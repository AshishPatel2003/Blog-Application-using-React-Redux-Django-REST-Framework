from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from User.serializers import UserRegistrationSerializer, UserLoginSerializer
from User.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# Create your views here.

class UserRegisterAPI(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response({'type': 'success', 'message': 'Registration was successful.'}, status=status.HTTP_201_CREATED)
        return Response({
            'type': "error",
            'message': "User registered successfully",
        }, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginAPI(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email = email, password = password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'type': 'success', 'message': 'Login successful...', 'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'type': 'error', 'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
