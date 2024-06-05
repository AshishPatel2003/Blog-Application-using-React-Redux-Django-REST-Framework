from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from User.permissions import IsAdmin, IsOwner
from User.serializers import UserRegistrationSerializer, UserLoginSerializer, UserGoogleAuthSerializer, UserInfoSerializer, UserProfileUpdateSerializer, UserDeleteSerializer
from User.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from User.models import User
from rest_framework.permissions import IsAuthenticated

from datetime import datetime
from dateutil.relativedelta import relativedelta


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh['is_admin'] = user.is_admin
    return {
        'access': str(refresh.access_token),
    }

class UsersAPI(APIView):
    renderer_classes = [UserRenderer]
    # permission_classes = [IsAuthenticated, IsOwner, IsAdmin]

    def get(self, request, *args, **kwargs):
        try:
            page = int(request.query_params.get("page", 1))
            limit = int(request.query_params.get("limit", 9))
            if page < 1 or limit < 1:
                raise ValueError

            if ('user_id' in request.query_params) :
                print("Inside if")
                users = User.objects.filter(
                    id=request.query_params.get("user_id"),
                )
            else:
                print("Inside else")
                users = User.objects.all().order_by("-created_at")[
                    ((page - 1) * limit) : ((page - 1) * limit + limit)
                ]
            all_users = UserInfoSerializer(users, many=True).data

            total_users = User.objects.count()

            print("outside")
            month_ago = datetime.now() - relativedelta(months=1)

            total_month_users = User.objects.filter(created_at__gte=month_ago).count()

            return Response(
                {
                    "type": "success",
                    "message": "Post Fetched",
                    "data": {
                        "all_users": all_users,
                        "page": page,
                        "limit": limit,
                        "total_users": total_users,
                        "total_month_users": total_month_users,
                    },
                }
            )
        except ValueError:
            return Response(
                {
                    "type": "error",
                    "message": "Page and limit must be positive integers.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print(e)
            return Response(
                {"type": "error", "message": "Something went wrong." },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
            'message': "Bad Request",
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

class UserProfileUpdateAPI(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsOwner]

    # @authenticate_user
    def put(self, request, id):
        try:
            user = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({'type': 'error', 'message': "User Not Found"})

        serializer = UserProfileUpdateSerializer(user, data = request.data, partial=True)
        if (serializer.is_valid()):
            update_user = serializer.save()
            user_info = UserInfoSerializer(update_user).data
            return Response({'type': 'success', 'message': "Profile updated successfully", 'user': user_info}, status=status.HTTP_200_OK)
        return Response({'type': 'error', 'message': "Profile updated failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDeleteAPI(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, id):
        try:
            if (request.user.is_admin == False and request.user.id != id):
                return Response({'type': 'error', 'message': "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            user = User.objects.get(id=id)
            serializer = UserDeleteSerializer()
            serializer.delete(user)
            return Response({'type': 'success', 'message': "User deleted successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'type': 'success', 'message': "User Not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'type': 'error', 'message': "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        