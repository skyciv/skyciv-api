import json
import inspect
import httplib

def isStr(s):
	try:
		return isinstance(s, basestring)
	except NameError:
		return isinstance(s, str)

#class skyciv:
	#def __init__(self):
		#nothing

current_API_version_endpoint = 3

def request(data, options = {}):
	if hasattr(options, 'version') is False: options['version'] = current_API_version_endpoint
	if hasattr(options, 'http_or_https') is False: options['http_or_https'] = "https"

	if (isStr(data) is False): # not a string
		data = json.dumps(data, separators=(',', ':')) # convert to JSON String

	headers = {
		'Content-Type' : 'application/json'
	}

	if options['http_or_https'] is "https":
		# use HTTPSConnection and port 443
		req_module = httplib.HTTPSConnection('api.skyciv.com', 8085) # 443
	else:
		# use HTTPConnection and port 80
		req_module = httplib.HTTPConnection('api.skyciv.com', 8086) # 80

	req_module.request('POST', '/v' + str(options['version']), data, headers)
	response = req_module.getresponse()
	response_data = response.read()
	req_module.close()

	if not response_data:
		response_data = {
			"response": {
				"status": 1,
				"msg": "No response was received from the API. Please contact support@skyciv.com for more assistance with this.",
			}
		}

		response_data = json.dumps(response_data, separators=(',', ':')) # TODO not sure if this should be stringified

	return response_data
