<template>
  <div class="self-process">
    <x-header>添加商品</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    	<div class="scroll-content">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div></keep-alive>
    	<div class="storeSelect">
	      	<div class="">
	      	<goods-info-item @change="shangeCount"
							v-for="(item,index) in initData" 
							:type="item.type"
							:code="item.goodsBarCode"
							:name="item.goodsName"
							:totalNum="item.availableNum"
							:unit="item.unit"
							:num="item.num"
							:textNum="item.textNum"
							:unitq="item.perNum"
							:altogether="item.availableNum"
							v-model="item.count"
							:key="index">
						</goods-info-item>
						</div>
						<!--&&initData.intarger.length>0-->
    	</div>
	   
    </div>
    <!--</scroller>-->
    </div>
    	 <div class="cm-footer">
	      <div class="btn-add">
	       <span @click="addGoods">继续扫描</span>
	      </div>
	      <div class="btn-submit">  <!--:disabled=""-->
	        <button type="button" @click="gotoConfirm" :disabled="disableds">确认上架清单</button>
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
    	initData:[],  //列表tab切换请求数据
			disableds:true,
  	}
  },
  computed: {
  	...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		directConfirmList:state=>state.direct.directConfirmList
  	}),
  },
  created() {
  	this.scanGoods(this.$route.query.scanResult)
  },
   mounted(){
  },
  methods: {
  	/*
  	 * 扫描商品并请求函数
  	 */
  	scanGoods(goodBarCode){
  		
//			if(isExit){
//				this.$vux.toast.show({
//          type: 'text',
//          text: '该商品已经在列表中',
//        })
//			}else{
	  		let obj ={goodsBarCode:goodBarCode,costCenterNum:this.commonInfo.costNumber}
		  	$request.get("/api/goods-warehouse/v1/protected/queryVirtualByGoodsBarCode",obj).then(res=>{
		  		if(res.success==true){
		  			if(res.data&&res.data.length>0){
		  				
//		  				let isExit = this.initData.some(n=>{
//								return n.goodsBarCode == goodBarCode
//							})
//			  				this.initData.push({
//		  					...res.data[0],
//		  					type:'input',
//		  					count:0
//		  				})
							res.data.forEach(item=>{
		  					let isExit = this.initData.some(n=>{
									return n.id == item.id
								})
		  					if(isExit){
		  						this.$vux.toast.show({
				            type: 'text',
				            text: goodBarCode+'商品已经在列表中',
				          })
		  					}else{
			  					this.initData.push({
				  					...item,
				  					type:'input',
				  					count:0
				  				})
		  					}
		  				})
		  			}
		  		}else{
		  			this.$router.push({path:'/fail',query:{text: res.message,title: '直送商品上架', path:'/scanEntry?key=directAddGoods'}})
		  		}
		  	},err=>{
		  		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '直送商品上架', path:'/scanEntry?key=directAddGoods'}})
		  	})
//	  	}
  	},
		/*
		 *确认上架
		 * */
    gotoConfirm(){
			this.$store.commit("setdirectConfirmList",this.initData.filter(i=>{return i.count>0}))
			this.$router.push({path:'confirmGoods'})
    },
    /**
     *继续扫描 
     **/
    addGoods(){
    	if(window.cordova){
    		factory.scan().then(i=>{
    			this.scanGoods(i.text)
    			this.disableds=true
    		})
    	}else{
    		this.scanGoods('2304050000002')
    		this.disableds=true
    	}
    },
    shangeCount(val,index){
    	if(val){
    		this.disableds=this.initData.filter((e)=>{
		    		return e.count<1
		    	}).length>0 ? true:false
    	}else{
    		this.disableds=true
    	}
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
		margin-top: 10px;
	}
	.wipeList{margin-top: 10px;}
}
</style>
