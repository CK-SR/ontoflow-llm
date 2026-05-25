import requests
base='http://127.0.0.1:8000'
for p in ['/api/health','/api/metadata/tables','/api/graph/stats','/api/equipment/risks']:
    print(p, requests.get(base+p, timeout=5).status_code)
print(requests.post(base+'/api/chat',json={'message':'当前有哪些风险较高的设备？'},timeout=10).json())
