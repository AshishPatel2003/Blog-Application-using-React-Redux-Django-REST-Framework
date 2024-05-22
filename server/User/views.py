from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from User.serializers import UserRegistrationSerializer, UserLoginSerializer, UserGoogleAuthSerializer, UserInfoSerializer
from User.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from User.models import User



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
                try:
                    user_info = UserInfoSerializer(user).data
                    response = Response({'type': 'success', 'message': 'Login successful...', 'token': token, 'user': user_info}, status=status.HTTP_200_OK)
                    return response
                except Exception as e:
                    print(e)
            else:
                return Response({'type': 'error', 'message': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)
        return Response({"type": "don't know"}, status=status.HTTP_400_BAD_REQUEST)

class UserGoogleAuthAPI(APIView):
    renderer_classes = [UserRenderer]
    
    def post(self, request, format=None):
        serializer = UserGoogleAuthSerializer(data = request.data)
        if (serializer.is_valid(raise_exception=True)):
            email = serializer.validated_data.get('email')
            # password = serializer.get('password')
            print(email)
            try:
                user = User.objects.get(email=email)
                print(user)
                print('fetching token')
                user_info = UserInfoSerializer(user).data
                print(type(user_info))
                token = get_tokens_for_user(user)
                print('token fetched')
                return Response({'type': 'success', 'message': 'Login successful...', 'token': token, 'user': user_info}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                print("Creating new user...")
                user = serializer.save()
                print(type(user))
                user_info = UserInfoSerializer(user).data
                print(type(user_info))
                return Response({'type': 'success', 'message': 'Registration Complete', 'user': user_info}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'type': 'error', 'message': e}, status=status.HTTP_404_NOT_FOUND)
    
