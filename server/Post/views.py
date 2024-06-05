from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime
from dateutil.relativedelta import relativedelta

from django.core.exceptions import ValidationError

from Post.models import Post
from Post.serializers import PostCreateSerializer, PostUpdateSerializer, PostsSerializer
from User.models import User
from User.permissions import IsAdmin, IsOwner
from User.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated


class PostsAPI(APIView):
    renderer_classes = [UserRenderer]

    def get(self, request, *args, **kwargs):
        try:
            page = int(request.query_params.get("page", 1))
            limit = int(request.query_params.get("limit", 9));
            user_id = int(request.query_params.get("user_id", -1))
            if page < 1 or limit < 1:
                raise ValueError

            search_query = request.query_params.get("search", "")

            if ('post_id' in request.query_params) :
                print("Inside if")
                posts = Post.objects.filter(
                    id=request.query_params.get("post_id"),
                )
            elif 'slug' in kwargs:
                print("Slug time")
                posts = Post.objects.filter(
                    slug=kwargs.get('slug'),
                )
            else:
                print("Inside else")
                posts = Post.objects.filter(
                    title__icontains=search_query,
                    content__icontains=search_query,
                    user_id=user_id,
                ).order_by("-created_at")[
                    ((page - 1) * limit) : ((page - 1) * limit + limit)
                ]

            all_posts = PostsSerializer(posts, many=True).data

            total_posts = Post.objects.count()

            month_ago = datetime.now() - relativedelta(months=1)

            total_month_posts = Post.objects.filter(created_at__gte=month_ago).count()

            return Response(
                {
                    "type": "success",
                    "message": "Post Fetched",
                    "data": {
                        "all_posts": all_posts,
                        "page": page,
                        "limit": limit,
                        "total_posts": total_posts,
                        "total_month_posts": total_month_posts,
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
            print(e.message)
            return Response(
                {"type": "error", "message": e.message},
                status=status.HTTP_400_BAD_REQUEST,
            )


# Create your views here.
class PostCreateAPI(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        print(request.user)
        request.data["user"] = id
        post_serializer = PostCreateSerializer(data=request.data)
        if post_serializer.is_valid(raise_exception=True):
            post_serializer.save()
            return Response(
                {"type": "success", "message": "Post created successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"type": "error", "message": "Invalid Request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


# Create your views here.
class PostAPI(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdmin, IsOwner]

    def put(self, request, id, post_id):
        try:
            post = Post.objects.get(id=post_id)
            if post:
                post_update_serializer = PostUpdateSerializer(post, data = request.data)
                if (post_update_serializer.is_valid(raise_exception=True)):
                    post_update_serializer.save()
                    return Response(
                        {"type": "success", "message": "Post Updated successfully"},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"type": "error", "message": "Not enough Data"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {"type": "error", "message": "Post Not Found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Post.DoesNotExist:
            return Response(
                {"type": "error", "message": "Post Not Found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print(e)
            return Response(
                {"type": "error", "message": "Something Went Wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, id, post_id):
        try:
            post = Post.objects.get(id=post_id)
            if post:
                post.delete()
                return Response(
                    {"type": "success", "message": "Post deleted successfully"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"type": "error", "message": "Post Not Found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Post.DoesNotExist:
            return Response(
                {"type": "error", "message": "Post Not Found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print(e)
            return Response(
                {"type": "error", "message": "Something Went Wrong"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
