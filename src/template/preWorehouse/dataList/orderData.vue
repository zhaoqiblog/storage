<template>
	<div class="dataWrap">
		<x-header class="vux-1px-b">门店订单数据</x-header>
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
										<dt class="summary-title">订单总数 (单)</dt>
										<dd><strong class="summary-data">{{dataObj.totalOrders}}</strong></dd>
									</dl>
								</div>
								<order-data-common :data="dataObj"></order-data-common>

							</div>
						</div>
					</swiper-item>
					<swiper-item>
						<div class="tab-swiper vux-center">
							<div class="tab-swiper vux-center">
								<div class="dataList-info">
									<div class="data-total-wrap">
										<dl class="summary-sale">
											<picker-data-item @changeTime="changetime" v-model="weekTime" :index='indexTab'></picker-data-item>
										</dl>
										<div class="summary-sale sale-effective-all">
											<dl>
												<dt>订单总数 (单)</dt>
												<dd><strong class="summary-data">{{dataObj.totalOrders}}</strong></dd>
											</dl>
										</div>
									</div>
									<order-data-common :data="dataObj"></order-data-common>

								</div>
							</div>
						</div>
					</swiper-item>
					<swiper-item>
						<div class="tab-swiper vux-center">
							<div class="dataList-info">
								<div class="data-total-wrap">
									<dl class="summary-sale">
										<picker-data-item :index='indexTab' v-model="monthTime" @changeTime="changetime"></picker-data-item>
									</dl>
									<div class="summary-sale sale-effective-all">
										<dl>
											<dt>订单总数 (单)</dt>
											<dd><strong class="summary-data">{{dataObj.totalOrders}}</strong></dd>
										</dl>
									</div>
								</div>
								<order-data-common :data="dataObj"></order-data-common>
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
	import func from '@/func'
	import $request from '@/service/request';
	import CONFIG from 'configuration';
	import PickerDataItem from './component/selectData.vue';
	import OrderDataCommon from './component/orderdataCommon.vue';
	export default {
		components: {
			XHeader,
			Tab,
			TabItem,
			OrderDataCommon,
			PickerDataItem,
			Swiper,
			Group,
			Cell,
			SwiperItem,
			//			OrderDataCommon
		},
		created() {
			this.time = new Date().format("YYYY-MM-dd");
			let obj = {
				beginDate: new Date().format("YYYY-MM-dd"),
				endDate: new Date().format("YYYY-MM-dd")
			}
			this.getData(obj)
		},
		computed: {
			costName() {
				return localStorage.getItem("costName")
			}
		},
		data() {
			return {
				indexTab: 0,
				time: new Date().format("YYYY-MM-dd"),
				weekTime: new Date(),
				monthTime: new Date().format("YYYY-MM"),
				dataObj: {
					"totalOrders": 0,
					"newOrders": 0,
					"finishOrders": 0,
					"completeOrders": 0,
					"timeoutOrders": 0,
					"refundedOrders": 0,
					"pickSelfOrders": 0,
					"pickDeliveryOrders": 0,
					"immediateOrders": 0,
					"expectTimeOrders": 0,
					"jdorders": 0,
					"yhorders": 0
				}
			}
		},
		methods: {
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
					obj = { ...func.getThisWeek(this.weekTime)
					};
				} else if(this.indexTab == 2) {
					obj = {
						beginDate: this.monthTime,
						endDate: this.monthTime
					}
				}
				this.getData(obj)
			},
			getData(obj) {
				$request.post(CONFIG.reportUrl + "/api/online-order-report/v1/protected/orders", obj).then(res => {
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
		}

	}
</script>

<style lang="less">

</style>