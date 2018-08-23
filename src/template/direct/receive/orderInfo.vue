<template>
  <div >
    <x-header :left-options="{preventGoBack:true}" @on-click-back="backScan">订单信息</x-header>
    <div class="contentWrap scroll-content content-wrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
    	<div class="wraps differWraps orderWraps">
    		<ul>
    			<li><span class="goodsName">订单编号</span><span>{{orderDetails.purchaseOrderNo}}</span></li>
    			<li><span class="goodsName">订单SKU数</span><span>{{orderDetails.skuQuantity}}</span></li>
    			<li><span class="goodsName">订单商品总数</span><span>{{orderDetails.goodsQuantity}}</span></li>
    		</ul>
    	</div>
    	<div class="goodsList">
    			<m-empty v-if="directReceiveShowList&&directReceiveShowList.length<1"></m-empty>
	    		<p class="listTitle" v-if="directReceiveShowList&&directReceiveShowList.length>0"><span>商品信息</span></p>
	    		<div class="listWrap">
	    			<!--@change="changeCount"-->
							<goods-info-item
								v-for="(item,index) in directReceiveShowList" 
								:code="item.goodsBarCode"
								:name="item.goodsName"
								:totalNum="item.availableNum"
								:unit="item.unit"
								:num="item.num"
								:textNum="item.textNum"
								:unitq="item.perNum"
								v-model="item.count"
								:time="item.intoWarehouseTime"
								:key="index"
								:id="'a'+item.goodsBarCode">
							</goods-info-item>
	    		</div>
	    	</div>
    </div>
    <div class="cm-footer footer-padding">
      <button  type="button" class="btnblue-add footer-bottom" @click="beginSampling"><i></i>&nbsp;&nbsp;开始商品抽检</button>
		</div>
  </div>
</template>
<script>
//import MHeader from '@/components/MHeader/index'
import MEmpty from '@/components/MEmpty/index'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
import { XHeader,XButton,Toast } from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'

//import 
export default {
  components: {
    XHeader,XButton,Toast,MEmpty
  },
  name: 'turnoverIndex',
  data() {
    return {
    	orderDetails:{
    		goodsQuantity:0,
				orderDate:"",
				purchaseOrderNo:"",
				skuQuantity:0,
				storeCode:"",
				storeName:"",
				initData:[],
    	}
    }
  },
  computed: {
		...mapState({
			commonInfo:state=>state.global.commonInfo,
			directReceiveShowList:state=>state.direct.directReceiveShowList,
		})
  },
  created() {
  	//4031193610    4031193609
		let obj ={orderNo:this.$route.query.scanResult,costCenterNum:this.commonInfo.costNumber}
		$request.get("/api/receive-goods/v1/protected/queryOrderInfo",obj).then(res=>{
			if(res.success==true){
				this.orderDetails={...res.data}
				this.$store.dispatch("updatedirectReceiveShowList",res.data.directReceiveGoodsInfoDTOS)
			}else{
				this.$router.push({path:'/fail',query:{text: res.message,title: '直送收货',info: '', path:'/scanEntry?key=directOrderInfo'}})
			}
		},err=>{
			this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '直送收货',info: '', path:'/scanEntry?key=directOrderInfo'}})
		})
  },
  mounted(){
  },
  methods: {
  	/*
  	 * 开始抽检商品
  	 */
		beginSampling(){
			if(window.cordova){
				factory.scan().then(res=>{
					this.$router.push({path:'receiptList',query:{orderCode:this.orderDetails.purchaseOrderNo,goodsBarCode:res.text,orderDate:this.orderDetails.orderDate}})
				})
			}else{
				this.$router.push({path:'receiptList',query:{orderCode:this.orderDetails.purchaseOrderNo,goodsBarCode:'6907992818894',orderDate:this.orderDetails.orderDate}})
			}
			
		},
		/**
     * 返回
     */
    backScan(){
//  	query:{scanResult:}
    	this.$router.push({path:'/scanEntry',query:{key: 'directOrderInfo'}})
    }
  }
}

</script>
<style lang="less" scoped>
	.orderWraps{
		ul{
			/*height:102px;*/
			li{
				font-size: 14px;
				line-height: 29px;
				display: flex;
				justify-content: space-between;
				&:nth-child(1){
					padding-top: 8px;
				}
				&:nth-child(3){
					padding-bottom: 8px;
				}
			}
		}
	}

</style>
