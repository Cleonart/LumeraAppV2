<template>
	<div>
		<div class="card shadow bg-default">
			<div class="card-header border-0 bg-transparent">
				<div class="row align-items-center">
					<div class="col">
						<h3 class="mb-0 text-white">
							Checkout
						</h3>
					</div>
				</div>
			</div>
			<div class="table-responsive pb-2">
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
						<td>{{row.item_name}}</td>
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
		</div>
	</div>
</template>

<script> 

	import {formatRupiah} from '../../../functions/universal.js';

	export default{
		name : 'posCheckout',
		data(){
			return{
				tableData : []
			}
		},

		methods : {
			
			addToCheckout : function (value) {
				var data = this.tableData;
				data.push({
					item_id    : value.item_id,
					item_name  : value.item_name,
					item_qty   : 1,
					item_price : value.item_price
				});
				console.log(data);
			},

			formatRupiah :function (value) {
				return formatRupiah(String(value), "Rp.");
			},
		}
	}
</script>