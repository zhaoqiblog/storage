<template>
  <div class="self-process">
    <x-header :left-options="{backText: '',preventGoBack:true}" @on-click-back="back"><span>目标库位合并后情况</span></x-header>
     <!--<scroller class="scroll-view" lock-x height="-45px">-->
     	<div class="scroll-content content-wrap">
	    <div class="contentWrap">
	    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
	    	<div class="totalNums">
				<dl>
					<dt>{{targetPlaceCode}}</dt>
					<dd>目标库位码</dd>
				</dl>
				<dl>
					<dt>{{initData.goodsSize}}</dt>
					<dd>SKU数量</dd>
				</dl>
				<dl>
					<dt>{{initData.goodsNum}}</dt>
					<dd>库存总件数</dd>
				</dl>
    	</div>
	    	<cell class="lastCode" title="原库位码" :value="$route.query.lastPlaceCode"></cell>
	    	<div class="goodsList" style="padding-bottom: 0;">
	    		<p class="listTitle"><span>商品信息</span><span>数量</span></p>
	    		<div class="listWrap">
						<goods-info-item
							v-for="(item,index) in dataList"
							:type="item.type"
							:code="item.goodsBarCode"
							:name="item.goodsName"
							:time="item.time"
							:totalNum="item.availableNum"
							:unit="item.unit"
							:num="item.num"
							:unitq="item.perNum"
							:altogether="item.altogether"
							:key="index">
							<div slot="textNumDom" class="l-list-text listInfo-cell-Info">
								<span>{{item.allNums}}</span>
							</div>
						</goods-info-item>
	    		</div>
	    	</div>
	    </div>
     <!--</scroller>-->
     </div>
    	<!--<div class="footer-bottom" @click="gotosuccess">确认入库</div>-->
    	 <div class="cm-footer">
      <div class="btn-add" @click="changePlaceCode">
       		修改目标库位
      </div>
      <div class="btn-submit">
        <button type="button" @click="commit" :disabled="disabled">确认合并</button>
      </div>
    </div>
    <div v-transfer-dom class="alert-info">
      <confirm v-model="showInput"
      title="输入库位码"
      confirm-text="确认"
      @on-confirm="confirmInput">
      <div class="vux-prompt"><input placeholder="请输入" v-model.trim="warehousecode" class="vux-prompt-msgbox" type="number"></div>
      </confirm>
    </div>
  </div>
</template>
<script>
import {XHeader,Scroller,Cell,Confirm,TransferDomDirective as TransferDom} from 'vux'
import factory from '@/factory'
import { mapGetters,mapState } from 'vuex'
import $request from '@/service/request.js'
//import
export default {
	directives: {
    TransferDom
  },
  components: {
    XHeader,Scroller,Cell,Confirm
  },
  name: 'turnoverIndex',
  data() {
    return {
    	warehousecode:'',
    	dataList:[],
    	initData:{},
    	targetPlaceCode:'',
    	disabled:true,
    	showInput:false,
    }
  },
  computed: {
  	...mapState({
			commonInfo:state=>state.global.commonInfo,
			inventoryToConfirm:state=>state.backCount.inventoryToConfirm,
		})
  },
  created() {
  	this.targetPlaceCode=this.$route.query.scanResult
  	let obj = {
  		warehousePlaceCode:this.$route.query.scanResult,
			costCenterNum:this.commonInfo.costNumber,
			warehouseType:0,
		}
		
		this.getPlaceCodeInfo(obj)
	},
  mounted(){
  },
  methods: {
  	getPlaceCodeInfo(obj){
  		let goodsListsInfo=[...this.inventoryToConfirm].map(i=>{return {...i,type:'text'}});
  		$request.get("/api/goods-warehouse/v1/protected/queryWarehouseGoods",obj).then(res=>{
  		if(res.success==true){
  			this.disabled=false;
  			this.initData=res.data
  			let tmpList=[...res.data.goodsInfo].map(e=>{return{...e,allNums:e.availableNum,type:'text',time:'入库时间：'+new Date(e.intoWarehouseTime).format("yyyy-MM-dd hh:mm"),}})
  			let e = this.getArray(tmpList,goodsListsInfo)
  			this.dataList=e.map(it=>{return it});
  		}else{
  			this.disabled=true;
  			let e = this.getArray([],goodsListsInfo)
  			this.dataList=e.map(it=>{return it});
			 this.$vux.toast.show({
			 	type:'text',
			 	text:res.message || '获取库位上的商品信息失败，请重试！',
			 	time:5000,
			 })
  		}
  	}).catch(err=>{
  		this.disabled=true;
		  this.$vux.toast.show({
			 	type:'text',
			 	text:'获取库位上商品信息失败，请重试！',
			 	time:3000,
			})
  	})
	},
  	/*修改目标库位*/
  	changePlaceCode(){
  		this.showInput=true;
//			if(window.cordova) {
//				 factory.scan().then(res=>{
//				 	this.targetPlaceCode=res.text;
//				 	let obj = {
//				  		warehousePlaceCode:this.targetPlaceCode,
//							costCenterNum:this.commonInfo.costNumber,
//							warehouseType:0,
//						}
//				 	this.getPlaceCodeInfo(obj)
//				 })
//			}else{
//		  		this.targetPlaceCode='A103'
//	  			let obj = {
//			  		warehousePlaceCode:this.targetPlaceCode,
//						costCenterNum:this.commonInfo.costNumber,
//						warehouseType:0,
//					}
//		  		this.getPlaceCodeInfo(obj)
//		}
	
  	},
  	/**
  	 * 修改目标库位完成
  	 */
  	 confirmInput(val){
  	 	if(this.warehousecode){
	 		this.targetPlaceCode=this.warehousecode;
  	 		let obj = {
			  		warehousePlaceCode:this.warehousecode,
						costCenterNum:this.commonInfo.costNumber,
						warehouseType:0,
					}
		  		this.getPlaceCodeInfo(obj)
  	 	}
  	 },
		commit(){
			let obj={
//				costCenterNum:this.commonInfo.costNumber,
				targetPlaceCode:this.targetPlaceCode,
			}
			obj.opWarehouseDetailDTOList=this.inventoryToConfirm.map(item=>{
					return {
						goodsCode:item.goodsCode,
						goodsBarCode:item.goodsBarCode,
						goodsName:item.goodsName,
						goodsWarehouseId:item.id,
						supplyNum:item.allNums,
						warehousePlaceId :item.warehouseId
					}
				})
				$request.post("/api/goods-warehouse/v1/protected/move_warehouse_supply",obj).then(res=>{
				if(res.success==true){
					this.$router.push({
		    		path:'/success',
			    	query:{
			    		text:"合并成功",
			    		title:`库位合并`,
			    		warehouseA:this.$route.query.lastPlaceCode,
			    		warehouseB:this.targetPlaceCode,
			    		path:'/scanEntry?key=selectMergeGoods'
			    	}
			    })
				}else{
						this.$router.push({
		    		path:'/fail',
			    	query:{
			    		text:res.message||"库位合并失败，请重试！",
			    		title:`库位合并`,
			    		path:'/scanEntry?key=selectMergeGoods'
			    	}
			    })
				}
			}).catch(err=>{
					this.$router.push({
		    		path:'/fail',
			    	query:{
			    		text:"库位合并失败，请重试！",
			    		title:`库位合并`,
			    		path:'/scanEntry?key=selectMergeGoods'
			    	}
			    })
			})
    	
		},
		
  	back(){
  		this.$router.push({
  			path:'mergeGoodsAmount',
  			query:{
  				  scanResult:this.$route.query.lastPlaceCode,
						goodsSize:this.$route.query.goodsSize,
						goodsNum:this.$route.query.goodsNum,
  			}
  		})
  	},
  	getArray(){
  		
  		var arr = arguments;
//		if(arr[0].length<1){
//  		listb=listb.map(e=>{
//  			return {
//  				...e,
//  				availableNum:0,
//  				num:0
//  			}
//  		})
//			}
			var res = new Array();
			var index = 0;
			var isTrue = false;
			for(var i = 0;i<arr.length;i++){
				if(arr[i] instanceof Array){
					for(var j = 0;j<arr[i].length;j++){
						if(res.length==0){
							res[index]=arr[i][j];
							continue;
						}
						for(var k =0;k<res.length;k++){
							if(res[k].goodsBarCode==arr[i][j].goodsBarCode){
								res[k].allNums+=arr[i][j].allNums;
								isTrue=true;
								break;
							}else{
								isTrue=false;
							}
						}
						if(!isTrue){
							isTrue=false;
							index++;
							res[index]=arr[i][j];
						}
					}
				}else{
					continue;
				}
			}
			return res;
  	},
  }
}

</script>
<style lang="less">
.listTitle{display: flex;justify-content: space-between;align-items: center;}
.lastCode{background: #48475A;color: #FFFFFF;}
</style>
