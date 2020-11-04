<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-2 pt-md-6">
            <div class="row" style="margin-bottom:-10px;">
              <div class="col">
                <span class="text-white" style="font-size:12.8px;"><b>Tanggal Awal</b></span>
                <base-input addon-left-icon="ni ni-calendar-grid-58" class="mt-1">
                  <flat-picker slot-scope="{focus, blur}"
                        style="background-color:#fff;"
                        :config="{dateFormat:'Y-m-d'}"
                        @on-open="focus"
                        @on-close="blur"
                        v-model="start_date"
                        class="form-control datepicker">
                  </flat-picker>
                </base-input>
              </div>
              <div class="col">
                <span class="text-white" style="font-size:12.8px;"><b>Tanggal Akhir</b></span>
                 <base-input addon-left-icon="ni ni-calendar-grid-58" class="mt-1">
                  <flat-picker slot-scope="{focus, blur}"
                        style="background-color:#fff;"
                        :config="{dateFormat:'Y-m-d'}"
                        @on-open="focus"
                        @on-close="blur"
                        v-model="end_date"
                        class="form-control datepicker">
                  </flat-picker>
                </base-input>
              </div>
            </div>

            <!-- Card stats -->
            <div class="row">
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Pendapatan"
                                type="gradient-red"
                                :sub-title="formatRupiah(overview_data.total)"
                                class="mb-4 mb-xl-0">
                        <template slot="footer">
                            <span class="text-nowrap">Total Pendapatan</span>
                        </template>
                    </stats-card>
                </div>
                
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Transaksi"
                                type="gradient-green"
                                :sub-title="overview_data.total_transaksi"
                                icon="ni ni-money-coins"
                                class="mb-4 mb-xl-0">
                        <template slot="footer">
                            <span class="text-nowrap">Total Transaksi</span>
                        </template>
                    </stats-card>
                </div>

                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Produk"
                                type="gradient-orange"
                                sub-title="2,356"
                                icon="ni ni-chart-pie-35"
                                class="mb-4 mb-xl-0">
                        <template slot="footer">
                            <span class="text-nowrap">Penjualan produk kecantikan</span>
                        </template>
                    </stats-card>
                </div>
                
                <div class="col-xl-3 col-lg-6">
                    <stats-card title="Performance"
                                type="gradient-info"
                                sub-title="49,65%"
                                icon="ni ni-chart-bar-32"
                                class="mb-4 mb-xl-0"
                    >

                        <template slot="footer">
                            <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 54.8%</span>
                            <span class="text-nowrap">Since last month</span>
                        </template>
                    </stats-card>
                </div>
            </div>
        </base-header>

        <!--Charts-->
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-12 mb-2 mb-xl-0">
                    <card type="default" header-classes="bg-transparent">
                        <div slot="header" class="row align-items-center">
                            <div class="col">
                                <h6 class="text-light text-uppercase ls-1 mb-1">Overview | <span>{{start_date}} - {{end_date}}</span></h6>
                                <h5 class="h3 text-white mb-0">Nilai Transaksi  </h5>
                            </div>
                            <div class="col">
                              <!--
                                <ul class="nav nav-pills justify-content-end">
                                    <li class="nav-item mr-2 mr-md-0">
                                        <a class="nav-link py-2 px-3"
                                           href="#"
                                           :class="{active: bigLineChart.activeIndex === 0}"
                                           @click.prevent="initBigChart(0)">
                                            <span class="d-none d-md-block">Month</span>
                                            <span class="d-md-none">M</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link py-2 px-3"
                                           href="#"
                                           :class="{active: bigLineChart.activeIndex === 1}"
                                           @click.prevent="initBigChart(1)">
                                            <span class="d-none d-md-block">Week</span>
                                            <span class="d-md-none">W</span>
                                        </a>
                                    </li>
                                </ul>
                              -->
                            </div>
                        </div>
                        <line-chart
                                :height="350"
                                ref="bigChart"
                                :chart-data="bigLineChart.chartData"
                                :extra-options="bigLineChart.extraOptions">
                        </line-chart>
                    </card>
                </div>
              </div>
        </div>

        <button @click="print('TRX11212', 10000, item_data)">Print</button>
        <Receipt ref="rec"></Receipt>

    </div>
</template>
<script>

  // Charts
  import * as chartConfigs from '@/components/Charts/config';
  import LineChart from '@/components/Charts/LineChart';
  import Receipt from './Pos/receipt.vue';

  // universal
  import {baseURL, getTodayDateUniv, formatRupiah} from '../functions/universal.js';

  // date
  import flatPicker from "vue-flatpickr-component";
  import "flatpickr/dist/flatpickr.css";

  // axios
  const axios = require('axios');

  export default {
    components: {
      LineChart,
      flatPicker,
      Receipt
    },
    data() {
      return {
        item_data : [
          {
            id     : '11212',
            name   : 'Lemonilo',
            qty    : 1,
            type   : "Klinik",
            handle : "Michael Rockefeler",
            price  : 10000 
          },
          {
            id     : '11212',
            name   : 'Lemonilo',
            qty    : 1,
            type   : "Klinik",
            handle : "Michael Rockefeler",
            price  : 2000 
          },
          {
            id    : '11214',
            name  : 'Lemonila',
            qty   : 200,
            type  : "Produk",
            price : 1000000 
          }
        ], 
        start_date : '',
        end_date : '',
        overview_data : {
            total : 0,
            total_transaksi : 0,
        },

        bigLineChart: {
          allData: [
            [0, 20, 10, 30, 15, 40, 20, 60, 60],
            [2000, 24, 35, 46 , 5, 6, 7, 8, 9],
          ],
          activeIndex: 0,
          chartData: {
            datasets: [],
            labels: [],
          },
          extraOptions: chartConfigs.blueChartOptions,
        },
        redBarChart: {
          chartData: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'Sales',
              data: [25, 20, 30, 22, 17, 29]
            }]
          }
        }
      };
    },
    methods: {
      initBigChart(index) {
        let chartData = {
          datasets: [
            {
              label: 'Performance',
              data: this.bigLineChart.allData[index]
            }
          ],
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        };
        this.bigLineChart.chartData = chartData;
        this.bigLineChart.activeIndex = index;
      },

      formatRupiah : function(value) {
        return formatRupiah(value.toString(), "Rp. ");
      },

      print : function (transaction_id, transaction_disc, transaction_item) {
        this.$refs.rec.print(transaction_id, transaction_disc, transaction_item);
      },

      getReportData : function(){
        let app = this;
        let url = baseURL + "/lumeraAPI/report/get.php?start_date=" + this.start_date + "&end_date=" + this.end_date;
        axios.get(url)
              .then(function(response){
                console.log(response);
                app.bigLineChart.chartData = response.data.chart_data;
                app.overview_data.total    = response.data.total;
                app.overview_data.total_transaksi = response.data.total_transaksi;
              })
              .catch(function(error){
                console.log(error);
              })
        }

    },

    watch : {
        start_date : function(val){
          this.getReportData();
          console.log(val);
        },

        end_date : function(val) {
          this.getReportData();
          console.log(val);
        }
    },

    mounted() {
      this.start_date = getTodayDateUniv();
      this.end_date   = getTodayDateUniv();
      this.getReportData();
    }
  };
</script>
<style></style>
