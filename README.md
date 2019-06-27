# SkyCiv API

This readme is for the SkyCiv Structural Analysis and Design API v3. This API allows structural engineers to develop their own applications and solutions using SkyCiv technology. This includes functionality such as:

* Auto generation of structural models, saving files in cloud
* Migrating data between applications (for instance, SkyCiv-Revit Plugin)
* Running steel members design checks (AISC 360, AS 4100, EN3, CSA S-16)
* Running timber members design checks (NDS, AS 1720)
* Performing structural analysis (static, static-buckling, non-linear (P-delta), frequency analysis (coming soon)


## Add your credentials
Your credentials are required if you wish to run the test/example scripts inside the test folders of each language. Add your credentials directly in credentials.json or run in nodeJS or python:\
```node credentials/credentials.js YOUR_API_USERNAME YOUR_API_KEY```\
OR\
```python credentials/credentials.py YOUR_API_USERNAME YOUR_API_KEY```

NOTE: We recommend changing your API key frequently.

In all other calls to the SkyCiv API, your credentials are passed in under an auth key:
```javascript 
'auth': {
  "username": "YOUR_USERNAME",
  "key": "YOUR_API_TOKEN" //get your key from https://platform.skyciv.com/account/settings
}
  ```


## List of functions
* auth
* session.end

S3D:
* S3D.session.start
* S3D.session.end
* S3D.session.switch

* S3D.file.new
* S3D.file.save
* S3D.file.open

* S3D.model.get
* S3D.model.set
* S3D.model.repair
* S3D.model.solve("static") //"static-buckling", "non-linear", "frequency" 

* S3D.results.get
* S3D.results.fetchMemberResult

* S3D.member_design.getInput
* S3D.member_design.check
* S3D.member_design.passFailCheck

* S3D.export.model.csv
* S3D.export.model.dxf



# API File Formats

## Input
The following is a simple JSON sample for the API. The functions are listed one after another. In this example, we are pushing up a structural model (model_data), saving it to our cloud storage and finally running a design check for AISC 360 (this will also run a structural analysis).

```javascript
{
  'auth': {
    "username": "sam@skyciv.com",
    "key": "sZFl0x6w7iq53bub7sFzhpZuDVMiPJEyVNNaXN6Kb5DfuJl5RIuUTnzK6HwKx4k6"
  },
  'functions': [
    {
      'function': "S3D.session.start",
      'arguments': {},
    },
    {
      'function': "S3D.file.save",
      'arguments': {
        'name': 'API File Name',
        'path': 'api folder',
      },
    },
    {
      'function': "S3D.member_design.check",
      'arguments': {
        'design_code': "AISC_360-16_LRFD", //"AS_4100-1998" 
        'model': model_data //my structural 3d model
    },
    }
  ]
}
```
## Output
An array of responses (one for each function run above) will be returned. It will also return a final response under the 'response' key which will return the final value:
```javascript
{
  "response": {
    "data": { ** DESIGN CHECK RESULTS **},
    "msg": "Member Design check for AISC_360-16_LRFD was run successfully.",
    "status": 0,
    "session_id": "gd3yxENtXpzQ7d05VqYdYQPVFJj01Uc6Ybk0UiPgaAHq3mrpIpdbiV1Bh8eAt8XV"
  },
  "functions": [
    {
      "msg": "S3D session successfully started.",
      "status": 0,
      "data": ""
    },
    {
      "data": "https://platform.skyciv.com/structural?preload_name=API%20File%20Name&preload_path=api",
      "msg": "Model was successfully saved to your SkyCiv cloud storage in the folder api. You can access this file from your SkyCiv Dashboard, or directly from https://platform.skyciv.com/structural?preload_name=API%20File%20Name&preload_path=api",
      "status": 0
    },
    {
      "data": { ** DESIGN CHECK RESULTS **},
      "msg": "Member Design check for AISC_360-16_LRFD was run successfully.",
      "status": 0
    }
  ]
}
```
https://jsfiddle.net/estreetdevelopers/z0n184s9/3/


## Examples (in Repository)

#### Javascript
* To run the browser example for javascript open the javascript/test/browser.html file in your browser. Please add your credentials in the browser.html file first.
* To run the node example you would run:\
```node javascript/test/node```
