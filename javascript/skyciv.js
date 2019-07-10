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

	skyciv.request = function(data, callback, options) {
		if (!options) options = {};

		if (!options.version) options.version = current_API_version_endpoint;
		if (!options.http_or_https) options.http_or_https = "https";

		if (typeof data === "object") {
			data = JSON.stringify(data);
		}

		if (is_nodejs) {
			var req_module;
			var req_port;
			if (options.http_or_https == "https") {
				req_module = require('https');
				req_port = 8085; // 443;
			} else {
				req_module = require('http');
				req_port = 8086; // 80;
			}

			var req_options = {
				hostname: 'api.skyciv.com',
				port: req_port,
				path: '/v' + options.version + '',
				method: 'POST',
				headers: { // these are compulsory for it to work properly
					'Content-Type': 'application/json',
					'Content-Length': data.length
				}
			};
			var req = req_module.request(req_options, function(res) {
				res.setEncoding('utf8');

				var res_data = "";
				res.on('data', function(chunk) {
					res_data += chunk;
				});

				res.on('end', function () {
					callback(res_data);
				});
			});
			
			req.on('error', function(e){
				console.log('problem with request: ' + e.message);
			});

			// Send the object as a JSON string
			req.write(data);
			req.end();
		} else {
			var req = new XMLHttpRequest();
			req.onreadystatechange = function() {
				try {
					if (req.readyState == XMLHttpRequest.DONE) {
						if (callback) callback(JSON.parse(req.responseText));
					}
				} catch (e) {
					throw new Error('There was an issue parsing the response from the API');
				}
			}

			var req_port = "";
			if (options.http_or_https == "https") {
				req_port = ":8085"; // 443;
			} else {
				req_port = ":8086"; // 80;
			}

			req.open("POST", options.http_or_https + "://api.skyciv.com" + req_port + "/v" + options.version, true); // true=async
			req.setRequestHeader("Content-type", "application/json");
			req.send(data);
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
