from rest_framework import serializers
from User.models import User
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'photoURL']

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
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'photoURL']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'photoURL': {'required': False}
        }
    
    def update(self, instance, validated_data):
        # Update first_name if provided
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name'].strip()
        
        # Update last_name if provided
        if 'last_name' in validated_data:
            instance.last_name = validated_data['last_name'].strip()

        # Update email if provided and valid
        if 'email' in validated_data:
            email = validated_data['email'].strip()
            try:
                validate_email(email)
                instance.email = email
            except DjangoValidationError:
                raise serializers.ValidationError({"email": "Invalid email format"})
        
        # Update password if provided
        if 'password' in validated_data:
            instance.password = make_password(validated_data['password'].strip())
        
        # Update photoURL if provided
        if 'photoURL' in validated_data:
            instance.photoURL = validated_data['photoURL'].strip()

        instance.save()
        return instance