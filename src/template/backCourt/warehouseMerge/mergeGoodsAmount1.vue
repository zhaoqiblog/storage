<template>
  <div class="self-process">
    <x-header :left-options="{backText: '',preventGoBack:true}" @on-click-back="back"><span>输入合并数量写</span></x-header>
     <!--<scroller class="scroll-view" lock-x height="-45px">-->
     	<div class="scroll-content">
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
      show-input
      title="输入库位码"
      placeholder='请输入'
      @on-confirm="confirmInput">
      </confirm>
    </div>
     	<!--<div class="footer-bottom" @click="toShowPlace" :disabled="isDisabled"><i></i>&nbsp;&nbsp;下一步，请扫描目标库位码</div>-->
  </div>
</template>
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
    confirmInput(val){
    	if(val){
    		this.$store.commit("setinventoryToConfirm",this.dataList.filter(item=>{return item.count>0}));
    		this.$router.push({
						path:'mergeGoodsConfirm',
						query:{
							scanResult:val,
							lastPlaceCode:this.$route.query.scanResult,
							goodsSize:this.$route.query.goodsSize,
							goodsNum:this.$route.query.goodsNum,
						}
				})
    		let list = []
      
    	}else{
    		
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
</style>
