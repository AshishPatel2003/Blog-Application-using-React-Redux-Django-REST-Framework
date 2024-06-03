from rest_framework import serializers

from Post.models import Post


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'category', 'content', 'image', 'user']
        extra_kwargs = {
            'image': {'required': False},
        }

    
    def create(self, validated_data):
        return Post.objects.create_new_post(validated_data)
