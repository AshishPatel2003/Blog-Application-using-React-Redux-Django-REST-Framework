import re
from django.db import models
from User.models import User


class PostManager(models.Manager):
    def create_new_post(self, data):
          print(type(data))
          if ('title' in data):
               slug = re.sub('r[^a-zA-Z0-9-]', '', "-".join(data['title'].split(' '))).lower()
               print(slug)
               if ('image' in data) :
                    return self.create(title=data['title'], content=data['content'], category=data['category'], image=data['image'], slug=slug, user=data['user'])
               else:
                    return self.create(title=data['title'], content=data['content'], category=data['category'], slug=slug, user=data['user'])         


# Create your models here.
class Post(models.Model):
     title = models.CharField(unique=True, max_length=255)
     content = models.TextField()
     category = models.SlugField()
     image= models.TextField(default="https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png")
     user = models.ForeignKey(User, on_delete=models.CASCADE)
     slug = models.SlugField()
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     objects = PostManager()

     def set_slug(self, title):
          self.slug = re.sub('r[^a-zA-Z0-9-]', '', "-".join(title.split(' '))).lower()