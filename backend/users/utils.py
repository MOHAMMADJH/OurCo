from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # If response is None, there was an unhandled exception
    if response is None:
        if isinstance(exc, Exception):
            response = Response({
                'message': 'An error occurred',
                'detail': str(exc)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Add more custom error handling here if needed
    # For example, you can modify the response format
    if response is not None and hasattr(response, 'data'):
        # Ensure there's always a 'message' field
        if 'detail' in response.data and 'message' not in response.data:
            response.data = {
                'message': response.data['detail'],
                'errors': response.data
            }
        # Handle validation errors
        elif isinstance(response.data, dict) and response.status_code == 400:
            response.data = {
                'message': 'Validation error',
                'errors': response.data
            }
    
    return response