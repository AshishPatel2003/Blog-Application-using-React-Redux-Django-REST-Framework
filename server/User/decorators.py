from functools import wraps
import json

from User.serializers import UserInfoSerializer

def authenticate_user(view_func):
    @wraps(view_func)
    def _wrapped_view(view, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        user = UserInfoSerializer(request.user).data
        print(type(user))
        print(type(auth_header))
        print(auth_header)
        return view_func(view, request, *args, **kwargs)
    return _wrapped_view