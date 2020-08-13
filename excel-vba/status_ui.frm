VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} status_ui 
   Caption         =   "Status"
   ClientHeight    =   1170
   ClientLeft      =   70
   ClientTop       =   290
   ClientWidth     =   8400.001
   OleObjectBlob   =   "status_ui.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "status_ui"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub UserForm_Activate()
    Me.StartUpPosition = 0
    Me.Top = Application.Top + Application.Height / 2 - Me.Height / 2
    Me.Left = Application.Left + Application.Width / 2 - Me.Width / 2
End Sub

