<template>
	<div>
		<x-header class="vux-1px-b">门店拣货效率数据Top10</x-header>
		<div class="dataList-info">
			<!--<group>
				<cell></cell>
			</group>-->
			<form-preview :header-label="headerLabel" header-value="平均拣货时长" :body-items="list"></form-preview>
			 <m-empty-norefresh  v-if="list.length<1"></m-empty-norefresh>
		</div>
	</div>
</template>

<script>
	import { XHeader,FormPreview } from 'vux';
	import $request from '@/service/request';
	import MEmptyNorefresh from '@/components/MEmpty'
	import CONFIG from 'configuration';
	export default{
		components:{XHeader,FormPreview,MEmptyNorefresh},
		data (){
			return{
				list:[],
				type:'',
				headerLabel:'',
				
			}
		},
		created(){
			let obj = {beginDate:this.$route.query.beginDate,endDate:this.$route.query.endDate}
			let types=this.$route.query.type;
			this.headerLabel = types=='2' ? obj.beginDate.split("-").join(".")+' ~ '+obj.endDate.split("-").join(".") :obj.beginDate
			this.getDataList(obj)
		},
		methods:{
			getDataList(obj){
				$request.post(CONFIG.reportUrl + "/api/online-order-report/v1/protected/pick/rank", obj).then(res => {
					if(res.success == true) {
						this.list = Object.assign(res.data.pickRankList.map((n,index)=>{
							return {label:(index+1)+'. '+n.operatorName,value: Math.floor(n.pickEfficiency/60)+':'+n.pickEfficiency % 60}
						}))
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
	.dataList-info{
		.vux-form-preview{box-shadow: #e4e4e4  0 0 6px 0;}
		.weui-form-preview__hd{
			line-height: 1.5;
			.weui-form-preview__label,.weui-form-preview__value{
				font-size: 14px;color: #333333;
			}
		}
		.weui-form-preview__hd:after{right: 15px;}
		.weui-form-preview__bd{
			padding-top: 0px;
			padding: 0;
			.weui-form-preview__item{line-height: 42px;position: relative;padding: 0 15px;}
			.weui-form-preview__item:nth-child(odd){}
			.weui-form-preview__item:nth-child(even){background: rgba(245,245,245,0.60);}
			/*.weui-form-preview__item:after{
				content: '';
				position: absolute;
				left: 0px;
				bottom: 0;
				right: 0px;
				height: 1px;
				color: #D9D9D9;
				border-bottom:1px solid #D9D9D9;
				transform-origin: 0 100%;
				transform: scaleY(0.5);
			}*/
		}
		.weui-form-preview__label{color: #666666;}
		.weui-form-preview__value{color: #333333;}
/*		.weui-form-preview__hd .weui-form-preview__value{
			font-size: 14px;color: #333333;
		}*/
	}
</style>