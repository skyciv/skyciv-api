using System;
using System.Net;
using System.Text;

namespace SkyCiv
{
    public static class SkyCiv
    {
        private static string _address = "https://api.skyciv.com/v3";
        private static string _contentType = "application/json";
        private static string _post = "POST";
        private static string _errorMessage = "An error occured";
        
        /// <summary>
        /// Make a request to the SkyCiv API
        /// </summary>
        /// <param name="requestBody">Serialized JSON including auth and function data.</param>
        /// <param name="response">The response from the SkyCiv API</param>
        /// <param name="post">Whether to use POST or GET request type. Default = POST</param>
        /// <returns>A boolean indicating whether the HTTP request was made and the reply received successfully</returns>
        public static bool TryRequest(string requestBody, out string response, bool post = true)
        {
            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = _contentType;

                return SafeRequest(client, requestBody, out response, post: post);
            }
        }

        /// <summary>
        /// Make a generic post or get request and catch exceptions
        /// </summary>
        /// <param name="client">Web client object to use for the request.</param>
        /// <param name="requestBody">HTTP Request body</param>
        /// <param name="response">The response from the SkyCiv API</param>
        /// <param name="post">Whether to use POST or GET request type. Default = POST</param>
        /// <returns>A boolean indicating whether the HTTP request was made and the reply received successfully</returns>
        private static bool SafeRequest(WebClient client, string requestBody, out string response, bool post = true)
        {
            try
            {
                // Make a POST request
                if( post )
                {
                    var data = client.UploadData(_address, _post, Encoding.UTF8.GetBytes(requestBody));
                    response = Encoding.UTF8.GetString(data);
                    return true;
                }

                // Make a GET request
                response = client.DownloadString(_address);
                return true;
            }
            catch (Exception e)
            {
                response = $"{_errorMessage}: {e.Message}";
                
                return false;
            }
        }
    }
}
