using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;

namespace SkyCiv
{
    public static class SkyCiv
    {
        /// <summary>
        /// Make a request to the SkyCiv api.
        /// </summary>
        /// <param name="requestBody">Serialized JSON including auth and function data.</param>
        /// <returns>Response from the SkyCiv API.</returns>
        public static string Request(string requestBody)
        {
            string route = "https://api.skyciv.com/v3";
            return StandardizeApiRequest("POST", route, requestBody);
        }

        /// <summary>
        /// Make a generic post/get request.
        /// </summary>
        /// <param name="requestType">Type of request. E.g. "GET" or "POST".</param>
        /// <param name="url">The full path to the API endpoint.</param>
        /// <param name="jsonArguments">Request body.</param>
        /// <returns>Request response.</returns>
        private static string StandardizeApiRequest(string requestType, string url, string jsonObject)
        {
            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = "application/json";
                return StandardizeApiRequest(client, requestType, url, jsonObject);
            }
        }

        /// <summary>
        /// Make a generic post/get request.
        /// </summary>
        /// <param name="client">Web client object to use for the request.</param>
        /// <param name="requestType">Type of request. E.g. "GET" or "POST".</param>
        /// <param name="url">The full path to the API endpoint.</param>
        /// <param name="jsonArguments">Request body.</param>
        /// <returns>Request response.</returns>
        private static dynamic StandardizeApiRequest(WebClient client, string requestType, string url, string jsonArguments)
        {
            var bytes = Encoding.UTF8.GetBytes(jsonArguments);
            var responseString = "";
            
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
            }
            catch (Exception e)
            {
                string errorMsg = "An error occured: " + e.ToString();
                Console.WriteLine(errorMsg);
                return errorMsg;
            }
            return responseString;
        }
    }
}
