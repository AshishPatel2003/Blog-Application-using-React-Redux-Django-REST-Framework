from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class UserRegisterAPI(APIView):
    def get(self, request, format=None):
        # print(request.data)
        return Response({
            'type': "success",
            'message': "User registered successfully"
        }, status=status.HTTP_200_OK)
    
