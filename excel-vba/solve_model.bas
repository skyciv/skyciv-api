Attribute VB_Name = "solve_model"
Public Sub APICall()
Application.StatusBar = "Please wait..."


Dim send As Object
Set send = solve_model.load()

Dim response As Object
Set response = API_V3.APICall(send)
Set send = Nothing


If response Is Nothing Then
    
    Application.StatusBar = "Processing response"
    MsgBox response("response")("msg") 'status of call
    Exit Sub
End If

Dim data As Object
Set data = response("response")("data")
Dim file As Object
Dim name As String
Dim csv_data As String

For Each item In data
Set file = item
name = file("file_name")
csv_data = file("data")

For Each Sheet In Worksheets 'delete existing data
    If Sheet.name = "_" & name Then
        Sheet.Delete
        Exit For
    End If
Next Sheet

    Set ws = Application.Worksheets.Add
    ws.name = "_" & name
    Lines = Split(csv_data, Chr(13) & Chr(10))
    For r = 0 To UBound(Lines) 'save response data to sheets
        row_cells = Split(Lines(r), ",")
        For c = 0 To UBound(row_cells)
            ws.Range("A1").Offset(r, c) = row_cells(c)
        Next c
        
    Next r
    
    Set ws = Nothing
    Set file = Nothing

Next

Application.StatusBar = ""
Application.ScreenUpdating = True

End Sub


Public Function load() As Object
Application.StatusBar = "Load Model"



'access the workbook
Dim wb As Workbook
Set wb = ThisWorkbook



'access main sheet
Dim ws As Worksheet
Set ws = wb.Worksheets("SKYCIV")


Dim send As Object
Dim solve_func As Object
Dim arguments As Object



Set send = set_model.load_send


Dim format As String
format = "csv"


'S3D Solve
Set arguments = CreateObject("Scripting.Dictionary")
Set solve_func = CreateObject("Scripting.Dictionary")
arguments.Add "analysis_type", "linear"
arguments.Add "repair_model", True
arguments.Add "format", format
solve_func.Add "function", "S3D.model.solve"
solve_func.Add "arguments", arguments
send("functions").Add solve_func
Set arguments = Nothing
Set temp_dict = Nothing



Set load = send

End Function
