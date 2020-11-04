<template>	
		<div>	
			<p @click="print('TRX11212', 10000, data)">Tes</p>
		</div>
</template>
<script>
	import {formatRupiah} from '../../functions/universal.js';

	export default{
		data(){
			return{
				data : [
					{
						id    : '11212',
						name  : 'Lemonilo',
						qty   : 3,
						price : 10000 
					},
					{
						id    : '11212',
						name  : 'Lemonilo',
						qty   : 5,
						price : 2000 
					},
					{
						id    : '11214',
						name  : 'Lemonila',
						qty   : 7,
						price : 1000000 
					}
				]
			}
		},
		methods : {

			print : function (transaction_id, transaction_disc, transaction_item) {
				let id      = transaction_id;
				let overall = 0;
				let disc    = transaction_disc;
				this.data   = transaction_item;

				let date_time = new Date();
				var date = date_time.getFullYear()+'-'+(date_time.getMonth()+1)+'-'+date_time.getDate();
				var time = date_time.getHours() + ":" + date_time.getMinutes() + ":" + date_time.getSeconds();
				
				this.receipt = window.open("", "receipt", "width=300,height=300");
				this.receipt.document.write("<p style='margin-bottom:0px;font-size:13px;text-align:center'>Wenang - Manado 082190886467<br/> Jl. Garuda No.10, Mahakeret Barat</p>");
				this.receipt.document.write("<p style='margin-top:0px;margin-bottom:0px;font-size:13px;text-align:center'>Tgl / Jam : "+date + " " + time +"</p>");
				this.receipt.document.write("<p style='margin-top:0px;margin-bottom:0px;font-size:13px;text-align:center'>No Struk : "+id+"</p>");
				this.receipt.document.write("<p style='margin-top:0px;margin-bottom:0px'>-----------------------------------------</p>");

				let table  = "<table style='border:none;font-size:13px;'>";

				// item
				for(var i = 0; i < this.data.length; i++){
					table     += "<tr>";
					table     += "<td>" + this.data[i].id + "</td>";
					table     += "<td colspan='4'>" + this.data[i].name + "</td>";
					table     += "</tr>";

					if(this.data[i].type != "Produk"){
						table += "<tr>";
						table += "<td></td>";
						table += "<td colspan='4'>" + this.data[i].handle + "</td>";
						table += "</tr>";
					}

					table     += "<tr>";
					table     += "<td></td>";
					table     += "<td>" + this.data[i].qty + "</td>";
					table     += "<td> x </td>";
					table     += "<td style='text-align:right'>" + formatRupiah(this.data[i].price.toString()) + "</td>";
					table     += "<td>: " + formatRupiah((this.data[i].price * this.data[i].qty).toString()) + "</td>";
					table     += "<tr>";
					overall   += (this.data[i].price * this.data[i].qty);
				}

				// sub total
				table += "<tr>";
				table += "<td colspan='4' style='text-align:right'>Sub Total</td>";
				table += "<td>: " + formatRupiah(overall.toString()) + "</td>";
				table += "</tr>";

				// diskon
				table += "<tr>";
				table += "<td colspan='4' style='text-align:right'>Diskon</td>";
				table += "<td>: " + formatRupiah(disc.toString()); + "</td>";
				table += "</tr>";

				// diskon
				table += "<tr>";
				table += "<td colspan='4' style='text-align:right'>Total</td>";
				table += "<td>: " + formatRupiah((overall-disc).toString()) + "</td>";
				table += "</tr>";

				table += "</table>";
				this.receipt.document.write(table);

				this.receipt.document.write("<p style='margin-bottom:0px;margin-top:0px'>-----------------------------------------</p>");
				let footer  = "<p style='font-size:13px;margin-top:0px;'>Terima kasih atas kunjungannya :)</p>";
				this.receipt.document.write(footer);
				this.receipt.print();
				this.receipt.close();
			}
		}
	}
</script>

