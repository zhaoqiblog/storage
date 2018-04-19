<template>
  <div class="self-process">
    <x-header :left-options="{preventGoBack:true}" @on-click-back="backScan">确认入库商品</x-header>
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
	      <button  type="button" class="btnblue-add footer-bottom" @click="submit"><i></i>&nbsp;&nbsp;下一步，请扫描库位码</button>
    	</div>
  </div>
</template>
<script>
import { XHeader} from 'vux'
import factory from '@/factory'
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
  },
   mounted(){
  	
  },
  methods: {
  	/**
  	 * 请扫描库位码
  	 */
    submit(){
    	if(window.cordova){
    		factory.scan().then(res=>{
    			this.$router.push({path:'placeConfirm',query:{scanResult:res.text}})
    		})
    	}else{
    		this.$router.push({path:'placeConfirm',query:{scanResult:'101'}})
    	}
			
 		},
 		backScan(){
 			this.$router.push({path:'directAddToStore',query:{scanResult:this.$route.query.scanResult}})
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
