using Newtonsoft.Json;
using System;
using System.IO;

namespace SkyCiv
{
    class Program
    {
        private static string inputFilePath = "full-req.json";
        private static string outputFilePath = "output.json";

        static void Main(string[] args)
        {
            // Load the input data (authentication & SkyCiv API commands), from a file
            var jsonRequestBody = File.ReadAllText(inputFilePath);

            // Try calling the SkyCiv API
            if( SkyCiv.TryRequest(jsonRequestBody, out var response, post: true) )
            {
                response = BeautifyJson(response);

                // Request succeeded, save the response
                File.WriteAllText(outputFilePath, response);

                // Notify in the console
                Console.Write($"The HTTP request to the SkyCiv API was successful - see {outputFilePath} for the JSON response");
            }
            else
            {
                // Request failed, notify in the console (response will be an error message)
                Console.Write(response);
            }
        }

        /// <summary>
        /// Deserializes and serializes the given json. 
        /// </summary>
        /// <param name="jsonContent">The json to prettify.</param>
        /// <returns>Prettified json.</returns>
        private static string BeautifyJson(string jsonContent) 
            => JsonConvert.SerializeObject( JsonConvert.DeserializeObject(jsonContent), Formatting.Indented ); 
    }
}
