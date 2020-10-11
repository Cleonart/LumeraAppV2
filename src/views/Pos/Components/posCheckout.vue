<template>
	<div>
		<div class="card shadow bg-default" style="height:525px">
			<div class="card-header border-0 bg-transparent">
				<div class="row align-items-center">
					<div class="col">
						<h3 class="mb-0 text-white">
							Checkout
						</h3>
					</div>
				</div>
			</div>
			<div class="table-responsive pb-2" style="height:310px;">
				<base-table class="table align-items-center table-flush table-dark"
							thead-classes="thead-dark text-white"
							tbody-classes="list"
							:data="tableData">
					<template slot="columns">
						<th>Nama PRD/SER</th>
						<th>Jumlah</th>
						<th>Sub Total</th>
						<th>Total</th>
					</template>
					<template slot-scope="{row}">
						<td>{{row.item_name}}<br/><span v-if="row.item_category != 'Produk'"
														style="opacity:0.5;font-size:12px">oleh {{row.item_handler}}</span></td>
						<td>
							<input  class="pt-1 pb-1 pr-0" 
									style="width:50px;text-align:center;border-radius:5px;border:none"
									type="number"
									v-model="row.item_qty"
									max="10"/>
						</td>
						<td>{{formatRupiah(row.item_price)}}</td>
						<td>{{formatRupiah(row.item_price * row.item_qty)}}</td>
					</template>
				</base-table>
				<p v-if="tableData.length == 0"
							style="font-weight:bold;text-align:center;"
							class="mt-4 mb-3">Checkout kosong :(</p>
			</div>

			<div style="color:#fff;opacity:0.97;-webkit-font-smoothing: antialiased;font-size:14.5px;">

				<div class="row pl-4 pr-4 mb-1 mt-3">
					<div class="col-sm-6">Sub Total</div>
					<div class="col-sm-6 text-right">Rp. 0.00</div>
				</div>

				<div class="row pl-4 pr-4 mb-1">
					<div class="col-sm-6">Diskon</div>
					<div class="col-sm-6 text-right">Rp. 0.00</div>
				</div>

				<div class="row pl-4 pr-4 mb-1">
					<div class="col-sm-6">Pajak</div>
					<div class="col-sm-6 text-right">Rp. 0.00</div>
				</div>

				<div class="row pl-4 pr-4 mt-3 mb-4">
					<div class="col-sm-6" style="font-size:23px;"><b>Total</b>({{tableData.length}})</div>
					<div class="col-sm-6 text-right" style="font-size:23px;">{{total}}</div>
				</div>

			</div>

		</div>
	</div>
</template>

<script> 

	import {formatRupiah} from '../../../functions/universal.js';

	export default{
		name : 'posCheckout',
		data(){
			return{
				tableData : [],
				subTotal : 0,
				total    : 0,
			}
		},

		methods : {
			
			addToCheckout : function (value) {
				var data = this.tableData;
				data.push({
					item_id    : value.item_id,
					item_name  : value.item_name,
					item_qty   : 1,
					item_price : value.item_price,
					item_category : value.item_category,
					item_handler : value.item_handler
				});

				for(var i = 0; i < data.length; i++){
					this.total += data[i].item_price * data[i].item_qty;
				}

				this.tableData = data;
				console.log(data);
			},

			formatRupiah :function (value) {
				return formatRupiah(String(value), "Rp.");
			},
		}
	}
</script>