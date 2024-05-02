from django.urls import path
from .views import query_model, query_captioning_large, query_object_detection, run_replicate,video_generation, api_test

urlpatterns = [
    path('query/', query_model, name='query_model'),
    path('captioning/', query_captioning_large, name='query_captioning_large'),
    path('object_detection/', query_object_detection, name='query_object_detection'),
    path('replicate/', run_replicate, name='run_replicate'),
    path('video_gen/', video_generation, name='video_generation'),
    path('api_test/', api_test, name='api_test'),

]
