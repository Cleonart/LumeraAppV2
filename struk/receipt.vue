<template>
	<div>
		
	</div>
</template>

<script type="text/javascript">
	export default{
		data(){
			return{
				receipt : 0
			}
		},
		methods : {

			createNewReceipt : function () {
				let address_style = "style='text-align:center'";
				this.receipt = window.open("", "receipt", "width=300,height=300");
				this.receipt.document.write("<p " + address_style + ">Wenang - Manado 082190886467<br/> Jl. Garuda No.10, Mahakeret Barat</p>")
				this.receipt.close();
			}

		},

		created(){
			this.createNewReceipt();
		}
	}
</script>