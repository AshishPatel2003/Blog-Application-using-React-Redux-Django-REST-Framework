"""
URL configuration for hostelms project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from User import views as user_views
from Post import views as post_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # -------- User Routes --------
    path('api/user/register', user_views.UserRegisterAPI.as_view()),
    path('api/user/login', user_views.UserLoginAPI.as_view()),
    path('api/user/google', user_views.UserGoogleAuthAPI.as_view()),
    path('api/user/<int:id>/update', user_views.UserProfileUpdateAPI.as_view()),
    path('api/user/<int:id>/delete', user_views.UserDeleteAPI.as_view()),
    path('api/users', user_views.UsersAPI.as_view()),

    # -------- Post Routes --------
    path('api/posts', post_views.PostsAPI.as_view()),
    path('api/post/<str:slug>', post_views.PostsAPI.as_view()),
    path('api/user/<int:id>/post/create', post_views.PostCreateAPI.as_view()),
    path('api/user/<int:id>/post/<int:post_id>', post_views.PostAPI.as_view()),
    path('api/user/<int:id>/post/<int:post_id>', post_views.PostAPI.as_view()),

]
