<template>
	<div>
		<x-header class="vux-1px-b">订单耗时最长Top10</x-header>
		<div class="dataList-info-dif ">
			<!--<group>
				<cell></cell>
			</group>-->
			<div class="vux-form-preview weui-form-preview">
				<div class="weui-form-preview__hd">
					<label class="weui-form-preview__label"  v-if="dates.beginDate!=dates.endDate">{{dates.beginDate}} ~ {{dates.endDate}}</label> 
					<label class="weui-form-preview__label" v-if="dates.beginDate==dates.endDate">{{dates.beginDate}}</label> 
					<em class="weui-form-preview__value">总耗时</em>
				</div>
				<ul class="datalist-list">
					<li v-for="n,index in list">
						<p class="orderInfos"><span class="orderid">{{index+1}}.订单：{{n.orderId}}</span> <span class="pickTime">{{Math.floor(n.timeConsume/60)+':'+n.timeConsume % 60}}</span></p>
						<p class="pickInfo">&nbsp;&nbsp;&nbsp;&nbsp;接单拣货:{{n.operatorName}} / 装袋:{{n.packagerName}}</p>
						
					</li>
				</ul>
			</div>

			<!--<form-preview :header-label="headerLabel" header-value="平均拣货时长" :body-items="list"></form-preview>-->
			<m-empty-norefresh v-if="list.length<1"></m-empty-norefresh>
		</div>
	</div>
</template>

<script>
	import { XHeader, FormPreview } from 'vux';
	import $request from '@/service/request';
	import MEmptyNorefresh from '@/components/MEmpty'
	import CONFIG from 'configuration';
	export default {
		components: {
			XHeader,
			FormPreview,
			MEmptyNorefresh
		},
		data() {
			return {
				list: [],
				type: '',
				headerLabel: '',
				dates:{beginDate:"",endDate:""},
			}
		},
		created() {
			let obj = {
				beginDate: this.$route.query.beginDate,
				endDate: this.$route.query.endDate
			}
			this.dates={...obj}
			let types = this.$route.query.type;
			this.headerLabel = types == '2' ? obj.beginDate.split("-").join(".") + ' ~ ' + obj.endDate.split("-").join(".") : obj.beginDate
			this.getDataList(obj)
		},
		methods: {
			getDataList(obj) {
				$request.post(CONFIG.reportUrl + "/api/online-order-report/v1/protected/orders/rank", obj).then(res => {
					if(res.success == true) {
						this.list = Object.assign(res.data.timeRankList)
					} else {
						this.$vux.toast.show({
							type: 'text',
							text: res.message
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.dataList-info-dif {
		position: absolute;
		left: 0;right: 0;bottom: 0;
		top:54px;
		overflow-y:auto ;
		padding-bottom: 20px;
		.datalist-list{
			.orderInfos{
				display: flex;justify-content: space-between;align-items: center;
			}
			li{padding:10px 15px;}
			li:nth-child(even){background: rgba(245,245,245,0.60);}
			.pickInfo,.orderid{font-size: 14px;color: #666666;line-height: 1.8;}
			.pickTime{font-size: 14px;color: #333333;}
		}
		
		.vux-form-preview {
			width: 95%;
		margin: 0px 2.5% 0;
			box-shadow: #e4e4e4 0 0 6px 0;
		}
		.weui-form-preview__hd {
			line-height: 1.5;
			.weui-form-preview__label,
			.weui-form-preview__value {
				font-size: 14px;
				color: #333333;
			}
		}
		.weui-form-preview__hd:after {
			right: 15px;
		}
	}
</style>