Attribute VB_Name = "web_browser"
'************ Code Start **********
' This code was originally written by Dev Ashish.
' It is not to be altered or distributed,
' except as part of an application.
' You are free to use it in any application,
' provided the copyright notice is left unchanged.
'
' Code Courtesy of
' Dev Ashish
'
Private Declare PtrSafe Function apiShellExecute Lib "shell32.dll" _
    Alias "ShellExecuteA" _
    (ByVal hwnd As Long, _
    ByVal lpOperation As String, _
    ByVal lpFile As String, _
    ByVal lpParameters As String, _
    ByVal lpDirectory As String, _
    ByVal nShowCmd As Long) _
    As Long

'***App Window Constants***
Public Const WIN_NORMAL = 1         'Open Normal
Public Const WIN_MAX = 3            'Open Maximized
Public Const WIN_MIN = 2            'Open Minimized

'***Error Codes***
Private Const ERROR_SUCCESS = 32&
Private Const ERROR_NO_ASSOC = 31&
Private Const ERROR_OUT_OF_MEM = 0&
Private Const ERROR_FILE_NOT_FOUND = 2&
Private Const ERROR_PATH_NOT_FOUND = 3&
Private Const ERROR_BAD_FORMAT = 11&

'***************Usage Examples***********************
'Open a folder:     ?fHandleFile("C:\TEMP\",WIN_NORMAL)
'Call Email app:    ?fHandleFile("mailto:dash10@hotmail.com",WIN_NORMAL)
'Open URL:          ?fHandleFile("http://home.att.net/~dashish", WIN_NORMAL)
'Handle Unknown extensions (call Open With Dialog):
'                   ?fHandleFile("C:\TEMP\TestThis",Win_Normal)
'Start Access instance:
'                   ?fHandleFile("I:\mdbs\CodeNStuff.mdb", Win_NORMAL)
'****************************************************

Function fHandleFile(stFile As String, lShowHow As Long)
Dim lRet As Long, varTaskID As Variant
Dim stRet As String
    'First try ShellExecute
    lRet = apiShellExecute(hWndAccessApp, vbNullString, _
            stFile, vbNullString, vbNullString, lShowHow)

    If lRet > ERROR_SUCCESS Then
        stRet = vbNullString
        lRet = -1
    Else
        Select Case lRet
            Case ERROR_NO_ASSOC:
                'Try the OpenWith dialog
                varTaskID = Shell("rundll32.exe shell32.dll,OpenAs_RunDLL " _
                        & stFile, WIN_NORMAL)
                lRet = (varTaskID <> 0)
            Case ERROR_OUT_OF_MEM:
                stRet = "Error: Out of Memory/Resources. Couldn't Execute!"
            Case ERROR_FILE_NOT_FOUND:
                stRet = "Error: File not found.  Couldn't Execute!"
            Case ERROR_PATH_NOT_FOUND:
                stRet = "Error: Path not found. Couldn't Execute!"
            Case ERROR_BAD_FORMAT:
                stRet = "Error:  Bad File Format. Couldn't Execute!"
            Case Else:
        End Select
    End If
    fHandleFile = lRet & _
                IIf(stRet = "", vbNullString, ", " & stRet)
End Function
'************ Code End **********

