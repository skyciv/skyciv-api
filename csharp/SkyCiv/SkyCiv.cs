using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;

namespace SkyCiv
{
    public class SkyCivOptions
    {
        
    }

    public static class SkyCiv
    {
        public static void Request(string data)
        {
            string route = "https://api.skyciv.com/v3";
            ApiRequestWithAuth("POST", "STRING", route, data);
        }

        public static dynamic ApiRequestWithAuth(string requestType, string responseType, string route, object jsonObject)
        {
            string jsonArguments = JsonConvert.SerializeObject(jsonObject, Formatting.Indented);
            return ApiRequestWithAuth(requestType, responseType, route, jsonArguments);
        }
           
        public static dynamic ApiRequestWithAuth(string requestType, string responseType, string route, string jsonObject)
        {
            string jsonArguments = jsonObject;

            using (var client = new WebClient())
            {
                //client.Headers[HttpRequestHeader.Authorization] = "Basic " + this.token;
                //client.Headers[HttpRequestHeader.Accept] = "application/json";
                client.Headers[HttpRequestHeader.ContentType] = "application/json";
                return StandardizeApiRequest(client, requestType, responseType, route, jsonArguments);
            }
        }

        public static dynamic StandardizeApiRequest(WebClient client, string requestType, string responseType, string url, string jsonArguments)
        {
            var bytes = Encoding.UTF8.GetBytes(jsonArguments);
            client.Headers[HttpRequestHeader.ContentLength] = bytes.Length.ToString();

        var responseString = "";
            dynamic responseJson = null;

            try
            {
                if (requestType == "POST")
                {
                    var response = client.UploadData(url, "POST", bytes);
                    responseString = Encoding.UTF8.GetString(response);
                }
                else if (requestType == "GET")
                {
                    responseString = client.DownloadString(url);
                }

                responseJson = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseString);
            }
            catch (Exception e)
            {
                object a = e;

                // do nothing
            }

            if (responseType == "STRING")
            {
                return responseString;
            }
            else
            {
                return responseJson;
            }
        }


    }
}
