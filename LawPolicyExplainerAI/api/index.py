# Root API endpoint
def handler(request):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        },
        'body': '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Law Policy Explainer AI</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .container { max-width: 600px; margin: 0 auto; }
                .btn { display: inline-block; padding: 10px 20px; margin: 10px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px; }
                .btn:hover { background: #0051cc; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Law Policy Explainer AI</h1>
                <p>Your application is deployed and running!</p>
                <p>API Endpoints:</p>
                <a href="/api/test" class="btn">Test API</a>
                <a href="/api/users" class="btn">Users API</a>
                <p>Frontend should be available at the root URL</p>
            </div>
        </body>
        </html>
        '''
    }