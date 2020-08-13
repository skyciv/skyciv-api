VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} account_ui 
   Caption         =   "Enter your credentials"
   ClientHeight    =   2160
   ClientLeft      =   60
   ClientTop       =   280
   ClientWidth     =   4640
   OleObjectBlob   =   "account_ui.frx":0000
   StartUpPosition =   2  'CenterScreen
End
Attribute VB_Name = "account_ui"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub CommandButton1_Click()
Dim wb As Workbook
Set wb = ThisWorkbook
Application.ScreenUpdating = False
Application.EnableEvents = False

Dim ws As Worksheet
Set ws = wb.Worksheets("DATA")
ws.Visible = xlSheetVisible
ws.Range("authentication_username") = TextBox1.Value
ws.Range("authentication_key") = TextBox2.Value
ws.Visible = xlSheetVeryHidden
Application.ScreenUpdating = True
Application.EnableEvents = True
account_ui.Hide

End Sub

Private Sub CommandButton2_Click()
Call web_browser.fHandleFile("https://platform.skyciv.com/account/api", 1)
End Sub

Private Sub UserForm_Initialize()

Dim wb As Workbook
Set wb = ThisWorkbook
Application.ScreenUpdating = False
Application.EnableEvents = False

Dim ws As Worksheet
Set ws = wb.Worksheets("DATA")
ws.Visible = xlSheetVisible
TextBox1.Value = ws.Range("authentication_username")
TextBox2.Value = ws.Range("authentication_key")
ws.Visible = xlSheetVeryHidden

Set ws = Nothing
Set wb = Nothing
Application.ScreenUpdating = True
Application.EnableEvents = True

End Sub
