Attribute VB_Name = "get_section_library"
Public Sub APICall()

Dim wb As Workbook
Set wb = ThisWorkbook
Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")

Dim send As Object: Set send = CreateObject("Scripting.Dictionary")
Dim arguments As Object

Dim auth As Object: Set auth = CreateObject("Scripting.Dictionary")
auth.Add "username", ws.Range("authentication_username").Value
auth.Add "key", ws.Range("authentication_key").Value
send.Add "auth", auth

'Functions
    Set functions = New Collection

'S3D Start Session
    Dim start_session As Object: Set start_session = CreateObject("Scripting.Dictionary")
    Set arguments = CreateObject("Scripting.Dictionary")
    start_session.Add "function", "S3D.session.start"
    start_session.Add "arguments", arguments
    functions.Add start_session
    Set arguments = Nothing
    Set start_session = Nothing

'Get Library Tree
    Dim get_library_tree As Object: Set get_library_tree = CreateObject("Scripting.Dictionary")
    get_library_tree.Add "function", "S3D.SB.getLibraryTree"
    
'    Dim map As New Collection
'    map.Add ws.Range("functions_get_section_library_country").Value
    
    Set arguments = CreateObject("Scripting.Dictionary")
'    arguments.Add "section_map", map
    
    get_library_tree.Add "arguments", arguments
    functions.Add get_library_tree
    Set get_library_tree = Nothing

send.Add "functions", functions

Dim response As Object
Set response = API_V3.APICall(send)

If response Is Nothing Then Exit Sub
MsgBox response("response")("msg") 'status of call
ws.Range("status_code").Value = response("response")("status")
ws.Range("status_msg").Value = response("response")("msg")
ws.Range("monthly_api_calls_performed").Value = response("response")("monthly_api_calls_performed")

Dim timestamp As Date 'update session live time
timestamp = Now
ws.Range("session_timestamp").Value = CDbl(Now())


End Sub

