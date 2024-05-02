# myapi/views.py
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
import replicate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer

@api_view(['POST'])
def query_model(request):
    question = request.data.get('question')
    context = request.data.get('context')

    if not question or not context:
        return Response({"error": "Both 'question' and 'context' must be provided"}, status=400)

    API_URL = "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2"
    API_TOKEN = "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"  # Replace with your Hugging Face API token
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    payload = {
        "inputs": {
            "question": question,
            "context": context
        }
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return Response(response.json(), status=response.status_code)
    except requests.RequestException as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def query_captioning_large(request):
    filename = request.data.get('filename')

    if not filename:
        return Response({"error": "Filename must be provided"}, status=400)

    API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
    API_TOKEN = "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"  # Replace with your Hugging Face API token
    headers = {"Authorization": f"Bearer {API_TOKEN}"}

    try:
        with open(filename, "rb") as f:
            data = f.read()

        response = requests.post(API_URL, headers=headers, data=data)
        response.raise_for_status()
        print(Response(response.json(), status=response.status_code))
        return Response(response.json(), status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def query_object_detection(request):
    filename = request.data.get('filename')

    if not filename:
        return Response({"error": "Filename must be provided"}, status=400)

    API_URL = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50"
    API_TOKEN = "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"  # Replace with your Hugging Face API token
    headers = {"Authorization": f"Bearer {API_TOKEN}"}

    try:
        with open(filename, "rb") as f:
            data = f.read()

        response = requests.post(API_URL, headers=headers, data=data)
        response.raise_for_status()
        return Response(response.json(), status=response.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Music Generation API
@csrf_exempt
def run_replicate(request):
    if request.method == 'POST':
        # Get data from request
        input_data = request.POST.dict()

        # Set Replicate API token from environment variable
        os.environ["REPLICATE_API_TOKEN"] = "r8_Mhf4fWmxLbGCk8ILYpuzeQLNHXYXLMR1BGBxV"


        # Run the Replicate task
        output = replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            input=input_data,
        )

        # Return the output as JSON response
        return JsonResponse(output, safe=False)
    else:
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)


#VIDEO GENERATION
@csrf_exempt
def video_generation(request):
    if request.method == 'POST':
        # Get data from request
        input_data = request.POST.dict()

        # Set Replicate API token from environment variable
        os.environ["REPLICATE_API_TOKEN"] = "r8_A5MUVJmtj8vdVxeRw0qMHwyQnLLMsbx2TDYq1"

        # Run the Replicate task
        output = replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            input=input_data,
        )

        # Return the output as JSON response
        return JsonResponse(output, safe=False)
    else:
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

# '''------------- TEST - API --------------'''
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def api_test(request):
    return Response({"message": "API Working msg"}, status=200)


