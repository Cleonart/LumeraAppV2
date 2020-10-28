<template>
	<div> 
		<div class="receipt_body ml-1 mr-1" id="receipt">
			<div class="col-lg-4">
				<p style="font-size:14px;font-family:'Dot Digital-7'">WENANG - MANADO 082190886467<br/>JL. GARUDA NO.10, MAHAKERET BARAT</p>
				<p class="divider">----------------------</p>
			</div>
			<button @click="print()" >Print</button>
		</div>
	</div>
</template>

<style type="text/css">

	.receipt_body{
		font-family: 'Times new Roman';
		font-size: 12px;
	}

	.address{
		text-align: center;
		margin-bottom: -5px;
	}

	.divider{
		text-align: center;
	}
</style>

<script>
	export default{
		data(){
			return{

			}
		},
		methods : {
			print : function () {
				window.print();
			}
		}
	}
</script>

