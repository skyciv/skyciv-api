# SkyCiv API v3 C# Example
Simple example of how to call into the SkyCiv API from a console application written in C# targeting dotnet core 3.0.

## Prerequisites
- dotnet 3.0 or Visual Studio 2019

## Run 
- change the _"YOUR_API_USERNAME_HERE"_  and _"YOUR_API_KEY_HERE"_ fields in the `full-req.json` to your own credentials.
- `cd csharp` 
- `dotnet run`
- or simply open the SkyCiv.sln file in VS2019 and hit run.

## Roadmap
- Separate the API username/api-key from the `full-req.json` in a more elegant way.
- Provide more flexibility in terms of options of the request body (auth, functions, arguments, version etc)
- Add SDK classes for serialization/deserialization to improve UX.