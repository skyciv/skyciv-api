Attribute VB_Name = "custom_functions"
Public Function memberLength(member_id)
'init the variables required in calculation
Dim wf As WorksheetFunction: Set wf = Application.WorksheetFunction
Dim ws As Worksheet: Set ws = ThisWorkbook.Worksheets("Template")
Dim caller_cell_rng As Range: Set caller_cell_rng = Application.Range(Application.Caller.Address)
Dim r As Integer: r = caller_cell_rng.Row - caller_cell_rng.ListObject.Range.Row 'get the row of the table
Dim members As ListObject: Set members = ws.ListObjects("members")
Dim member_index As Integer: member_index = wf.vlookup(member_id, members.Range, 1, True)
Dim node_A As Integer: node_A = wf.index(members.Range, member_index + 1, 2) 'get the node a index
Dim node_B As Integer: node_B = wf.index(members.Range, member_index + 1, 3)  'get the node b index
Dim nodes As ListObject: Set nodes = ws.ListObjects("nodes")
Dim node_A_coords(2) As Single 'get the x y z positions of both nodes
Dim node_B_coords(2) As Single
node_A_coords(0) = wf.index(nodes.Range, wf.Match(node_A, nodes.ListColumns(1).Range, 0), 2)
node_A_coords(1) = wf.index(nodes.Range, wf.Match(node_A, nodes.ListColumns(1).Range, 0), 3)
node_A_coords(2) = wf.index(nodes.Range, wf.Match(node_A, nodes.ListColumns(1).Range, 0), 4)
node_B_coords(0) = wf.index(nodes.Range, wf.Match(node_B, nodes.ListColumns(1).Range, 0), 2)
node_B_coords(1) = wf.index(nodes.Range, wf.Match(node_B, nodes.ListColumns(1).Range, 0), 3)
node_B_coords(2) = wf.index(nodes.Range, wf.Match(node_B, nodes.ListColumns(1).Range, 0), 4)
''get the length by taking the sqrt of the squares of the differences between coordinates
memberLength = ((node_A_coords(0) - node_B_coords(0)) ^ 2 + (node_A_coords(1) - node_B_coords(1)) ^ 2 + (node_A_coords(2) - node_B_coords(2)) ^ 2) ^ (1 / 2) 'return the length
End Function
