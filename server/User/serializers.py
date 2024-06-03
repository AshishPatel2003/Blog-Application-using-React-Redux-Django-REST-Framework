from rest_framework import serializers
from User.models import User
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'photoURL', 'is_admin']

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

class UserGoogleAuthSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'photoURL']
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length=255, required=False)
    last_name = serializers.CharField(max_length=255, required=False)
    email = serializers.EmailField(max_length=255, required=False)
    password = serializers.CharField(max_length=511, required=False)
    photoURL = serializers.CharField(max_length=255, required=False)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'photoURL']
    
    def update(self, instance, validated_data):
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        email = validated_data.get('email')
        password = validated_data.get('password')
        photoURL = validated_data.get('photoURL')

        if (first_name):
            instance.first_name = first_name.strip()
        
        if (last_name):
            instance.last_name = last_name.strip()

        if (email):
            try:
                validate_email(email)
                instance.email = email.strip()
            except DjangoValidationError:
                pass

        
        if (password):
            instance.password = make_password(password.strip())
        
        if (photoURL):
            instance.photoURL = photoURL.strip()

        instance.save()
        return instance
    
class UserDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
    
    def delete(self, instance):
        instance.delete()
        return instance