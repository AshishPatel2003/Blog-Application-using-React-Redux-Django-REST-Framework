from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from User.serializers import UserRegistrationSerializer

# Create your views here.

class UserRegisterAPI(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response({'type': 'success', 'message': 'Registration was successful.'}, status=status.HTTP_201_CREATED)
        return Response({
            'type': "error",
            'message': "User registered successfully",
        }, status=status.HTTP_400_BAD_REQUEST)
    
