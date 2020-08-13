Attribute VB_Name = "convert"
Public Function tableToDictionary(tbl As ListObject)

Dim name As String
name = tbl.DisplayName
Dim row_count, r, col_count, c As Integer
row_count = tbl.ListRows.Count
col_count = tbl.ListColumns.Count

Dim obj As Object
Set obj = CreateObject("Scripting.Dictionary")
Dim subobj As Object

For r = 1 To row_count
If tbl.DataBodyRange(r, 1) = "" Then Exit For
    Dim id As Integer
    id = tbl.DataBodyRange(r, 1)
    Set subobj = CreateObject("Scripting.Dictionary")
    For c = 2 To col_count
        If tbl.HeaderRowRange(1, c) = "node/member" Then
            Dim typ As String
            typ = tbl.DataBodyRange(r, c - 1)
            Dim n As Integer
            If typ = "n" Then
                subobj.Add "node", tbl.DataBodyRange(r, c)
                x = c + 2
            ElseIf typ = "m" Then
                subobj.Add "member", tbl.DataBodyRange(r, c)
                subobj.Add "position", tbl.DataBodyRange(r, c + 1)
                x = c + 2
            End If
                For i = x To col_count
                subobj.Add tbl.HeaderRowRange(1, i), tbl.DataBodyRange(r, i)
                Next i
            Exit For
        Else
            subobj.Add tbl.HeaderRowRange(1, c), tbl.DataBodyRange(r, c)
        End If
    Next c

obj.Add id, subobj
Set subobj = Nothing

Next r

Set tableToDictionary = obj

End Function
Public Function tableToCollection(tbl As ListObject)


Dim name As String
name = tbl.DisplayName
Dim row_count, r, col_count, c As Integer
row_count = tbl.ListRows.Count
col_count = tbl.ListColumns.Count

Dim obj As Collection
Set obj = New Collection
Dim subobj As Object


For r = 1 To row_count
If tbl.DataBodyRange(r, 1) = "" Then Exit For

    Set subobj = CreateObject("Scripting.Dictionary")
    For c = 2 To col_count
        If tbl.HeaderRowRange(1, c) = "node/member" Then
            Dim typ As String
            typ = tbl.DataBodyRange(r, c - 1)
            Dim n As Integer
            If typ = "n" Then
                subobj.Add "node", tbl.DataBodyRange(r, c)
                x = c + 2
            ElseIf typ = "m" Then
                subobj.Add "member", tbl.DataBodyRange(r, c)
                subobj.Add "position", tbl.DataBodyRange(r, c + 1)
                x = c + 2
            End If
                For i = x To col_count
                subobj.Add tbl.HeaderRowRange(1, i), tbl.DataBodyRange(r, i)
                Next i
            Exit For
        Else
            subobj.Add tbl.HeaderRowRange(1, c), tbl.DataBodyRange(r, c)
        End If
    Next c

obj.Add subobj
Set subobj = Nothing

Next r

Set tableToCollection = obj

End Function

Public Function digger(response, r, c)
Dim results_data As Worksheet
Set results_data = ThisWorkbook.Worksheets("results_data")
Dim subitem As Variant

c = c + 1

    For Each item In response
        If VarType(item) = vbObject Then
            Call digger(item, r, c)
        ElseIf VarType(item) = vbDouble Then
            results_data.Range("B1").Offset(r, c) = item
            r = r + 1
        ElseIf VarType(response(item)) <> vbObject Then
            results_data.Range("A1").Offset(r, c) = item
            results_data.Range("B1").Offset(r, c) = response(item)
            r = r + 1
        ElseIf VarType(response(item)) = vbObject Then
            results_data.Range("A1").Offset(r, c) = item
            r = r + 1
            Call digger(response(item), r, c)
        End If
    Next item
    
c = c - 1

End Function
'
'Public Function model_info() As Object
''Initialised variables
'Dim wb As Workbook
'Set wb = ThisWorkbook
'Dim ws As Worksheet: Set ws = wb.Worksheets("SKYCIV")
'
'Dim result As Object
'Set result = CreateObject("Scripting.Dictionary")
'
'Dim autosave As Boolean
'Dim choice As String
'
'If ws.Range("functions_bypass_set_model") = "Active" Then
'autosave = ws.Range("functions_set_model_autosave").Value
'choice = "set"
'ElseIf ws.Range("functions_bypass_open_model") = "Active" Then
'autosave = ws.Range("functions_open_model_autosave").Value
'choice = "open"
'End If
'
'Dim file_name As String: Dim file_path As String
'If choice = "set" Then
'    file_name = ws.Range("functions_set_model_file_name").Value
'    file_path = ws.Range("functions_set_model_file_path").Value
'ElseIf choice = "open" Then
'    file_name = ws.Range("functions_open_model_file_name").Value
'    file_path = ws.Range("functions_open_model_file_path").Value
'End If
'
'result.Add "choice", choice
'result.Add "autosave", autosave
'result.Add "file_name", file_name
'result.Add "file_path", file_path
'
'Set model_info = result
'
'End Function
