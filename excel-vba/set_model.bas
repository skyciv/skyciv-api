Attribute VB_Name = "set_model"
Public Function load_model() As Object
'Initialised variables
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")

Dim temp_dict As Object
Dim temp_sub_dict As Object
Dim model As Object

'Model
Set model = CreateObject("Scripting.Dictionary")

'Settings
Application.StatusBar = "Loading model"
Set temp_dict = CreateObject("Scripting.Dictionary")
'units
Dim unit As String
unit = Range("units_system")

Dim units As Object
Set units = CreateObject("Scripting.Dictionary")

units.Add "length", Range("units_length")
units.Add "section_length", Range("units_section_length")
units.Add "material_strength", Range("units_material_strength")
units.Add "density", Range("units_density")
units.Add "force", Range("units_force")
units.Add "moment", Range("units_moment")
units.Add "pressure", Range("units_pressure")
units.Add "mass", Range("units_mass")
units.Add "translation", Range("units_translation")
units.Add "stress", Range("units_stress")
temp_dict.Add "units", units

'visibility
Dim visibility As Object
Set visibility = CreateObject("Scripting.Dictionary")
visibility.Add "nodes", True
visibility.Add "node_lables", True
visibility.Add "members", True
visibility.Add "member_labels", True
visibility.Add "plates", True
visibility.Add "mesh_nodes", True
visibility.Add "mesh", True
visibility.Add "loads", True
visibility.Add "local_axis", False
visibility.Add "graphics_font_size", 3
temp_dict.Add "visibility", visibility

model.Add "settings", temp_dict
Set temp_dict = Nothing

'Nodes
Set temp_dict = convert.tableToDictionary(ws.ListObjects("nodes"))
model.Add "nodes", temp_dict
Set temp_dict = Nothing




'Members
Set temp_dict = convert.tableToDictionary(ws.ListObjects("members"))
model.Add "members", temp_dict
Set temp_dict = Nothing



'Sections
Set temp_dict = convert.tableToDictionary(ws.ListObjects("sections"))
Dim load_section As Collection

Dim section_type As String
Dim this_row As Object
For Each item In temp_dict
    
        Set this_row = temp_dict(item)
        
        For Each sub_item In this_row
        
            If sub_item = "type" Then
            
                section_type = this_row(sub_item)
                
                
                
            End If
        
        Next sub_item
        
        
        If section_type = "library" Then
        
        Set load_section = New Collection
        
            For Each sub_item In this_row
            
            
                Select Case sub_item
            
                    Case Is = "country"
                        load_section.Add this_row(sub_item)
                        this_row.Remove sub_item
                    Case Is = "library"
                        load_section.Add this_row(sub_item)
                        this_row.Remove sub_item
                    Case Is = "class"
                        load_section.Add this_row(sub_item)
                        this_row.Remove sub_item
                    Case Is = "name"
                        load_section.Add this_row(sub_item)
                        this_row.Remove sub_item
                    Case Is = "material_id"
                    
                    Case Else
                        this_row.Remove sub_item
                    
                
                
                End Select
            
            
            Next sub_item
            this_row.Add "load_section", load_section
            
            
            
        Else
        
            For Each sub_item In this_row
               Select Case sub_item
                    Case Is = "type"
                        this_row.Remove sub_item
                    Case Is = "country"
                        this_row.Remove sub_item
                    Case Is = "library"
                        this_row.Remove sub_item
                    Case Is = "class"
                        this_row.Remove sub_item
                End Select

            Next sub_item
        End If
Next item


model.Add "sections", temp_dict
Set temp_dict = Nothing

'Materials
Set temp_dict = convert.tableToDictionary(ws.ListObjects("materials"))
model.Add "materials", temp_dict
Set temp_dict = Nothing

'Supports
Set temp_dict = convert.tableToDictionary(ws.ListObjects("supports"))
model.Add "supports", temp_dict
Set temp_dict = Nothing

'Point Loads
Set temp_dict = convert.tableToDictionary(ws.ListObjects("point_loads"))
model.Add "point_loads", temp_dict
Set temp_dict = Nothing

'Distributed Loads
Set temp_dict = convert.tableToDictionary(ws.ListObjects("distributed_loads"))
model.Add "distributed_loads", temp_dict
Set temp_dict = Nothing

'Pressures
Set temp_dict = convert.tableToDictionary(ws.ListObjects("pressures"))
model.Add "pressures", temp_dict
Set temp_dict = Nothing

'Moments
Set temp_dict = convert.tableToDictionary(ws.ListObjects("moments"))
model.Add "moments", temp_dict
Set temp_dict = Nothing

'Self Weight
Set temp_dict = convert.tableToDictionary(ws.ListObjects("self_weight"))
model.Add "self_weight", temp_dict
Set temp_dict = Nothing

'Load Combinations
Set temp_dict = convert.tableToDictionary(ws.ListObjects("load_combinations"))
model.Add "load_combinations", temp_dict
Set temp_dict = Nothing

'Settlements
Set temp_dict = convert.tableToDictionary(ws.ListObjects("settlements"))
model.Add "settlements", temp_dict
Set temp_dict = Nothing

'Plates
Set temp_dict = convert.tableToDictionary(ws.ListObjects("plates"))
model.Add "plates", temp_dict
Set temp_dict = Nothing

'Meshed Plates
Set temp_dict = convert.tableToDictionary(ws.ListObjects("meshed_plates"))
model.Add "meshed_plates", temp_dict
Set temp_dict = Nothing

Set load_model = model

End Function
Public Function load_send() As Object

Dim send As Object
Set send = start_session.load()

Dim set_func As Object
Dim arguments As Object

Dim model As Object
Set model = set_model.load_model()

'S3D Set Model
Set arguments = CreateObject("Scripting.Dictionary")
Set set_func = CreateObject("Scripting.Dictionary")
arguments.Add "s3d_model", model
set_func.Add "function", "S3D.model.set"
set_func.Add "arguments", arguments
send("functions").Add set_func
Set arguments = Nothing
Set set_func = Nothing


Set load_send = send


End Function

Public Sub APICall(filename As String, filepath As String)

Application.ScreenUpdating = False
Application.StatusBar = "Loading model data"

'Initialised variables
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")

Dim send As Object
Set send = set_model.load_send(filename, filepath)

Dim response As Object
Set response = API_V3.APICall(send)
Set send = Nothing

If response Is Nothing Then Exit Sub
MsgBox response("response")("msg") 'status of call
ws.Range("status_code").Value = response("response")("status")
ws.Range("status_msg").Value = response("response")("msg")
If response("response").Exists("monthly_api_calls_performed") Then
ws.Range("monthly_api_calls_performed").Value = response("response")("monthly_api_calls_performed")
End If

Dim timestamp As Date 'update session live time
timestamp = Now
ws.Range("session_timestamp").Value = CDbl(Now())

Application.StatusBar = ""
Application.ScreenUpdating = True

End Sub

