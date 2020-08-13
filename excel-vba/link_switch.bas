Attribute VB_Name = "link_switch"
Global calling_function

Public Sub call_function(function_name)
Dim response As Object
calling_function = function_name

If function_name = "Start Session" Then
start_session.APICall
End If

If function_name = "Set Model" Then
set_model.APICall
End If

If function_name = "Open Model" Then
open_model.APICall
End If

If function_name = "Solve Model" Then
solve_model.APICall
End If

If function_name = "Get Design Input" Then
get_design_input.APICall 'to be continued
End If

If function_name = "Get Section Library" Then
get_section_library.APICall 'to be continued
End If

If function_name = "Design Check" Then
design_check.APICall
End If

If function_name = "Refresh" Then
ActiveSheet.Calculate
End If

If function_name = "Open Send File" Then
open_json ("send.json")
End If

If function_name = "Open Response File" Then
open_json ("response.json")
End If

If function_name = "View Model in Browser" Then

Dim link As String
Dim model_information As Object
Set model_information = convert.model_info
Dim file_name As String: file_name = model_information("file_name")
Dim file_path As String: file_path = model_information("file_path")
link = "https://platform.skyciv.com/structural?preload_name=" & file_name & "&preload_path=" & file_path
open_link = web_browser.fHandleFile(link, 1)
End If

End Sub

Public Function open_json(file_name)
Dim wb As Workbook
Set wb = ThisWorkbook
Dim path As String
path = wb.path

Dim process As Object
Set process = CreateObject("Shell.Application")
open_path = path & "\" & file_name
process.Open (open_path)
End Function

