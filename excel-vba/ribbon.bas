Attribute VB_Name = "ribbon"
'Callback for customButton1 onAction
Sub ribbon_switch(control As IRibbonControl)
Dim id As String
id = control.id
Select Case id

Case Is = "SC_save_cloud"
    upload_model_ui.Show
    
Case Is = "SC_download_cloud"
    download_model_ui.Show
    
Case Is = "SC_account"
    account_ui.Show
    
Case Is = "SC_about"
    about_ui.Show
    
Case Is = "SC_open_in_S3D"
    'Call saveModelForDesktop
    
Case Is = "SC_analysis_linear"
    Call solve_model.APICall
    
Case Is = "SC_clear_model"
    Call general_functions.clear_tables
    
Case Is = "SC_update_local"

    Debug.Print (GetSaveFilename)


Case Else

    Debug.Print (id)

End Select



End Sub

Public Function GetSaveFilename() As String

    Dim Dialog As FileDialog: Set Dialog = Application.FileDialog(msoFileDialogSaveAs)
    With Dialog
        .InitialFileName = "*.json"
        .FilterIndex = 2
        .Title = "Save As"
        If .Show <> 0 Then
            GetSaveFilename = .SelectedItems(1)
        End If
    End With
End Function
