using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SkyCivAPI.Client;
using SkyCivAPI.Constant;
using SkyCivAPI.Extensions;
using SkyCivAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SkyCivAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            SkyCivModelObject model = new SkyCivModelObject("metric");

            // Nodes
            model.Nodes.Add(0, 0, 0);
            model.Nodes.Add(0, 0.5, 0);
            model.Nodes.Add(0, 1, 0);
            model.Nodes.Add(0.5, 1, 0);
            model.Nodes.Add(0.5, 0.5, 0);
            model.Nodes.Add(1, 0.6, 0);
            model.Nodes.Add(1, 0.1, 0);
            model.Nodes.Add(1.5, 0.1, 0);
            model.Nodes.Add(1.5, 0.6, 0);
            model.Nodes.Add(1.5, 0, 0);
            model.Nodes.Add(1.5, -0.4, 0);
            model.Nodes.Add(1, -0.6, 0);
            model.Nodes.Add(2, 0, 0);
            model.Nodes.Add(2, 0.7, 0);
            model.Nodes.Add(2, 1, 0);
            model.Nodes.Add(1.7, 0.7, 0);
            model.Nodes.Add(2.3, 0.7, 0);
            model.Nodes.Add(2.5, 1, 0);
            model.Nodes.Add(2.5, 0.5, 0);
            model.Nodes.Add(2.5, 0, 0);
            model.Nodes.Add(3, 0.5, 0);
            model.Nodes.Add(3, 0, 0);
            model.Nodes.Add(3.3, 0.5, 0);
            model.Nodes.Add(3.3, 0.14, 0);
            model.Nodes.Add(3.7, 0.14, 0);
            model.Nodes.Add(3.7, 0.5, 0);
            model.Nodes.Add(4, 0.5, 0);
            model.Nodes.Add(4, 0.4, 0);
            model.Nodes.Add(4, 0, 0);
            model.Nodes.Add(4.5, 0.5, 0);
            model.Nodes.Add(4.5, 0, 0);
            model.Nodes.Add(-0.5, 0, 0);
            model.Nodes.Add(3.3, 0, 0);
            model.Nodes.Add(3.7, 0, 0);
            model.Nodes.Add(4.9, 0, 0);

            // Members
            model.Members.Add(1, 2, 1);
            model.Members.Add(2, 3, 1);
            model.Members.Add(3, 4, 1);
            model.Members.Add(4, 5, 1);
            model.Members.Add(5, 2, 1);
            model.Members.Add(6, 7, 1);
            model.Members.Add(7, 8, 1);
            model.Members.Add(8, 9, 1);
            model.Members.Add(8, 10, 1);
            model.Members.Add(10, 11, 1);
            model.Members.Add(11, 12, 1);
            model.Members.Add(15, 14, 1);
            model.Members.Add(14, 13, 1);
            model.Members.Add(16, 14, 1);
            model.Members.Add(14, 17, 1);
            model.Members.Add(18, 19, 1);
            model.Members.Add(19, 20, 1);
            model.Members.Add(19, 21, 1);
            model.Members.Add(21, 22, 1);
            model.Members.Add(24, 25, 1);
            model.Members.Add(25, 26, 1);
            model.Members.Add(26, 23, 1);
            model.Members.Add(23, 24, 1);
            model.Members.Add(27, 28, 1);
            model.Members.Add(28, 29, 1);
            model.Members.Add(28, 30, 1);
            model.Members.Add(30, 31, 1);
            model.Members.Add(32, 1, 2);
            model.Members.Add(1, 10, 2);
            model.Members.Add(10, 13, 2);
            model.Members.Add(13, 20, 2);
            model.Members.Add(20, 22, 2);
            model.Members.Add(22, 33, 2);
            model.Members.Add(33, 34, 2);
            model.Members.Add(34, 29, 2);
            model.Members.Add(29, 31, 2);
            model.Members.Add(31, 35, 2);
            model.Members.Add(24, 33, 1, "normal", 0, "FFFfff", "FFFfff");
            model.Members.Add(25, 34, 1, "normal", 0, "FFFfff", "FFFfff");

            // Plates
            int[] plateNodeArr = new int[] { 5, 4, 3, 2 };
            model.Plates.Add(plateNodeArr, 1, 12, true);

            // Sections
            model.Sections.AddLibrarySection(LibrarySections.Australian_Steel_300_Grade_CHS_Grade_350_101_6x3_2_CHS, 1);
            model.Sections.AddLibrarySection(
                LibrarySections.Australian_Steel_300_Grade_Universal_beams_150_UB_14_0, 1);

            // Section with custom properties
            string classJson = @"{
            'version': 1,
            'name': '203 x 203',
            'area': 5894.42893,
            'Iy': 15391924.9909,
            'Iz': 45719276.66583,
            'J': 224234,
            'material_id': 1,
            'shear_area_z': 500,
            'shear_area_y': 800,
            'aux': {
                'composite': false,
                'Qz': 249151.30616,
                'Qy': 115057.81814,
                'centroid_point': [101.6, 101.6],
                'centroid_length': [101.6, 101.6],
                'depth': 203.2,
                'width': 203.2,
                'alpha': 0,
                'shear_area_z': 1380.153833546,
                'shear_area_y': 3889.4548957763,
                'torsion_radius': 16.5124
            }

            }";

            SectionProperties sectionProperties = JsonConvert.DeserializeObject<SectionProperties>(classJson);
            model.Sections.AddCustomSection(sectionProperties);

            // Material
            model.Materials.Add("Structural Steel", 7850, 210000, 0.29, 300, 440, "steel");// For custom material
            model.Materials.Add(DefaultMaterials.STRUCTURAL_STEEL);

            // Supports
            model.Supports.Add(32, "FFFFRR");
            model.Supports.Add(35, "FFFFRR");

            // Add point load
            model.PointLoads.Add("m", member: 3, position: 30.4, y_mag: -5, load_group: "LG1");
            model.PointLoads.Add("n", node: 13, y_mag: 1.6, load_group: "LG1");
            model.PointLoads.Add("n", node: 12, y_mag: -3.7, load_group: "LG1");

            // Add moment

            model.Moments.Add("n", node: 12, y_mag: 0.3, load_group: "LG1");
            model.Moments.Add("m", member: 16, position: 0, x_mag: -0.1, load_group: "LG1");

            // Add distributed load
            model.DistributedLoads.Add(32, y_mag_A: -10, y_mag_B: -2, position_B: 100, load_group: "LG1");

            // Pressure
            model.PlatePressures.Add(1, "global", 0, 0, 0.1, "LG1");

            // Selfweight
            model.SelfWeight.Add(y: -1, load_group: "SW1");

            //We have set up most of the properties on the model object. 
            //We will now see how to set the dynamic properties . Below is the example of setting the area loads
            //Once the dynamic property is set, we should pass the model object for further processing. 

            //Add Area Load 
            JObject modelObject = JObject.FromObject(model);
            modelObject["area_loads"] = new JObject();
            modelObject["area_loads"]["1"] = (JToken)Newtonsoft.Json.JsonConvert.DeserializeObject(/*lang=json*/ @"{'type': 'one_way',
                        'nodes': [1, 2, 3, 4],
                        'members': null,
                        'mag': 10,
                        'direction': 'X',
                        'elevations': null,
                        'mags': null,
                        // Loads will span parallel to the direction from node 1 to node 2
                        'column_direction': '1,2',
                        'loaded_members_axis': null,
                        'LG': 'LG'}");

            //There are two approaches we can take from hereon.. The `modelObject` can be convereted again back to SkyCivModelObject as
            //shown below and continue setting up the properties 
            //or if we are done with the property setting we can just deserialize the `modelObject`
            //SkyCivModelObject convertedModel = JsonConvert.DeserializeObject<SkyCivModelObject>(modelObject.ToString());

            SkyCivModelObject convertedModel = modelObject.ToObject<SkyCivModelObject>();
            convertedModel.LoadCombinations.Add("SW1 + LG1", "strength", @"{ 'SW1': 1, 'LG1': 1}");

            var jsonModel = JsonConvert.SerializeObject(convertedModel, Formatting.Indented);
            System.IO.File.WriteAllText(@"model.json", jsonModel);

            // set up Auth
            var auth = new Authentication();

            var jsonConfig = JsonConvert.DeserializeObject<dynamic>(System.IO.File.ReadAllText("config.json"));
            auth.Source = "API";
            auth.Username = jsonConfig["username"].Value;
            auth.Key = jsonConfig["key"].Value;

            // making a request to start session, set and save model

            SkyCivRequestObject request = new SkyCivRequestObject();
            request.Auth = auth;
            request.Functions.Add(APIConstants.Functions.S3D_SESSION_START, "{ keep_open:true}");
            request.Functions.Add(APIConstants.Functions.S3D_MODEL_SET, "{s3d_model:" + jsonModel + "}");
            Dictionary<string, string> saveArguments = new Dictionary<string, string>
            {
                { "name", "csharp" },
                { "path", "api samples" }
            };
            request.Functions.Add(APIConstants.Functions.S3D_FILE_SAVE, saveArguments);

            request.options.ValidateInput = false;
            SkyCivAPIObject apiObject = new SkyCivAPIObject();
            request.options.Timeout = 2 * 60 * 1000;

            var requestJson = JsonConvert.SerializeObject(request, Formatting.Indented);
            System.IO.File.WriteAllText(@"request.json", requestJson);

            Console.WriteLine("Requesting for session start and model set");
            SkyCivAPIResponse response = apiObject.Request(request);

            var saveResponse = response.RespJsonObject["functions"].First(f => f["function"].ToString() == "s3d.file.save"); // find the save function by name
            var link = saveResponse["data"].ToString(); // get the link from this functions return data
            Console.WriteLine($"Request finished, model was saved at {link}");
            Console.WriteLine(response.Msg);
            Console.WriteLine(response.Status);

            var responseJson = JsonConvert.SerializeObject(response.RespJsonObject);
            System.IO.File.WriteAllText(@"response.json", responseJson);

            // ----------------------------------------------------------------------------------------
            // making a request including analysis

            SkyCivRequestObject analysisRequest = new SkyCivRequestObject();
            analysisRequest.Auth = auth;
            analysisRequest.options.ValidateInput = false;
            analysisRequest.Functions.Add(APIConstants.Functions.S3D_SESSION_START, "{ keep_open:true}");
            analysisRequest.Functions.Add(APIConstants.Functions.S3D_MODEL_SET, "{s3d_model:" + jsonModel + "}");
            request.Functions.Add(APIConstants.Functions.S3D_FILE_SAVE, saveArguments);
            analysisRequest.Functions.Add(APIConstants.Functions.S3D_MODEL_SOLVE, "{\"analysis_type\":\"linear\",\"repair_model\":\"true\"," +
                "\"format\":\"json\"}");

            var analysisRequestJson = JsonConvert.SerializeObject(analysisRequest, Formatting.Indented);
            System.IO.File.WriteAllText(@"analysisRequest.json", analysisRequestJson);

            Console.WriteLine("Requesting for Analysis");
            var analysisResponse = apiObject.Request(analysisRequest);
            Console.WriteLine("Completed the Analysis");
            var analysisResponseObj = analysisResponse.RespJsonObject["functions"].First(f => f["function"].ToString() == APIConstants.Functions.S3D_MODEL_SOLVE); // find the save function by name
            var analysisMsg = analysisResponseObj["msg"].ToString();
            Console.WriteLine(analysisMsg);

            var analysisResponseJson = JsonConvert.SerializeObject(analysisResponse.RespJsonObject, Formatting.Indented);
            System.IO.File.WriteAllText(@"analysisResponse.json", analysisResponseJson);

            // ----------------------------------------------------------------------------------------
            // Making a request including member design (AISC_360-16_LRFD)

            SkyCivRequestObject designRequest = new SkyCivRequestObject();
            designRequest.Auth = auth;
            designRequest.options.ValidateInput = false;

            designRequest.Functions.Add(APIConstants.Functions.S3D_SESSION_START, "{ keep_open:true}");

            //AISC_360-16_LRFD
            Dictionary<string, string> s3dDesignOptions = new Dictionary<string, string>
            {
                {"s3d_model" , jsonModel },
                {"design_code", "AISC_360-16_LRFD" }
            };

            designRequest.Functions.Add(APIConstants.Functions.S3D_MEMBER_DESIGN_CHECK, s3dDesignOptions);

            var designRequestJson = JsonConvert.SerializeObject(designRequest, Formatting.Indented);
            System.IO.File.WriteAllText(@"designRequest.json", designRequestJson);

            Console.WriteLine("Requesting for Design");
            SkyCivAPIResponse designResponse = apiObject.Request(designRequest);
            var designResponseObj = designResponse.RespJsonObject["functions"].First(f => f["function"].ToString() == APIConstants.Functions.S3D_MEMBER_DESIGN_CHECK); // find the save function by name
            var designMsg = designResponseObj["msg"].ToString();
            Console.WriteLine(designMsg);

            var designResponseJson = JsonConvert.SerializeObject(designResponse.RespJsonObject, Formatting.Indented);
            System.IO.File.WriteAllText(@"designResponse.json", designResponseJson);

            Console.WriteLine("Press any key to finish");
            Console.ReadLine();
        }
    }
}
