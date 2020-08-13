Attribute VB_Name = "save_model_desktop"
Public Sub saveModelForDesktop()
'check if SkyCiv Desktop Application is installed
Dim userProfile As String
userProfile = Environ("USERPROFILE")
Dim fpath As String
fpath = userProfile + "/AppData/Local/Programs/skyciv-desktop/skyciv_localhost/excels"
'Debug.Print (Dir(fpath, vbDirectory)) should print "excel" if installed
If Dir(fpath, vbDirectory) = "" Then
    Dim ans As Integer
    ans = MsgBox("You don't have SkyCiv Desktop installed on your system, would you like to download and install it?", vbYesNoCancel, "Oops")
    Debug.Print (ans)
    
    
    
Else 'save to default place
    Dim model As Object
    Set model = set_model.load_model()
    Dim model_str As String
    model_str = JsonConverter.ConvertToJson(model)
    Open fpath + "/model.json" For Output As #1
    Print #1, model_str
    Close #1
End If

End Sub
