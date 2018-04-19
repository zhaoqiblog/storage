<template>
  <div class="self-process"> <!--:left-options="{preventGoBack:true}" @on-click-back="back"-->
    <x-header>散货上架清单</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    	<div class="scroll-content">
    <div class="contentWrap">
    	<div class="shopName "><i></i>{{commonInfo.costName}}</div>
    	<div class="storeSelect-wrap initShopName">{{goodsToMallSeleData.storename}}</div>
    	<div class="storeSelect" style="padding-bottom: 48px;">
    		<tab :line-width="2" custom-bar-width="60px" v-model="overall">
			     <tab-item :selected="index==0" v-for="(item, index) in tablist" :key="index">{{item.name}}&nbsp;&nbsp;{{item.value}}</tab-item>
      		</tab>
      		
      		<div v-if="overall==0" class="wipeList" style="margin-top: 0;">
      					<p class="listTitle titleIndos" style="">
      						<span style="margin-left: 16px;">商品信息</span>
      						<span style="margin-right: 16px;">上架数量</span>
      					</p>
		          	<goods-info-item 
									v-for="(item,index) in goodsToMallSeleData.floats" 
									:sideslip="item.sideslip"
									:type="item.type"
									:code="item.goodsCode"
									:name="item.goodsName"
									:totalNum="item.count"
									:unit="item.unit"
									:num="item.num"
									:textNum="item.textNum"
									:unitq="item.perNum"
									v-model="item.count"
									:key="index">
									<div slot="textNumDom" class="l-list-text">
  								{{item.count}}<small>{{item.unit}}</small>
									</div>
									
								</goods-info-item>
								</div>
		          <!--</div>-->
		          <!--<div class="tab-swiper vux-center" v-if="item.index==2">-->
		          	<div v-if="overall==1" class="wipeList" style="margin-top: 0;">
		          		<p class="listTitle titleIndos" style="">
	      						<span style="margin-left: 16px;">商品信息</span>
	      						<span style="margin-right: 16px;">上架数量</span>
	      					</p>
			          	<goods-info-item 
										v-for="(item,index) in goodsToMallSeleData.intarger" 
										:sideslip="item.sideslip"
										:type="item.type"
										:code="item.goodsCode"
										:name="item.goodsName"
										:totalNum="item.availableNum"
										:unit="item.unit"
										:num="item.num"
										:textNum="item.count"
										:unitq="item.perNum"
										v-model="item.count"
										:key="index">
										<div slot="textNumDom" class="l-list-text">
	  									{{item.count}}<small>{{item.unit}}</small>
										</div>
									</goods-info-item>
								</div>
    	</div>
	   
    </div>
    <!--</scroller>-->
    </div>
   <div class="footer-bottom" @click="gotosuccess">完成</div>
  </div>
</template>
<script>
import { XHeader,Scroller, PopupPicker, Group,Tab, TabItem,Swiper, SwiperItem } from 'vux'
import factory from '@/factory'
import service from '@/service'
import $request from '@/service/request.js'
import {mapState,mapMutations} from 'vuex'
//import 
export default {
  components: {
    XHeader,Scroller, PopupPicker, Group,Tab, TabItem,Swiper, SwiperItem 
  },
  data() {
    return {
    	overall:0,
    	swipeHeight:"0px",
    	tablist:[{name:"散货商品",value:0,index:1},{name:"整件商品",value:0,index:2}],
    	store:[],
    	selectDatas:{datas1:[],datas:[]},
    	listdatas: [],
  }
    },
  computed: {
		...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		goodsToMallSeleData:state=>state.turnoverArea.goodsToMallSeleData
  	})
  },
  created() {
  },
  mounted(){
		this.tablist[0].value=this.goodsToMallSeleData.floats.length;
		this.tablist[1].value=this.goodsToMallSeleData.intarger.length;
		this.goodsToMallSeleData.intarger.forEach((e)=>{
			e.type="text"
		})
		this.goodsToMallSeleData.floats.forEach((e)=>{
			e.type="text"
		})
  },
  methods: {
//	backScan(){
//  	this.$router.back()
//  }
     gotosuccess(){
     	let lists=[]
     	this.goodsToMallSeleData.floats.map(e=>{
     		lists.push( {	goodsCode: e.goodsCode,goodsWarehouseId:e.id,supplyNum: e.count})
     	})
     	this.goodsToMallSeleData.intarger.map(e=>{
     		lists.push( {	goodsCode: e.goodsCode,goodsWarehouseId:e.id,supplyNum: e.count})
     	})
     let obj={
     	goodsWarehouseDetailDTOList: lists.concat([]),
		  receiveGoodsId: this.goodsToMallSeleData.receiveGoodsId
		}
     	$request.post("/api/goods-warehouse/v1/protected/pallet/supply",obj).then(e=>{
     		if(e.success==true){
     			this.$router.push({path:'/success',query:{text:"上架成功",title:"商品上架",path:'/scanEntry?key=goodsToMall'}})
     		}else{
//   			this.$vux.toast.show({
//          type: 'text',
//          text: e.message
//        })
					this.$router.push({path:"/fail",query:{text:e.message,title:'商品上架',path:'/scanEntry?key=goodsToMall'}})
     		}
     	}).catch(err=>{
     		this.$router.push({path:"/fail",query:{text:'上架失败',title:'商品上架',path:'/scanEntry?key=goodsToMall'}})
     	})
    }
  }
}

</script>
<style lang="less">
.contentWrap{
	.wraps{margin: 0;padding: 0;}
	.storeSelect-wrap{
		.vux-no-group-title{margin-top: 0!important;}
		.weui-cells:before{border: none;}
		.weui-cells{
			background: #48475A;
			margin-top:0px!important;
			.vux-cell-box .weui-cell .weui-label{color: #FFFFFF !important;}
		}
	}
	.storeSelect{
		
	}
}
.totalNums{
	display: flex;justify-content: center;align-items: center;
	box-sizing: border-box;
	background:#FFFFFF;
	height: 72px;
	dl{
		width:33.3%;
		text-align: center;
		dt{
			color: #303030;
			font-size: 20px;
			font-weight: 600;
		}
		dd{
			color: #999999;
			font-size: 12px;
		}
	}
}
	.listTitle{
		height: 50px;
		line-height: 50px;
		text-align: left;
		color: #999999;
		font-size: 14px;
		&.titleIndos{
			height: 50px;
			line-height: 50px;
		}
	}
.self-process{

.storeSelect{
	
	.vux-tab .vux-tab-item.vux-tab-selected{
		color: #3DA5FE;
	}
	.vux-tab-bar-inner{
		background-color:#3DA5FE;
	}
	.vux-slider{margin-top: 10px;background: #FFFFFF;}
	}
	.swiper-wrap{margin-top: 10px;
	.tab-swiper{box-sizing: border-box;}
		.goods-info-item{box-sizing: border-box;}
	}
}
.initShopName{
	background: #48475A;
	color: #FFFFFF;
	font-size: 15px;
	text-align: center;
	height: 44px;
	line-height: 44px;
}
</style>
