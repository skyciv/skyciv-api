Attribute VB_Name = "start_session"
Public Sub APICall()

'Initialised variables
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")

Application.Calculate
Application.ScreenUpdating = False

If ws.Range("session_timer") < 1 Then
    user_choice = MsgBox("Your session is still active, are you sure you want to start a new session?", vbYesNo, "Session already active")
    If user_choice = vbNo Then Exit Sub
End If

Application.StatusBar = "Preparing request"

Dim send As Object
Set send = start_session.load()
  
Dim response As Object
Set response = API_V3.APICall(send)
If response Is Nothing Then Exit Sub
MsgBox response("response")("msg") 'status of call
ws.Range("status_code").Value = response("response")("status")
ws.Range("status_msg").Value = "Session has started"
ws.Range("session_id").Value = response("response")("session_id")
Dim timestamp As Date
timestamp = Now
ws.Range("session_timestamp").Value = CDbl(Now())

Application.StatusBar = ""
Application.ScreenUpdating = True

End Sub

Public Function load() As Object

'Initialised variables
Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")

Dim send As Object
Dim temp_dict As Object
Dim temp_col As Collection
Dim arguments As Object

Set send = CreateObject("Scripting.Dictionary")

'Authentication
Set temp_dict = CreateObject("Scripting.Dictionary")
temp_dict.Add "username", Range("authentication_username").Value
temp_dict.Add "key", Range("authentication_key").Value

send.Add "auth", temp_dict
Set temp_dict = Nothing

'Functions
Set temp_col = New Collection
Set temp_dict = CreateObject("Scripting.Dictionary")

'S3D Start Session
Set arguments = CreateObject("Scripting.Dictionary")
temp_dict.Add "function", "S3D.session.start"
temp_dict.Add "arguments", arguments
temp_col.Add temp_dict

send.Add "functions", temp_col
Set temp_dict = Nothing
Set temp_col = Nothing
Set arguments = Nothing

Set load = send
End Function
