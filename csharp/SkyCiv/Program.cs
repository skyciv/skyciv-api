using Newtonsoft.Json;
using System;
using System.IO;

namespace SkyCiv
{
    class Program
    {
        
        static void Main(string[] args)
        {
            //Load input data.
            var modelData = LoadJson("full-req.json");

            //Call into the SkyCiv API.
            string response = SkyCiv.Request(modelData);
            
            //Beautify json to improve readability in the console.
            var prettyJson = BeautifyJson(response);

            //Print the json.
            Console.Write(prettyJson);
        }

        /// <summary>
        /// Deserializes and serializes the given json. 
        /// </summary>
        /// <param name="jsonContent">The json to prettify.</param>
        /// <returns>Prettified json.</returns>
        private static string BeautifyJson(string jsonContent)
        {
            var deser = JsonConvert.DeserializeObject(jsonContent);
            var beautify = JsonConvert.SerializeObject(deser, Formatting.Indented);
            return beautify;
        }

        /// <summary>
        /// Load a json file given its full path.
        /// </summary>
        /// <param name="fullPath">Full path to json file to load (including extension.)</param>
        /// <returns>The content of the json file.</returns>
        private static string LoadJson(string fullPath)
        {
            string json;
            using (StreamReader r = new StreamReader(fullPath))
            {
                json = r.ReadToEnd();
            }
            return json;
        }
    }
}
