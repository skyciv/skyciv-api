Attribute VB_Name = "general_functions"
Sub units_validation()
Attribute units_validation.VB_ProcData.VB_Invoke_Func = " \n14"
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet
Set ws = wb.Worksheets("SKYCIV")
Dim units_system As String
units_system = ws.Range("units_system").Value
Dim unitsList As Collection
Set unitsList = New Collection
unitsList.Add "length"
unitsList.Add "section_length"
unitsList.Add "material_strength"
unitsList.Add "density"
unitsList.Add "force"
unitsList.Add "moment"
unitsList.Add "pressure"
unitsList.Add "mass"
unitsList.Add "translation"
unitsList.Add "stress"

Dim system_name As String
Dim units_name As String
For Each item In unitsList
'    Debug.Print (Item)
    system_name = units_system & "_" & item
    units_name = "units_" & item
    With ws.Range(units_name)
        With .Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:= _
        xlBetween, Formula1:="=" & system_name
        .IgnoreBlank = True
        .InCellDropdown = True
        .InputTitle = ""
        .ErrorTitle = ""
        .InputMessage = ""
        .ErrorMessage = ""
        .ShowInput = True
        .ShowError = True
        End With
        
        .Value = Range(system_name).Cells(1, 1)
    End With
Next item
    
    
End Sub


Public Sub clear_tables()

Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet
Set ws = wb.Worksheets("SKYCIV")
Dim select_rng As Range
Set select_rng = Selection

Dim table As ListObject
Dim table_names As Collection
Set table_names = New Collection
table_names.Add "nodes"
table_names.Add "members"
table_names.Add "materials"
table_names.Add "sections"
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
Dim c As Integer
Dim rng As Range
For Each table_name In table_names

    Set table = ws.ListObjects(table_name)
    If table.DataBodyRange Is Nothing Then
    Else
        table.DataBodyRange.ClearContents
        c = table.ListColumns.Count
        Set rng = table.Range
        table.Resize rng.Resize(2, c)
    End If
Next table_name
End Sub
