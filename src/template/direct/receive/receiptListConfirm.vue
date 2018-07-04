<template>
  <div class="self-process">
    <x-header :left-options="{preventGoBack:true}" @on-click-back="backScan">确认收货清单</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    	<div class="scroll-content">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div></keep-alive>
    	<div class="storeSelect">
	      	<div class="top-margin">
		      	<goods-info-item
					v-for="(item,index) in initData" 
					:type="item.type"
					:showInde='true'
					:code="item.goodsBarCode"
					:name="item.goodsName"
					:totalNum="item.sysNum"
					:unit="item.unit"
					:num="item.caseNum"
					:textNum="item.textNum"
					:unitq="item.perNum"
					:timeSel="item.timeSel"
					:actualVal="item.actualVal"
					:giftsVal="item.giftsVal"
					@changeActual="changeActual"
					@changeGift="changeGifts"
					@changeDate="changeDate"
					:key="index">
				</goods-info-item>
			</div>
						<!--&&initData.intarger.length>0-->
    	</div>
	   
    </div>
    <!--</scroller>-->
    </div>
    	<div class="cm-footer footer-padding">
     	 <button  type="button" class="btnblue-add footer-bottom" @click="submit">提交收货清单</button>
			</div>
  </div>
</template>
<script>
import { XHeader} from 'vux'
import factory from '@/factory'
import func from '@/func'
import $request from '@/service/request.js'
import {mapState,mapMutations} from 'vuex'
//import
export default {
  components: {
    XHeader
  },
  data() {
    return {
    	initData:[],  //列表tab切换请求数据
			disableds:false,
  	}
  },
  computed: {
  	...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		directReceiveConfirm:state=>state.direct.directReceiveConfirm  //去下一页数据
  	}),
  },
  created() {
  	this.initData=this.directReceiveConfirm.map(i=>{
  			return {
  				...i,
  				type:'bottomText',
  			}
  	})
		console.log(this.initData)
  },
   mounted(){
  },
  methods: {
	/*
	 提交清单
	 **/
    submit(){
    	let obj = {
		  "costCenterNum": this.commonInfo.costNumber,
		  "orderDate": this.$route.query.orderDate,
		  "purchaseOrderNo": this.$route.query.purchaseOrderNo,
		  "receiveGoodsList": []
}
    obj.receiveGoodsList=	this.initData.map(e=>{
    		return {
    			availableNum:e.actualVal,
    			giftNum:e.giftsVal,
    			goodsBarCode:e.goodsBarCode,
    			goodsName:e.goodsName,
    			producedDate:e.timeSel,
    			validDays:e.validDays,
    		}
    	})
    console.log(obj)
    	$request.post("/api/receive-goods/v1/protected/confirmDirectReceive",obj).then(res=>{
    		if(res.success==true){
    			this.$router.push({path:'/success',query:{text: res.message,title: '直送收货',info:'总收货品项数量：'+res.data[0].sku+'，总收货数量：'+res.data[1].totalNum, path:'/scanEntry?key=directOrderInfo'}})
    		}else{
    			this.$router.push({path:'/fail',query:{text: res.message,title: '直送收货',info: '', path:'/scanEntry?key=directOrderInfo'}})
    		}
    	},err=>{
    		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '直送收货',info: '', path:'/scanEntry?key=directOrderInfo'}})
    	})
    },
    changeActual(val,index){
    	this.initData[index].actualVal=val;
    },
    changeGifts(val,index){
    	this.initData[index].giftsVal=val;
    },
    changeDate(val,index){
    	this.initData[index].timeSel=val;
    	console.log(this.initData[index])
    },
    /**
     * 返回
     */
    backScan(){
    	this.$router.push({path:'receiptList',query:{isBack:1,orderCode:this.$route.query.purchaseOrderNo,orderDate:this.$route.query.orderDate}})
    }
  }
}

</script>
<style lang="less" scoped>
.contentWrap{
	.wraps{margin: 0;padding: 0;}
	.storeSelect-wrap{
			background: #48475A;height: 44px;
			color: #FFFFFF;
			text-align: center;
			line-height: 44px;
	}
	.storeSelect{
		padding-bottom: 48px;
	}
	.top-margin{margin-top: 10px;
	.goods-info-item{
		margin-top: 10px;
	}
	}
	.wipeList{margin-top: 10px;}
}
</style>
