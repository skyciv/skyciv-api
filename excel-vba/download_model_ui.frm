VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} download_model_ui 
   Caption         =   "Download a Model"
   ClientHeight    =   2304
   ClientLeft      =   120
   ClientTop       =   320
   ClientWidth     =   2180
   OleObjectBlob   =   "download_model_ui.frx":0000
End
Attribute VB_Name = "download_model_ui"
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


download_model_ui.Hide


status_ui.Show vbModeless


Call open_model.APICall

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



TextBox1.Value = Range("open_filename")
TextBox2.Value = Range("open_path")



End Sub

