"use strict";

// Followed this guide to create a JS file that can be run in NodeJS (via 'require') or on the client side browser (via the 'skyciv' global)
// http://www.richardrodger.com/2013/09/27/how-to-make-simple-node-js-modules-work-in-the-browser

(function () {
	var root = this
	var previous_skyciv = root.skyciv
	var current_API_version_endpoint = 3

	var has_require = typeof require !== 'undefined'

	var is_nodejs = (typeof module !== 'undefined' && module.exports);

	// If you rely on a module like underscore then do the below
	/*
	var _ = root._
	if (typeof _ === 'undefined') {
		if (has_require) {
			_ = require('underscore')
		}
		else throw new Error('skyciv requires underscore, see http://underscorejs.org');
	}
	*/

	var skyciv = root.skyciv = function () {}

	skyciv.noConflict = function () {
		root.skyciv = previous_skyciv;
		return skyciv;
	}

	// ======== START FUNCTIONS HERE ========

	skyciv.request = function(data, version, http_or_https) {
		if (!version) version = current_API_version_endpoint;
		if (!http_or_https) http_or_https = "https";

		if (is_nodejs) {
			// TODO https?
			var http = require("http");
			var options = {
				hostname: 'api.skyciv.com',
				port: 80,
				path: '/v' + version + '.php',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			};
			var req = http.request(options, function(res) {
				res.setEncoding('utf8');
				res.on('data',function(body) {
					console.log(body);
				});
			});
			
			req.on('error', function(e){
				console.log('problem with request: ' + e.message);
			});

			// Send the object as a JSON string
			req.write(JSON.stringify(data));
			req.end();
		} else {
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST", http_or_https + "://api.skyciv.com/v" + version, false);
			xmlHttp.send(JSON.stringify(data));
		}
	}

	// ======== END FUNCTIONS HERE =========

	if (typeof exports !== 'undefined') {
		if (is_nodejs) {
			exports = module.exports = skyciv
		}
		exports.skyciv = skyciv
	} else {
		root.skyciv = skyciv
	}

}).call(this); // this makes it equal to the window object if you're running it in a browser
