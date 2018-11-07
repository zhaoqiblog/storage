<template>
  <div class="shop-supply pick-supply">
  	<x-header class="vux-1px-b">
  		前置仓商品信息
  	</x-header>
    <div class="scroll-content pre-content" ref="scrollWrap">
    	<pic-exchange-item v-if="data&&data.warehouseCode"
    		:warehouseCode="'前置仓货位  '+data.warehouseCode"	
    		:imgurl="data.imgurl"
    		:name="data.goodsName"
    		:code="data.goodsBarCode"
    		type="bBtn"
    		:nowNum="data.availableNum"
    		:safeNum="data.safeNum"
    		@showInput="showInput"
    		@exchange="exchangeGoods"
    		:data = "data"
    	/>
    </div>
     <div class="cm-footer">
			<div class="btnblue-add btn-scan-add" @click="changeGoogs">
	       	<span>重新扫码商品</span>
   		</div>
    </div>
    <div v-transfer-dom class="common-confirm">
      <confirm v-model="showInputCon"
      show-input
      title="输入目标货位号"
      placeholder="请输入6位货位号"
      :input-attrs="{type: 'number',pattern:'[0-9]'}"
      @on-cancel="showInputCon=false"
      @on-confirm="onConfirm">
      </confirm>
    </div>
  </div>
</template>

<script>
import { XHeader,Confirm,TransferDomDirective as TransferDom} from 'vux'
import { mapState,mapActions } from 'vuex';
import $request from '@/service/request.js';
import factory from '@/factory'
export default {
	directives: {
    TransferDom
  },
  components: {
    XHeader,Confirm
  },
  name: 'pre-goods-info',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
    lRemoveGoods:state=>state.preExchange.lRemoveGoods,
  }),
  data() {
    return {
    	data:{},
    	showInputCon:false,  //显示输入目标库位号
    }
  },
  created() {
  	let code =this.$route.query.scanResult
  	this.getGoodsInfo(code)
  },
  methods: {
  	getGoodsInfo(code){
  		$request.get("/api/goods-front-warehouse/v1/protected/queryplace/barcode",{goodsBarCode:code}).then((res)=>{
  			if(res.success==true){
  				if(res.data.warehouseCode){
	  				this.data =res.data
						this.data.warehouseCode = this.data.warehouseCode.substr(0,2)+"-"+this.data.warehouseCode.substr(2,2)+"-"+this.data.warehouseCode.substr(4);
						this.$store.dispatch("setLremoveGoods",this.data)
					}else{
						this.$vux.toast.show({
		          type: 'text',
		          text:'前置仓没有该商品，请切换商品！'
		        })
					}
  			}else{
  				this.$vux.toast.show({
	          type: 'text',
	          text:res.message
	        })
  			}
  		})
  	},
  	//重新扫描商品
  	changeGoogs(){
  		if(window.cordova){
  			factory.scan().then((res)=>{
	  			this.getGoodsInfo(res.text)
	  		})
  		}else{
	  			this.getGoodsInfo('6923600202442')
  		}
  	},
  	onConfirm(val){
			console.log(this.lRemoveGoods);
			//去移动货位的界面
			this.$router.push({name:'removeConfirm',query:{code:val}})
  	},
  	//移动货位点击事件
  	showInput(){
  		this.showInputCon=true;
  	},
  	//替换商品点击事件
  	exchangeGoods(){
  		if(window.cordova){
  			factory.scan().then(res=>{
  				this.$router.push({name:'exchangeConfirm',query:{code:res.text}})
  			})
  		}else{
			this.$router.push({name:'exchangeConfirm',query:{code:'6954767486390'}}) //商品有货位
//			this.$router.push({name:'exchangeConfirm',query:{code:'2302335000006'}})//商品无货位
  		}
  	}
  },
}
</script>
<style lang="less">
</style>
