<template>
  <div class="self-process">
    <x-header >库位盘点详情</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
<div class="scroll-content content-wrap">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{this.commonInfo.costName}}</div>
    	<div class="totalNums">
				<dl>
					<dt>{{$route.query.scanResult}}</dt>
					<dd>库位码</dd>
				</dl>
				<dl>
					<dt>{{titleInfo.goodsSize}}</dt>
					<dd>SKU数量</dd>
				</dl>
    	</div>
    	<keep-alive>
	    	<div class="goodsList">
	    		<m-empty v-if="showEmpty"></m-empty>
	    		<p class="listTitle" v-if="!showEmpty"><span>商品信息</span><span>数量</span></p>
	    		<div class="listWrap">
	    			<!--@change="changeCount"-->
							<goods-info-item  :class="selectId=='a'+item.goodsBarCode?'active':''"
								v-for="(item,index) in inventoryList" 
								:sideslip="item.sideslip"
								:type="item.type"
								:code="item.goodsBarCode"
								:name="item.goodsName"
								:maxBan='true'
								v-model="item.count"
								:key="index"
								:id="'a'+item.goodsBarCode">
							</goods-info-item>
	    		</div>
	    	</div>
    	</keep-alive>
    </div>
    <!--</scroller>-->
   </div>
    <!--<div class="footer-bottom" @click="complete">完成</div>-->
    <div class="cm-footer">
      <div class="btn-add">
       <span @click="toInfo()">扫描商品</span>
      </div>
      <div class="btn-submit">
        <button type="button" @click="toConfirmApply">盘点完毕</button>
      </div>
    </div>
  </div>
</template>
<script>
import MEmpty from '@/components/MEmpty/index'
import { XHeader,Scroller} from 'vux'
import factory from '@/factory'
import func from '@/func'
import $request from '@/service/request.js'
import { mapGetters,mapState } from 'vuex'
//import
export default {
  components: {
    XHeader,Scroller,MEmpty
  },
  data() {
    return {
    	selectId:'',
    	dataList:[],
    	titleInfo:{goodsNum:'',sumAvailableNum:''},
//  	tmpDatas:[]
			showEmpty:false,
    }
  },
  computed: {
	 ...mapState({
				commonInfo:state=>state.global.commonInfo,
				inventoryToConfirm:state=>state.backCount.inventoryToConfirm,
				inventoryList:state=>state.backCount.inventoryList,
			})
  },
  created() {
  	/**
  	 * 解决android输入框键盘弹起时挡住界面的问题
  	 */
  	window.addEventListener('resize', () => { 
		 if (document.activeElement.tagName == 'INPUT') {  
		  //延迟出现是因为有些 Android 手机键盘出现的比较慢   
		  window.setTimeout(() => {
		   document.activeElement.scrollIntoViewIfNeeded();  
		 }, 100); 
		} });
  	
		const obj={
			warehousePlaceCode:this.$route.query.scanResult,
			costCenterNum:this.commonInfo.costNumber,
			warehouseType:0,
		}
   $request.get("/api/goods-warehouse/v1/protected/queryWarehouseGoods",obj).then(res=>{
   	if(res.success==true){
   		 this.showEmpty = res.data.goodsInfo&&res.data.goodsInfo.length>0 ? false:true
	   	 this.titleInfo={...res.data}
	   	 if(res.data.goodsInfo){
		     let listd=[...res.data.goodsInfo].map(item=>{
		     	return {
		     		...item,
		     		type:'input',
		     		count:item.availableNum,
		     	}
		     })
		     this.$store.dispatch("changeinventoryList",listd)
	     }else{
	     	this.$store.dispatch("changeinventoryList",[])
	     }
	     
	   }else{
	   	this.$router.push({path:"/fail",query:{title:"库位盘点",text:res.message||'获取库位上的商品信息失败,请重试!',path:'/scanEntry?key=inventory'}})
	   }
   },err=>{
	   	this.$router.push({path:"/fail",query:{title:"库位盘点",text:'获取库位上的商品信息失败,请重试!',path:'/scanEntry?key=inventory'}})
   })
  },
  methods: {
  	//确认进行库位盘点
  	toConfirmApply(){
  		//库位盘点时，没扫到的商品信息是否一起传给后台？
//		let list =this.inventoryList.filter(item=>{return item.count>0})
			this.$store.dispatch("chaninventoryToConfirm",this.inventoryList)
			let submitList=this.inventoryList.map(e=>{
				return {
					"costCenterNum": this.commonInfo.costNumber,
			    "goodsBarCode": e.goodsBarCode,
			    "goodsWarehouseId": e.id,
			    "realityNum": e.count,
					"warehouseCode":e.warehouseCode
				}
			})
			$request.post("/api/goods-warehouse/v1/protected/warehouse/check",submitList).then(res=>{
				if(res.success==true){
					this.$router.push({path:"inventoryResult",query:{id:res.data}})
				}else{
					this.$router.push({path:'/fail',query:{text: res.message||'服务器错误,库位盘点失败,请重试!',title: '库位盘点', path:'/scanEntry?key=inventory'}})
				}
			},err=>{
				this.$router.push({path:'/fail',query:{text:'服务器错误,库位盘点失败,请重试!' ,title: '库位盘点',info: '', path:'/scanEntry?key=goodsTostore'}})
			})
  	},
  	/**
  	 * 定位
  	 */
  	positionGoods (goodaBarCode,isnew) {
  		const selector="#a" + goodaBarCode
  		this.selectId=selector.slice(1)
  		if(!isnew){
		    var anchor = this.$el.querySelector(selector)
		    this.$el.querySelector(".scroll-content").scrollTop = anchor.offsetTop
	   	}else{
	   	
	   	}
  	},
    /*
     * 扫描商品
     */
  	toInfo() {
  		if(window.cordova) {
        factory.scan().then(res => {
        	let isWareCode = this.inventoryList.filter(i=>{
        		return i.goodsBarCode==res.text
        	})
        	if(isWareCode.length>0){
							this.positionGoods(res.text)
        	}else{
        		$request.get("/api/product-query/v1/protected/queryGoodsWarehouseInfo",{goodsBarCode:res.text,costCenterNum:this.commonInfo.costNumber}).then(res=>{
        			if(res.success==true){
	        			this.showEmpty=false;
	        			let obj = {...res.data,id:res.data.goodsWarehouseId,type:'input',count:"",warehouseCode:this.$route.query.scanResult}
	        			if(this.inventoryList.some(i=>{return i.goodsBarCode==res.data.goodsBarCode})){
	        				this.$vux.toast.show({
									 	type:'text',
									 	text:'列表中已存在该商品！',
									 	time:2000,
									})
	        			}else{
	        				this.inventoryList.unshift(obj)
	        			}
	        			this.positionGoods(res.data.goodsBarCode,true)
	        		}else{
	        			this.$vux.toast.show({
								 	type:'text',
								 	text:res.message,
								 	time:5000,
							 })
	        		}
        		},err=>{
        				this.$vux.toast.show({
								 	type:'text',
								 	text:'接口错误，请联系管理员',
								 	time:3000,
								})
        		})
        	}
        	
        })
      } else {
      	let isWareCode = this.inventoryList.filter(i=>{
        		return i.goodsBarCode=='6930210788662'
        	})
      	if(isWareCode.length>0){
      		this.positionGoods('6930210788662')
      	}else{
      		$request.get("api/product-query/v1/protected/queryGoodsWarehouseInfo",{goodsBarCode:'6930210788662',costCenterNum:this.commonInfo.costNumber}).then(res=>{
        		if(res.success==true){
        			this.showEmpty=false;
        			let obj = {...res.data,id:res.data.goodsWarehouseId,type:'input',count:0,warehouseCode:this.$route.query.scanResult}
        			if(this.inventoryList.some(i=>{return i.goodsBarCode==res.data.goodsBarCode})){
        				this.$vux.toast.show({
								 	type:'text',
								 	text:'列表中已存在该商品！',
								 	time:2000,
								})
        			}else{
        				this.inventoryList.unshift(obj)
        			}
        			this.positionGoods(res.data.goodsBarCode,true)
        		}else{
        			this.$vux.toast.show({
							 	type:'text',
							 	text:res.message,
							 	time:5000,
						 })
        		}
        	},err=>{
        		this.$vux.toast.show({
						 	type:'text',
						 	text:'接口错误，请联系管理员',
						 	time:3000,
						})
        	})
      	}
      	
      }
   },
  }
}

</script>
<style lang="less">
	@import url("../../../css/footer.less");
</style>
