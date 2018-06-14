<template>
	<div class="shop-supply">
		<x-header class="difer-header">确认补货清单</x-header>
		 <!--<div class="vux-header vux-1px-b pre-picking-header clearfix">
	    		<span class="icons fl" @click="$router.back"></span>
	    	<span class="txt">确认补货清单</span>
	    </div>-->
		<!--<div class="header-wrap pre-header-wrap">
			<div class="shopName vux-1px-tb"><i></i>{{this.commonInfo.costName}}</div>
				<div class="totalNums">
					<dl>
						<dt>{{$route.query.scanResult}}</dt>
						<dd>库位码</dd>
					</dl>
					<dl>
						<dt >{{$route.query.goodsSize}}</dt>
						<dd>SKU数量</dd>
					</dl>
					<dl>
						<dt>{{$route.query.sumAvailableNum}}</dt>
						<dd>库存数量</dd>
					</dl>
				</div>
		</div>-->
		 <div class="pre-content-title pre-detail-title">
    	<div class="picking-title">
    		<div class="counting-time">
    		</div>
    		<div class="pick-code pick-info-wrap confirm-t-wrap">
    			<div class="confirm-t vux-1px-b">
    				<dl>
    					<dt>确认补货</dt>
    					<dd>请核对商品补货信息</dd>
    				</dl>
    				<img src="../../../assets/pre/icon1.png"/>
    			</div>
    			<p>补货SKU数：<span>{{backConfirmList.length}}</span></p>     			
    			<p>补货总数：<span>{{totalNum}}</span></p>     			
    			<p>补货员：<span>{{commonInfo.name}}</span></p>     			
    		</div>
    	</div>
    </div>
		<div class="scroll-content back-list-wraps">
			<div class="prolist" v-if="backConfirmList&&backConfirmList.length" v-for="e,index in backConfirmList">
		        <div class="proname vux-1px-b">
		          <div class="code" >商品编码  {{e.goodsBarCode}}</div>
		          <div class="name" >{{e.goodsName}}</div>
		        </div>
    			<div class="pre-supply-title">
    				<span class="item-top-left">前置仓  {{e.frontWarehouseCode}}</span>
    				<div class="title-right">
    					<span class="now-num vux-1px-r">现有库存 {{e.frontNowNum}}</span><span class="safe-num">安全库存 <span>{{e.safeNum}}</span></span>
    				</div>
    			</div>
    			<div class="supply-input vux-1px-t">
    				<span>补货至前置仓</span>
    				<span>{{e.count}}</span>
    			</div>
    			
		    </div>
				<div class="goodsList">
					<m-empty v-if="showEmpty"></m-empty>
				</div>
		</div>
		<div class="cm-footer">
			<div class="btn-submit">
				<!--:disabled=""-->
				<button type="button" @click="toConfirmApply">提交补货信息</button>
			</div>
		</div>
	</div>
</template>
<script>
	import MEmpty from '@/components/MEmpty/index'
	import { XHeader, Scroller } from 'vux'
	import factory from '@/factory'
	import service from '@/service'
	import func from '@/func'
	import $request from '@/service/request.js'
	import { mapGetters, mapState } from 'vuex'
	//import
	export default {
		components: {
			XHeader,
			Scroller,
			MEmpty
		},
		data() {
			return {
				selectId: '',
				dataList: [],
				titleInfo: {
					goodsNum: '',
					sumAvailableNum: ''
				},
				selectData1: [],
				showEmpty: false,
				totalNum:0,//补货总数量
			}
		},
		created(){
			console.log("pp")
//			console.log(this.backConfirmList)
			this.backConfirmList.forEach((e,i)=>{
				this.totalNum += parseInt(e.count)
			})
			},
		computed: {
			...mapState({
				commonInfo: state => state.global.commonInfo,
				backConfirmList:state=>state.prePick.backConfirmList,
			})
		},
		methods: {
			//提交补货申请
			toConfirmApply() {
				let subObj ={
				  "creatTime": "", "id": "",
				  "skuNum": 0,		 //sku数量
				  "supplementBillNo": "", //补货单号
				  "supplyItemRequestDTOS": [
				    {
				      "frontWarehouseCode": "string", //前置仓编码
				      "frontWarehouseId": 0,	//前置仓id
				      "goodsBarCode": "string",	//商品条码
				      "goodsCode": "string",		//商品编码
				      "goodsName": "string",		//商品名称
				      "supplyChannelRequestDTOS": [
				        {
				          "fromWarehouseCode": "string",  //库位编码
				          "fromWarehouseId": 0,		//库位id
				          "goodsWarehouseId": 0,	//商品库位表id
				          "supplyNum": 0				//补货商品数量
				        }
				      ],
				      "supplyNum": 0  //单子补货商品数量
				    }
				  ],
				  "totalNum": 0  //总补货数量
				}
				
				subObj.supplyItemRequestDTOS = this.backConfirmList.map((e,i)=>{
					subObj.totalNum += parseInt(e.count)
					subObj.skuNum +=1;
					return {
					  "frontWarehouseCode": e.frontWarehouseCode, //前置仓编码
				      "frontWarehouseId": e.frontWarehouseId,	//前置仓id
				      "goodsBarCode": e.goodsBarCode,	//商品条码
				      "goodsCode": e.goodsCode,		//商品编码
				      "goodsName": e.goodsName,	
				      "supplyNum": parseInt(e.count),
				      "supplyChannelRequestDTOS":[
				      	{
				      		"fromWarehouseCode": e.warehouseCode,  //库位编码
				          "fromWarehouseId": e.warehouseId,		//库位id
				          "goodsWarehouseId": e.id,	//商品库位表id
				          "supplyNum": parseInt(e.count)	
				      	}
				      ]
					}
				})
				console.log(subObj)
				$request.post("/api/supplement-invoices/v1/protected/to_pre_from_back_place",subObj).then(res=>{
					if(res.success==true){
//						//提交成功之后把列表上数据删除
						this.$store.dispatch("setBackSupplyList",[])
						this.$store.dispatch("setBackConfirmList",[])
						this.$router.push({path:"preSupSuccess",query:{
							title:'补货完成',
							text:'补货',
							info:'请将库位商品移至前置仓',
							btn1link:'/preWorehouse/preShopDetail?id='+res.data,  //查看补货单
							btn1Text:'补货单详情',			
							btn2Text:'继续补货',
							btn2link:'/scanEntry?key=wareHouseAdd',	//继续补货
							backpath:'/'		//返回首页
						}})
					}else{
        		this.$router.push({path:'/fail',query:{text: res.message,title: '卖场给前置仓补货',info: '', path:'/'}})
//						
					}
				}).catch(err=>{
        		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '卖场给前置仓补货',info: '', path:'/'}})
					
				})
			},
		}
	}
</script>
<style lang="less">
	.back-list-wraps{
		top: 230px;
	}
</style>