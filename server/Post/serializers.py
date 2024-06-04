from rest_framework import serializers

from Post.models import Post


class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'content', 'image', 'user', 'slug', 'created_at', 'updated_at']


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'category', 'content', 'image', 'user']
        extra_kwargs = {
            'image': {'required': False},
        }
    
    def create(self, validated_data):
        return Post.objects.create_new_post(validated_data)


class PostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'category', 'content', 'image']
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title').strip()
        instance.category = validated_data.get('category').strip()
        instance.content = validated_data.get('content').strip()
        instance.image = validated_data.get('image').strip()
        instance.set_slug(validated_data.get('title').strip())
        instance.save()
        return instance
