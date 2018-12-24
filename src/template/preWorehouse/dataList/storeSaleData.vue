<template>
	<div class="dataWrap">
		<x-header class="vux-1px-b">门店销售数据</x-header>
		<div class="dataList-content contentWrap">
			<tab v-model="indexTab" active-color='#3DA5FE' style="z-index: 9;">
				<tab-item>日报</tab-item>
				<tab-item>周报</tab-item>
				<tab-item>月报</tab-item>
			</tab>
			<div class="scroll-content" style="top: 83px;z-index: 0;">
				<swiper v-model="indexTab" height="600px" :show-dots='false' @on-index-change="changeTab">
					<swiper-item>
						<div class="tab-swiper vux-center">
							<div class="dataList-info">
								<div class="data-total-wrap">
									<dl class="summary-sale sumary-sale-tab">
										<picker-data-item :index='indexTab' v-model="time" @changeTime="changetime"></picker-data-item>
									</dl>
									<dl class="sumary-sale-tab">
										<dt class="summary-title">销售总额（元）</dt>
										<dd><strong class="summary-data">{{dataObj.totalSales}}</strong></dd>
									</dl>
								</div>
								<sales-common v-if="dataObj" :data="dataObj"></sales-common>
							</div>
						</div>
					</swiper-item>
					<swiper-item>
						<div class="tab-swiper vux-center">
							<div class="tab-swiper vux-center">
								<div class="dataList-info">
									<div class="data-total-wrap">
										<dl class="summary-sale">
											<picker-data-item @changeTime="changetime" :index='indexTab' v-model="weekTime"></picker-data-item>
										</dl>
										<div class="summary-sale">
											<dl>
												<dt class="summary-title">销售总额（元）</dt>
												<dd><strong class="summary-data">{{dataObj.totalSales}}</strong></dd>
											</dl>
										</div>
									</div>
									<sales-common v-if="dataObj" :data="dataObj"></sales-common>
								</div>
							</div>
						</div>
					</swiper-item>
					<swiper-item>
						<div class="tab-swiper vux-center">
							<div class="dataList-info" v-if="indexTab==2">
								<div class="data-total-wrap">
									<dl class="summary-sale">
										<!--<picker-data-item datetime="datetime" @changeTime="changetime" :index='indexTab'></picker-data-item>-->
										<picker-data-item :index='indexTab' v-model="monthTime" @changeTime="changetime"></picker-data-item>
									</dl>
									<div class="summary-sale">
										<dt class="summary-title">销售总额（元）</dt>
										<dd><strong class="summary-data">{{dataObj.totalSales}}</strong></dd>
									</div>
								</div>
								<sales-common v-if="dataObj" :data="dataObj"></sales-common>
							</div>
						</div>
					</swiper-item>
				</swiper>
			</div>
		</div>
	</div>
</template>

<script>
	import { XHeader, Tab, TabItem, Swiper, SwiperItem, Group, Cell } from 'vux';
	import $request from '@/service/request';
	import CONFIG from 'configuration';
	import func from '@/func'
	import PickerDataItem from './component/selectData.vue'
	import SalesCommon from './component/salesCommon.vue'
	export default {
		components: {
			XHeader,
			Tab,
			TabItem,
			PickerDataItem,
			SalesCommon,
			Swiper,
			Group,
			Cell,
			SwiperItem

		},
		computed: {
			costName() {
				return localStorage.getItem("costName")
			}
		},
		data() {
			return {
				indexTab: 0,
				list2: [1, 2, 3],
				type: 1,
				time: new Date().format("YYYY-MM-dd"),
				weekTime: new Date(),
				monthTime: new Date().format("YYYY-MM"),
				dataObj: {
					totalSales: 0,
					refundedOrders: 0,
					refundedAmount: 0,
					payedOrders: 0,
					ordersAveragePrice: 0
				},
			}
		},
		created() {
			this.time = new Date().format("YYYY-MM-dd");
			let obj = {
				beginDate: new Date().format("YYYY-MM-dd"),
				endDate: new Date().format("YYYY-MM-dd")
			}
			this.getData(obj)
		},
		methods: {
			getData(obj) {
				Object.keys(this.dataObj).forEach(n => {
					this.dataObj[n] = ''
				})
				$request.post(CONFIG.reportUrl + "/api/online-order-report/v1/protected/sales", obj).then(res => {
					if(res.success == true) {
						this.dataObj = { ...this.dataObj,
							...res.data
						}
					}else{
						this.$vux.toast.show({
							type:'text',
							text:res.message
						})
					}
				})
			},
			changetime(val) {
				let obj = {
					beginDate: this.time,
					endDate: this.time
				}
				if(this.indexTab == 1) { //周选择器
					obj = {
						beginDate: val.split("~")[0],
						endDate: val.split("~")[1]
					}
				} else if(this.indexTab == 2) {
					obj = {
						beginDate: this.monthTime,
						endDate: this.monthTime
					}
				}
				this.getData(obj)
			},
			changeTab(index) {
				this.indexTab=index
				let obj = {
					beginDate: this.time,
					endDate: this.time
				}
				if(this.indexTab == 1) { //周选择器
					obj = {...func.getThisWeek(this.weekTime)
					};
				} else if(this.indexTab == 2) {
					obj = {
						beginDate: this.monthTime,
						endDate: this.monthTime
					}
				}
				this.getData(obj)
			},
		}

	}
</script>

<style lang="less">
	.palte-title-info {
		span:nth-child(1) {
			color: #666666;
		}
		span:nth-child(2) {
			color: #333333;
		}
	}
	
	.vux-slider>.vux-swiper {
		overflow: scroll;
	}
	
	.dif-plate {
		padding-top: 10px;
	}
	
	.summary-Thumbnail {
		background: #FFFFFF;
		margin-top: 10px;
	}
	
	.pay-total {
		padding-top: 0px;
		background: url(../../../assets/pre/data/pa_total.svg) top center no-repeat;
		margin-top: 20px;
	}
	
	.order-middle {
		background: url(../../../assets/pre/data/order-middle.png) top center no-repeat;
		margin-top: 20px;
	}
	
	.reback-total {
		background: url(../../../assets/pre/data/reback_total.svg) top center no-repeat;
		margin-top: 20px;
	}
	
	.reback-total-money {
		background: url(../../../assets/pre/data/reback_moneysvg.svg) top center no-repeat;
		margin-top: 20px;
	}
	
	.today-total {
		padding-left: 20px;
		padding-right: 20px;
		width: 50%;
		padding-bottom: 35px;
		margin-bottom: 0;
		padding-top: 70px;
		background-position-y: 20px;
	}
	.pay-total {
		/*padding-top: 0px;*/
		/*background: url(../../../assets/pre/data/微信图片_20181219181419.png) top center no-repeat;*/
		/*margin-top: 35px;*/
	}
	.order-middle {
		/*padding-top: 0px;*/
		/*background: url(../../../assets/pre/data/order-middle.png) top center no-repeat;*/
		/*margin-top: 35px;*/
	}
	.summary-sale {
		background: #FFFFFF;
		text-align: center;
		&.other-summary {
			padding-bottom: 0;
			padding-top: 0;
		}
		.today-total-dif {
			margin-top: 0;
			padding-top: 85px;
			background-position-y: 35px;
			margin-bottom: 15px;
		}
		&.sumary-sale-tab {
			padding-top: 25px;
		}
		&.sale-effective-all {
			padding-top: 0;
			font-size: 14px;
			dt {
				color: #666666;
			}
			dd {
				color: #333333;
				span {
					font-size: 28px;
					font-weight: 600;
				}
			}
		}
	}
	
	.sumary-sale-tab {
		padding: 8px 0 20px;
	}
	
	.well-cils-wrap {
		.weui-cells {
			font-size: 14px;
		}
		.weui-cells .weui-cell .vux-cell-primary .vux-label {
			color: #333333 !important;
		}
		.weui-cells .weui-cell .weui-cell__ft {
			color: #3DA5FE;
		}
		.weui-cell_access .weui-cell__ft:after {
			border-color: #3DA5FE !important;
		}
	}
</style>