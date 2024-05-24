from rest_framework import renderers
import json

class UserRenderer(renderers.JSONRenderer):
    charset = 'utf-8'
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = ''
        print(str(data))
        if ("code='required'" in str(data)):
            response = json.dumps({'type': 'error', 'message': 'All Fields are required'})
        elif ('ErrorDetail' in str(data)):
            message = ''
            data = dict(data)
            for i in data.items():
                print(i)
                if (isinstance(i[1], list)):
                    message = i[1][0]
                else:
                    message=i[1]
                break
            response = json.dumps({'type': 'error', 'message': message})
        else:
            response = json.dumps(data)
        return response
