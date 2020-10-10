export function masterData(){

	let master = {
		Staff    : mastereditStaff(),
		Service  : mastereditService(),
		Patients : mastereditPatients(),
		Product  : mastereditProducts()
	}
	return master;
}

function mastereditStaff(){
	let inputData = {
		title : "Edit Staff",
		code  : "STF",
		inputs : [
			{
				label : "Nama Staf",
				required : true,
				text : "",
				placeholder : "Masukan Nama Staf",
				type : "text"
			},
			{
				label : "Username",
				required : true,
				text : "",
				placeholder : "Masukan Username",
				type : "text"
			},
			{
				label : "Password",
				required : true,
				text : "",
				placeholder : "Masukan Password",
				type : "text"
			},
			{
				label : "Posisi",
				required : true,
				text : "-PILIH-",
				type : "select_box",
				option : ["Administrator", "Kasir", "Clinician", "Stylist", "Hair Washer"]
			},
			{
				label : "Status",
				required : true,
				text : "1",
				type : "radio",
				option : [
					{
						label : "Aktif",
						value : "1"
					},
					{
						label : "Tidak Aktif",
						value : "0"
					}
				]
			}
		],
		urlToGet  : '/lumeraAPI/master_data/getAllStaff.php',
		urlToPost : '/lumeraAPI/master_data/insertEditStaff.php' 
	}
	return inputData;
}

function mastereditService(){

}

function mastereditPatients() {

}

function mastereditProducts(){

}