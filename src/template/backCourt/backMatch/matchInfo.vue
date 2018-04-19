<template>
  <div class="self-process">
    <x-header><span>后场反配</span></x-header>
     	<div class="scroll-content">
	    <div class="contentWrap">
	    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
	    	<div class="totalNums">
				<dl>
					<dt>{{$route.query.scanResult}}</dt>
					<dd>库位码</dd>
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
    		<group title="" label-width="5em" class="storeSelect-wrap">
			   <popup-picker title="反配库位" :data="wareHouseCode" v-model="selectPlaceCode" show-name placeholder="点击选择"></popup-picker>
			 </group>
	    	<div class="goodsList">
	    		<m-empty v-if="showEmpty"></m-empty>
	    		<p class="listTitle" v-if="!showEmpty"><span>商品信息</span><span>数量</span></p>
	    		<div class="listWrap">
					<goods-info-item @change="changeCount"
						v-for="(item,index) in dataList"
						:sideslip="item.sideslip"
						:type="item.type"
						:depotCode="item.depotCode"
						:code="item.goodsBarCode"
						:name="item.goodsName"
						:time="item.time"
						:totalNum="item.availableNum"
						:unit="item.unit"
						:num="item.num"
						:unitq="item.perNum"
						v-model="item.count"
						:key="index">
					</goods-info-item>
	    		</div>
	    		
	    	</div>
	    </div>
     </div>
     <div class="cm-footer">
      	<button  type="button" class="btnblue-add footer-bottom" :disabled="isDisabled||selectPlaceCode.length==0||selectPlaceCode[0]==''" @click="commit">提交反配单</button>
    	</div>
     	<!--<div class="footer-bottom" @click="commit" >提交反配单</div>-->
  </div>
</template>
<script>
	import MEmpty from '@/components/MEmpty/index'
import {XHeader,Cell,Group,PopupPicker} from 'vux'
import factory from '@/factory'
import { mapGetters,mapState } from 'vuex'
import $request from '@/service/request.js'
//import
export default {
  components: {
    XHeader,Cell,Group,PopupPicker,MEmpty
  },
  data() {
    return {
    	selectDatas:[],
    	dataList:[],
    	selectPlaceCode:[],		//选择的返配库位
    	wareHouseCode:[[{name:'暂无数据',value:""}]],			//反配库位列表
    	initData:{},
    	isDisabled:true,
    	showEmpty:false,
    }
  },
  computed: {
		...mapState({
			commonInfo:state=>state.global.commonInfo,
			changewareHouseList:state=>state.backCount.wareHouseList,
		})
  },
  created() {
  	this.getGoodListInfo()
		if(this.changewareHouseList.length){
			this.wareHouseCode=[[...this.changewareHouseList]]
		}else{
			/**
			 * 获取库位信息
			 * */
	  	let getplaceobj={isReturnPlace:1,costCenterNum:this.commonInfo.costNumber}
	  	$request.get("/api/sys-warehouse/v1/protected/queryWarehouses",getplaceobj).then(res=>{
	  		if(res.success==true){
	  			if(res.data.length>0){
	  				let tmpLi=res.data.map(e=>{return {name:e.warehousePlaceName,value:e.warehousePlaceCode}})
						this.$store.dispatch("changewareHouseList",tmpLi)
						this.wareHouseCode=[[...this.changewareHouseList]]
	  			}else{
	  				this.wareHouseCode=[[{name:'暂无数据',value:""}]]
	  			}
	  		}else{
	  			this.$vux.toast.show({
	          type: 'text',
	          text: res.message || '获取反配库位列表失败',
	        })
	  		}
	  	},error=>{
	  		this.$vux.toast.show({
		      type: 'text',
		      text: '获取返配库位列表失败',
		    })
	  	})
		}
		
  },
  mounted(){
  },
  methods: {
  	/*获取库位上的商品信息*/
  	getGoodListInfo(){
  		let getListObj={
  			warehousePlaceCode:this.$route.query.scanResult,
  			costCenterNum:this.commonInfo.costNumber,
			warehouseType:0,
  		}
  		$request.get("/api/goods-warehouse/v1/protected/queryWarehouseGoods",getListObj).then(res=>{
  			if(res.success==true){
  				this.showEmpty=res.data.goodsInfo.length>0? false:true
  				this.dataList=res.data.goodsInfo.map(item=>{
  					return {
	  					...item,
	  					time:'入库时间：'+new Date(item.intoWarehouseTime).format("yyyy-MM-dd"),
	  					count:0,
	  					type:'input',
	  				}
  				})
  				this.initData=res.data
  			}else{
	  			this.$router.push({path:'/fail',query:{text: res.message || '服务器错误,获取库位上商品信息失败,请重试!',title: '后场反配', path:'/scanEntry?key=backMatck'}})
  			}
  		},err=>{
  			this.$router.push({path:'/fail',query:{text: '服务器错误,获取库位上商品信息失败,请重试!',title: '后场反配', path:'/scanEntry?key=backMatck'}})
  		})
  	},
    scan () {
      factory.scan().then(function(res) {
        alert('success:' + JSON.stringify(res))
      })
    },
    /* 提交反配单 */
    commit(){
    	let listToconfirm=this.dataList.filter(a=>{return a.count>0}).map(e=>{return {goodsCode:e.goodsCode,goodsWarehouseId:e.id,supplyNum:e.count,warehouseId:e.warehouseId}})
    	let submitObj={
			  costCenterNum: this.commonInfo.costNumber,
			  opWarehouseDetailDTOList: listToconfirm,
			  targetPlaceCode: this.selectPlaceCode[0]
			}
    	if(!submitObj.targetPlaceCode){
    		this.$vux.toast.show({
		      type: 'text',
		      text: '目标反配库位不能为空！请选择',
		    })
    		return;
    	}else if(submitObj.opWarehouseDetailDTOList.length<1){
    		this.$vux.toast.show({
		      type: 'text',
		      text: '反配商品不能为空，请输入要反配的商品的数量！',
		    })
    		return;
    	}else{
    		$request.post("/api/goods-warehouse/v1/protected/warehouseToReturnWarehouse",submitObj).then(res=>{
    			if(res.success==true){
    				this.$router.push({
    					path:"/success",
    					query:{
    						title:'后场反配',
    						text:'反配成功',  
    						wareHousea:this.$route.query.scanResult,
    						wareHouseb:submitObj.targetPlaceCode,
    						path:'/scanEntry?key=backMatck'
    					}
    				})
    			}else{
	    			this.$router.push({
	    				path:"/fail",
	    				query:{
	    						title:'后场反配',
	    						text:res.message||'反配失败，请重试！', 
	    						path:'/scanEntry?key=backMatck'
	    					}
	    			})
	    		}
    		},err=>{
    			this.$router.push({
	    				path:"/fail",
	    				query:{
	    						title:'后场反配',
	    						text:'反配失败，请重试！',
	    						path:'/scanEntry?key=backMatck'
	    					}
	    			})
    		})
    	}
    },
    changeCount(){
    	if(this.dataList.filter(item => {
        return (item.count != null && item.count != 0 && !isNaN(item.count))
      }).length > 0) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    }
  }
}

</script>
<style lang="less">
.listTitle{display: flex;justify-content: space-between;align-items: center;}
.lastCode{background: #48475A;color: #FFFFFF;}
</style>
