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
						<td>{{row.item_qty}}</td>
						<td>{{formatRupiah(row.item_price)}}</td>
						<td>{{formatRupiah(row.item_price * row.item_qty)}}</td>
					</template>
				</base-table>
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
				tableData : [
					{
						item_id   : "tes",
						item_name : "name",
						item_qty  : 1,
						item_price : 10000
					},
					{
						item_id   : "tes",
						item_name : "Sanitizer",
						item_qty  : 3,
						item_price : 10000
					},
				]
			}
		},

		methods : {
			formatRupiah :function (value) {
				return formatRupiah(String(value), "Rp.");
			},
		}
	}
</script>