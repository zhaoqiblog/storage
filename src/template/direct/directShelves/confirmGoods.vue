<template>
  <div class="self-process">
    <x-header>直送商品上架</x-header>
    	<div class="scroll-content">
		    <div class="contentWrap">
		    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div></keep-alive>
		    	<div class="storeSelect">
			      	<div class="top-margin">
			      	<goods-info-item
									v-for="(item,index) in initData" 
									:type="item.type"
									:code="item.goodsBarCode"
									:name="item.goodsName"
									:totalNum="item.availableNum"
									:unit="item.unit"
									:num="item.num"
									:textNum="item.count"
									:unitq="item.perNum"
									:key="index">
									<div slot="textNumDom" class="l-list-text">{{item.count}}</div>
								</goods-info-item>
								</div>
		    	</div>
		    </div>
	    </div>
    	 <div class="cm-footer footer-padding">
	      <button  type="button" class="btnblue-add footer-bottom" @click="submit">确认商品上架</button>
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
  	}
  },
  computed: {
  	...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		directConfirmList:state=>state.direct.directConfirmList
  	}),
  	initData:function(){
  		const datas = this.directConfirmList.map(i=>{
  			return {
  				...i,
  				type:'text',
  			}
  		})
  		return datas
  	}
  },
  created() {
  },
   mounted(){
  	
  },
  methods: {
    submit(){
			console.log("submit")
			let obj ={
			  "costCenterNum": this.commonInfo.costNumber,
			  "goodsWarehouseDetailDTOList": [],
			  warehousePlaceCode:''
			}
			obj.goodsWarehouseDetailDTOList= this.initData.map(e=>{
				return {
					 "goodsCode": e.goodsCode,
			      "goodsWarehouseId": e.id,
			      "supplyNum": e.count
				}
			})
			$request.post("/api/goods-warehouse/v1/protected/virtual/supply",obj).then(res=>{
				if(res.success==true){
					this.$router.push({path:'/success',query:{text:"上架成功",title:"提交成功",info:'请将商品移至卖场',path:'/scanEntry?key=directAddGoods'}})
				}else{
					this.$router.push({path:"/fail",query:{text:res.message,title:'商品上架',info:'上架失败',path:'/scanEntry?key=directAddGoods'}})
				}
			},err=>{
				this.$router.push({path:"/fail",query:{text:'接口调用错误，请重试',title:'商品上架',info:'上架失败',path:'/scanEntry?key=directAddGoods'}})
			})
 		}
  },
  
}

</script>
<style lang="less" scoped>
.top-margin{
	margin-top: 10px;
}
.scroll-content{padding-bottom: 50px;}
</style>
