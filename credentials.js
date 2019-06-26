// NODE JS SCRIPT that will create credentials.json

const fs = require('fs');

var _username = process.argv[2];
var _key = process.argv[3];

if (!_username) {
	console.log('No username provided');
	process.exit(1);
}

if (!_key) {
	console.log('No key provided');
	process.exit(1);
}

var auth_obj = {
	"username": _username,
	"key": _key
};

fs.writeFileSync(__dirname + '/credentials.json', JSON.stringify(auth_obj));

console.log('credentials.json created successfully');