import sys
sys.path.insert(0, '/app')
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
import django
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()
admin = User.objects.get(email='admin@stiexpert.com')

client = APIClient(SERVER_NAME='v2.stiexpert.com')
client.force_authenticate(user=admin)

r = client.post('/api/v1/news/categories/', {'name':'Force Auth Test','description':'test cat','order':88}, format='json')
print(f'POST /categories/ => {r.status_code}')
if r.status_code in (200, 201):
    data = r.json()
    cid = data.get('id')
    print(f'Created: id={cid}, name={data.get("name")}, slug={data.get("slug")}')
    
    # Test PUT
    r3 = client.put(f'/api/v1/news/categories/{cid}/', {'name':'Updated Cat','description':'updated','order':88}, format='json')
    print(f'PUT => {r3.status_code}')
    
    # Test DELETE
    r2 = client.delete(f'/api/v1/news/categories/{cid}/')
    print(f'DELETE => {r2.status_code}')
else:
    print('Body:', r.content.decode()[:500])
