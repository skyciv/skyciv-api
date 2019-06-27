# Python Script that will create credentials.json

import json
import sys

args = sys.argv

if len(args) > 1 and args[1]:
	_username = args[1]
else:
	print 'No API username provided'
	sys.exit()

if len(args) > 2 and args[2]:
	_key = args[2]
else:
	print 'No API key provided'
	sys.exit()

auth_obj = {
	"username": _username,
	"key": _key
}

f = open('./credentials.json', "w")
f.write(json.dumps(auth_obj))
f.close()

print 'credentials.json created successfully'