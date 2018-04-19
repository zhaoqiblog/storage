<template>
  <div class="self-process">
    <x-header backScan>散货小店选择</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    	<div class="scroll-content">
    <div class="contentWrap">
    	<div class="shopName vux-1px-t"><i></i>{{commonInfo.costName}}</div></keep-alive>
    	<group title="" label-width="5em" class="storeSelect-wrap">
		   <popup-picker title="小店" :data="listdatas" :columns="3" v-model="store" @on-change="changeStore" show-name placeholder="请选择小店"></popup-picker>
		 </group>
    	<div class="storeSelect">
	      	<div class="">
	      		<p class="listTitle titleIndos" style="">
  						<span style="margin-left: 16px;">商品信息</span>
  						<span style="margin-right: 16px;">上架数量</span>
  					</p>
	      	<goods-info-item @change="shangeCount"
							v-for="(item,index) in initData.allGoods" 
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
    	</div>
	   
    </div>
    <!--</scroller>-->
    </div>
    <div class="cm-footer"> <!--:disabled=""--> 
      	<button  type="button" class="btnblue-add footer-bottom" :disabled="disableds" @click="gotoConfirm">完成</button>
    	</div>
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
    	selectDatas:{floats:[],intarger:[],storecode:[],storename:'',receiveGoodsId:'',allGoods:[]},  //传给下一个页面的数据
    	tablist:[/*{name:"散货商品",value:0,index:1},{name:"整件商品",value:0,index:2}*/],
    	initData:{floats:[],intarger:[],allGoods:[]},  //列表tab切换请求数据
    	store:[],
    	listdatas: [
		    ],
		    dataLists:{
		    	datas:[],
					datas1:[]
			},
			disableds:true,
  	}
  },
  computed: {
  	...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		storeInfo:state=>state.global.storeInfo,
  		goodsToMallSeleData:state=>state.turnoverArea.goodsToMallSeleData,
  		shopId:state=>state.turnoverArea.shopId,
  		
  	})
  },
  created() {
  	let code = this.$route.query.scanResult
  	this.palletCode=code;
  	this.costCenterNum=this.commonInfo.costNumber;
		this.getTrayInfo();
  },
   mounted(){
//	this.swipeHeight=this.dataLists.datas.length*110+55+'px'
  	
  },
  methods: {
	getTrayInfo(callback){
			let obj = {palletCode:this.palletCode,costCenterNum:this.commonInfo.costNumber}
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
						let intarger=[],floats=[],allGoods=[];
						this.listdatas.push({name:e.shopName,value:e.ShopCode,intarger:[],floats:[],allGoods:[]})
						e.goodsInfo.forEach((r,n)=>{
							r.type="input";
							r.count=0;
							allGoods.push(r);
							if(r.inBulkNum>0){
								floats.push(r)
							}else{
								intarger.push(r);
							}
						})
						this.listdatas[i].intarger=intarger.concat([])
						this.listdatas[i].floats=floats.concat([])
						this.listdatas[i].allGoods=allGoods.concat([])
					})
					console.log(this.storeInfo)
					console.log(this.listdatas)
					
					//如果用户的小店存在，
					if(this.storeInfo.shopCode){
						console.log("用户所在小店存在")
						let isStore = this.listdatas.filter(items=>{
							return items.value==this.storeInfo.shopCode
						})
						//当前托盘上有当前用户所在的小店，默认选中用户所在小店
						if (isStore.length>0){
							console.log("用户所在小店存在且托盘上有该小店的商品")
							this.store=[isStore.value]
						}else{  //托盘上没有操作用户所在的小店，给提示，然后默认选中第一个
							console.log("用户所在小店存在，但是托盘上没有改小店的商品")
							this.$vux.toast.show({
				        type: 'text',
				        text: '该托盘上没有您所在的小店商品信息，但您仍可操作',
				        time:3000,
				      })
							this.store=[this.listdatas[0].value]
						}
					}else{   //如果用户所在小店不存在，默认选中第一条
						console.log("用户所在小店不存在，默认选中第一条")
						this.store=[this.listdatas[0].value]
					}
//					this.store[0]=this.commonInfo.stores[0].storeCode
						console.log(this.store,this.commonInfo.stores)
						this.selectShop(this.store)
				}else{
					this.$router.push({path:'/fail',query:{text: re.message,title: '商品上架',info: '', path:'/scanEntry?key=goodsToMall'}})
				}
			})
	},
    changeStore(val){
    	console.log(val)
    	const {listdatas}=this;
    	this.$store.commit("setshopId",val)
			this.selectShop(val);
			this.disableds=true;
    },
    selectShop(val){
    	this.listdatas.forEach((e)=>{
    		if(e.value==val[val.length-1]){
    			this.selectDatas.storename=e.name;
					this.initData={...e}
    		}
    	})
//  	console.log(this.init)
    	this.initData.allGoods.forEach((a)=>{
    		a.count=0
    	})
    },
    gotoConfirm(){
//  	就操作件数*件装数+散装数
			if(this.store.length>0){
	    	this.initData.allGoods.forEach((e,index)=>{
	    		if(e.count>0){
	    			this.selectDatas.allGoods.push(e)
	    		}
	    	})
	    	if(this.selectDatas.allGoods.length<1){
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
    },
    shangeCount(val,index){
			this.disableds=this.initData.allGoods.filter((e)=>{
		    		return e.count>0
		    	}).length>0 ? false:true
		    },
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
