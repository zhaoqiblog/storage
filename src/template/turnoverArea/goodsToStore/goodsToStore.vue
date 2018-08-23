<template>
  <div class="self-process">
  <x-header :left-options="{backText: ''}"><span>商品入库</span></x-header>
 	<div class="scroll-content content-wrap">
    <div class="contentWrap">
    	<div class="shopName vux-1px-t"><i></i>{{commonInfo.costName}}</div>
    	<div class="locationCode">
    		库位码：{{submitList.warehousePlaceCode}}
    	</div>
    	<div class="goodsList">
    		<p class="listTitle"><span>商品列表({{selectDatas.length}})</span><span>入库数量</span></p>
    		<div class="listWrap">
					<goods-info-item @change="changes" v-if="selectDatas.length>0"
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
    		</div>
    	</div>
    </div>
 </div>
 <div class="cm-footer">
  	<button  type="button" class="btnblue-add footer-bottom" :disabled="disabled" @click="gotosuccess">确认入库</button>
	</div>
	<!--<div class="footer-bottom" @click="gotosuccess" :disabled="disabled">确认入库</div>-->
  </div>
</template>
<script>
import {XHeader,Scroller} from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
//import 
export default {
  components: {
    XHeader,Scroller
  },
  data() {
    return {
    	showPlaceCode:false,
    	selectDatas:null,
    	testdata:999,
    	disabled:true,
    		submitList:{
				  palletCode: "P0000087",
				  receiveGoodsId: 0,
				  warehousePlaceCode: "",
				  goodsWarehouseDetailDTOList: [
				  ],
				}
    }
  },
  computed: {
		...mapState({
			confirmDatas:state=>state.turnoverArea.goodsToStore.confirmDatas,
			receiveGoodsId:state=>state.turnoverArea.goodsToStore.receiveGoodsId,
			commonInfo:state=>state.global.commonInfo
		})
  },
  created(){
		this.submitList={...this.$route.query}
		delete this.submitList.costCenterNum
		this.submitList.receiveGoodsId=this.receiveGoodsId
		let list = []
		this.confirmDatas.map(e=>{
			list.push({goodsCode:e.goodsCode,goodsWarehouseId :e.id,supplyNum :e.count})
		})
		 this.submitList.goodsWarehouseDetailDTOList=list;
		 let isNull = this.submitList.goodsWarehouseDetailDTOList.some(i=>{
		 	return i.supplyNum>0
		 })
		 if(this.submitList.warehousePlaceCode&&isNull){
		 	this.disabled=false
		 }
		this.selectDatas=JSON.parse(JSON.stringify(this.confirmDatas)).concat([])
  },
  mounted(){
  },
  methods: {
     gotosuccess(){
     this.submitList.goodsWarehouseDetailDTOList.map((e,index)=>{
     	if(e.supplyNum<1){
     		 this.submitList.goodsWarehouseDetailDTOList.splice(index,1)
     	}
     })
     
     $request.post("/api/goods-warehouse/v1/protected/pallet/palletMoveWarehouse",this.submitList).then(e=>{
     	if(e.success==true){
     		
//   		this.$router.push({path:'/goodsToStoreSuccess',query:{scanResult:this.$route.query.palletCode,text:"商品转移成功",title:`商品入库`,info:"请将商品移至"+this.submitList.warehousePlaceCode+'库位',path:'/scanEntry?key=goodsTostore'}})
     		this.$router.push({path:'/goodsToStoreSuccess',query:{scanResult:this.$route.query.palletCode,text:"商品转移成功",title:`商品入库`,info:"请将商品移至"+this.submitList.warehousePlaceCode+'库位'}})
     	}else{
				this.$router.push({path:'/fail',query:{text: e.message,title: '商品入库',info: '', path:'/scanEntry?key=goodsTostore'}})
     	}
     }).catch(err=>{
     	this.$router.push({path:'/fail',query:{text: '操作失败，请联系管理员！',title: '商品入库',info: '', path:'/scanEntry?key=goodsTostore'}})
     })
    	
    },
		changes(value,key){
			this.selectDatas[key].altogether=value*this.selectDatas[key].perNum;
			this.submitList.goodsWarehouseDetailDTOList[key].supplyNum=value;
			let isNull = this.submitList.goodsWarehouseDetailDTOList.some(i=>{
			 	return i.supplyNum>0
			 })
			if(isNull){
				this.disabled=false;
			}else{
				this.disabled=true;
			}
		},
  }
}

</script>
<style lang="less">
.listTitle{display: flex;justify-content: space-between;align-items: center;}
</style>
