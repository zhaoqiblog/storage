<template>
  <div class="self-process">
    <x-header backScan>散货小店选择</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    	<div class="scroll-content">
    <div class="contentWrap">
    	<div class="shopName"><i></i>{{commonInfo.costName}}</div></keep-alive>
    	<group title="" label-width="5em" class="storeSelect-wrap">
		   <popup-picker title="小店" :data="listdatas" :columns="3" v-model="store" @on-change="changeStore" show-name placeholder="请选择小店"></popup-picker>
		 </group>
    	<div class="storeSelect">
    		<tab :line-width="2" custom-bar-width="60px" v-model="overall">
    			<!--:selected="index==0"-->
			     <tab-item  v-for="(item, index) in tablist" :key="item.index" >{{item.name}}&nbsp;&nbsp;{{item.value}}</tab-item>
      	</tab>
	      	<div v-if="overall==0&&initData.floats.length>0" class="wipeList" style="margin-top: 0;">
	      		<p class="listTitle titleIndos" style="">
  						<span style="margin-left: 16px;">商品信息</span>
  						<span style="margin-right: 16px;">上架数量</span>
  					</p>
	      	<goods-info-item 
							v-for="(item,index) in initData.floats" 
							:sideslip="item.sideslip"
							:type="item.type"
							:code="item.goodsBarCode"
							:name="item.goodsName"
							:totalNum="item.availableNum"
							:unit="item.unit"
							:num="item.num"
							:textNum="item.textNum"
							:unitq="item.perNum"
							v-model="item.count"
							:key="index">
						</goods-info-item>
						</div>
						<!--&&initData.intarger.length>0-->
	      	<div v-if="overall==1||(overall==0&&initData.intarger.length>0)" class="wipeList" style="margin-top: 0;">
	      		<p class="listTitle titleIndos" style="">
  						<span style="margin-left: 16px;">商品信息</span>
  						<span style="margin-right: 16px;">上架数量</span>
  					</p>
	      	<goods-info-item 
							v-for="(item,index) in initData.intarger" 
							:sideslip="item.sideslip"
							:type="item.type"
							:code="item.goodsBarCode"
							:name="item.goodsName"
							:totalNum="item.availableNum"
							:unit="item.unit"
							:num="item.num"
							:textNum="item.textNum"
							:unitq="item.perNum"
							v-model="item.count"
							@change="changeList"
							:key="index">
						</goods-info-item>
						</div>
    	</div>
	   
    </div>
    <!--</scroller>-->
    </div>
    <div class="footer-bottom" @click="gotoConfirm">完成</div>
  </div>
</template>
<script>
import { XHeader,Scroller, PopupPicker, Group,Tab, TabItem,Swiper, SwiperItem } from 'vux'
import factory from '@/factory'
import func from '@/func'
import $request from '@/service/request.js'
import {mapState,mapMutations} from 'vuex'
//import
export default {
  components: {
    XHeader,Scroller, PopupPicker, Group,Tab, TabItem,Swiper, SwiperItem 
  },
  name: 'turnoverIndex',
  data() {
    return {
    	overall:0,
    	swipeHeight:"0px",
    	warehousePlaceCode:'A101',  //库位码
    	costCenterNum:'', //成本中心编码
    	palletCode:'P0000087', //托盘编号
    	selectDatas:{floats:[],intarger:[],storecode:[],storename:'',receiveGoodsId:''},  //传给下一个页面的数据
    	tablist:[/*{name:"散货商品",value:0,index:1},{name:"整件商品",value:0,index:2}*/],
    	initData:{floats:[],intarger:[]},  //列表tab切换请求数据
    	store:[],
    	listdatas: [
		    ],
		    dataLists:{
		    	datas:[],
					datas1:[]
			}
  	}
  },
  computed: {
  	...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		goodsToMallSeleData:state=>state.turnoverArea.goodsToMallSeleData,
  		shopId:state=>state.turnoverArea.shopId
  	})
  },
  created() {
  	let code = this.$route.query.scanResult
  	this.palletCode=code;
  	this.costCenterNum=this.commonInfo.costCenterNum;
//	this.store=this.shopId
//	if(this.store.length>0){
//		this.getTrayInfo('callvack')
//		}else{
		this.getTrayInfo();
//	}
  	
  },
   mounted(){
//	this.swipeHeight=this.dataLists.datas.length*110+55+'px'
  	
  },
  methods: {
	getTrayInfo(callback){
			let obj = {palletCode:this.palletCode,costCenterNum:this.commonInfo.costNumber}
//			let obj = {palletCode:'P0000081',costCenterNum:'0090123100'}
				$request.get("/api/goods-warehouse/v1/protected/queryPalletGoods",obj).then((re)=>{
					if(re.success==true){
					this.palletCode=re.data.palletCode
					this.selectDatas.receiveGoodsId=re.data.receiveGoodsId
					this.topInfo={...re.data}
					this.sku=re.data.goodsSize
					//小店数据获取
					this.listdatas=[];
					//整件散装区分
					
					re.data.shopGoodsInfo.forEach((e,i)=>{
						//小店数据获取
						let intarger=[],floats=[];
						this.listdatas.push({name:e.shopName,value:e.ShopCode,intarger:[],floats:[]})
						e.goodsInfo.forEach((r,n)=>{
							if(r.inBulkNum>0){
								r.type="input";
								r.count=0;
								floats.push(r)
							}else{
								r.type="input";
								r.count=0
								intarger.push(r);
							}
						})
						this.listdatas[i].intarger=intarger.concat([])
						this.listdatas[i].floats=floats.concat([])
					})
					this.store[0]=this.listdatas[0].value
//					this.store[0]=this.commonInfo.stores[0].storeCode
						this.selectShop(this.store)
//					if(callback){
//						this.store=this.shopId
//				  this.selectShop(this.store)
//					}else{
//						this.store[0]=this.listdatas[0].value
//						this.selectShop(this.store)
//					}
				}else{
					this.$router.push({path:'/fail',query:{text: re.message,title: '商品上架',info: '', path:'/scanEntry?key=goodsToMall'}})
				}
			})
		},
    scan () {
      factory.scan().then(function(res) {
        alert('success:' + JSON.stringify(res))
      })
    },
    changeStore(val){
    	const {listdatas}=this;
    	this.$store.commit("setshopId",val)
			this.selectShop(val);
    },
    selectShop(val){
    	this.listdatas.forEach((e)=>{
    		if(e.value==val[val.length-1]){
    			this.selectDatas.storename=e.name;
					this.initData={...e}
//					this.tablist[0].value=e.floats.length;
//					this.tablist[1].value=e.intarger.length;
//					[{name:"散货商品",value:0,index:1},{name:"整件商品",value:0,index:2}],
					
					if(e.floats.length<1){
						this.overall=1;	
						this.tablist=[{name:"整件商品",value:e.intarger.length,index:2}];
					}else if(e.intarger.length<1){
						this.overall=0;
						this.tablist=[{name:"散货商品",value:e.floats.length,index:1}]
					}else{
						this.overall=0;
						this.tablist=[
							{name:"散货商品",value:e.floats.length,index:1},
							{name:"整件商品",value:e.intarger.length,index:2}
						]
//						this.tablist[0].value=e.floats.length;
//						this.tablist[1].value=e.intarger.length;
					}
					
    		}
    	})
    },
    gotoConfirm(){
//  	就操作件数*件装数+散装数
			if(this.store.length>0){
//	    	this.selectDatas.floats=this.initData.floats.concat([])
	    	this.selectDatas.intarger=[];
	    	this.initData.intarger.forEach((e,index)=>{
	    		if(e.count>0){
	    			this.selectDatas.intarger.push(e)
	    		}
	    	})
	    	this.initData.floats.forEach((e,index)=>{
	    		if(e.count>0){
	    			this.selectDatas.floats.push(e)
	    		}
	    	})
	    	if(this.selectDatas.floats.length<=0&&this.selectDatas.intarger.length<=0){
	    		this.$vux.toast.show({
            type: 'text',
            text: '选择的要上架的商品数量不能为0'
          })
	    	}else{
	    		this.$store.commit("setgoodsToMallSeleData",this.selectDatas)
	    		this.$router.push({path:'shopSelectConfirm'})
	    	}
	    }else{
	    	this.$vux.toast.show({
            type: 'text',
            text: '请先选择小店，之后再选择商品'
          })
	    }
    },
    changeList(e,index){
    	const {dataLists}=this;
    	const thisData=this.initData.intarger[index]
    },
    backScan(){
    	this.$store.commit("setshopId",[])
    	this.$router.back()
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
	.wipeList{margin-top: 10px;}
}
</style>
