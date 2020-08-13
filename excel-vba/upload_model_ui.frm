VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} upload_model_ui 
   Caption         =   "Upload Model"
   ClientHeight    =   2300
   ClientLeft      =   130
   ClientTop       =   310
   ClientWidth     =   2260
   OleObjectBlob   =   "upload_model_ui.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "upload_model_ui"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub CommandButton1_Click()

Application.ScreenUpdating = False
Application.EnableEvents = False
Application.Calculation = xlCalculationManual


Range("open_filename") = TextBox1.Value
Range("open_path") = TextBox2.Value


upload_model_ui.Hide

status_ui.Show vbModeless


Call set_model.APICall

Application.ScreenUpdating = True
Application.EnableEvents = True
Application.Calculation = xlCalculationAutomatic


End Sub


Private Sub UserForm_Activate()
    
    
    
    Me.StartUpPosition = 0
    Me.Top = Application.Top + Application.Height / 2 - Me.Height / 2
    Me.Left = Application.Left + Application.Width / 2 - Me.Width / 2



End Sub

Private Sub UserForm_Initialize()



TextBox1.Value = Range("save_filename")
TextBox2.Value = Range("save_path")



End Sub

