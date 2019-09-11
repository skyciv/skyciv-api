import json
import os.path
import skyciv

credentials = {
	"username": "YOUR_API_USERNAME_HERE",
	"key": "YOUR_API_KEY_HERE"
}

# Get credentials from credentials.json if it exists
credentials_file = './credentials.json'
if os.path.isfile(credentials_file):
	f = open(credentials_file, "r")
	credentials = json.loads(f.read())
	f.close()

model_data = '{"dataVersion":20,"settings":{"units":{"length":"m","section_length":"mm","material_strength":"mpa","density":"kg/m3","force":"kn","moment":"kn-m","pressure":"kpa","translation":"mm","stress":"mpa"},"precision":"fixed","precision_values":3,"evaluation_points":9,"vertical_axis":"Y","projection_system":"orthographic","solver_timeout":600,"accurate_buckling_shape":false,"buckling_johnson":false,"non_linear_tolerance":"1","non_linear_theory":"small","auto_stabilize_model":false},"details":{},"nodes":{"1":{"x":0,"y":0,"z":0},"2":{"x":1,"y":0,"z":0}},"members":{"1":{"type":"normal_continuous","cable_length":null,"node_A":1,"node_B":2,"section_id":1,"rotation_angle":0,"fixity_A":"FFFFFF","fixity_B":"FFFFFF","offset_Ax":"0","offset_Ay":"0","offset_Az":"0","offset_Bx":"0","offset_By":"0","offset_Bz":"0"}},"plates":{},"meshed_plates":{},"sections":{"1":{"version":2,"name":"200 x 20","area":4000,"Iz":13333333.33333,"Iy":133333.33333,"material_id":1,"aux":{"composite":false,"Qz":100000,"Qy":10000,"centroid_point":[10,100],"centroid_length":[10,100],"depth":200,"width":20,"alpha":0,"Zy":20000,"Zz":200000,"polygons":[{"name":"Rectangular","group_id":0,"points_calc":[[0,0,"regular"],[20,0,"regular"],[20,200,"regular"],[0,200,"regular"]],"points_custom_orig":[],"shape":"rectangle","dimensions_show":true,"dimensions":{"h":{"value":200,"locat":[[40,0],[40,200],{"placeholder":"Height","dimension_id":"h","dimension":200}]},"b":{"value":20,"locat":[[0,-20],[20,-20],{"placeholder":"Width","dimension_id":"b","dimension":20}]}},"operations":{"rotation":0,"translation":[0,0],"mirror_z":false,"mirror_y":false},"cutout":false,"material":{"id":1,"name":"Structural Steel","density":7850,"elasticity_modulus":200000,"poissons_ratio":0.27,"yield_strength":260,"ultimate_strength":410,"class":"steel"},"type":"standard","points_centroid_shifted":[[-10,-100,"regular"],[10,-100,"regular"],[10,100,"regular"],[-10,100,"regular"]]}],"warping_constant":425194000,"shear_area_z":3333.3333333333335,"shear_area_y":3336.4751807952484,"torsion_radius":20},"J":499552}},"materials":{"1":{"id":1,"name":"Structural Steel","density":7850,"elasticity_modulus":200000,"poissons_ratio":0.27,"yield_strength":260,"ultimate_strength":410,"class":"steel"},"2":{"id":2,"name":"Aluminium","density":2700,"elasticity_modulus":69000,"poissons_ratio":0.32,"yield_strength":100,"ultimate_strength":150,"class":"aluminium"},"3":{"id":3,"name":"Carbon Fibre Reinforced Plastic","density":3500,"elasticity_modulus":150000,"poissons_ratio":0.2,"yield_strength":"","ultimate_strength":2705,"class":"other"},"4":{"id":4,"name":"Concrete","density":2500,"elasticity_modulus":17000,"poissons_ratio":0.2,"yield_strength":"","ultimate_strength":3.5,"class":"concrete"},"5":{"id":5,"name":"Concrete High Strength","density":2500,"elasticity_modulus":30000,"poissons_ratio":0.2,"yield_strength":"","ultimate_strength":5,"class":"concrete"},"6":{"id":6,"name":"Oakwood","density":900,"elasticity_modulus":11000,"poissons_ratio":0.3,"yield_strength":4.5,"ultimate_strength":5,"class":"wood"},"7":{"id":7,"name":"Glass","density":2500,"elasticity_modulus":70000,"poissons_ratio":0.24,"yield_strength":"","ultimate_strength":33,"class":"other"}},"supports":{"1":{"tx":0,"ty":0,"tz":0,"rx":0,"ry":0,"rz":0,"node":1,"restraint_code":"FFFFFF"}},"settlements":{},"point_loads":{"1":{"x_mag":0,"y_mag":-1,"z_mag":0,"load_group":"LG","type":"N","node":2}},"moments":{},"distributed_loads":{},"pressures":{},"member_prestress_loads":{},"self_weight":{},"load_combinations":{},"load_cases":{}}'
model_data = json.loads(model_data) #convert to python associative array

data = {
	'auth': credentials,
	'functions': [
		{
			'function': "S3D.session.start",
			'arguments': {},
		},
		{
			'function': "S3D.model.set",
			'arguments': {
				's3d_model': model_data
			},
		},
		{
			'function': "S3D.file.save",
			'arguments': {
				'name': 'API Test File',
				'path': 'API Folder',
			},
		},
	],
}

response = skyciv.request(data)
print response