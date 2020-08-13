Attribute VB_Name = "design_check"
Public Function load() As Object
'Initialised variables
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")

Dim send As Object
Dim functions As Object
Dim temp_dict As Object
Dim temp_col As Collection
Dim arguments As Object

'Check set/option choice
Dim model_information As Object
Set model_information = convert.model_info
Set send = start_session.load()

Dim model As Object
Set model = set_model.load_model()

Set functions = send("functions")

'Get Design Input
Dim design_code As String: design_code = ws.Range("functions_member_design_check_code").Value
Set arguments = CreateObject("Scripting.Dictionary")
Set temp_dict = CreateObject("Scripting.Dictionary")
arguments.Add "design_code", design_code
arguments.Add "s3d_model", model
temp_dict.Add "function", "S3D.member_design.check"
temp_dict.Add "arguments", arguments
functions.Add temp_dict
Set arguments = Nothing
Set temp_dict = Nothing

If model_information("autosave") = True And calling_function = "Design Check" Then
    Dim file_name As String: Dim file_path As String
    file_name = model_information("file_name")
    file_path = model_information("file_path")
    
    'Save Model
    Set arguments = CreateObject("Scripting.Dictionary")
    Set temp_dict = CreateObject("Scripting.Dictionary")
    arguments.Add "name", file_name
    arguments.Add "path", file_path
    temp_dict.Add "function", "S3D.file.save"
    temp_dict.Add "arguments", arguments
    functions.Add temp_dict
    Set arguments = Nothing
    Set temp_dict = Nothing

End If

Set load = send
End Function

Public Sub APICall()
Application.ScreenUpdating = False
Application.StatusBar = "Loading model data"

'Initialised variables
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")

Dim send As Object
Set send = design_check.load()

Dim response As Object
Set response = API_V3.APICall(send)
Set send = Nothing

If response Is Nothing Then Exit Sub

design_check.loadDesignResults response

MsgBox response("response")("msg") 'status of call
ws.Range("status_code").Value = response("response")("status")
ws.Range("status_msg").Value = response("response")("msg")
ws.Range("monthly_api_calls_performed").Value = response("response")("monthly_api_credits")("total_used")

Dim timestamp As Date 'update session live time
timestamp = Now
ws.Range("session_timestamp").Value = CDbl(Now())

Application.StatusBar = ""
Application.ScreenUpdating = True

End Sub
Public Sub loadDesignResults(ByRef response As Object)

Dim functions As Collection
Dim function_response As Object
Dim design_data As Object

'find the function which has the results
For Each item In response
    If item = "functions" Then
    Set functions = response("functions")
    For Each subitem In functions
        If subitem.Exists("data") Then
            Set function_response = subitem
                If VarType(function_response("data")) = vbObject Then Set design_data = function_response("data"): GoTo data
        End If
    Next subitem
    End If
Next item

data:

For Each Sheet In Worksheets 'delete existing data
    If Sheet.name = "_design_results" Then
        Sheet.Delete
        Exit For
    End If
Next Sheet

Dim ws As Worksheet 'add a new sheet to store the data
Set ws = Application.Worksheets.Add
ws.name = "_design_results"

ws.Range("A1").Value = "Design Member ID"

Dim capacity As Object 'capacity
Set capacity = design_data("capacity")

Dim i As Integer: i = 0
Dim j As Integer:

Dim temp_collection As Collection
Dim worstlc As Collection

For Each item In capacity
    ws.Range("B1").Offset(0, i).Value = item
    j = 1
    Set temp_collection = capacity(item)
        For Each result In temp_collection
            ws.Range("A1").Offset(j, 0).Value = j
            ws.Range("B1").Offset(j, i).Value = result
            j = j + 1
        Next result
    i = i + 1
Next item

Dim ratio As Object
Set ratio = design_data("ratio") 'ratio

ratio_start = Split(Cells(1, (i + 2)).Address, "$")(1)

For Each item In ratio
ws.Range("B1").Offset(0, i).Value = item
j = 1
If item = "worstlc" Then
    Set worstlc = ratio(item)
Else
    Set temp_collection = ratio(item)
        For Each result In temp_collection
            ws.Range("B1").Offset(j, i).Value = result
            j = j + 1
        Next result
    i = i + 1
End If
Next item

ratio_end = Split(Cells(1, i + 1).Address, "$")(1)

Dim ratio_address As String
ratio_address = ratio_start & "2:" & ratio_end & j

Dim ratio_range As Range
Set ratio_range = ws.Range(ratio_address)

design_check.conditionalFormatting ratio_range

ws.Range("B1").Offset(0, i).Value = "worstlc" 'worst load combination
j = 1
For Each result In worstlc
ws.Range("B1").Offset(j, i).Value = result
j = j + 1
Next result


Dim reports As Collection 'report links
Set reports = design_data("reports")

Dim k As Integer
k = i + 1
    
Dim report_dict As Object
Set report_dict = reports(1)
For Each item In report_dict
    ws.Range("B1").Offset(0, k) = item
    k = k + 1
Next item

j = 1
For Each report In reports
    k = i + 1
    Set report_dict = report
    For Each item In report_dict
        ws.Hyperlinks.Add anchor:=ws.Range("B1").Offset(j, k), Address:=report_dict(item), TextToDisplay:=report_dict(item)
        k = k + 1
    Next item
    j = j + 1
Next report

ws.UsedRange.Columns.AutoFit

End Sub

Public Sub conditionalFormatting(ratio_range As Range)

    ratio_range.FormatConditions.Add Type:=xlCellValue, Operator:=xlGreater, _
        Formula1:="=1"
    ratio_range.FormatConditions(ratio_range.FormatConditions.Count).SetFirstPriority
    With ratio_range.FormatConditions(1).Font
        .Color = -16383844
        .TintAndShade = 0
    End With
    With ratio_range.FormatConditions(1).Interior
        .PatternColorIndex = xlAutomatic
        .Color = 13551615
        .TintAndShade = 0
    End With
    
    ratio_range.FormatConditions(1).StopIfTrue = False
    ratio_range.FormatConditions.Add Type:=xlCellValue, Operator:=xlLess, _
        Formula1:="=1"
    ratio_range.FormatConditions(ratio_range.FormatConditions.Count).SetFirstPriority
    With ratio_range.FormatConditions(1).Font
        .Color = -16752384
        .TintAndShade = 0
    End With
    With ratio_range.FormatConditions(1).Interior
        .PatternColorIndex = xlAutomatic
        .Color = 13561798
        .TintAndShade = 0
    End With
    ratio_range.FormatConditions(1).StopIfTrue = False

End Sub


