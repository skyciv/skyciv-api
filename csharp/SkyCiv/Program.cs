using Newtonsoft.Json;
using System;
using System.IO;

namespace SkyCiv
{
    class Program
    {
        
        static void Main(string[] args)
        {

            var modelData = LoadJson("full-req.json");

            SkyCiv.Request(modelData);

            Console.WriteLine("Hello World!");
        }

        public static string LoadJson(string fullPath)
        {
            string json;
            using (StreamReader r = new StreamReader(fullPath))
            {
                json = r.ReadToEnd();
                //List<Item> items = JsonConvert.DeserializeObject<List<Item>>(json);
            }
            return json;
        }


    }
}
