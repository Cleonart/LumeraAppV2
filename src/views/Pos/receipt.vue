<template>	
		<div>	

		</div>
</template>
<script>
	import {formatRupiah, getDateAndTime} from '../../functions/universal.js';

	export default{
		data(){
			return{
				data : []
			}
		},
		methods : {

			print : function (transaction_id, transaction_disc, transaction_item, transaction_name) {
				let id      = transaction_id;
				let overall = 0;
				let disc    = transaction_disc;
				this.data   = transaction_item;
				
				this.receipt = window.open("", "receipt", "width=300,height=300");
				this.receipt.document.write("<p style='margin-bottom:0px;font-size:13px;margin-top:-10px; text-align:center'>Wenang - Manado 082190886467<br/> Jl. Garuda No.10, Mahakeret Barat</p>");
				this.receipt.document.write("<p style='margin-top:0px;margin-bottom:0px;font-size:13px;text-align:center'>Tgl / Jam : "+ getDateAndTime() +"</p>");
				this.receipt.document.write("<p style='margin-top:0px;margin-bottom:0px;font-size:13px;text-align:center'>No Struk : "+id+"</p>");
				this.receipt.document.write("<p style='margin-top:0px;margin-bottom:0px;font-size:13px;text-align:center'>Nama : "+transaction_name+"</p>");
				this.receipt.document.write("<p style='margin-top:0px;margin-bottom:0px'>-----------------------------------------</p>");

				let table  = "<table style='border:none;font-size:13px;'>";

				// item
				for(var i = 0; i < this.data.length; i++){
					table     += "<tr>";
					table     += "<td style='display: block;width: 40px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>" + this.data[i].item_id + "</td>";
					table     += "<td colspan='4'>" + this.data[i].item_name + "</td>";
					table     += "</tr>";

					if(this.data[i].item_category != "Produk"){
						table += "<tr>";
						table += "<td></td>";
						table += "<td colspan='4'>" + this.data[i].item_handler + "</td>";
						table += "</tr>";
					}

					table     += "<tr>";
					table     += "<td></td>";
					table     += "<td>" + this.data[i].item_qty + "</td>";
					table     += "<td> x </td>";
					table     += "<td style='text-align:right'>" + formatRupiah(this.data[i].item_price.toString()) + "</td>";
					table     += "<td>: " + formatRupiah((this.data[i].item_price * this.data[i].item_qty).toString()) + "</td>";
					table     += "<tr>";
					overall   += (this.data[i].item_price * this.data[i].item_qty);
				}

				// sub total
				table += "<tr>";
				table += "<td colspan='4' style='text-align:right'>Sub Total</td>";
				table += "<td>: " + formatRupiah(overall.toString()) + "</td>";
				table += "</tr>";

				// diskon
				table += "<tr>";
				table += "<td colspan='4' style='text-align:right'>Diskon (" +  ((disc / overall) * 100) + "%)</td>";
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

