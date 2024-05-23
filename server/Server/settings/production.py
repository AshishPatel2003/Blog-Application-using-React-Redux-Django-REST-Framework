from base import *

ALLOWED_HOSTS = ['*']

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Raftar20031$default',
        'HOST': 'Raftar20031.mysql.pythonanywhere-services.com',
        'USER': 'Raftar20031',
        'PASSWORD': 'ashishkumarp',
        'PORT': '3306',
    }
}