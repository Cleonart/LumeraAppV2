<template>
	<div>
		<div class="card shadow bg-default" style="height:600">
			<div class="card-header border-0 bg-transparent">
				<div class="row align-items-center">
					<div class="col">
						<h3 class="mb-0 text-white">
							Checkout
							<p style="margin-bottom:0px;font-size:12px;font-weight:bold;margin-top:5px;">Atas Nama : {{name}}</p>
						</h3>
					</div>
				</div>
			</div>
			<div class="table-responsive pb-2" style="height:320px;">
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
						<td style="display:flex">
							<base-button @click="removeItem(row.item_id)" type="danger" icon="ni ni-fat-remove" style="height:37px;width:37px;padding-left:10px"></base-button>
							<div class="align-items-center"> {{row.item_name}}<br/>
								<span v-if="row.item_category != 'Produk'" style="opacity:0.5;font-size:12px">oleh {{row.item_handler}}</span>
								<span v-if="row.item_category == 'Produk'" style="opacity:0.5;font-size:12px">Produk Kecantikan</span>
							</div>
						</td>
						<td>
							<input  class="pt-1 pl-2 pb-1 pr-0 input_number" 
									type="number"
									disabled 
									v-model="row.item_qty"
									max="10"/>
							<span class="number_arrow_button" style="cursor:pointer">
								<i @click="row.item_qty++" class="ni ni-bold-up ml-1 mr-1 up"></i>
								<i @click="row.item_qty--" class="ni ni-bold-down down"></i>
							</span>
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
					<div class="col-sm-6 text-right">{{formatRupiah(subTotal)}}</div>
				</div>

				<div class="row pl-4 pr-4 mb-1 mt-3">
					<div class="col-sm-6">Diskon ({{percentage_disc}}%)<br/><span style="opacity:0.5;font-size:12px">Persentase Diskon</span></div>
					<div class="col-sm-6 text-right text-success">
						<input  type="text" 
								class="form-control pt-0 pb-0 text-white" 
								v-model="disc"
								style="height:35px;background-color:#1c345d;border:none">
					</div>
				</div>

				<!-- pajak disembunyikan 
				<div class="row pl-4 pr-4 mb-1">
					<div class="col-sm-6">Pajak</div>
					<div class="col-sm-6 text-right text-danger">+ {{formatRupiah(tax)}}</div>
				</div>-->

				<!-- switch pembayaran -->
				<div class="row pl-4 pr-4 mb-1 mt-3">
					<div class="col-sm-6">Switch<br/><span style="opacity:0.5;font-size:12px">Metode Pembayaran</span></div>
					<div class="col-sm-6 text-right text-danger">
						<select v-model="transaction_switch" class="form-control pt-0 pb-0 text-white" style="height:35px;background-color:#1c345d;border:none">
							<option>Tunai</option>
							<option>Kartu Debit</option>
						</select>
					</div>
				</div>

				<div class="row pl-4 pr-4 mt-3 mb-4">
					<div class="col-sm-6" style="font-size:23px;"><b>Total</b>({{tableData.length}})</div>
					<div class="col-sm-6 text-right" style="font-size:23px;">{{formatRupiah(total)}}</div>
				</div>
			</div>
			<div class="container" style="margin-top:0px;padding-left:35px;padding-right:35px;margin-bottom:20px;margin-top:-10px">
				<div class="row">
					<base-button v-if="status != '200'" class="col" type="primary mt-2" @click="checkout('fixed')"><i class="ni ni-money-coins mr-2"></i>Bayar</base-button>
					<base-button v-if="status != '200'"  class="col" type="success mt-2" @click="checkout('update')">Simpan</base-button>
					<base-button class="col" type="danger mt-2">Kembali</base-button>
				</div>
			</div>
		</div>
	</div>
</template>

<style type="text/css">

	.input_number{
		padding-right: 0;
		width:30px;
		text-align:center;
		border-radius:5px;
		border:none;
		background-color:#1c345d;
		color:#fff;
		-webkit-user-select: none;
        -webkit-touch-callout: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
	}

	.number_arrow_button .up, .number_arrow_button .down{
		transition: all 0.1s ease;
	}

	.number_arrow_button .up:hover{
		transform: scale(1.05);
		color: #2ecc71
	}

	.number_arrow_button .down:hover{
		transform: scale(1.05);
		color: #e74c3c
	}

</style>
	
<script> 

	import {baseURL, formatRupiah, showLoading} from '../../../functions/universal.js';
	const axios = require('axios');

	export default{
		name : 'posCheckout',
		props : ['id', 'name', 'status'],
		data(){
			return{
				tableData : [],
				subTotal : 0,
				total    : 0,
				tax      : 0,
				disc     : 0,
				percentage_disc : 0,
				transaction_switch   : "Tunai"
			}
		},

		watch : {
			tableData : {
				handler:function (value) {
					this.total = 0;
					this.subTotal = 0;
					for(var i = 0; i < this.tableData.length;i++){
						console.log(value);
						if(this.tableData[i].item_category == "Produk"){
							if(this.tableData[i].item_qty >= this.tableData[i].item_stock){
								this.tableData[i].item_qty = this.tableData[i].item_stock;
							}
						}

						if(this.tableData[i].item_qty == 0){
							this.tableData.splice(i, 1);
						}
						else{
							this.subTotal += this.tableData[i].item_price * this.tableData[i].item_qty;
						}
					}
					this.total = this.subTotal + this.tax - this.disc;
					this.percentage_disc = (this.disc / this.subTotal) * 100;
				},
				deep:true
			},

			disc : function(val){
				if(val > this.subTotal){
					alert("diskon tidak bisa lebih tinggi dari total");
					this.disc = this.subTotal;
				}
				else{
					this.total = this.subTotal - val;
					this.percentage_disc = (this.disc / this.subTotal) * 100;
				}
			}

		},

		methods : {

			checkout : function(mode) {
				var app = this;
				let url = baseURL + "/lumeraAPI/pos_purchase/transactionSave.php";
				let transaction_id = this.id;
				let transaction_amount = this.total;
				
				const json_data = JSON.stringify({
					transaction_body : { 
						transaction_id           : transaction_id,
						transaction_amount       : transaction_amount,
						transaction_mode         : mode,
						transaction_name         : app.name,
						transaction_created_date : "",
						transaction_updated_date : "",
						transaction_fixed_date   : "",
						transaction_status       : "",
						transaction_disc         : app.disc,
						transaction_switch		 : app.transaction_switch
					},
					transaction_items : app.tableData
				});

				// validate checkout items
				// keranjang kosong
				if(this.tableData.length == 0){
					this.$swal.fire("Checkout kosong", 
									"Tidak bisa menyimpan transaksi karena tidak ada item yang dipilih", 
									"error");
					return 0;
				}

				// keranjang ada item
				else{
					let title = "";
					let text  = "";
					let confirmText = "";

					if(mode == "fixed"){
						title = "Anda yakin akan melakukan pembayaran transaksi ini?";
						text  = "Transaksi akan dicatat setelah pembayaran dikonfirmasi, perubahan data sudah tidak bisa dilakukan setelah proses ini";
						confirmText = "Ya, Bayar";

						// jika tunai maka jangan lupa uang kembalian
						if(app.transaction_switch == 'Tunai'){
							this.$swal.fire({
								title : "Jumlah bayar",
								text : "Total Pembayaran " +  app.formatRupiah(app.total),
								icon : "warning",
								input: 'text',
								inputLabel: 'Nominal Bayar',
								inputPlaceholder: '0',
								showCancelButton: true,
								inputValidator : (value) => {
									let pay_amount = parseInt(value);
									
									if(pay_amount != undefined && pay_amount != ''){

										if(pay_amount < app.total){
											return "Jumlah pembayaran kurang";
										}

										axios.post(url, json_data)
											.then(function(response){
												console.log(response);
												app.$swal.fire("Pembayaran Berhasil", "Uang kembalian : " + (pay_amount - app.total), "success");
											})
											.catch(function(error){
												console.log(error);
											})
									}
									else{
										return "Jumlah pembayaran harus diisi";
									}
								}
							})
						}
					}

					else if(mode == "update"){
						title = "Anda yakin akan menyimpan transaksi ini?";
						text  = "Transaksi masih dapat dirubah sesuai dengan kebutuhan";
						confirmText = "Ya, Simpan";

						// payment confirmation
						this.$swal.fire({
							title: title,
							text: text,
							icon: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#5e72e4',
							cancelButtonColor: '#d33',
							confirmButtonText: confirmText
						}).then((result) => {
							if (result.isConfirmed) {
								showLoading(this.$swal);
								app.sendCheckoutToServer(url, json_data);
							}
						})
					}
				}
			},

			cancel : function () {
				
			},

			sendCheckoutToServer : function (url, json_data) {
				let app = this;
				axios.post(url, json_data)
					.then(function(response){
						console.log(response);
						app.$swal("Proses Berhasil", "Transaksi dan Perubahan data berhasil dilakukan", "success");
					})
					.catch(function(error){
						console.log(error);
					})
			},

			addToCheckout : function (value) {

				for(var i = 0; i < this.tableData.length; i++){
					if(value.item_id == this.tableData[i].item_id){

						if(value.item_category == 'Produk'){
							this.tableData[i].item_qty = parseInt(this.tableData[i].item_qty) + 1;
							return "SAME_ID";
						}

						else{
							if(value.item_handler == this.tableData[i].item_handler){
								this.tableData[i].item_qty = parseInt(this.tableData[i].item_qty) + 1;
								return "SAME_ID_AND_HANDLER";
							}
							else{
								break;
							}
						}
						
					}
				}

				let handler;
				let handler_id = null;
				let handler_name = null;
				if(value.item_handler != undefined && value.item_handler != "undefined"){
					handler = value.item_handler.split(".");
					handler_id = handler[0];
					handler_name = handler[1];
				}

				this.tableData.push({
					item_id    : value.item_id,
					item_name  : value.item_name,
					item_qty   : 1,
					item_stock : value.item_stock,
					item_price : value.item_price,
					item_category : value.item_category,
					item_handler_id : handler_id,
					item_handler : handler_name
				});

				return "SUCCESS";
			},

			replaceItems : function(items, disc, switch_data){
				this.tableData = items;
				this.disc = disc;
				this.transaction_switch = switch_data;
			},

			removeItem : function(id) {
				var app = this;

				this.$swal.fire({
					title: 'Hapus item?',
					text: "Anda yakin akan menghapus item dari checkout?",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#5e72e4',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Ya, Hapus'
				}).then((result) => {
					if (result.isConfirmed) {
						app.$swal.fire('Berhasil Dihapus','Item berhasil dihapus dari checkout','success');
						for(var i = 0; i < this.tableData.length; i++){
							if(id == this.tableData[i].item_id){
								this.tableData.splice(i, 1);
								break;
							}
						}
					}
				})
				
			},

			formatRupiah :function (value) {
				return formatRupiah(String(value), "Rp.");
			},
		}
	}
</script>