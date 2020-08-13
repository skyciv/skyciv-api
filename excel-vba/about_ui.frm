VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} about_ui 
   Caption         =   "About"
   ClientHeight    =   2150
   ClientLeft      =   60
   ClientTop       =   300
   ClientWidth     =   5150
   OleObjectBlob   =   "about_ui.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "about_ui"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub CommandButton1_Click()
about_ui.Hide


End Sub



Private Sub UserForm_Initialize()
TextBox1.Value = "SkyCiv Excel Plugin Version 1.1" & Chr(13) & "Please send your feedback to info@skyciv.com"
End Sub
