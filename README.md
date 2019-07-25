# SkyCiv API v3

This readme is for the SkyCiv Structural Analysis and Design API v3. This API allows structural engineers to develop their own applications and solutions using SkyCiv technology. This includes functionality such as:

* Auto generation of structural models, saving files in cloud
* Migrating data between applications (for instance, SkyCiv-Revit Plugin)
* Running steel members design checks (AISC 360, AS 4100, EN3, CSA S-16)
* Running timber members design checks (NDS, AS 1720)
* Performing structural analysis (static, static-buckling, non-linear (P-delta), frequency analysis (coming soon)

SkyCiv API v3 uses the following endpoint for all methods:
```
https://api.skyciv.com/v3
```

You can make a HTTP/HTTPS POST Request to this endpoint manually or you can include/import/require the SkyCiv API file in your project which will do the request for you (typically through the `skyciv.request` method). Currently we have an API module and examples for:
* JavaScript (browser or node.js compatible)
* Python

Eventually we will create an importable file and examples:
* PHP
* MATLAB

Please read the API docs which explains the API functions here:
```
DOCS COMING SOON
```

# Examples

### Add your credentials to run the examples
Your credentials (found [here](https://platform.skyciv.com/account/settings)) are required if you wish to run the test/example scripts inside the test folders of each language. Add your credentials via the nodeJS or python credential maker:
```
node credentials/credentials.js YOUR_API_USERNAME YOUR_API_KEY
```
OR
```
python credentials/credentials.py YOUR_API_USERNAME YOUR_API_KEY
```

Alternatively you can just create the credentials.json file manually in the root of this repo:
```json
{
	"username": "YOUR_API_USERNAME ",
	"key": "YOUR_API_KEY"
}
```

NOTE: We recommend changing your API key frequently.

### Javascript
* To run the browser example for javascript open the javascript/test/browser.html file in your browser. Please add your credentials in the browser.html file first.
* To run the node example you would run:
```
node javascript/test/node
```

### Python
* To run the example for python just run:
```
python python/test.py
```