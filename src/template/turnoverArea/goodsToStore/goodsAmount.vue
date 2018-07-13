<template>
  <div class="self-process">
  <x-header :left-options="{backText: ''}"><span>入库商品数量填写</span></x-header>
 	<div class="scroll-content content-wrap">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
    	<!--<div class="locationCode" v-if="showPlaceCode">
    		库位码：{{submitList.warehousePlaceCode}}
    	</div>-->
    	<div class="goodsList">
    		<p class="listTitle"><span>商品列表({{selectDatas.length}})</span><span>入库数量</span></p>
    		<div class="listWrap">
					<!--<div  v-if="selectDatas">-->
						<!--@change="changesajkshdfajhfsdj"--> 
					<goods-info-item v-if="selectDatas.length>0" @change="changeCount"
						v-for="(item,index) in selectDatas" 
						:sideslip="item.sideslip"
						:code="item.goodsCode"
						:name="item.goodsName"
						:type="item.type"
						:totalNum="item.availableNum"
						:unit="item.unit"
						:num="item.num"
						:textNum="item.textNum"
						:unitq="item.perNum"
						v-model="item.count"
						:key="index">
					</goods-info-item>
					<!--</div>-->
    		</div>
    	</div>
    </div>
 </div>
 	<!--<div class="footer-bottom" @click="toShowPlace"><i></i>&nbsp;&nbsp;下一步，请扫描库位码</div>-->
 	<!--<div class="cm-footer"> 
  	<button  type="button" class="btnblue-add footer-bottom" :disabled="disableds" @click="toShowPlace"><i></i>&nbsp;&nbsp;下一步，请扫描库位码</button>
	</div>-->
		<div class="cm-footer">
	    <div class="btn-add" @click="toShowPlace()">
	    	<span><i></i>&nbsp;&nbsp;请扫描库位码</span>
	  	</div>
		  <div class="btn-submit" @click="inputCode">
		    <button type="button">输入库位码</button>
		  </div>
    </div>
    <div v-transfer-dom class="alert-info">
      <confirm v-model="showInput"
      title="输入库位码"
      confirm-text="确认"
      @on-confirm="confirmInput">
      <div class="vux-prompt"><input placeholder="请输入" type="number" pattern="[0-9]*" v-model.trim="warehousecode" class="vux-prompt-msgbox"></div>
      </confirm>
    </div>
  </div>
</template>
<script>
import {XHeader,Scroller,Confirm,TransferDomDirective as TransferDom } from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
//import 
export default {
	directives: {
    TransferDom
  },
  components: {
    XHeader,Scroller,Confirm
  },
  name: 'turnoverIndex',
  data() {
    return {
    	warehousecode:'',
    	showInput:false,
    	showPlaceCode:false,
    	selectDatas:null,
    	testdata:999,
    		submitList:{
				  costCenterNum: "",
				  palletCode: "",
				  receiveGoodsId: 0,
				  warehousePlaceCode: "",
				  goodsWarehouseDetailDTOList: [
				  ],
				},
				disableds:true,
    }
    
  },
  computed: {
		...mapState({
			amountDatas:state=>state.turnoverArea.goodsToStore.amountDatas,
			selectData:state=>state.turnoverArea.goodsToStore.selectData,
			receiveGoodsId:state=>state.turnoverArea.goodsToStore.receiveGoodsId,
			confirmDatas:state=>state.turnoverArea.goodsToStore.confirmDatas,
			commonInfo:state=>state.global.commonInfo,
		})
  },
  created(){
  	this.$store.commit("setamountDatas",this.selectData)
  	this.amountDatas.map(e=>{
  		e.count=0;
			e.altogether=0;
  	})
  	let listd=JSON.stringify(this.amountDatas)
		this.selectDatas=JSON.parse(listd).concat([])
		this.submitList.receiveGoodsId=this.receiveGoodsId
  },
  mounted(){
  },
  methods: {
    changeCount(val){
    	this.disableds=this.selectDatas.filter((e)=>{
    		return e.count>0
    	}).length>0 ? false:true
    },
    //扫描二维码显示库位码
    toShowPlace(){  
    	
    	let list = []
      this.selectDatas.map(e=>{
      	if(e.count>0){
     			list.push({goodsCode:e.goodsCode,goodsWarehouseId :e.id,supplyNum :e.count})
     		}
      })
     this.submitList.goodsWarehouseDetailDTOList=list;
    	//在这一步去下一页：
	  	this.$store.commit("setconfirmDatas",this.selectDatas)
	  	let isNull = this.selectDatas.filter(function(item){
        return item.count >0
    })
		const dataToStore={...this.$route.query}
			if(window.cordova){
		  	factory.scan().then(res => {
		  		this.$router.push({path:'/turnover/goodsToStore',query:{costCenterNum:this.commonInfo.costNumber,palletCode:dataToStore.palletCode,warehousePlaceCode:res.text}})
		  	})
	  	}else{
	  		this.$router.push({path:'/turnover/goodsToStore',query:{costCenterNum:this.commonInfo.costNumber,palletCode:dataToStore.palletCode,warehousePlaceCode:'101'}})
	  	}
  },
  /**
     * 请输入二维码
     */
    inputCode(){
    	this.showInput=true;
    },
    /**
     * 输入确认关闭
     */
    confirmInput(val){
    	if(this.warehousecode){
    			let list = []
      this.selectDatas.map(e=>{
      	if(e.count>0){
     			list.push({goodsCode:e.goodsCode,goodsWarehouseId :e.id,supplyNum :e.count})
     		}
      })
     this.submitList.goodsWarehouseDetailDTOList=list;
    	//在这一步去下一页：
	  	this.$store.commit("setconfirmDatas",this.selectDatas)
	  	let isNull = this.selectDatas.filter(function(item){
        return item.count >0
    })
    		const dataToStore={...this.$route.query}
    		this.$router.push({path:'/turnover/goodsToStore',query:{costCenterNum:this.commonInfo.costNumber,palletCode:dataToStore.palletCode,warehousePlaceCode:this.warehousecode}})
    	}else{
    		
    	}
    	
    },
	}
}

</script>
<style lang="less">
.listTitle{display: flex;justify-content: space-between;align-items: center;}
</style>
