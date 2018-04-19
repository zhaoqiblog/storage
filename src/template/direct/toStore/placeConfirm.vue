<template>
  <div class="self-process">
    <x-header>关联库位</x-header>
    	<div class="scroll-content">
		    <div class="contentWrap">
		    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div></keep-alive>
		    	<div class="locationCode success">
		    		库位码：{{placeCode}}
		    	</div>
		    	<div class="storeSelect">
			      	<div class="">
			      		<p class="listTitle titleIndos" style="">
	  						<span style="margin-left: 16px;">商品列表({{initData.length}})</span>
  						</p>
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
    	<div class="cm-footer">
	      <div class="btn-add">
	       <span @click="changePlaceCode">更换库位码</span>
	      </div>
	      <div class="btn-submit">
	        <button type="button" @click="submit" :disabled="!placeCode">关联</button>
	      </div>
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
    	placeCode:'',
  	}
  },
  computed: {
  	...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		directToStoreList:state=>state.direct.directToStoreList
  	}),
  	initData:function(){
  		const datas = this.directToStoreList.map(i=>{
  			return {
  				...i,
  				type:'text',
  			}
  		})
  		return datas
  	}
  },
  created() {
  	this.placeCode=this.$route.query.scanResult
  },
   mounted(){
  	
  },
  methods: {
  	/**
  	 * 修改目标库位
  	 */
  	changePlaceCode(){
  		if(window.cordova){
  			factory.scan().then(res=>{
  				this.placeCode=res.text;
  			})
  		}else{
  			this.placeCode='102';
  		}
  	},
  	/**
  	 * 提交
  	 */
    submit(){
    	const obj ={
		  "costCenterNum": this.commonInfo.costNumber,
		  "goodsWarehouseDetailDTOList": [],
		  "warehousePlaceCode": this.placeCode
		}
    	obj.goodsWarehouseDetailDTOList=this.initData.map(e=>{
    		return {
		       "goodsCode": e.goodsCode,
			      "goodsWarehouseId": e.id,
			      "supplyNum": e.count
    		}
    	})
    	$request.post("api/goods-warehouse/v1/protected/virtual/virtualMoveWarehouse",obj).then(res=>{
    		if(res.success==true){
    			this.$router.push({path:'/success',query:{text:"关联成功",title:"提交成功",info:'请将商品移至库位'+this.placeCode,path:'/scanEntry?key=directAddToStore'}})
    		}else{
    			this.$router.push({path:"/fail",query:{text:res.message,title:'商品上架',info:'操作失败',path:'/scanEntry?key=directAddToStore'}})
    		}
    	},err=>{
    		this.$router.push({path:"/fail",query:{text:'服务器错误，请重试！',title:'商品上架',info:'操作失败',path:'/scanEntry?key=directAddToStore'}})
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
