Attribute VB_Name = "model"
Public Function GetModelDictionary() As Object
'This function loads all the data from the model tables and sets it into a dictionary object.

'Shortcut variables
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet
Set ws = wb.Worksheets("SKYCIV")

'New model dictionary
Dim model As Object
Set model = CreateObject("Scripting.Dictionary")

'START LOADING IN MODEL:

    'UNITS:
    model.Add "settings", CreateObject("Scripting.Dictionary")
    model("settings").Add "units", CreateObject("Scripting.Dictionary")
    model("settings")("units").Add "length", Range("units_length")
    model("settings")("units").Add "section_length", Range("units_section_length")
    model("settings")("units").Add "material_strength", Range("units_material_strength")
    model("settings")("units").Add "density", Range("units_density")
    model("settings")("units").Add "force", Range("units_force")
    model("settings")("units").Add "moment", Range("units_moment")
    model("settings")("units").Add "pressure", Range("units_pressure")
    model("settings")("units").Add "mass", Range("units_mass")
    model("settings")("units").Add "translation", Range("units_translation")
    model("settings")("units").Add "stress", Range("units_stress")

    'NODES:
    model.Add "nodes", convert.tableToDictionary(ws.ListObjects("nodes"))

    'MEMBERS:
    model.Add "members", convert.tableToDictionary(ws.ListObjects("members"))

    'SECTIONS
    model.Add "sections", ProcessSectionDictionary(convert.tableToDictionary(ws.ListObjects("sections")))

    'MATERIALS
    model.Add "materials", convert.tableToDictionary(ws.ListObjects("materials"))

    'SUPPORTS
    model.Add "supports", convert.tableToDictionary(ws.ListObjects("supports"))

    'POINT LOADS
    model.Add "point_loads", convert.tableToDictionary(ws.ListObjects("point_loads"))

    'DISTRIBUTED LOADS
    model.Add "distributed_loads", convert.tableToDictionary(ws.ListObjects("distributed_loads"))

    'PRESSURES
    model.Add "pressures", convert.tableToDictionary(ws.ListObjects("pressures"))

    'MOMENTS
    model.Add "moments", convert.tableToDictionary(ws.ListObjects("moments"))

    'SELF-WEIGHT
    model.Add "self_weight", convert.tableToDictionary(ws.ListObjects("self_weight"))

    'LOAD COMBINATIONS
    model.Add "load_combinations", convert.tableToDictionary(ws.ListObjects("load_combinations"))

    'SETTLEMENTS
    model.Add "settlements", convert.tableToDictionary(ws.ListObjects("settlements"))

    'PLATES
    model.Add "plates", convert.tableToDictionary(ws.ListObjects("plates"))

    'MESHED PLATES
    model.Add "meshed_plates", convert.tableToDictionary(ws.ListObjects("meshed_plates"))

Set GetModelDictionary = model

End Function


Public Function ProcessSectionDictionary(section_dictionary As Object) As Object
'This function gets the section data and checks it for type, then transforms it according to that type.

'The reason we need to do this is because there are two types of section data that we will send
'up to the api and recieve from the api.

'These are:

'Libary: which requires the library selections to be sent as an array, in the correct order, and the custom section property keys removed.

'Custom: which requires the library selection keys to be removed and only the section properties to be sent.
        
Dim load_section As Collection 'this will store the library selection array
Dim section_type As String 'this will store the section type
Dim this_row As Object 'this will store the row data

For Each item In section_dictionary 'iterating over the row data

        Set this_row = section_dictionary(item) 'set the row data
        
        For Each sub_item In this_row 'iterating over the columns of the row data
            If sub_item = "type" Then 'looping until we get the right key
                section_type = this_row(sub_item) 'get the section type
            End If
        Next sub_item
        
        If section_type = "library" Then 'make an array for library selections
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
                    Case Is = "material_id" 'ignore material id
                    Case Else 'delete the other keys
                        this_row.Remove sub_item
                End Select
            Next sub_item
            this_row.Add "load_section", load_section
            
        Else 'just delete the library selections
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

Set ProcessSectionDictionary = section_dictionary

End Function
