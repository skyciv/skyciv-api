Attribute VB_Name = "test"
Sub test()
Dim wb As Workbook
Set wb = ThisWorkbook
Dim s As String

fpath = ThisWorkbook.path 'write send.json to workbook path for checking
Open fpath & "\response.json" For Input As #1
Do Until EOF(1)
    Line Input #1, textline
    s = s & textline
Loop
Close #1

Dim response As Object
Set response = JsonConverter.ParseJson(s)

loadSectionResults response



End Sub



Public Sub loadSectionResults(ByRef response As Object)

Dim functions As Collection
Dim function_response As Object
Dim section_data As Object

'find the function which has the results
For Each item In response
    If item = "functions" Then
    Set functions = response("functions")
    For Each subitem In functions
        If subitem.Exists("data") Then
            Set function_response = subitem
                If VarType(function_response("data")) = vbObject Then Set section_data = function_response("data"): GoTo data
        End If
    Next subitem
    End If
Next item

data:

For Each Sheet In Worksheets 'delete existing data
    If Sheet.name = "_section_data" Then
        Sheet.Delete
        Exit For
    End If
Next Sheet

Dim ws As Worksheet 'add a new sheet to store the data
Set ws = Application.Worksheets.Add
ws.name = "_section_data"

'ws.Range("A1").Value = "country"
'ws.Range("B1").Value = "library"
'ws.Range("C1").Value = "class"
'ws.Range("D1").Value = "name"

Dim r As Integer: Dim c As Integer
Dim country_data As Object
Dim library_data As Object
Dim class_file As Collection
r = 0: c = 0
For Each country In section_data
    Set country_data = section_data(country)
    For Each library In country_data
        Set library_data = country_data(library)
        For Each class_object In library_data
            Set class_collection = library_data(class_object)
                ws.Range("A1").Offset(r, 0).Value = country
                ws.Range("A1").Offset(r, 1).Value = library
                ws.Range("A1").Offset(r, 2).Value = class_object
            For Each item In class_collection
                ws.Range("A1").Offset(r, c + 3).Value = item
                c = c + 1
            Next item
            c = 0
            r = r + 1
        Next class_object
    Next library
Next country

End Sub

Public Sub section_data_processing()
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet
Set ws = wb.Worksheets("_section_data")

Dim section_data_range As Range
Set section_data_range = ws.UsedRange

Dim country_data_range As Range
Set country_data_range = Intersect(ws.Columns(1), section_data_range)

country_data_range.Select

Dim target_range As Range

Set target_range = ws.Cells(section_data_range.rows.Count + 1, 1)

createUniqueList country_data_range, target_range

End Sub

Public Sub createUniqueList(list_range As Range, target_range As Range)

list_range.Copy target_range

Range(target_range, target_range.End(xlDown)).Select
Selection.RemoveDuplicates Columns:=1, header:=xlNo
Range(target_range, target_range.End(xlDown)).Select

Dim country_range As Range
Set country_range = Selection

Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet
Set input_ws = wb.Worksheets("SKYCIV")

Dim validation_range As Range
Set validation_range = input_ws.ListObjects("sections").ListColumns(2).DataBodyRange

createANamedRange country_range, "list_country", validation_range

End Sub

Sub createANamedRange(target_range As Range, name As String, validation_range As Range)
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet
Set ws = wb.Worksheets("SKYCIV")

On Error Resume Next
wb.Names(name).Delete
On Error GoTo 0
wb.Names.Add name:=name, RefersTo:=target_range

With validation_range.Validation
    .Delete
    .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Formula1:="=" & name
End With


End Sub
