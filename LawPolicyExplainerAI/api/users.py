# Vercel serverless function for users endpoint
import sys
import os
import json

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.utils.db_api import create_user, get_user_by_email

def handler(request):
    if request.method == 'POST':
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Email and password are required'})
                }
            
            # Check if user exists
            existing_user = get_user_by_email(email)
            if existing_user:
                return {
                    'statusCode': 200,
                    'body': json.dumps(existing_user)
                }
            
            # Create new user
            user = create_user(email, password)
            return {
                'statusCode': 201,
                'body': json.dumps(user)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'body': json.dumps({'error': 'Method not allowed'})
    }








