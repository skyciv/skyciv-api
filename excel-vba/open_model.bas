Attribute VB_Name = "open_model"
Public Sub APICall()
Application.StatusBar = "Please wait..."
status_ui.Label1 = "Please wait..."


'access the workbook
Dim wb As Workbook
Set wb = ThisWorkbook



'access main sheet
Dim ws As Worksheet
Set ws = wb.Worksheets("SKYCIV")



'create the send object
Dim send As Object
Set send = open_model.load()



'make the call
status_ui.Label1 = "Calling The SkyCiv API"
DoEvents
Dim response As Object
Set response = API_V3.APICall(send)
Set send = Nothing


status_ui.Label1 = "Processing Response"
'query the response
If response Is Nothing Then
    MsgBox ("There was no response from the server")
    Exit Sub 'add more handling here
End If



'check that the model was returned
Dim model As Object
Set model = response("response")("data")
If response("response")("status") = 0 Then 'success


    Application.StatusBar = "Outputting Response"
    status_ui.Label1 = "Outputting Model"
    
    
    
'    Application.EnableEvents = False
    
    
   
    'output units
    Dim units As Object
    Set units = response("response")("data")("settings")("units")
    Dim units_names As Collection
    
    
    
    'create collection to easily loop over cells
    Set units_names = New Collection
    units_names.Add "length"
    units_names.Add "section_length"
    units_names.Add "material_strength"
    units_names.Add "density"
    units_names.Add "force"
    units_names.Add "moment"
    units_names.Add "pressure"
    units_names.Add "mass"
    units_names.Add "translation"
    units_names.Add "stress"
    
    
    'loop over cells
    Dim range_name As String
    For Each name In units_names
        range_name = "units_" & name
        Range(range_name) = units(name)
    Next name
    
    
    
    'determine which units system is being used
    If units("section_length") = "inch" Then
        Range("units_system") = "imperial"
    Else
        Range("units_system") = "metric"
    End If
    
    
    
    
    'output into tables
    Call general_functions.clear_tables
    Dim table As ListObject
    Dim r As Integer 'row counter
    
    
    'output sections
    Dim sections As Object
    Set sections = response("response")("data")("sections")
    Dim this_section As Object
    Dim section_type As String
    Dim library_selections As Object
    
    
    
    'get the sections table and clean contents
    Set table = ws.ListObjects("sections")

    
    
    
    'start the loop
    r = 1
    For Each item In sections
        Set this_section = sections(item)
        If this_section.Exists("aux") Then
            If this_section("aux").Exists("polygons") Then
                If this_section("aux")("polygons")(1)("type") = "library" Then 'we have a library section type
                
                
                
                    Set library_selections = this_section("aux")("polygons")(1)("library_selections")
                    section_type = "library"
                    table.ListRows.Add
                    table.DataBodyRange(r, 1) = item
                    table.DataBodyRange(r, 2) = section_type
                    table.DataBodyRange(r, 3) = library_selections(1)
                    table.DataBodyRange(r, 4) = library_selections(2)
                    table.DataBodyRange(r, 5) = library_selections(3)
                    table.DataBodyRange(r, 6) = library_selections(4)
                    table.DataBodyRange(r, 11) = this_section("material_id")
                    
                    
                    
                Else 'we will use custom section type
                
                
                
                    section_type = "custom"
                    table.ListRows.Add
                    table.DataBodyRange(section_id, 1) = item
                    table.DataBodyRange(section_id, 2) = section_type
                    table.DataBodyRange(r, 7) = this_section("area")
                    table.DataBodyRange(r, 8) = this_section("Iz")
                    table.DataBodyRange(r, 9) = this_section("Iy")
                    table.DataBodyRange(r, 10) = this_section("J")
                    table.DataBodyRange(r, 11) = this_section("material_id")
                    
                    
                    
                End If
                r = r + 1
            End If
        End If
    Next item
    
    
    
    'create array of table names for looping
    Dim table_names As Collection
    Set table_names = New Collection
    table_names.Add "nodes"
    table_names.Add "members"
    table_names.Add "materials"
    table_names.Add "supports"
    table_names.Add "point_loads"
    table_names.Add "distributed_loads"
    table_names.Add "pressures"
    table_names.Add "moments"
    table_names.Add "self_weight"
    table_names.Add "load_combinations"
    table_names.Add "settlements"
    table_names.Add "plates"
    table_names.Add "meshed_plates"
    
    
    
    'begin loop
    Dim table_data As Object
    Dim this_row As Object
    Dim header As String
    Dim table_name As String
    table_name = "members"
    For Each name In table_names
    
    
    
        table_name = name
        Set table_data = response("response")("data")(table_name)
        Set table = ws.ListObjects(table_name)
        r = 1
        For Each item In table_data
        
        
        
            Set this_row = table_data(item)
            table.ListRows.Add
            table.DataBodyRange(r, 1) = item
            For i = 2 To table.ListColumns.Count
            
            
            
                header = table.HeaderRowRange(1, i)
                table.DataBodyRange(r, i) = this_row(header)
                
                
                
            Next i
            r = r + 1
        Next item
    Next name
    
    
    
    
'    Application.EnableEvents = True
    status_ui.Hide

    



Else 'there was a problem



    MsgBox response("response")("msg"), vbExclamation
    
    
    
End If

Application.StatusBar = ""

End Sub

Public Function load() As Object
Application.StatusBar = "Loading Send Object"
status_ui.Label1 = "Loading Send Object"
DoEvents

'access the workbook
Dim wb As Workbook
Set wb = ThisWorkbook



'access main sheet
Dim ws As Worksheet
Set ws = wb.Worksheets("SKYCIV")



'create send object base object
Dim send As Object
Set send = start_session.load()



'initialise dictionary for open model function object
Set open_model_func = CreateObject("Scripting.Dictionary")



'give argument values
Set arguments = CreateObject("Scripting.Dictionary")
arguments.Add "name", Range("open_filename").Value
arguments.Add "path", Range("open_path").Value



'give function values
open_model_func.Add "function", "S3D.file.open"
open_model_func.Add "arguments", arguments



'add function to functions array
send("functions").Add open_model_func



'initialise dictionary for download model function object
Set download_model_func = CreateObject("Scripting.Dictionary")



'give argument values
Set arguments = CreateObject("Scripting.Dictionary")



'give function values
download_model_func.Add "function", "S3D.model.get"
download_model_func.Add "arguments", arguments



'add function to functions array
send("functions").Add download_model_func



'return value from function
Set load = send



'cleanup variables
Set wb = Nothing
Set ws = Nothing
Set arguments = Nothing
Set download_model_func = Nothing
Set send = Nothing




End Function
