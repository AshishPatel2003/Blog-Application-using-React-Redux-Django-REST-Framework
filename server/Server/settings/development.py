from .base import *

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

ALLOWED_HOSTS = ['*']

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'blogapp',
        'HOST': 'localhost',
        'USER': 'root',
        'PASSWORD': 'ashishkumarp',
        'PORT': '3306',
    }
}