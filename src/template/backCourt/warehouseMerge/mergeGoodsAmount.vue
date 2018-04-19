<template>
  <div class="self-process">
    <x-header :left-options="{backText: '',preventGoBack:true}" @on-click-back="back"><span>输入合并数量写</span></x-header>
     <!--<scroller class="scroll-view" lock-x height="-45px">-->
     	<div class="scroll-content content-wrap">
	    <div class="contentWrap">
	    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
	    	<div class="goodsList" style="padding-bottom: 0;">
	    		<p class="listTitle"><span>商品信息</span><span>数量</span></p>
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
     <!--</scroller>-->
     </div>
      <!--<div class="cm-footer">
      	<button  type="button" class="btnblue-add footer-bottom" :disabled="isDisabled" @click="toShowPlace"><i></i>&nbsp;&nbsp;下一步，请扫描目标库位码</button>
    	</div>-->
    	<div class="cm-footer">
		    <div class="btn-add" @click="toShowPlace()">
		    	<button><span><i></i>&nbsp;&nbsp;请扫描库位码</span></button>	
		  	</div>
		  <div class="btn-submit" @click="inputCode">
		    <button type="button">输入库位码</button>
		  </div>
    </div>
    <div v-transfer-dom class="alert-info">
      <confirm v-model="showInput"
      	mask-z-index='10'
	      title="输入库位码"
	      placeholder='请输入'
	      @on-confirm="confirmInput">
      <!--<div><input type="text" v-model.trim="warehousecode"/></div>-->
      <div class="vux-prompt"><input placeholder="请输入" v-model.trim="warehousecode" class="vux-prompt-msgbox"  type="number"></div>
      </confirm>
    </div>
    <!--<div class="alert-wrap" v-if="showInput1"></div>-->
    <!--<div class="weui-dialog new-dialoag" style="" v-if="showInput1">
    	<div class="weui-dialog__hd">
    		<strong class="weui-dialog__title">输入库位码</strong>
    	</div>
    	<div class="vux-prompt">
    		<input placeholder="请输入" class="vux-prompt-msgbox" v-model="warehousecode">
    	</div> 
    	<div class="weui-dialog__ft" @click="confirmInput1">
    		<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>
    	</div>
    </div>-->
     	<!--<div class="footer-bottom" @click="toShowPlace" :disabled="isDisabled"><i></i>&nbsp;&nbsp;下一步，请扫描目标库位码</div>-->
  </div>
</template>
<style lang="less">
.listTitle{display: flex;justify-content: space-between;align-items: center;}
.lastCode{background: #48475A;color: #FFFFFF;}
.cm-footer .btn-add{
	button{
		background: #FFFFFF;
		color: #3DA5FE;border: none;
		font-size: 16px;
		width: 100%;
		&:disabled{
			color: #c7c7c7;
		}
	}
}
.alert-wrap{
	/*display: none;*/
    position: absolute;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
}
.vux-x-dialog .weui-dialog .weui-dialog__bd{
	padding: 0;
}
 .weui-dialog {
 	&.new-dialoag{
		position: absolute;
		border-radius: 10px;
		font-size: 15px!important;
		.weui-dialog__hd{
			    padding: 20px 0 28px 0;
			.weui-dialog__title{
				font-size: 16px;
				color: #303030;
			}
		}
		.vux-prompt{
			padding-bottom: 28px;
			input{
			    height: 40px;
			    border-radius: 4px;
			    padding: 0;
			    width: 90%;
			    z-index: 99999;
			    text-align: center;
			    
			    }
		}
		 .weui-dialog__ft {
	    width: 90%;
	    margin: 0 auto;
	    background: #3DA5FE;
	    color: #FFFFFF;
	    border-radius: 4px;
	    margin-bottom: 15px;
	    height: 40px;
	    .weui-dialog__btn{
	      color: #FFFFFF;
   		 	line-height: 40px;
   		 	font-size: 15px;
   		 	
    }
   }
	}
}
</style>
<script>
import {XHeader,Scroller,Cell,Confirm,TransferDomDirective as TransferDom} from 'vux'
import factory from '@/factory'
import { mapGetters,mapState } from 'vuex'
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
    	showInput1:false,
    	showInput:false,
    	selectDatas:[],
    	dataList:[],
    	isDisabled: true,
    }
  },
  computed: {
		...mapState({
			commonInfo:state=>state.global.commonInfo,
			mergeAmountGoods:state=>state.backCount.mergeAmountGoods,
			inventoryToConfirm:state=>state.backCount.inventoryToConfirm,
		})
  },
  created() {
  },
  mounted(){
		this.dataList=this.mergeAmountGoods.map(item=>{
			return {
				...item,
				type:'input',
				time:'入库时间：'+new Date(item.intoWarehouseTime).format("yyyy-MM-dd hh:mm"),
				count:0
			}
		})
  },
  methods: {
    scan () {
      factory.scan().then(function(res) {
        alert('success:' + JSON.stringify(res))
      })
    },
    back(){
  		this.$router.push({name:'selectMergeGoods',query:{scanResult:this.$route.query.scanResult}})
  	},
    toShowPlace(){  //扫描二维码显示库位码
			this.$store.commit("setinventoryToConfirm",this.dataList.filter(item=>{return item.count>0}))
//			this.$store.commit("setinventoryToConfirm",this.dataList)
			if(this.inventoryToConfirm.length>0){
				if(window.cordova) {
	        factory.scan().then(res => {
	          this.$router.push({
	          	path: "mergeGoodsConfirm", 
	          	query:{ 
	          		scanResult: res.text,
	          		lastPlaceCode:this.$route.query.scanResult,
	          		goodsSize:this.$route.query.goodsSize,
								goodsNum:this.$route.query.goodsNum,
	          	}
	          })
	        })
	     } else {
	     	this.$router.push({
						path:'mergeGoodsConfirm',
						query:{
							scanResult:'103',
							lastPlaceCode:this.$route.query.scanResult,
							goodsSize:this.$route.query.goodsSize,
							goodsNum:this.$route.query.goodsNum,
						}
				})
	     }
     }else{
     	this.$vux.toast.show({
     		type:"text",
     		text:'合并商品数量不能为0，请输入！',
     		time:3000
     	})
     }
    },
     /**
     * 请输入二维码
     */
    inputCode(){
    	let isNull = this.dataList.some(i=>{
    		return i.count>0
    	})
    	if(isNull){
    		this.showInput=true;
//  		this.showInput1=true;
    	}else{
    		 this.$vux.toast.show({
				 	type:'text',
				 	text:'要合并的商品数量不能为0，请输入',
				 	time:3000,
				})
    	}
    },
     /**
     * 输入确认关闭
     */
    confirmInput(){
    	if(this.warehousecode){
    		this.$store.commit("setinventoryToConfirm",this.dataList.filter(item=>{return item.count>0}));
    		this.$router.push({
						path:'mergeGoodsConfirm',
						query:{
							scanResult:this.warehousecode,
							lastPlaceCode:this.$route.query.scanResult,
							goodsSize:this.$route.query.goodsSize,
							goodsNum:this.$route.query.goodsNum,
						}
				})
      
    	}else{
    		
    	}
    	
    },
    confirmInput1(val){
    	if(this.warehousecode){
    		this.$store.commit("setinventoryToConfirm",this.dataList.filter(item=>{return item.count>0}));
    		this.$router.push({
						path:'mergeGoodsConfirm',
						query:{
							scanResult:this.warehousecode,
							lastPlaceCode:this.$route.query.scanResult,
							goodsSize:this.$route.query.goodsSize,
							goodsNum:this.$route.query.goodsNum,
						}
				})
    	}else{
    		this.showInput1=false
    	}
    	
    },
    changeCount(val,a){
    	this.dataList[a].allNums=val   //allNums:下一个页面的数量
    	if(this.dataList.filter(item => {
        return (item.count != null && item.count != 0 && !isNaN(item.count))
      }).length > 0) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
  }
}

</script>

