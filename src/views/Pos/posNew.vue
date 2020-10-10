<template>
	<div class="container p-5">
		<div class="row">
			<div class="col-lg-6">
				<h2>Buat Transaksi Baru</h2>
				<badge type="warning mr-2">Transaksi Baru</badge>
				<badge type="primary">{{id}}</badge>

				<div class="card shadow mt-4">
					<div class="card-header border-0">
						<div class="row align-items-center">
							<div class="col">
								<h3 class="mb-0">
									Daftar PRD/SER
								</h3>
							</div>
							<div class="col text-right">
								<select class="form-control" v-model="selectBar">
									<option selected disabled>-PILIH-</option>
									<option>Layanan Klinik</option>
									<option>Layanan Salon</option>
									<option>Produk</option>
								</select>
							</div>
						</div>
						<hr class="mt-3 mb-3">
						<base-input v-model="searchBar" 
									placeholder="Cari disini.."
									addon-left-icon="ni ni-zoom-split-in"
									class="mb-0"></base-input>
					</div>
					<div class="table-responsive pb-2">
						<base-table class="table align-items-center table-flush"
									thead-classes="thead-light"
									tbody-classes="list"
									:data="tableData">
							<template slot="columns">
								<th>Nama PRD/SER</th>
								<th>Harga</th>
								<th v-if="selectBar == 'Produk'">Stok</th>
							</template>
							<template slot-scope="{row}">
								<td>{{row.item_name}}</td>
								<td>{{row.item_qty}}</td>
							</template>
						</base-table>
					</div>
				</div>
			</div>
			<div class="col-lg-6">
				<posCheckout></posCheckout>
			</div>
		</div>
	</div>
</template>

<script>
	
	import {generateId} from '../../functions/universal.js';
	import posCheckout from './Components/posCheckout';
	//const axios = require('axios');
	
	export default {
		name: 'projects-table',
		data(){
			return{
				id : '',
				selectBar : 'Layanan Salon',
				searchBar : ''
			}
		},

		created(){
			this.id = generateId("LMR");
		},

		computed: {
			/*filteredData() {
				/*
				return this.Masterdata.raw_data.filter(tableData => {
					let data = tableData[this.settings.search_index].data.toLowerCase().includes(this.search.toLowerCase()); 
					return data;
				})
			}*/
		},

		components: {
			posCheckout
		}
	}

</script>