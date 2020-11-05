<template>
	<div class="container p-5">
		<div class="row">
			<div class="col-lg-7">
				<h2>Buat Transaksi Baru</h2>
				<badge type="warning mr-2" v-if="$route.params.id = 'new'">Transaksi Baru</badge>
				<badge type="primary">{{id}}</badge>

				<div class="card shadow mt-4">
					<div class="card-header border-0">
						<div class="row align-items-center">
							<div class="col">
								<h3 class="mb-0">
									Daftar {{title}}
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
									:data="filteredData">
							<template slot="columns">
								<th>Nama {{title}}</th>
								<th>Harga</th>
								<th v-if="selectBar == 'Produk'">Stok</th>
								<th>Aksi</th>
							</template>
							<template slot-scope="{row}">
								<td><b>{{row.item_name}}</b></td>
								<td>{{formatRupiah(row.item_price)}}</td>
								<td v-if="selectBar == 'Produk'">{{row.item_stock}}</td>
								<td>
									<base-button type="primary" icon="ni ni-fat-add" style="height:37px;width:37px;padding-left:10px"
									@click="addToCheckout(row)"></base-button>
								</td>
							</template>
						</base-table>
						<p v-if="filteredData.length == 0"
							style="font-weight:bold;text-align:center;opacity:0.7"
							class="mt-4 mb-3">Item tidak ditemukan :(</p>
					</div>

				</div>

			</div>
			
			<div class="col-lg-5">
				<posCheckout 	:name="name" 
								:status="status" 
								:id="id"
								ref="posCheckout"></posCheckout>
			</div>
		</div>

		<div>
          <base-button type="primary" @click="modals.modal0 = true">Launch demo modal</base-button>
          <Modal @close="setName()" :show.sync="modals.modal0">
            <h2 class="mb-0 mt-0">Masukan Nama Pelanggan</h2>
            <small class="text-muted mb-2">Ketik atau pilih nama pelanggan pada kotak di bawah ini</small>
            <v-select v-on:keyup.enter="setName" v-model="name_modal" push-tags taggable class="mt-3" :options="customerNames"></v-select>
			<base-alert class="mt-1" v-if="error.customer" type="danger"><strong>Perhatian</strong> Anda harus mengisi nama pelanggan untuk melanjutkan</base-alert>
			<input @click="setName()" type="button" class="mt-2 btn btn-primary" value="Simpan" />
			<input @click="cancel()" type="button" class="mt-2 btn btn-danger" value="Kembali ke Dashboard" />
          </Modal>
        </div>

	</div>
</template>

<script>
	
	import {generateId, baseURL, formatRupiah, showLoading, hideLoading} from '../../functions/universal.js';
	import posCheckout from './Components/posCheckout';
	import Modal from '../../components/Modal';
	const axios = require('axios');
	
	export default {
		name: 'projects-table',
		data(){
			return{

				modals : {
					modal0 : false
				},

				error : {
					customer : false
				},
				customerNames : [],
				title : '',
				id : '',
				status : '',
				name : '',
				name_modal : '',
				selectBar : 'Layanan Salon',
				searchBar : '',
				itemData : [],
				staffData : []
			}
		},

		methods : {
			
			addToCheckout : function (value) {

				var app = this;

				if(value.item_category == "Produk"){
					this.$swal.fire({
						title: 'Tambahkan ke Checkout?',
						text: "Tambahkan item " + value.item_name + " ke Checkout",
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#5e72e4',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Ya, Tambahkan'
					}).then((result) => {
						if (result.isConfirmed) {
							app.$swal.fire('Berhasil Ditambahkan','Item berhasil ditambahkan ke dalam checkout',
								'success'
								);
							app.$refs.posCheckout.addToCheckout(value);
						}
					})
				}

				else{
					var staff = [];
					for(var i = 0; i < this.staffData.length; i++){
						staff[i] = this.staffData[i].staff_id + "." + this.staffData[i].staff_name;
					}

					this.$swal.fire({
						title: 'Pilih Sytlist/Clinician',
						input: "select",
						inputOptions: staff,
						inputPlaceholder: 'Silahkan pilih disini',
						showCancelButton: true,
					}).then(function (result) {
						if(result.value != undefined && result.value != ""){
							value.item_handler = staff[result.value];
							app.$refs.posCheckout.addToCheckout(value);
							app.$swal.fire('Berhasil Ditambahkan','Item berhasil ditambahkan ke dalam checkout','success');
						}
						
					})
				}
			},

			getExistingTransaction : function(id="new"){
				var app = this;
				let url = "";

				// new transaction
				if(id == 'new'){
					url = baseURL + "/lumeraAPI/pos_purchase/getTransactionSalesById.php";
				}

				// recent transaction
				else{
					url = baseURL + "/lumeraAPI/pos_purchase/getTransactionSalesById.php?id=" + id;
				}

				axios.get(url)
					.then(function(response) {
						console.log(response);
						app.itemData = response.data.embed_item;
						app.staffData = response.data.embed_staff;
						app.customerNames = response.data.embed_name;
						if(id != 'new'){
							app.id = response.data.transaction_data.transaction_id;
							app.name = response.data.transaction_data.transaction_name;
							app.status = response.data.transaction_data.transaction_status;
							let items = response.data.transaction_data.transaction_items;
							let disc  = response.data.transaction_data.transaction_disc;
							let transaction_switch = response.data.transaction_data.transaction_switch;
							app.$refs.posCheckout.replaceItems(items, disc, transaction_switch);
							hideLoading(app.$swal);
						}			
					})
					.catch(function(error) {
						console.log(error);
					})
			},

			formatRupiah : function (value) {
				return formatRupiah(value, "Rp. ");
			},

			setName : function(){
				
				if(this.name_modal == ""){
					this.modals.modal0 = true;
					this.error.customer = true;
				}
				else{
					this.name = this.name_modal.toUpperCase();
					this.modals.modal0 = false;
					this.error.customer = false;
				}

			},

			cancel : function(){
				this.modals.modal0 = false;
				this.$router.replace('/');
			},

			onMounted : function () {
				var app = this;
				showLoading(this.$swal);

				let id   = this.$route.params.id;
				let type = this.$route.params.type;
				
				// jika transaksi baru
				if(id == "new"){
					this.getExistingTransaction();
					this.$swal.fire({
						title: 'Transaksi Atas Nama',
						text : "Silahkan memasukan nama pelanggan disini..",
						input: 'text',
						inputLabel: 'Nama Pelanggan',
						inputPlaceholder: 'Nama Pelanggan',
						showCancelButton:true,
						allowOutsideClick : false,
					}).then(function(result){

						if(result.value != undefined && result.value != ''){
							app.id = generateId(type.toUpperCase());
							app.name = result.value.toUpperCase();
						}

						else{
							app.$swal.fire({
								title: 'Batalkan Transaksi',
								text: "Anda yakin ingin membatalkan transaksi",
								icon: 'warning',
								showCancelButton: true,
								confirmButtonColor: '#d33',
								cancelButtonColor: '#5e72e4',
								confirmButtonText: 'Batalkan',
								cancelButtonText: 'Lanjutkan Transaksi'
							}).then((result) => {
								if (result.isConfirmed) {
									app.$router.replace('/admin/Transaksi');
								}
								else{
									app.onMounted();
								}
							})
						}	
					});
				}

				// jika transaksi merupakan transaksi lama
				else{
					app.getExistingTransaction(id);
				}
			}

		},

		watch : {
			'$route.params.type': function (val) {
				this.id = generateId(val.toUpperCase());

				if(val == "trx"){
					this.title = "PRD/SER";
				}

				else if(val == "inv"){
					this.title = "Inventaris"
				}
				this.onMounted();
			}
		},

		created(){
			this.onMounted();
		},

		computed: {
			filteredData() {
				return this.itemData.filter(itemData => {
					if(this.selectBar == itemData.item_category){
						let data = itemData.item_name.toLowerCase().includes(this.searchBar.toLowerCase()); 
						return data;
					}
				})
			}
		},

		components: {
			posCheckout,
			Modal
		}
	}

</script>