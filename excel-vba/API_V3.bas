Attribute VB_Name = "API_V3"
Public Function APICall(send As Object) As Object
'This function calls the api
Dim wb As Workbook
Set wb = ThisWorkbook

Dim debug_code As Boolean
debug_code = True 'set to false to prevent files being written in workbook directory

Dim orequest As Object 'require the http request library object
Set orequest = CreateObject("WinHttp.WinHttpRequest.5.1")
orequest.SetTimeouts 120000, 120000, 120000, 120000
orequest.Open "POST", "http://api.skyciv.com:8086/v3"
orequest.setRequestHeader "Content-Type", "application/json"
orequest.setRequestHeader "Accept", "application/json"

Application.StatusBar = "Converting to JSON"
s = JsonConverter.ConvertToJson(send)

If debug_code Then
fpath = ThisWorkbook.path 'write send.json to workbook path for checking
Open fpath & "\send.json" For Output As #1
Print #1, s
Close #1
End If

Application.StatusBar = "Calling SkyCiv API"
On Error GoTo errHand

orequest.send s 'api call

Application.StatusBar = "Processing response"
On Error GoTo 0
If orequest.Status = 200 Then

        If debug_code Then
            fpath = wb.path 'write the response to validate
            Open fpath & "\response.json" For Output As #1
            Print #1, orequest.responseText
            Close #1
        End If
        
        Dim response As Object
        Set response = JsonConverter.ParseJson(orequest.responseText)
        Set APICall = response
        
Else
    MsgBox "Problem with server, please try again later."
    Exit Function
End If

errHand:
Application.StatusBar = "Error"
If Err.Number <> 0 Then
    Select Case Err.Number
        Case -2147012894 'Code for Timeout
            MsgBox "Timeout"
        Case -2147012891 'Code for Invalid URL
            MsgBox "Invalid URL"
        Case Else 'Add more Errorcodes here if wanted
            MsgBox "Errornumber: " & Err.Number & vbNewLine & "Errordescription: " & Error(Err.Number)
    End Select
    Exit Function
End If
Application.StatusBar = ""

End Function

