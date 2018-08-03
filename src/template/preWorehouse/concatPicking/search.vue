<template>
	<div class="search">
  		<x-header class="vux-1px-b">搜 索 订 单</x-header>
		<div class="s-wrap">
			<group>
				<div class="search-in">
					<input type="text" placeholder="订单号或序号(如：1) 或客户手机号" v-model="searchObj.searchKey"/>
					<i class="iconfonts"></i>
				</div>
				<!--<div class="search-order-type">
					<button>永辉</button> <button>京东</button>
				</div>-->
				<div class="checkers">
					<checker
					    v-model="searchObj.outerOrderType"
					    default-item-class="demo5-item"
					    selected-item-class="demo5-item-selected"
					    @on-change="changeType"
				    >
				    <checker-item value="0">永辉</checker-item>
				    <checker-item value="2">京东</checker-item>
				    </checker>
				</div>
				<button class="search-btn" @click="searchOrder">搜索</button>				
			</group>
		</div>
		<div class="scrol">
			<p v-if="searchData.totalElements">共{{searchData.totalElements}}个结果</p>
			<!--<div style="display:none" v-for="(a,ai) in searchData.content">{{new Date(a.creatTime).format("yyyy-MM-dd")}}</div>-->
			<pre-search-item v-for="(a,ai) in searchData.content" :key="ai"
				:id="a.id"
				:creatTime="new Date(a.creatTime).format('yyyy-MM-dd hh:mm:ss')"
				:orderSequenceNo="a.orderSequenceNo"
				:deliverType="a.deliverType"
				:slotType="a.slotType"
			>
			</pre-search-item>
		</div>
	</div>
</template>

<script>
	import {XHeader,Group,Checker, CheckerItem} from 'vux';
	import $request from '@/service/request.js'
	import {mapState} from 'vuex'
	export default{
		name:'search',
		components:{XHeader,Group,Checker, CheckerItem},
		data(){
			return {
				checkers:null,
				searchObj:{searchKey:'',outerOrderType:'0',shopId:''},
				searchData:[],
			}
		},
		computed:mapState({
			commonInfo:state=> state.global.commonInfo
		}),
		created(){
			this.searchObj.shopId=this.commonInfo.costNumber
		},
		methods:{
			changeType(){
				console.log(this.checkers);
			},
			searchOrder(){
				$request.get("/api/online-order/v1/protected/searchOrders",this.searchObj).then((res)=>{
					this.searchData = res.data;
				})
			}
		}
	}
</script>

<style lang="less">
	.s-wrap{
		margin: 0;
		.weui-cells{margin: 0;}
		.weui-cells:before{
			border-top: none;
		}
		.search-in{
			position: relative;margin:20px 2.5% 0 2.5%;width: 95%;
		}
		input[type='text']{
			border: none;background: #d0d0d05e;line-height: 36px;font-size: 13px;width: 100%;box-sizing: border-box;
			border-radius: 5px;padding-left:30px;
			
		}
		.iconfonts{
			position: absolute;
			width: 15px;height: 15px;
			background: url(../../../assets/common/searchc.png) center center no-repeat;
			background-size: cover;top: 10px;left:8px;color: #CCCCCC;
		}
		.search-btn{
			width: 95%;margin: 0 2.5% 15px;text-align: center;    border-radius: 3px;
			height: 40px;
		    background: #3DA5FE;
		    border: none;
		    font-size: 16px;
		    padding: 4px 8px;
		    color: #FFFFFF;
		}
	}
	.checkers{
		margin: 20px auto 24px;
		width: 95%;
		.vux-checker-box{
			display: flex;
			justify-content: space-between;
		}
		.demo5-item {
		  width: 44.5%;
		  height: 32px;
		  line-height: 34px;
		  text-align: center;
		  border-radius: 3px;
		  border: 1px solid #ccc;
		  background-color: #fff;box-sizing: border-box;
		}
		.demo5-item-selected {
		  border-color: rgba(74,144,226,0.40);;color: #4A90E2;
		}
	}
</style>