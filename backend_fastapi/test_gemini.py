import requests
import json

# Test the chat endpoint
response = requests.post(
    'http://localhost:8000/chat',
    json={
        'message': 'What are the best stocks in India?',
        'context': {}
    }
)

print("Status:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2))
