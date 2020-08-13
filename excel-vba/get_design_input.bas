Attribute VB_Name = "get_design_input"
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

Set send = start_session.load()
Set functions = send("functions")

Dim model As Object
Set model = set_model.load_model()

'Get Design Input
Set arguments = CreateObject("Scripting.Dictionary")
Set temp_dict = CreateObject("Scripting.Dictionary")
arguments.Add "design_code", ws.Range("functions_member_design_check_code").Value
arguments.Add "S3D_model", model
temp_dict.Add "function", "s3d.member_design.getInput"
temp_dict.Add "arguments", arguments
functions.Add temp_dict
Set arguments = Nothing
Set temp_dict = Nothing

'Check set/option choice
Dim model_information As Object
Set model_information = convert.model_info

If model_information("autosave") = True And calling_function = "Set Model" Then
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
Set send = get_design_input.load()

Dim response As Object
Set response = API_V3.APICall(send)
Set send = Nothing

If response Is Nothing Then Exit Sub
MsgBox response("response")("msg") 'status of call
ws.Range("status_code").Value = response("response")("status")
ws.Range("status_msg").Value = response("response")("msg")
ws.Range("monthly_api_calls_performed").Value = response("response")("monthly_api_calls_performed")

Dim timestamp As Date 'update session live time
timestamp = Now
ws.Range("session_timestamp").Value = CDbl(Now())

Application.StatusBar = ""
Application.ScreenUpdating = True


End Sub
