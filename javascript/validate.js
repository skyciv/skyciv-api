// If you wish to test in something like jsfiddle, there is a simulated function call at the bottom of this script.
// skyciv.validator.model({ your_skyciv_model}, log_flag)
// If log_flag is set to true the result of the validation is returned to the console.

if (typeof skyciv == "undefined") var skyciv = {};

skyciv.validator = (function () {
	var functions = {};
	var model_schema = {
		"$comment": "This schema for S3D models generally follows this pattern: $id, title, description, and then any keys evaluated by Ajv (type, required etc.)",
		"definitions": {},
		"$schema": "http://json-schema.org/draft-07/schema#",
		"title": "The Model Schema",
		"description": "Expected input for S3D model.",
		"type": "object",
		"required": [
			"settings",
			"nodes",
			"sections",
			"materials",
			"supports"
		],
		"properties": {
			"settings": {
				"$id": "#/properties/settings",
				"title": "The settings Schema",
				"description": "The settings are defined in the properties of the settings object.",
				"type": "object",
				"properties": {
					"units": {
						"$id": "#/properties/settings/properties/units",
						"title": "The units Schema",
						"description": "Structure the data to pass 'oneOf' the schemas below.",
						"if": {
							"$id": "#/properties/settings/properties/units/implicit",
							"title": "The Implicit units Schema",
							"description": "Derive the units implicity via type.",
							"type": "string"
						},
						"then": {
							"default": "metric",
							"enum": [
								"metric",
								"imperial"
							]
						},
						"else": {
							"$id": "#/properties/settings/properties/units/explicit",
							"title": "The Explicit units Schema",
							"description": "Specify the units per parameter explicitly.",
							"type": "object",
							"required": [
								"length",
								"section_length",
								"material_strength",
								"density",
								"force",
								"moment",
								"pressure",
								"mass",
								"translation",
								"stress"
							],
							"properties": {
								"length": {
									"enum": [
										"m",
										"mm",
										"ft",
										"in"
									]
								},
								"section_length": {
									"enum": [
										"mm",
										"in"
									]
								},
								"material_strength": {
									"enum": [
										"mpa",
										"ksi",
										"psi"
									]
								},
								"density": {
									"enum": [
										"kg/m3",
										"lb/ft3"
									]
								},
								"force": {
									"enum": [
										"kn",
										"n",
										"kg",
										"kip",
										"lb"
									]
								},
								"moment": {
									"enum": [
										"kn-m",
										"n-m",
										"kg-m",
										"kip-ft",
										"lb-ft",
										"lb-in"
									]
								},
								"pressure": {
									"enum": [
										"mpa",
										"kpa",
										"pa",
										"ksf",
										"ksi",
										"psf",
										"psi"
									]
								},
								"mass": {
									"enum": [
										"kg",
										"kip",
										"lb"
									]
								},
								"translation": {
									"enum": [
										"m",
										"mm",
										"in"
									]
								},
								"stress": {
									"enum": [
										"mpa",
										"kpa",
										"ksi",
										"psi"
									]
								}
							},
							"errorMessage": {
								"oneOf": "Please follow one specification for units. Refer to https://skyciv.com/api/v3/docs/s3d-model/#settings"
							}
						},
						"errorMessage": {
							"if": "Please follow one specification for units. Refer to https://skyciv.com/api/v3/docs/s3d-model/#settings"
						}
					},
					"precision": {
						"$id": "#/properties/settings/properties/precision",
						"title": "The precision Schema",
						"description": "Selects the type of precision to receive your output.",
						"default": "fixed",
						"enum": [
							0,
							1,
							"fixed",
							"exponential"
						]
					},
					"precision_values": {
						"$id": "#/properties/settings/properties/precision_values",
						"title": "The precision_values Schema",
						"description": "The number of precision values to receive for the type of precision selected.",
						"type": "integer",
						"default": 3
					},
					"evaluation_points": {
						"$id": "#/properties/settings/properties/evaluation_points",
						"title": "The evaluation_points Schema",
						"description": "The number of points along each member which a solution is evaluated. Maximum possible value is 50.",
						"type": "integer",
						"default": 5,
						"minimum": 3,
						"maximum": 50
					},
					"vertical_axis": {
						"$id": "#/properties/settings/properties/vertical_axis",
						"title": "The vertical_axis Schema",
						"description": "Set 'Y' or 'Z' as the vertical axis.",
						"type": "string",
						"enum": [
							"Y",
							"Z",
							"y",
							"z"
						],
						"default": "Y"
					},
					"projection_system": {
						"$id": "#/properties/settings/properties/projection_system",
						"title": "The projection_system Schema",
						"description": "Set 'orthographic' or 'perspective as the projection system for the model view.",
						"type": "string",
						"enum": [
							"orthographic",
							"perspective"
						],
						"default": "orthographic"
					},
					"solver_timeout": {
						"$id": "#/properties/settings/properties/solver_timeout",
						"title": "The solver_timeout Schema",
						"description": "Set the allowable time in minutes for the solver to work before timing out. Base on the size of your structure.",
						"type": "integer",
						"default": 90
					},
					"accurate_buckling_shape": {
						"$id": "#/properties/settings/properties/accurate_buckling_shape",
						"title": "The accurate_buckling_shape Schema",
						"description": "This setting does not affect buckling values and factors. If enabled when a buckling analysis is performed then only the accuracy of the displayed buckled shape will be improved, however it will take longer to solve.",
						"type": "boolean",
						"default": false
					},
					"buckling_johnson": {
						"$id": "#/properties/settings/properties/buckling_johnson",
						"title": "The buckling_johnson Schema",
						"description": "Use the parabolic or J.B. Johnson formula which is a more conservative approach for buckling of intermediate-length columns. The Johnson formula will be applied for critical stresses above half the yield strength.",
						"type": "boolean",
						"default": false
					},
					"non_linear_tolerance": {
						"$id": "#/properties/settings/properties/non_linear_tolerance",
						"title": "The non_linear_tolerance Schema",
						"description": "Non-Linear Analysis will continue to solve until this tolerance (relative error percentage) is met. A smaller number takes longer for convergence.",
						"type": [
							"number",
							"string"
						],
						"default": 1,
						"minimum": 0.1,
						"maximum": 10,
						"pattern": "([1-9].[0-9]+)|(^10$)|(^[1-9]$)|(^[0].[0-9]+$)",
						"errorMessage": {
							"pattern": "should be number from 0.1 to 10."
						}
					},
					"non_linear_theory": {
						"$id": "#/properties/settings/properties/non_linear_theory",
						"title": "The non_linear_theory Schema",
						"description": "Finite Displacement theory takes into account the full movement of the member and is suitable when the displacement is very large. If displacement is small there will be negligible difference between Small and Finite Displacement Theory.",
						"type": "string",
						"enum": [
							"small",
							"finite"
						],
						"default": "small"
					},
					"auto_stabilize_model": {
						"$id": "#/properties/settings/properties/auto_stabilize_model",
						"title": "The auto_stabilize_model Schema",
						"description": "Enable this if your model has stability issues, especially if the non-linear analysis will not converge. The solver will attempt to automatically stabilize nodes that are not restrained. Recommended to leave this disabled unless you are having issues with stability.",
						"type": "boolean",
						"default": false
					}
				}
			},
			"details": {
				"$id": "#/properties/details",
				"title": "The details Schema",
				"description": "Meta data for the model.",
				"properties": {
					"name": {
						"type": "string",
						"pattern": "^(.*)$"
					},
					"designer": {
						"type": "string",
						"pattern": "^(.*)$"
					},
					"notes": {
						"type": "string",
						"pattern": "^(.*)$"
					}
				}
			},
			"nodes": {
				"$id": "#/properties/nodes",
				"title": "The nodes Schema",
				"description": "Each node is defined by an object. The properties x, y, and z represent the x, y, and z coordinates in the global axes respectively for that node.",
				"type": "object",
				"minProperties": 1,
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/nodes/properties/instance",
						"type": "object",
						"title": "The Nodes Instance Schema",
						"required": [
							"x",
							"y",
							"z"
						],
						"additionalProperties": false,
						"properties": {
							"x": {
								"type": "number"
							},
							"y": {
								"type": "number"
							},
							"z": {
								"type": "number"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"members": {
				"$id": "#/properties/members",
				"title": "The members Schema",
				"description": "Each member is defined by an object. Members are defined by two nodes, the section, rotation angle, and fixity of the member at each node.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/members/properties/1",
						"type": "object",
						"title": "The Members Instance Schema",
						"required": [
							"node_A",
							"node_B",
							"section_id"
						],
						"if": {
							"required": [
								"type"
							],
							"properties": {
								"type": {
									"const": "rigid"
								}
							}
						},
						"then": {
							"properties": {
								"section_id": {
									"type": "null"
								}
							}
						},
						"else": {
							"properties": {
								"section_id": {
									"$id": "#/properties/members/properties/instance/properties/section_id",
									"title": "The section_id Schema",
									"description": "The ID of the section to be applied to the member. Required to be postive. Sections are defined in their own object.",
									"type": "integer",
									"minimum": 1
								}
							}
						},
						"properties": {
							"type": {
								"$id": "#/properties/members/properties/instance/properties/type",
								"title": "The type Schema",
								"description": "Optional property. Accepts 'normal' or 'cable'. Defaults to 'normal' if this is not specified. If 'cable' is specified, then there are consequences for what is assigned to a few other properties. rotation_angle is set to 0. fixity_A and fixity_B is set to 'FFFRRR'. All offset properties assigned 0.",
								"type": "string",
								"default": "normal",
								"enum": [
									"normal",
									"normal_continuous",
									"continuous",
									"compression",
									"tension",
									"cable",
									"rigid",
									"joist"
								]
							},
							"node_A": {
								"$id": "#/properties/members/properties/instance/properties/node_ID",
								"title": "The node_A Schema",
								"description": "The starting node. Identifed by the node ID.",
								"type": "integer",
								"minimum": 1
							},
							"node_B": {
								"$id": "#/properties/members/properties/instance/properties/node_B",
								"title": "The node_B Schema",
								"description": "The ending node. Identifed by the node ID.",
								"type": "integer",
								"minimum": 1
							},
							"rotation_angle": {
								"$id": "#/properties/members/properties/instance/properties/rotation_angle",
								"title": "The rotation_angle Schema",
								"description": "Rotate the member in degrees about its own axis. If 'type' property is 'cable', then this is assigned 0 (even if another value is specified here).",
								"type": "number",
								"examples": [
									0
								],
								"minimum": -360,
								"maximum": 360
							},
							"fixity_A": {
								"$id": "#/properties/members/properties/instance/properties/fixity_A",
								"title": "The fixity_A Schema",
								"description": "How the member is connected about node A represented by a restraint code. The first three characters represent translational degrees of freedom in the local x, y, and z axes. The last 3 character represent rotational degrees of freedom in the local x, y, and z axes. F = Fixed and R = Released. If 'type' property is 'cable' then this is assigned 'FFFRRR' (even if another value is specified here).",
								"type": "string",
								"examples": [
									"FFFFFF"
								],
								"pattern": "^[FSRfsr]{6}$",
								"errorMessage": {
									"pattern": "should be 6 letter code with F or R (Fixed or Released) eg. 'FFFRRR'"
								}
							},
							"fixity_B": {
								"$id": "#/properties/members/properties/instance/properties/fixity_B",
								"title": "The fixity_B Schema",
								"description": "How the member is connected about node B represented by a restraint code. If 'type' property is 'cable', then this is assigned 'FFFRRR' (even if another value is specified here).",
								"type": "string",
								"default": "",
								"examples": [
									"FFFFFF"
								],
								"pattern": "^[FSRfsr]{6}$",
								"errorMessage": {
									"pattern": "should be 6 letter code with F or R (Fixed or Released) eg. 'FFFRRR'"
								}
							},
							"offset_Ax": {
								"$id": "#/properties/members/properties/instance/properties/offset_Ax",
								"title": "The offset_Ax Schema",
								"description": "The local x distance that the member is offset from its centroid at node. If 'type' property is 'cable', then this is assigned 0 (even if another value is specified here).",
								"type": [
									"number",
									"string"
								]
							},
							"offset_Ay": {
								"$id": "#/properties/members/properties/instance/properties/offset_Ay",
								"title": "The offset_Ay Schema",
								"description": "The local y distance that the member is offset from its centroid at node. If 'type' property is 'cable', then this is assigned 0 (even if another value is specified here).",
								"type": [
									"number",
									"string"
								]
							},
							"offset_Az": {
								"$id": "#/properties/members/properties/instance/properties/offset_Az",
								"title": "The offset_Az Schema",
								"description": "The local z distance that the member is offset from its centroid at node. If 'type' property is 'cable', then this is assigned 0 (even if another value is specified here).",
								"type": [
									"number",
									"string"
								]
							},
							"offset_Bx": {
								"$id": "#/properties/members/properties/instance/properties/offset_Bx",
								"title": "The offset_Bx Schema",
								"description": "The local x distance that the member is offset from its centroid at node. If 'type' property is 'cable', then this is assigned 0 (even if another value is specified here).",
								"type": [
									"number",
									"string"
								]
							},
							"offset_By": {
								"$id": "#/properties/members/properties/instance/properties/offset_By",
								"title": "The offset_By Schema",
								"description": "The local y distance that the member is offset from its centroid at node. If 'type' property is 'cable', then this is assigned 0 (even if another value is specified here).",
								"type": [
									"number",
									"string"
								]
							},
							"offset_Bz": {
								"$id": "#/properties/members/properties/instance/properties/offset_Bz",
								"title": "The offset_Bz Schema",
								"description": "The local z distance that the member is offset from its centroid at node. If 'type' property is 'cable', then this is assigned 0 (even if another value is specified here).",
								"type": [
									"number",
									"string"
								]
							},
							"cable_length": {
								"$id": "#/properties/members/properties/instance/properties/cable_length",
								"title": "The cable_length Schema",
								"description": "Optional property. Only relevant if 'type' property is set to 'cable', but even if the 'type' is a 'cable', it is optional to assign. A cable length can be specified to account for sagging or pre-tension. Do not set this property if you do not need to assign pre-tension or sagging.",
								"type": [
									"number",
									"string",
									"null"
								]
							}
						},
						"errorMessage": {
							"if": "Specfication for members can be found at https://skyciv.com/api/v3/docs/s3d-model/#members"
						}
					}
				},
				"additionalProperties": false
			},
			"plates": {
				"$id": "#/properties/plates",
				"title": "The plates Schema",
				"description": "Each plate is defined by an object.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/plates/properties/instance",
						"type": "object",
						"title": "The Plates Instance Schema",
						"required": [
							"nodes",
							"thickness",
							"material_id",
							"rotZ",
							"type",
							"offset",
							"state"
						],
						"properties": {
							"nodes": {
								"$id": "#/properties/plates/properties/instance/properties/nodes",
								"title": "The Nodes Schema",
								"description": "The nodes which make up the plate. A minimum of 3 nodes are required to specify a plate. Enter this as a string with double quotes, with each node id number separated by commas.",
								"type": [
									"array",
									"string"
								],
								"examples": [
									"4,5,7,6"
								],
								"pattern": "^([1-9]{1}[0-9]*,)+[1-9][0-9]*$",
								"items": {
									"type": "integer"
								},
								"errorMessage": {
									"pattern": "should be a comma-seperated list of 4 nodes eg. '1,2,3,4'"
								}
							},
							"thickness": {
								"$id": "#/properties/plates/properties/instance/properties/thickness",
								"title": "The thickness Schema",
								"description": "The thickness of the plate.",
								"type": "number",
								"exclusiveMinimum": 0,
								"examples": [
									50
								]
							},
							"material_id": {
								"$id": "#/properties/plates/properties/instance/properties/material_id",
								"title": "The material_id Schema",
								"description": "The material of the plate. Identified by the material ID defined in the 'materials' object.",
								"type": "integer",
								"minimum": 1
							},
							"rotZ": {
								"$id": "#/properties/plates/properties/instance/properties/rotZ",
								"title": "The rotZ Schema",
								"description": "Rotation of plate about the plate's local Z (normal) axis in degrees.",
								"default": 0,
								"type": "number"
							},
							"type": {
								"$id": "#/properties/plates/properties/instance/properties/type",
								"title": "The type Schema",
								"description": "Currently only accepts 'mindlin'. Mindlin plates take into account shear deformations based on the Mindlin-Reissner Theory. Plans to implement the Kirchhoff Plate is in our future works list.",
								"type": "string",
								"default": "auto",
								"enum": [
									"auto",
									"mindlin"
								],
								"errorMessage": {
									"enum": "should be 'auto'. Implementation of the Kirchoff Plate is in our development roadmap."
								}
							},
							"offset": {
								"$id": "#/properties/plates/properties/instance/properties/offset",
								"title": "The offset Schema",
								"description": "Offset of the plate in its local z-axis.",
								"default": 0,
								"type": "number"
							},
							"state": {
								"$id": "#/properties/plates/properties/instance/properties/state",
								"title": "The state Schema",
								"description": "'stress' or 'strain' denotes whether the plate is in a state of 'Plane Stress' or 'Plane Stress'.",
								"type": "string",
								"default": "stress",
								"pattern": "stress|strain",
								"errorMessage": {
									"pattern": "should be 'stress' or 'strain'."
								}
							},
							"holes": {
								"$id": "#/properties/plates/properties/instance/properties/holes",
								"title": "The holes Schema",
								"type": [
									"array",
									"null"
								],
								"items": {
									"pattern": "^([0-9]+,){2,}([0-9]+)$",
									"errorMessage": {
										"pattern": "should be a comma-seperated list of nodes eg. '1,2,3,4'"
									}
								}
							},
							"diaphragm": {
								"$id": "#/properties/plates/properties/instance/properties/diaphragm",
								"title": "The diaphragm Schema",
								"type": "string",
								"default": "no",
								"enum": [
									"rigid",
									"no"
								],
								"errorMessage": {
									"enum": "should be 'rigid' or 'no'."
								}
							},
							"membrane_thickness": {
								"$id": "#/properties/plates/properties/instance/properties/membrane_thickness",
								"title": "The membrane thickness Schema",
								"description": "Membrane thickness of the plate.",
								"default": 0,
								"type": [
									"number",
									"null",
									"string"
								],
								"if": {
									"type": "string"
								},
								"then": {
									"enum": [
										""
									]
								}
							},
							"shear_thickness": {
								"$id": "#/properties/plates/properties/instance/properties/shear_thickness",
								"title": "The shear thickness Schema",
								"description": "Shear thickness of the plate.",
								"default": 0,
								"type": [
									"number",
									"null",
									"string"
								],
								"if": {
									"type": "string"
								},
								"then": {
									"enum": [
										""
									]
								}
							},
							"bending_thickness": {
								"$id": "#/properties/plates/properties/instance/properties/bending_thickness",
								"title": "The bending thickness Schema",
								"description": "Bending thickness of the plate.",
								"default": 0,
								"type": [
									"number",
									"null",
									"string"
								],
								"if": {
									"type": "string"
								},
								"then": {
									"enum": [
										""
									]
								}
							}
						},
						"$comment": "patternProperties checks for is_meshed or isMeshed key. A proposed change to ajv is 'patternRequired'",
						"patternProperties": {
							"isMeshed|is_meshed": {
								"$id": "#/properties/plates/properties/instance/properties/is_meshed",
								"title": "The is_meshed Schema",
								"type": "boolean",
								"default": false
							}
						}
					}
				},
				"additionalProperties": false
			},
			"meshed_plates": {
				"$id": "#/properties/meshed_plates",
				"title": "The meshed_plates Schema",
				"description": "Each plate is defined by an object with properties. Plates are defined by the nodes making them up (3-4), their parent plate, and their rotation.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/meshed_plates/properties/instance",
						"type": "object",
						"title": "The Meshed Plates Instance Schema",
						"required": [
							"node_A",
							"node_B",
							"node_C",
							"node_D",
							"parent_plate",
							"rotZ"
						],
						"properties": {
							"node_A": {
								"$id": "#/properties/meshed_plates/properties/instance/properties/node_A",
								"title": "The node_A Schema",
								"description": "The first node of the meshed plate. Meshed plates must be quadrilateral elements.",
								"type": "integer",
								"minimum": 1
							},
							"node_B": {
								"$id": "#/properties/meshed_plates/properties/instance/properties/node_B",
								"title": "The node_B Schema",
								"description": "The second node of the meshed plate. Meshed plates must be quadrilateral elements.",
								"type": "integer",
								"minimum": 1
							},
							"node_C": {
								"$id": "#/properties/meshed_plates/properties/instance/properties/node_C",
								"title": "The node_C Schema",
								"description": "The third node of the meshed plate. Meshed plates must be quadrilateral elements.",
								"type": "integer",
								"minimum": 1
							},
							"node_D": {
								"$id": "#/properties/meshed_plates/properties/instance/properties/node_D",
								"title": "The node_D Schema",
								"description": "The fourth node of the meshed plate. Meshed plates must be quadrilateral elements.",
								"type": "integer",
								"minimum": 1
							},
							"parent_plate": {
								"$id": "#/properties/meshed_plates/properties/instance/properties/parent_plate",
								"title": "The parent_plate Schema",
								"description": "The id of the plate which the meshed plate originated from.",
								"type": "integer",
								"minimum": 1
							},
							"rotZ": {
								"$id": "#/properties/meshed_plates/properties/instance/properties/rotZ",
								"title": "The rotZ Schema",
								"description": "Rotation of plate about the plate's local Z (normal) axis in degrees.",
								"default": 0,
								"type": "number"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"materials": {
				"$id": "#/properties/materials",
				"title": "The materials Schema",
				"description": "Each material is defined as an object with properties.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/materials/properties/instance",
						"title": "The Materials Instance Schema",
						"type": "object",
						"required": [
							"name",
							"density",
							"elasticity_modulus",
							"poissons_ratio"
						],
						"properties": {
							"name": {
								"$id": "#/properties/materials/properties/instance/properties/name",
								"title": "The name Schema",
								"description": "The name of the material.",
								"type": "string",
								"default": "",
								"examples": [
									"Structural Steel"
								],
								"pattern": "^(.*)$"
							},
							"density": {
								"$id": "#/properties/materials/properties/instance/properties/density",
								"title": "The density Schema",
								"description": "The density of the material.",
								"type": "number",
								"exclusiveMinimum": 0
							},
							"elasticity_modulus": {
								"$id": "#/properties/materials/properties/instance/properties/elasticity_modulus",
								"title": "The elasticity_modulus Schema",
								"description": "Modulus of elasticity of the material. Also known as Young's Modulus.",
								"type": "number",
								"exclusiveMinimum": 0
							},
							"poissons_ratio": {
								"$id": "#/properties/materials/properties/1/properties/poissons_ratio",
								"title": "The poissons_ratio Schema",
								"description": "Poisson's Ratio, also known as coefficient of expansion.",
								"type": "number",
								"exclusiveMinimum": 0
							}
						}
					}
				},
				"additionalProperties": false
			},
			"supports": {
				"$id": "#/properties/supports",
				"title": "The supports Schema",
				"description": "Each support is defined by an object with properties. Supports are defined by their node position, restraint code, translational and rotational stiffness.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/supports/properties/instance",
						"title": "The Supports Instance Schema",
						"type": "object",
						"required": [
							"node",
							"restraint_code"
						],
						"properties": {
							"node": {
								"$id": "#/properties/supports/properties/instance/properties/node",
								"title": "The node Schema",
								"type": "integer",
								"minimum": 1
							},
							"restraint_code": {
								"$id": "#/properties/supports/properties/instance/properties/restraint_code",
								"title": "The restraint_code Schema",
								"description": "A 6 character restraint code. The first three characters represent translational degrees of freedom in the global x, y, and z axes. The last 3 character represent rotational degrees of freedom in the global x, y, and z axes. F = Fixed, R = Released, S = Spring supported.",
								"type": "string",
								"default": "",
								"examples": [
									"FFFFFF"
								],
								"pattern": "^[FSRfsr]{6}$",
								"errorMessage": {
									"pattern": "should be 6 letter code with F, R, or S (Fixed, Released, or Spring) eg. 'FFFRSR'"
								}
							},
							"tx": {
								"$id": "#/properties/supports/properties/instance/properties/tx",
								"title": "The tx Schema",
								"description": "Spring stiffness for translation in the x axis. Only applies if the restraint code has an 'S' character set in the x translational direction.",
								"default": 0,
								"type": "number",
								"minimum": 0
							},
							"ty": {
								"$id": "#/properties/supports/properties/instance/properties/ty",
								"title": "The ty Schema",
								"description": "Spring stiffness for translation in the y axis. Only applies if the restraint code has an S' character set in the y translational direction.",
								"default": 0,
								"type": "number",
								"minimum": 0
							},
							"tz": {
								"$id": "#/properties/supports/properties/instance/properties/tz",
								"title": "The tz Schema",
								"description": "Spring stiffness for translation in the z axis. Only applies if the restraint code has an 'S' character set in the z translational direction.",
								"default": 0,
								"type": "number",
								"minimum": 0
							},
							"rx": {
								"$id": "#/properties/supports/properties/instance/properties/rx",
								"title": "The rx Schema",
								"description": "Spring stiffness for rotation in the x axis. Only applies if the restraint code has an 'S' character set in the x rotational direction.",
								"default": 0,
								"type": "number",
								"minimum": 0
							},
							"ry": {
								"$id": "#/properties/supports/properties/instance/properties/ry",
								"title": "The ry Schema",
								"description": "Spring stiffness for rotation in the y axis. Only applies if the restraint code has an 'S' character set in the y rotational direction.",
								"default": 0,
								"type": "number",
								"minimum": 0
							},
							"rz": {
								"$id": "#/properties/supports/properties/instance/properties/rz",
								"title": "The rz Schema",
								"description": "Spring stiffness for rotation in the z axis. Only applies if the restraint code has an 'S'character set in the z rotational direction.",
								"default": 0,
								"type": "number",
								"minimum": 0
							},
							"direction_code": {
								"$id": "#/properties/supports/properties/instance/properties/direction_code",
								"title": "The direction_code Schema",
								"description": "A 6 character code indicating support direction on all axes. 'B' for both positive and negative directions along the axis. 'P' for positive-only direction and 'N' for negative-only direction.",
								"type": "string",
								"default": "",
								"examples": [
									"BBBBBB"
								],
								"pattern": "^[BPN]{6}$|()",
								"errorMessage": {
									"pattern": "should be a 6 letter code with B, P, or N (Both, Positive, or Negative). eg. 'BBBNPN'"
								}
							}
						}
					}
				},
				"additionalProperties": false
			},
			"settlements": {
				"$id": "#/properties/settlements",
				"title": "The settlements Schema",
				"description": "Each settlement is defined by an object with properties. Settlements are defined by their node location, and their translational or rotational magnitude in each axis.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/settlements/properties/instance",
						"title": "The Settlements Instance Schema",
						"type": "object",
						"required": [
							"node",
							"tx",
							"ty",
							"tz",
							"rx",
							"ry",
							"rz"
						],
						"properties": {
							"node": {
								"$id": "#/properties/settlements/properties/instance/properties/node",
								"title": "The Node Schema",
								"description": "The node location where the settlement is applied. The value is the node ID.",
								"type": "integer",
								"minimum": 1
							},
							"tx": {
								"$id": "#/properties/settlements/properties/instance/properties/tx",
								"title": "The tx Schema",
								"description": "Displacement of settlement in the x axis.",
								"type": "number"
							},
							"ty": {
								"$id": "#/properties/settlements/properties/instance/properties/ty",
								"title": "The ty Schema",
								"description": "Displacement of settlement in the y axis.",
								"type": "number"
							},
							"tz": {
								"$id": "#/properties/settlements/properties/instance/properties/tz",
								"title": "The tz Schema",
								"description": "Displacement of settlement in the z axis.",
								"type": "number"
							},
							"rx": {
								"$id": "#/properties/settlements/properties/instance/properties/rx",
								"title": "The rx Schema",
								"description": "Rotation of settlement in the x axis.",
								"type": "number"
							},
							"ry": {
								"$id": "#/properties/settlements/properties/instance/properties/ry",
								"title": "The ry Schema",
								"description": "Rotation of settlement in the y axis.",
								"type": "number"
							},
							"rz": {
								"$id": "#/properties/settlements/properties/instance/properties/rz",
								"title": "The rz Schema",
								"description": "Rotation of settlement in the z axis.",
								"type": "number"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"point_loads": {
				"$id": "#/properties/point_loads",
				"title": "The point_loads Schema",
				"description": "Each point load is defined by an object with properties depending on the location that the point load is applied. Point loads are defined by their location type (node or member), magnitude, and load group.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/point_loads/properties/instance",
						"title": "The Point Loads Instance Schema",
						"type": "object",
						"required": [
							"type",
							"x_mag",
							"y_mag",
							"z_mag",
							"load_group"
						],
						"properties": {
							"type": {
								"$id": "#/properties/point_loads/properties/instance/properties/type",
								"title": "The Type Schema",
								"description": "The location where the point load is located. 'n' = located on a node. 'm' = located somewhere along the member.",
								"type": "string",
								"enum": [
									"N",
									"M",
									"n",
									"m"
								]
							},
							"node": {
								"$id": "#/properties/point_loads/properties/instance/properties/node",
								"title": "The Node Schema",
								"description": "Contextual. Only include the property 'node' if applying the point load to a node. The value should be the node ID.",
								"type": [
									"integer",
									"null"
								],
								"minimum": 1
							},
							"member": {
								"$id": "#/properties/point_loads/properties/instance/properties/member",
								"title": "The Member Schema",
								"description": "Contextual. Only include the property 'member'if applying the point load somewhere along a member. The value should be the member ID.",
								"type": [
									"integer",
									"null"
								],
								"minimum": 1
							},
							"position": {
								"$id": "#/properties/point_loads/properties/instance/properties/position",
								"title": "The Position Schema",
								"description": "Contextual. Only include the property 'position' if applying the point load somewhere along a member. This is the position along the member where the point load is applied, measured as a percentage along the member.",
								"type": [
									"number",
									"null"
								],
								"minimum": 0,
								"maximum": 100,
								"examples": [
									30
								]
							},
							"x_mag": {
								"$id": "#/properties/point_loads/properties/instance/properties/x_mag",
								"title": "The X_mag Schema",
								"description": "The magnitude of the point load force along x axis.",
								"default": 0,
								"type": "number"
							},
							"y_mag": {
								"$id": "#/properties/point_loads/properties/instance/properties/y_mag",
								"title": "The Y_mag Schema",
								"description": "The magnitude of the point load force along y axis.",
								"default": 0,
								"type": "number"
							},
							"z_mag": {
								"$id": "#/properties/point_loads/properties/instance/properties/z_mag",
								"title": "The Z_mag Schema",
								"description": "The magnitude of the point load force along z axis.",
								"default": 0,
								"type": "number"
							},
							"load_group": {
								"$id": "#/properties/point_loads/properties/instance/properties/load_group",
								"title": "The Load_group Schema",
								"description": "The load group which the point load is to be grouped to.",
								"type": "string"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"moments": {
				"$id": "#/properties/moments",
				"title": "The moments Schema",
				"description": "Each moment is defined by an object with properties depending on the location that the point load is applied. Moments are defined by their location type (node or member), magnitude, and load group.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/moments/properties/instance",
						"title": "The Moments Instance Schema",
						"type": "object",
						"required": [
							"type",
							"x_mag",
							"y_mag",
							"z_mag",
							"load_group"
						],
						"properties": {
							"type": {
								"$id": "#/properties/moments/properties/instance/properties/type",
								"title": "The type Schema",
								"description": "The location where the point load is located. 'n' = located on a node. 'm' = located somewhere along the member.",
								"type": "string",
								"pattern": "(n|N|m|M)?"
							},
							"node": {
								"$id": "#/properties/moments/properties/instance/properties/node",
								"title": "The node Schema",
								"description": "Contextual. Only include the property 'node' if applying the moment to a node. The value should be the node ID.",
								"type": [
									"integer",
									"null"
								],
								"minimum": 1
							},
							"member": {
								"$id": "#/properties/moments/properties/instance/properties/member",
								"title": "The member Schema",
								"description": "Contextual. Only include the property 'member' if applying the moment somewhere along a member. The value should be the member ID.",
								"type": [
									"integer",
									"null"
								],
								"minimum": 1
							},
							"position": {
								"$id": "#/properties/moments/properties/instance/properties/position",
								"title": "The position Schema",
								"description": "Contextual. Only include the property 'position' if applying the moment somewhere along a member. This is the position along the member where the moment is applied, measured as a percentage along the member.",
								"type": [
									"number",
									"null"
								],
								"minimum": 0,
								"maximum": 100,
								"examples": [
									30
								]
							},
							"x_mag": {
								"$id": "#/properties/moments/properties/instance/properties/x_mag",
								"title": "The x_mag Schema",
								"description": "The magnitude of the moment about the x axis. Positive = counter-clockwise, negative = clockwise.",
								"type": "number"
							},
							"y_mag": {
								"$id": "#/properties/moments/properties/instance/properties/y_mag",
								"title": "The y_mag Schema",
								"description": "The magnitude of the moment about the y axis. Positive = counter-clockwise, negative = clockwise.",
								"default": 0,
								"type": "number"
							},
							"z_mag": {
								"$id": "#/properties/moments/properties/instance/properties/z_mag",
								"title": "The z_mag Schema",
								"description": "The magnitude of the moment about the z axis. Positive = counter-clockwise, negative = clockwise.",
								"default": 0,
								"type": "number"
							},
							"load_group": {
								"$id": "#/properties/moments/properties/instance/properties/load_group",
								"title": "The Load_group Schema",
								"description": "The load group which the point load is to be grouped to.",
								"type": "string"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"distributed_loads": {
				"$id": "#/properties/distributed_loads",
				"title": "The distributed_loads Schema",
				"description": "Each distributed load is defined by an object with properties. Distributed loads are defined by their location type (node or member), magnitude, and load group.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/distributed_loads/properties/instance",
						"title": "The Distributed Loads Instance Schema",
						"type": "object",
						"required": [
							"member",
							"x_mag_A",
							"y_mag_A",
							"z_mag_A",
							"x_mag_B",
							"y_mag_B",
							"z_mag_B",
							"position_A",
							"position_B",
							"load_group",
							"axes"
						],
						"properties": {
							"member": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/member",
								"title": "The member Schema",
								"description": "Member where the distributed load is applied. Identified by the member ID.",
								"type": "integer",
								"minimum": 1
							},
							"x_mag_A": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/x_mag_A",
								"title": "The x_mag_A Schema",
								"description": "Magnitude of load in x direction at the starting position A.",
								"default": 0,
								"type": "number"
							},
							"y_mag_A": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/y_mag_A",
								"title": "The y_mag_A Schema",
								"description": "Magnitude of load in y direction at the starting position A.",
								"default": 0,
								"type": "number"
							},
							"z_mag_A": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/z_mag_A",
								"title": "The z_mag_A Schema",
								"description": "Magnitude of load in z direction at the starting position A.",
								"default": 0,
								"type": "number"
							},
							"x_mag_B": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/x_mag_B",
								"title": "The x_mag_B Schema",
								"description": "Magnitude of load in x direction at the finish position B.",
								"default": 0,
								"type": "number"
							},
							"y_mag_B": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/y_mag_B",
								"title": "The y_mag_B Schema",
								"description": "Magnitude of load in y direction at the finish position B.",
								"type": "number"
							},
							"z_mag_B": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/z_mag_B",
								"title": "The z_mag_B Schema",
								"description": "Magnitude of load in z direction at the finish position B.",
								"default": 0,
								"type": "number"
							},
							"position_A": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/position_A",
								"title": "The position_A Schema",
								"description": "Position along member where the distributed load starts. Expressed as a percentage.",
								"type": [
									"number",
									"null"
								],
								"minimum": 0,
								"maximum": 100,
								"examples": [
									30
								]
							},
							"position_B": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/position_B",
								"title": "The position_b Schema",
								"description": "Position along member where the distributed load ends. Expressed as a percentage.",
								"type": [
									"number",
									"null"
								],
								"minimum": 0,
								"maximum": 100,
								"examples": [
									30
								]
							},
							"load_group": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/load_group",
								"title": "The load_group Schema",
								"description": "The load group which the load belongs.",
								"type": "string"
							},
							"axes": {
								"$id": "#/properties/distributed_loads/properties/instance/properties/axes",
								"title": "The axes Schema",
								"description": "Specify either 'global' or 'local' to assign which axes are to be used to apply the distributed load.",
								"type": "string",
								"default": "global",
								"enum": [
									"global",
									"local",
									"Global",
									"Local"
								]
							}
						}
					}
				},
				"additionalProperties": false
			},
			"pressures": {
				"$id": "#/properties/pressures",
				"title": "The pressures Schema",
				"description": "Each pressure is defined by an object with properties. Pressures are defined by the plate ID they are applied to, the reference axes, magnitude and load group.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/pressures/properties/instance",
						"title": "The Pressures Instance Schema",
						"type": "object",
						"required": [
							"plate_id",
							"axes",
							"x_mag",
							"y_mag",
							"z_mag",
							"load_group"
						],
						"if": {
							"properties": {
								"load_distribution": {
									"const": "linear"
								}
							}
						},
						"then": {
							"properties": {
								"load_direction": {
									"$id": "#/properties/pressures/properties/instance/properties/load_direction",
									"title": "The load_direction Schema",
									"description": "Direction of the load is 'X', 'Y' or 'Z'.",
									"default": "Y",
									"type": "string",
									"pattern": "^(X|Y|Z)$"
								},
								"p1_point_id": {
									"$id": "#/properties/pressures/properties/instance/properties/p1_point_id",
									"title": "The p1_point_id Schema",
									"description": "Node ID of point P1 of linear pressure.",
									"type": "integer"
								},
								"p1_magnitude": {
									"$id": "#/properties/pressures/properties/instance/properties/p1_magnitude",
									"title": "The p1_magnitude Schema",
									"description": "Magnitude at P1 for linear pressure.",
									"default": 0,
									"type": "number"
								},
								"p2_point_id": {
									"$id": "#/properties/pressures/properties/instance/properties/p2_point_id",
									"title": "The p2_point_id Schema",
									"description": "Node ID of point P2 of linear pressure.",
									"type": "integer"
								},
								"p2_magnitude": {
									"$id": "#/properties/pressures/properties/instance/properties/p2_magnitude",
									"title": "The p2_magnitude Schema",
									"description": "Magnitude at P2 for linear pressure.",
									"default": 0,
									"type": "number"
								},
								"p3_point_id": {
									"$id": "#/properties/pressures/properties/instance/properties/p3_point_id",
									"title": "The p3_point_id Schema",
									"description": "Node ID of point P3 of linear pressure.",
									"type": "integer"
								},
								"p3_magnitude": {
									"$id": "#/properties/pressures/properties/instance/properties/p3_magnitude",
									"title": "The p3_magnitude Schema",
									"description": "Magnitude at P3 for linear pressure.",
									"default": 0,
									"type": "number"
								}
							}
						},
						"properties": {
							"plate_id": {
								"$id": "#/properties/pressures/properties/instance/properties/plate_id",
								"title": "The plate_id Schema",
								"description": "Plate where the pressure is applied. Identified by the plate ID.",
								"type": [
									"integer",
									"string"
								],
								"minimum": 1,
								"pattern": "^[1-9]+[0-9]*$"
							},
							"axes": {
								"$id": "#/properties/pressures/properties/instance/properties/axes",
								"title": "The axes Schema",
								"description": "Specify either 'global' or 'local' to assign which axes are to be used to apply the pressure load.",
								"type": "string",
								"default": "global",
								"enum": [
									"global",
									"local"
								]
							},
							"x_mag": {
								"$id": "#/properties/pressures/properties/instance/properties/x_mag",
								"title": "The x_mag Schema",
								"description": "Magnitude of pressure in x direction, dependent on local or global axes setting.",
								"default": 0,
								"type": "number"
							},
							"y_mag": {
								"$id": "#/properties/pressures/properties/instance/properties/y_mag",
								"title": "The y_mag Schema",
								"description": "Magnitude of pressure in y direction, dependent on local or global axes setting.",
								"default": 0,
								"type": "number"
							},
							"z_mag": {
								"$id": "#/properties/pressures/properties/instance/properties/z_mag",
								"title": "The z_mag Schema",
								"description": "Magnitude of pressure in z direction, dependent on local or global axes setting.",
								"default": 0,
								"type": "number"
							},
							"load_group": {
								"$id": "#/properties/pressures/properties/instance/properties/load_group",
								"title": "The load_group Schema",
								"description": "The load group which the load belongs.",
								"type": "string"
							},
							"load_distribution": {
								"$id": "#/properties/pressures/properties/instance/properties/load_distribution",
								"title": "The load_distribution Schema",
								"description": "Select between 'linear' and 'uniform' distribution.",
								"default": "uniform",
								"type": "string",
								"enum": [
									"uniform",
									"linear"
								]
							}
						}
					}
				},
				"additionalProperties": false
			},
			"area_loads": {
				"$id": "#/properties/area_loads",
				"title": "The area_loads Schema",
				"description": "Each area load is defined by an object with properties.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/area_loads/properties/instance",
						"title": "The Area Load Instance Schema",
						"type": "object",
						"required": [
							"type",
							"nodes"
						],
						"if": {
							"properties": {
								"type": {
									"const": "column_wind_load"
								}
							}
						},
						"then": {
							"properties": {
								"mags": {
									"$id": "#/properties/area_loads/properties/instance/properties/mags",
									"title": "The mags Schema",
									"description": "Comma-seperated list of magnitudes matching the number of elevations in the load.",
									"type": [
										"string",
										"number",
										"array"
									],
									"if": {
										"type": "string"
									},
									"then": {
										"pattern": "([-]?[0-9]*[.]?[0-9]*[,])*([-]?[0-9]*[.]?[0-9])",
										"errorMessage": {
											"pattern": "should be number or a comma-seperated list of numbers eg. '1.2' or '0.2,0.5'"
										}
									},
									"items": {
										"type": "number"
									}
								}
							}
						},
						"else": {
							"properties": {
								"mag": {
									"$id": "#/properties/area_loads/properties/instance/properties/mag",
									"title": "The mag Schema",
									"description": "The pressure magnitude.",
									"type": [
										"number",
										"null"
									]
								},
								"direction": {
									"$id": "#/properties/area_loads/properties/instance/properties/direction",
									"title": "The direction Schema",
									"description": "The direction of the pressure force.",
									"type": [
										"string",
										"null"
									],
									"if": {
										"type": "string"
									},
									"then": {
										"enum": [
											"X",
											"Y",
											"Z",
											"local"
										]
									}
								}
							}
						},
						"properties": {
							"type": {
								"$id": "#/properties/area_loads/properties/instance/properties/type",
								"title": "The type Schema",
								"description": "This area load instance's type.",
								"type": "string",
								"enum": [
									"one_way",
									"two_way",
									"column_wind_load",
									"open_structure"
								]
							},
							"nodes": {
								"$id": "#/properties/area_loads/properties/instance/properties/nodes",
								"title": "The nodes Schema",
								"description": "The nodes comprising the area_load.",
								"type": [
									"array",
									"string"
								],
								"examples": [
									"4,5,7,6"
								],
								"pattern": "^([0-9]+,){2,3}([0-9]+)$",
								"items": {
									"type": "integer"
								},
								"errorMessage": {
									"pattern": "should be a comma-seperated list of 4 nodes eg. '1,2,3,4'"
								}
							},
							"elevations": {
								"$id": "#/properties/area_loads/properties/instance/properties/elevations",
								"title": "The elevations Schema",
								"description": "Comma-seperated list of elevations in feet or metres for wind loads.",
								"type": [
									"string",
									"number",
									"array",
									"null"
								],
								"pattern": "^(([0-9]+,)|([0-9]+[.]?[0-9]*,)|([0-9]*[.]?[0-9]+,))*(([0-9]+$)|([0-9]+[.]?[0-9]*$)|([0-9]*[.]?[0-9]+$))",
								"items": {
									"type": "number"
								},
								"errorMessage": {
									"pattern": "should be a comma-seperated list of numbers eg. '1,1.3'"
								}
							},
							"column_direction": {
								"$id": "#/properties/area_loads/properties/instance/properties/column_direction",
								"title": "The column_direction Schema",
								"description": "The direction of your internal beams or columns. Enter two comma-seperated nodes e.g. 1,2. This would distribute the area loads along members in this direction.",
								"type": [
									"string",
									"array",
									"null"
								],
								"pattern": "[0-9]+,[0-9]+",
								"items": {
									"type": "integer"
								},
								"minItems": 2,
								"maxItems": 2,
								"errorMessage": {
									"pattern": "should be a comma-seperated list of 2 nodes indicating direction of load distribution eg. '1,2'"
								}
							},
							"loaded_members_axis": {
								"$id": "#/properties/area_loads/properties/instance/properties/loaded_members_axis",
								"title": "The loaded_members_axis Schema",
								"description": "Pick up and apply loads to all members within corner nodes, or members along X,Y,Z axis only.",
								"type": [
									"string",
									"null"
								],
								"if": {
									"type": "string"
								},
								"then": {
									"enum": [
										"all",
										"major"
									]
								}
							}
						},
						"patternProperties": {
							"LG|load_group": {
								"$id": "#/properties/area_loads/properties/instance/properties/LG",
								"title": "The LG Schema",
								"description": "The load group to which this load belongs.",
								"type": "string",
								"pattern": "^(.+)$"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"member_prestress_loads": {
				"$id": "#/properties/member_prestress_loads",
				"title": "The member_prestress_loads Schema",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/member_prestress_loads/instance",
						"title": "The Member Prestress Load Instance Schema",
						"required": [
							"LG",
							"member_id",
							"prestress_magnitude"
						],
						"LG": {
							"type": "string",
							"pattern": "^(.+)$"
						},
						"$comment": "'id' must be pattern property. Conflicts with $id",
						"patternProperties": {
							"id": {
								"type": "integer",
								"minimum": 1
							}
						},
						"member_id": {
							"type": "integer",
							"minimum": 1
						},
						"prestress_magnitude": {
							"type": "number"
						}
					}
				},
				"additionalProperties": false
			},
			"self_weight": {
				"$id": "#/properties/self_weight",
				"title": "The self_weight Schema",
				"description": "The self weight is an object defined by properties. It can be optionally enabled and applied a gravity multiplier in the x, y, or z axes",
				"type": "object",
				"if": {
					"required": [
						"x"
					]
				},
				"then": {
					"required": [
						"x",
						"y",
						"z"
					],
					"properties": {
						"enabled": {
							"$id": "#/properties/self_weight/properties/enabled",
							"title": "The Enabled Schema",
							"description": "true = self weight enabled. false = self weight disabled",
							"type": "boolean",
							"default": false
						},
						"x": {
							"$id": "#/properties/self_weight/properties/x",
							"title": "The x Schema",
							"description": "Acceleration due to gravity in the x axis measured in g's",
							"default": 0,
							"type": "number"
						},
						"y": {
							"$id": "#/properties/self_weight/properties/y",
							"title": "The y Schema",
							"description": "Acceleration due to gravity in the y axis measured in g's",
							"default": 0,
							"type": "number"
						},
						"z": {
							"$id": "#/properties/self_weight/properties/z",
							"title": "The z Schema",
							"description": "Acceleration due to gravity in the z axis measured in g's",
							"default": 0,
							"type": "number"
						},
						"LG": {
							"$id": "#/properties/self_weight/instance/properties",
							"description": "The Load Group to which the self weight belongs.",
							"type": "string",
							"pattern": "^SW[1-9]+[0-9]*$",
							"errorMessage": {
								"pattern": "should follow pattern \"SW\" followed by integer greater than 0 eg: \"SW2\"."
							}
						}
					}
				},
				"else": {
					"patternProperties": {
						"^[1-9][0-9]*$": {
							"required": [
								"x",
								"y",
								"z",
								"LG"
							],
							"properties": {
								"enabled": {
									"$id": "#/properties/self_weight/instance/properties/enabled",
									"title": "The Enabled Schema",
									"description": "true = self weight enabled. false = self weight disabled",
									"type": "boolean",
									"default": false
								},
								"x": {
									"$id": "#/properties/self_weight/instance/properties/x",
									"title": "The x Schema",
									"description": "Acceleration due to gravity in the x axis measured in g's",
									"default": 0,
									"type": "number"
								},
								"y": {
									"$id": "#/properties/self_weight/instance/properties/y",
									"title": "The y Schema",
									"description": "Acceleration due to gravity in the y axis measured in g's",
									"default": 0,
									"type": "number"
								},
								"z": {
									"$id": "#/properties/self_weight/instance/properties/z",
									"title": "The z Schema",
									"description": "Acceleration due to gravity in the z axis measured in g's",
									"default": 0,
									"type": "number"
								},
								"LG": {
									"$id": "#/properties/self_weight/instance/properties/lg",
									"description": "The Load Group to which the self weight belongs.",
									"type": "string",
									"pattern": "^SW[1-9]+[0-9]*$",
									"errorMessage": {
										"pattern": "should follow pattern \"SW\" followed by integer greater than 0 eg: \"SW2\"."
									}
								}
							}
						}
					}
				}
			},
			"load_combinations": {
				"$id": "#/properties/load_combinations",
				"title": "The load_combinations Schema",
				"description": "Load combinations are assigned to forces and moments as a property in their objects. The load combinations object is used to assign a multiplier to each load combination defined",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/load_combinations/instance/properties/instance",
						"title": "The Load Combinations Instance Schema",
						"type": "object",
						"properties": {
							"name": {
								"$id": "#/properties/load_combinations/instance/properties/name",
								"title": "The Load Combination Name Schema",
								"type": "string"
							}
						},
						"patternProperties": {
							"^(!name)(.+)$": {
								"$id": "#/properties/load_combinations/instance/pattern_properties/lg",
								"title": "The LG Schema",
								"description": "This is the Load Group Factor. Do not confuse with Load Group Name!",
								"type": "number"
							},
							"^(SW)[1-9][0-9]*$": {
								"$id": "#/properties/load_combinations/instance/pattern_properties/sw",
								"title": "The SW1 Schema",
								"type": "number"
							}
						}
					}
				},
				"properties": {
					"import": {
						"properties": {
							"design_code": {
								"type": "string",
								"enum": [
									"EN",
									"ASCE",
									"AS1170",
									"NBCC",
									"ACI"
								]
							},
							"expand_wind_loads": {
								"type": "boolean"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"load_cases": {
				"$id": "#/properties/load_cases",
				"title": "The load_cases Schema",
				"type": "object",
				"patternProperties": {
					"^AISC$|^ASCE$": {
						"$id": "#/properties/load_cases/properties/instance/united_states",
						"title": "The Load Cases Instance Schema",
						"patternProperties": {
							"^(.+)$": {
								"type": "string",
								"enum": [
									"Dead: dead",
									"Live: live",
									"Wind: wind",
									"Snow: snow",
									"Snow: Roof live",
									"Snow: Rain",
									"Temp: temp",
									"Acci: acci",
									"Seis: seis",
									"Seis: strength",
									"Seis: service level"
								],
								"default": "Dead: dead"
							}
						}
					},
					"^AS$": {
						"$id": "#/properties/load_cases/properties/instance/australia",
						"title": "The Load Cases Instance Schema",
						"patternProperties": {
							"^(.+)$": {
								"type": "string",
								"enum": [
									"Dead: G-permanent",
									"Live: Q-distr-floor",
									"Live: Q-distr-storage",
									"Live: Q-distr-roof-floor",
									"Live: Q-distr-roof-other",
									"Live: Q-conc-floor,roof",
									"Live: Q-conc-floor domestic",
									"Live: Q-conc-roof-other",
									"Live: Q-conc-machinery",
									"Wind: Wu-wind",
									"Snow: Su",
									"Seis: Eu-earthquake"
								],
								"default": "Dead: G-permanent"
							}
						}
					},
					"^EN$": {
						"$id": "#/properties/load_cases/properties/instance/europe",
						"title": "The Load Cases Instance Schema",
						"patternProperties": {
							"^(.+)$": {
								"type": "string",
								"enum": [
									"Dead: Unfavourable",
									"Dead: Favourable",
									"Live: CAT A",
									"Live: CAT B",
									"Live: CAT C",
									"Live: CAT D",
									"Live: CAT E",
									"Live: CAT F",
									"Live: CAT G",
									"Live: CAT H",
									"Snow: H <= 1000m",
									"Live: H > 1000m",
									"Wind: wind",
									"Temp: non-fire",
									"Acci: acci",
									"Seis: seis"
								],
								"default": "Dead: Unfavourable"
							}
						}
					},
					"^NBCC$": {
						"$id": "#/properties/load_cases/properties/instance/canada",
						"title": "The Load Cases Instance Schema",
						"patternProperties": {
							"^(.+)$": {
								"type": "string",
								"enum": [
									"Dead: unfavourable",
									"Dead: favourable",
									"Live: live",
									"Wind: wind",
									"Snow: snow",
									"Seis: Earthquake/Accidental"
								],
								"default": "Dead: unfavourable"
							}
						}
					}
				},
				"additionalProperties": false
			},
			"nodal_masses": {
				"$id": "#/properties/nodal_masses",
				"title": "The nodal_masses Schema",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/nodal_masses/properties/instance",
						"title": "The Nodal Masses Instance Schema",
						"type": "object",
						"properties": {
							"node_id": {
								"type": "integer",
								"minimum": 1
							},
							"tx_mass": {
								"type": "number",
								"minimum": 0
							},
							"ty_mass": {
								"type": "number",
								"minimum": 0
							},
							"tz_mass": {
								"type": "number",
								"minimum": 0
							},
							"rx_mass": {
								"type": "number",
								"minimum": 0
							},
							"ry_mass": {
								"type": "number",
								"minimum": 0
							},
							"rz_mass": {
								"type": "number",
								"minimum": 0
							}
						}
					}
				},
				"additionalProperties": false
			},
			"nodal_masses_conversion_map": {
				"$id": "#/properties/nodal_masses_conversion_map",
				"title": "The nodal_masses_conversion_map Schema",
				"type": "object",
				"patternProperties": {
					"^(.+)$": {
						"$id": "#/properties/nodal_masses_conversion_map/properties/instance",
						"title": "The Nodal Masses Conversion Map Instance Schema",
						"required": [
							"factor",
							"direction"
						],
						"properties": {
							"factor": {
								"type": "number",
								"except": [
									0
								]
							},
							"direction": {
								"type": "string",
								"enum": [
									"X,Y,Z",
									"X,Y",
									"X,Z",
									"Y,Z",
									"X",
									"Y",
									"Z"
								]
							}
						}
					}
				},
				"additionalProperties": false
			},
			"spectral_loads": {
				"$id": "#/properties/spectral_loads",
				"title": "The spectral_loads Schema",
				"description": "Each spectral load is defined by an object with properties.",
				"type": "object",
				"patternProperties": {
					"^[1-9][0-9]*$": {
						"$id": "#/properties/spectral_loads/properties/instance",
						"title": "The Spectral Load Instance Schema",
						"type": "object",
						"required": [
							"input_method"
						],
						"properties": {
							"input_method": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/input_method",
								"description": "'1' if the load was generated via 'user input'. '2' if by 'design code'",
								"type": "integer",
								"enum": [
									1,
									2
								]
							},
							"design_code": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/design_code",
								"description": "The selected design code if the load was generated via design code.",
								"type": "string",
								"enum": [
									"EN8",
									"ASCE",
									""
								]
							},
							"design_data": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/design_data",
								"title": "The design_data Schema",
								"properties": {
									"saved": {
										"type": "boolean"
									},
									"rs_type": {
										"title": "The Response Spectrum Schema",
										"type": "string",
										"enum": [
											"type_1",
											"type_2"
										]
									},
									"rs_dir": {
										"title": "The Response Spectrum Type Schema",
										"type": "string",
										"enum": [
											"el_horizontal",
											"el_vertical",
											"des_horizontal",
											"des_vertical"
										]
									},
									"rs_peak": {
										"title": "The Peak Ground Acceleration Schema",
										"type": "number",
										"exclusiveMinimum": 0
									},
									"rs_imp_fac": {
										"title": "The Response Spectrum Importance Factor Schema",
										"type": "number",
										"minimum": 0
									},
									"rs_ground": {
										"title": "The Response Spectrum Ground Type Schema",
										"type": "string",
										"enum": [
											"A",
											"B",
											"C",
											"D",
											"E"
										]
									},
									"rs_damp": {
										"title": "The Response Spectrum Damping Schema",
										"type": "number",
										"exclusiveMinimum": 0
									},
									"max_T": {
										"title": "The Maximum Period (Secs) Schema",
										"type": "number",
										"exclusiveMinimum": 0
									},
									"beta": {
										"title": "The Lower Bound Factor Schema",
										"type": "number",
										"exclusiveMinimum": 0
									},
									"q_fac": {
										"title": "The Behavior Factor Schema",
										"type": "number",
										"exclusiveMinimum": 0
									}
								}
							},
							"xy_data": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/xy_data",
								"description": "Values for the XY plot in pairs { Period T (X), Spectral Value (Y) }",
								"type": "array",
								"items": {
									"type": "object",
									"required": [
										"x",
										"y"
									],
									"properties": {
										"x": {
											"type": "number"
										},
										"y": {
											"type": "number"
										}
									},
									"additionalProperties": false
								}
							},
							"load_dir": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/load_dir",
								"description": "Direction of the load.",
								"type": "string",
								"enum": [
									"X",
									"Z",
									"XZ",
									"Y"
								]
							},
							"load_angle": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/load_angle",
								"description": "Angle of the load if 'XZ' was chosen for direction.",
								"type": "number",
								"minimum": 0,
								"maximum": 360
							},
							"load_factor": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/load_factor",
								"description": "Factor multiplier for the load.",
								"type": "number"
							},
							"load_combo_method": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/load_combo_method",
								"description": "Method used to calculate the impact of load combinations.",
								"type": "string",
								"enum": [
									"CQC",
									"ABS",
									"SRSS",
									"Linear"
								]
							},
							"load_damping_ratio": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/load_damping_ratio",
								"type": "number"
							},
							"LG": {
								"$id": "#/properties/spectral_loads/properties/instance/properties/lg",
								"description": "The load group this load belongs to",
								"pattern": "^(.+)$"
							}
						}
					}
				},
				"additionalProperties": false
			}
		}
	}

	var ajv;

	var script = document.createElement('script');
	script.onload = function () {
		var Ajv = window.ajv7.default
		ajv = new Ajv({
			allErrors: true,
			allowUnionTypes: true,
			strict: false
		})
	};
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/ajv/7.0.1/ajv7.min.js";
	document.head.appendChild(script); //or something of the likes

	functions.model =  function (s3d_model, log_flag) {
		if (!log_flag) log_flag = false;
		return validateModel(s3d_model, log_flag);
	}

	functions.API = function (input) {
		return validateStart(input);
	}

	var structuralChecks = {
		"sections": function (model_data) {
			var info_schema = {
				"$id": "#/properties/sections/properties/instance/type4",
				"type": "object",
				"title": "The Sections Array Schema",
				"description": "One can call a definition from the Section Database, instead of defining a Section explicitly",
				"required": [
					"info"
				],
				"properties": {
					"info": {
						"properties": {
							"selection": {
								"properties": {
									"family_code": {
										"type": [
											"string",
										],
										"pattern": "^(.)+$"
									},
									"family_name": {
										"type": [
											"string",
										],
										"pattern": "^(.)+$"
									},
									"section_name": {
										"type": [
											"string",
										],
										"pattern": "^(.)+$"
									},
									"name": {
										"type": [
											"string",
										],
										"pattern": "^(.)+$"
									}
								}
							},
							"shape": {
								"type": [
									"string"
								],
								"pattern": "^(.)+$"
							}
						}
					}
				}
			}

			var section_builder_schema = {
				"$id": "#/properties/sections/properties/instance/type1",
				"title": "The Sections Database Schema",
				"description": "Schema for a section whose properties are explicitly defined.",
				"type": "object",
				"required": [
					"area",
					"Iz",
					"Iy",
					"J",
					"material_id"
				],
				"properties": {
					"version": {
						"$id": "#/properties/sections/properties/instance/type1/properties/version",
						"title": "The version Schema",
						"description": "The version of the 'Section Builder' that was used to construct this object.",
						"type": [
							"integer",
							"string"
						],
						"examples": [
							1
						],
						"minimum": 1,
						"pattern": "^[0-9]+$",
						"errorMessage": {
							"pattern": "should be a positive integer."
						}
					},
					"name": {
						"$id": "#/properties/sections/properties/instance/properties/type1/name",
						"title": "The name Schema",
						"description": "The name of your section. If nothing is entered, the name will default to the (rounded) height x width dimension.",
						"type": "string",
						"default": "",
						"examples": [
							"203 x 203"
						],
						"pattern": "^(.*)$"
					},
					"area": {
						"$id": "#/properties/sections/properties/instance/properties/type1/area",
						"title": "The area Schema",
						"description": "Cross sectional area.",
						"type": "number",
						"exclusiveMinimum": 0
					},
					"Iy": {
						"$id": "#/properties/sections/properties/instance/properties/type1/Iy",
						"title": "The Iy Schema",
						"description": "Area moment of inertia about the y axis.",
						"type": "number",
						"exclusiveMinimum": 0
					},
					"Iz": {
						"$id": "#/properties/sections/properties/instance/properties/type1/Iz",
						"title": "The Iz Schema",
						"description": "Area moment of inertia about the z axis.",
						"type": "number",
						"exclusiveMinimum": 0
					},
					"J": {
						"$id": "#/properties/sections/properties/instance/properties/type1/J",
						"title": "The J Schema",
						"description": "Torsion constant.",
						"type": "number",
						"exclusiveMinimum": 0
					},
					"material_id": {
						"$id": "#/properties/sections/properties/instance/properties/type1/material_id",
						"title": "The material_id Schema",
						"description": "The ID of the material that is assigned to the cross section. Materials are defined in its own object.",
						"type": "integer",
						"minimum": 1
					},
					"shear_area_z": {
						"$id": "#/properties/sections/properties/instance/properties/type1/shear_area_z",
						"title": "The shear_area_z Schema",
						"description": "Optional. Do not get confused between this property and the one with the same name within the 'aux' property. Shear Area in the Z-axis. Leave this value as Empty or Zero for a Euler-Bernoulli Beam (Recommended). Enter a value for a Timoshenko Beam (i.e. where shear deformation is not neglible).",
						"type": [
							"number",
							"null",
							"string"
						],
						"pattern": "^([0-9]*\\.?[0-9]*)$",
						"examples": [
							500,
							null
						]
					},
					"shear_area_y": {
						"$id": "#/properties/sections/properties/instance/properties/type1/shear_area_y",
						"title": "The shear_area_y Schema",
						"description": "Optional. Do not get confused between this property and the one with the same name within the 'aux' property. Shear Area in the Y-axis. Leave this value as Empty or Zero for a Euler-Bernoulli Beam (Recommended). Enter a value for a Timoshenko Beam (i.e. where shear deformation is not neglible).",
						"type": [
							"number",
							"null",
							"string"
						],
						"pattern": "^([0-9]*\\.?[0-9]*)$",
						"examples": [
							800,
							null
						]
					},
					"revit": {
						"type": [
							"string",
							"null"
						]
					},
					"aux": {
						"$id": "#/properties/sections/properties/instance/type1/properties/aux",
						"title": "The aux Schema",
						"description": "The 'aux' property is an object containing various property values. It contains the geometric coordinates of the cross section among other properties which are calculated via the 'Section Builder' software. For brevity, the individual properties are not detailed here. To understand how to create a section via the 'Section Builder' and implement it into the API, please contact us at info@skyciv.com",
						"type": "object",
						"required": [
							"composite",
							"Qz",
							"Qy",
							"centroid_point",
							"centroid_length",
							"depth",
							"width",
							"alpha",
							"shear_area_z",
							"shear_area_y",
							"torsion_radius"
						],
						"properties": {
							"composite": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/composite",
								"title": "The composite Schema",
								"type": "boolean",
								"default": false
							},
							"Qz": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/Qz",
								"title": "The Qz Schema",
								"default": 0,
								"type": "number"
							},
							"Qy": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/Qy",
								"title": "The Qy Schema",
								"default": 0,
								"type": "number"
							},
							"centroid_point": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/centroid_point",
								"title": "The centroid_point Schema",
								"type": "array",
								"minItems": 2,
								"maxItems": 2,
								"items": {
									"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/centroid_point/items",
									"type": "number",
									"title": "The Items Schema",
									"default": 0,
									"examples": [
										101.6,
										101.6
									]
								}
							},
							"centroid_length": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/centroid_length",
								"title": "The centroid_length Schema",
								"type": "array",
								"minItems": 2,
								"maxItems": 2,
								"items": {
									"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/centroid_length/items",
									"type": "number",
									"title": "The Items Schema",
									"default": 0,
									"examples": [
										101.6,
										101.6
									]
								}
							},
							"depth": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/depth",
								"title": "The depth Schema",
								"default": 0,
								"type": "number"
							},
							"width": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/width",
								"title": "The width Schema",
								"default": 0,
								"type": "number"
							},
							"alpha": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/alpha",
								"title": "The alpha Schema",
								"default": 0,
								"type": "number"
							},
							"Zy": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/Zy",
								"title": "The Zy Schema",
								"type": "number"
							},
							"Zz": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/Zz",
								"title": "The Zz Schema",
								"type": "number"
							},
							"warping_constant": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/warping_constant",
								"title": "The warping_constant Schema",
								"type": "number"
							},
							"shear_area_z": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/shear_area_z",
								"title": "The shear_area_z Schema",
								"default": 0,
								"type": "number"
							},
							"shear_area_y": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/shear_area_y",
								"title": "The shear_area_y Schema",
								"default": 0,
								"type": "number"
							},
							"torsion_radius": {
								"$id": "#/properties/sections/properties/instance/type1/properties/aux/properties/torsion_radius",
								"title": "The torsion_radius Schema",
								"default": 0,
								"type": "number"
							}
						}
					}
				}
			}

			var load_section_schema = {
				"$id": "#/properties/sections/properties/instance/type2",
				"type": "object",
				"title": "The Sections Array Schema",
				"description": "One can call a definition from the Section Database, instead of defining a Section explicitly",
				"required": [
					"load_section",
					"material_id"
				],
				"properties": {
					"load_section": {
						"$id": "#/properties/sections/properties/instance/type2/load_section",
						"type": [
							"array",
							"string"
						],
						"title": "The Load Section Schema",
						"$comment": "Array is a list of strings eg. ['American', 'AISC', 'W shapes', 'W14x808']",
						"items": {
							"type": "string"
						}
					},
					"material_id": {
						"$id": "#/properties/sections/properties/instance/type2/material_id",
						"title": "The Material ID Schema",
						"description": "The material attached to this particle section.",
						"type": "integer",
						"minimum": 1
					}
				}
			}

			var load_custom_schema = {
				"$id": "#/properties/sections/properties/instance/type3",
				"type": "object",
				"title": "The Sections Array Schema",
				"description": "One can call a definition from the Section Database, instead of defining a Section explicitly",
				"required": [
					"load_custom",
					"material_id"
				],
				"properties": {
					"load_section": {
						"$id": "#/properties/sections/properties/instance/type2/load_custom",
						"type": [
							"string"
						],
						"title": "The Load Section Schema",
						"$comment": "The name of your custom section, as saved in the Section Builder",
						"items": {
							"type": "string"
						}
					},
					"material_id": {
						"$id": "#/properties/sections/properties/instance/type2/material_id",
						"title": "The Material ID Schema",
						"description": "The material attached to this particle section.",
						"type": "integer",
						"minimum": 1
					}
				}
			}

			var sections = model_data.sections;
			var validate_a = ajv.compile(info_schema);
			var validate_b = ajv.compile(section_builder_schema);
			var validate_c = ajv.compile(load_section_schema);
			var validate_d = ajv.compile(load_custom_schema);
			var errors = [];

			for (const s in sections) {
				var a_is_valid = validate_a(sections[s]);
				var b_is_valid = validate_b(sections[s]);
				var c_is_valid = validate_c(sections[s]);
				var d_is_valid = validate_d(sections[s]);

				if (!a_is_valid && !b_is_valid && !c_is_valid && !d_is_valid) {
					errors.push("sections[" + s + "] does not match an accepted specification. Please follow one specification for this section. Refer to https://skyciv.com/api/v3/docs/s3d-model/#sections");

					errors.push("If using the \"info\" format:");
					for (var e = 0; e < validate_a.errors.length; e++) {
						if (validate_a.errors[e].dataPath !== "") {
							validate_a.errors[e].dataPath = "sections[" + s + "]" + validate_a.errors[e].dataPath;
						} else {
							validate_a.errors[e].dataPath = "sections[" + s + "]";
						}
						errors.push(validate_a.errors[e]);
					}

					errors.push("If using the \"section builder\" format:");
					for (e = 0; e < validate_b.errors.length; e++) {
						if (validate_b.errors[e].dataPath !== "") {
							validate_b.errors[e].dataPath = "sections[" + s + "]" + validate_b.errors[e].dataPath;
						} else {
							validate_b.errors[e].dataPath = "sections[" + s + "]";
						}
						errors.push(validate_b.errors[e]);
					}

					errors.push("If using the \"load_section\" format:");
					for (e = 0; e < validate_c.errors.length; e++) {
						if (validate_c.errors[e].dataPath !== "") {
							validate_c.errors[e].dataPath = "sections[" + s + "]" + validate_c.errors[e].dataPath;
						} else {
							validate_c.errors[e].dataPath = "sections[" + s + "]";
						}
						errors.push(validate_c.errors[e]);
					}

					errors.push("If using the \"load_custom\" format:");
					for (e = 0; e < validate_d.errors.length; e++) {
						if (validate_d.errors[e].dataPath !== "") {
							validate_d.errors[e].dataPath = "sections[" + s + "]" + validate_d.errors[e].dataPath;
						} else {
							validate_d.errors[e].dataPath = "sections[" + s + "]";
						}
						errors.push(validate_d.errors[e]);
					}
				}
			}

			if (errors.length > 0) {
				return errors;
			} else {
				return true;
			}
		},
		"unitsAreMixedOrMalformed": function (model_data) {
			var units = {
				"length": {
					"metric": ["m", "mm"],
					"imperial": ["ft", "in"],
				},
				"section_length": {
					"metric": ["mm"],
					"imperial": ["in"],
				},
				"material_strength": {
					"metric": ["mpa"],
					"imperial": ["ksi", "psi"],
				},
				"density": {
					"metric": ["kg/m3"],
					"imperial": ["lb/ft3"],
				},
				"force": {
					"metric": ["kn", "n", "kg"],
					"imperial": ["kip", "lb"],
				},
				"moment": {
					"metric": ["kn-m", "n-m", "kg-m"],
					"imperial": ["kip-ft", "lb-ft", "lb-in"],
				},
				"pressure": {
					"metric": ["mpa", "kpa", "pa"],
					"imperial": ["ksf", "ksi", "psf", "psi"],
				},
				"mass": {
					"metric": ["kg"],
					"imperial": ["kip", "lb"],
				},
				"translation": {
					"metric": ["m", "mm"],
					"imperial": ["in"],
				},
				"stress": {
					"metric": ["mpa", "kpa"],
					"imperial": ["ksi", "psi"]
				}
			}

			var metric_count = 0;
			var imperial_count = 0;
			var outlier_count = 0;
			var keys = [];
			var malformed_keys = [];

			if (typeof model_data.settings.units === "object") {
				for (const k in model_data.settings.units) {

					if (!units[k]) {
						return [
							k + " is not a unit key."
						];
					}
					if (units[k].metric.indexOf(model_data.settings.units[k]) > -1) {
						metric_count++;
						keys.push("Metric " + k + " detected.");

					} else if (units[k].imperial.indexOf(model_data.settings.units[k]) > -1) {
						imperial_count++;
						keys.push("Imperial " + k + " detected.");

					} else {
						var metric_formatted = [];
						var imperial_formatted = [];

						for (const u in units[k].metric) {
							metric_formatted.push("\"" + units[k].metric.hasOwnProperty[u] + "\"")
						}

						for (const u in units[k].imperial) {
							imperial_formatted.push("\"" + units[k].imperial[u] + "\"")
						}

						keys.push("settings." + k + " if metric should be: " + metric_formatted.join(" or ") + ". Or if imperial should be: " + imperial_formatted.join(" or "))
						malformed_keys.push("settings." + k + " (" + model_data.settings.units[k] + ") does not fit either Metric or Imperial specification.")
						outlier_count++;
					}
				}

				if (metric_count > 0 && imperial_count > 0 && outlier_count > 0) {
					return [
						[
							"1. Please specify units as metric-only or imperial-only.",
							"2. Units were detected that do not fit any specification. To remedy both errors refer to https://skyciv.com/api/v3/docs/s3d-model/#units"
						],
						keys
					];
				} else if (metric_count > 0 && imperial_count > 0 && outlier_count == 0) {
					return [
						[
							"Please specify units as metric-only or imperial-only. Refer to https://skyciv.com/api/v3/docs/s3d-model/#units",
						],
						keys
					];
				} else if (outlier_count > 0) {
					return malformed_keys;
				} else {
					return false;
				}
			}
		},
		"isV2Format": function (model_data) {
			var has_auth = model_data.hasOwnProperty("auth");
			var has_file_management = model_data.hasOwnProperty("file_management");
			var has_analysis_report = model_data.hasOwnProperty("analysis_report");

			if (has_auth && has_file_management && has_analysis_report) {
				return true;
			}
		}
	}

	function validateModel(model_data, log_flag) {

		if (!ajv) return console.error("Dependencies have not loaded yet.")

		var validate = ajv.compile(model_schema);
		var is_valid = validate(model_data);
		var model_data_str = model_data;

		if (typeof model_data_str !== "string") {
			model_data_str = JSON.stringify(model_data, null, '\t');
		}

		// ++++++++++++ Logging is overkill?
		if (is_valid) {
			if (log_flag == true) console.log("Model format OK");
			return errorResponse([]);
		} else {
			if (log_flag == true) console.log(errorResponse(validate.errors));
			return errorResponse(validate.errors);		// Loop over .messages in caller for user messages.
		}
	}

	function errorResponse(errors) {
		var is_valid = false;
		if (errors.length == 0) {
			return {
				status: true,
				errors: [],
				messages: []
			}
		}

		var messages = [];
		if (errors && typeof errors == "object") {
			for (var i = 0; i < errors.length; i++) {
				var error_msg = error2message(errors[i]);
				messages.push(error_msg);
			}
		}

		return {
			status: is_valid,
			errors: errors,
			messages: messages
		}
	}

	function error2message(obj) {
		switch (obj.keyword) {
			case "type":
			case "required":
			case "maximum":
			case "minimum":
			case "exclusiveMinimum":
			case "exclusiveMaximum":
			case "errorMessage":		// Custom error messages using ajv-errors plugin.
			case "pattern":
				return obj.dataPath + " " + obj.message.toString();
			case "enum":
				return obj.dataPath + " should be one of the following inputs: " + obj.params.allowedValues.toString().replace(/,/g, ", ");
			default:
				return obj.dataPath + " " + obj.message + ": " + JSON.stringify(obj.params);
		}
	}

	function isV2Format(model_data) {
		var has_auth = model_data.hasOwnProperty("auth");
		var has_file_management = model_data.hasOwnProperty("file_management");
		var has_analysis_report = model_data.hasOwnProperty("analysis_report");

		if (has_auth || has_file_management || has_analysis_report) {
			return true;
		}
	}

	function unitsAreMixedOrMalformed(model_data) {
		var units = {
			"length": {
				"metric": ["m", "mm"],
				"imperial": ["ft", "in"],
			},
			"section_length": {
				"metric": ["mm"],
				"imperial": ["in"],
			},
			"material_strength": {
				"metric": ["mpa"],
				"imperial": ["ksi", "psi"],
			},
			"density": {
				"metric": ["kg/m3"],
				"imperial": ["lb/ft3"],
			},
			"force": {
				"metric": ["kn", "n", "kg"],
				"imperial": ["kip", "lb"],
			},
			"moment": {
				"metric": ["kn-m", "n-m", "kg-m"],
				"imperial": ["kip-ft", "lb-ft", "lb-in"],
			},
			"pressure": {
				"metric": ["mpa", "kpa", "pa"],
				"imperial": ["ksf", "ksi", "psf", "psi"],
			},
			"mass": {
				"metric": ["kg"],
				"imperial": ["kip", "lb"],
			},
			"translation": {
				"metric": ["m", "mm"],
				"imperial": ["in"],
			},
			"stress": {
				"metric": ["mpa", "kpa"],
				"imperial": ["ksi", "psi"]
			}
		}

		var metric_count = 0;
		var imperial_count = 0;
		var outlier_count = 0;
		var keys = [];
		var malformed_keys = [];

		if (typeof model_data.settings.units === "object") {
			for (const k in model_data.settings.units) {
				if (units[k].metric.indexOf(model_data.settings.units[k]) > -1) {
					metric_count++;
					keys.push("Metric " + k + " detected.");

				} else if (units[k].imperial.indexOf(model_data.settings.units[k]) > -1) {
					imperial_count++;
					keys.push("Imperial " + k + " detected.");

				} else {
					var metric_formatted = [];
					var imperial_formatted = [];

					for (const u in units[k].metric) {
						metric_formatted.push("\"" + units[k].metric[u] + "\"")
					}

					for (const u in units[k].imperial) {
						imperial_formatted.push("\"" + units[k].imperial[u] + "\"")
					}

					keys.push("settings." + k + " if metric should be: " + metric_formatted.join(" or ") + ". Or if imperial should be: " + imperial_formatted.join(" or "))
					malformed_keys.push("settings." + k + " does not fit either Metric or Imperial specification.")
					outlier_count++;
				}
			}

			if (metric_count > 0 && imperial_count > 0 && outlier_count > 0) {
				return [
					[
						"1. Please specify units as metric-only or imperial-only.",
						"2. Units were detected that do not fit any specification. To remedy both errors refer to https://skyciv.com/api/v3/docs/s3d-model/#units"
					],
					keys
				];
			} else if (metric_count > 0 && imperial_count > 0 && outlier_count == 0) {
				return [
					[
						"Please specify units as metric-only or imperial-only. Refer to https://skyciv.com/api/v3/docs/s3d-model/#units",
					],
					keys
				];
			} else if (outlier_count > 0) {
				return [
					[
						"Units were detected that do not fit any specification. Refer to https://skyciv.com/api/v3/docs/s3d-model/#units"
					],
					malformed_keys]
			} else {
				return false;
			}
		}
	}

	function validateStart(input) {
		try {
			for (var i = 0; i < input.functions.length; i++) {
				if (!input.functions[i]) continue;
				if (!input.functions[i].arguments) continue;
				if (!input.functions[i].arguments.s3d_model) continue;

				var model_data = input.functions[i].arguments.s3d_model;

				if (typeof model_data === "string") {
					model_data = JSON.parse(model_data);
				}

				if (isV2Format(model_data)) {
					return {
						"status": false,
						"messages": ["Model appears to be v2 format. Please use a v3 model: https://skyciv.com/api/v3/docs/s3d-model/"]
					};
				}

				var units_mixed_or_malformed = unitsAreMixedOrMalformed(model_data);

				if (units_mixed_or_malformed) {
					return {
						"status": false,
						"messages": units_mixed_or_malformed
					}
				}

				var has_members = model_data.hasOwnProperty("members");
				var has_plates = model_data.hasOwnProperty("plates");

				if (!has_members && !has_plates) {
					return {
						"status": false,
						"messages": ["Model is missing both members and plates."]
					};
				}

				var sections_result = structuralChecks.sections(model_data);

				if (sections_result !== true) {
					// console.log(sections_result);
					var error_obj = errorResponse(sections_result);
					// console.log(error_obj.messages);
					return {
						"status": false,
						"messages": error_obj.messages
					};
				}

				var result = validateModel(model_data); // Array of errors.

				if (typeof result !== "undefined") {
					return result;
				}

				break; // assume there will only be one s3d_model in their API object
			}

		} catch (e) {
			console.log(e)
		}
	}

	return functions;
})();