from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Post.serializers import PostCreateSerializer
from User.models import User
from User.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class PostCreateAPI(APIView):

    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        print(request.user)
        request.data['user'] = 11
        post_serializer = PostCreateSerializer(data=request.data)
        if post_serializer.is_valid(raise_exception=True):
            post_serializer.save()
            return Response({'type': "success", "message": "Post created successfully"}, status=status.HTTP_200_OK)
        return Response({'type': 'error', 'message': "Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)
            