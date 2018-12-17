<template>
	<div class="dataWrap">
		<x-header class="vux-1px-b">门店拣货效率数据</x-header>
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
										<dt class="summary-title">拣货总效率</dt>
										<dd><span class="singleEffective">每单 </span><strong class="summary-data">{{Math.floor(dataObj.pickEfficiency /60 ) +':'+dataObj.pickEfficiency % 60}}</strong></dd>
									</dl>
								</div>
								<effective-common :data="dataObj" type="1" :beginDate="timeData.beginDate" :endDate="timeData.endDate"></effective-common>
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
										<dl class="sumary-sale-tab">
											<dt class="summary-title">拣货总效率</dt>
											<dd><span class="singleEffective">每单 </span><strong class="summary-data">{{Math.floor(dataObj.pickEfficiency /60 ) +':'+dataObj.pickEfficiency % 60}}</strong></dd>
										</dl>
									</div>
									<effective-common :data="dataObj" type="2" :beginDate="timeData.beginDate" :endDate="timeData.endDate"></effective-common>

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
									<dl class="sumary-sale-tab">
										<dt class="summary-title">拣货总效率</dt>
										<dd><span class="singleEffective">每单 </span><strong class="summary-data">{{Math.floor(dataObj.pickEfficiency /60 ) +':'+dataObj.pickEfficiency % 60}}</strong></dd>
									</dl>
								</div>
								<effective-common :data="dataObj" type="3" :beginDate="timeData.beginDate" :endDate="timeData.endDate"></effective-common>
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
	import PickerDataItem from './component/selectData.vue';
	import EffectiveCommon from './component/effectiveCommon.vue';
	import func from '@/func'
	import $request from '@/service/request';
	import CONFIG from 'configuration';
	export default {
		components: {
			XHeader,
			Tab,
			TabItem,
			EffectiveCommon,
			PickerDataItem,
			Swiper,
			Group,
			Cell,
			SwiperItem,
		},
		created() {
			this.time = new Date().format("YYYY-MM-dd");
			let obj = {
				beginDate: new Date().format("YYYY-MM-dd"),
				endDate: new Date().format("YYYY-MM-dd")
			}
			this.timeData={...this.timeData,...obj};
			console.log(this.timeData)
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
					averagePackageTime: 0,
					averagePickTime: 0,
					averageStartTime: 0,
					pickEfficiency: 0,
				},
				timeData:{
					beginDate:this.time,
					endDate:this.time,
				},
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
				this.timeData={...this.timeData,...obj}
				this.getData(obj)
			},
			changeTab(index) {
				this.indexTab = index
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
				this.timeData={...this.timeData,...obj}
				this.getData(obj)
			},
			getData(obj) {
				$request.post(CONFIG.reportUrl + "/api/online-order-report/v1/protected/pick", obj).then(res => {
					if(res.success == true) {
						this.dataObj = { ...this.dataObj,
							...res.data
						}
					} else {
						this.$vux.toast.show({
							type: 'text',
							text: res.message
						})
					}
				})
			},
		}

	}
</script>

<style lang="less">
	.singleEffective {
		font-size: 14px;
	}
</style>