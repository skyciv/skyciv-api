# SkyCiv API v3

This GitHub includes sample code, helper functions and other resources for the v3 [SkyCiv Structural Analysis and Design API](https://skyciv.com/structural-analysis-design-api/). This API allows structural engineers to develop their own applications and solutions using SkyCiv technology. This includes functionality such as:

* Auto generation of structural models, saving files in cloud
* Performing structural analysis (static, static-buckling, non-linear (P-delta), plates, cables, frequency analysis (coming soon)
* Migrating data between applications (for instance, SkyCiv-Revit Plugin)
* Running steel members design checks (AISC 360, AS 4100, EN3, CSA S-16)
* Running timber members design checks (NDS, AS 1720)
* Calculate wind speeds, topography, wind pressure and snow pressure calcs from ASCE, NBCC, AS1170 and EN1991

[Full Documentation available at https://skyciv.com/api/v3/docs/getting-started/]

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
https://skyciv.com/api/v3
```

# Examples

### Add your credentials to run the examples
Your credentials (found [here](https://platform.skyciv.com/account/api)) are required if you wish to run the test/example scripts inside the test folders of each language. Add your credentials via the nodeJS or python credential maker:
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

### CSharp
* To run the C# example, simply run:
```
cd csharp
dotnet run
```
or open the SkyCiv.sln in VS2019 and hit run. For more info, check out the README file in the csharp folder.
