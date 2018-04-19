<template>
  <div class="self-process">
    <x-header >确认补货清单</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
<div class="scroll-content content-wrap">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{this.commonInfo.costName}}</div>
    	<div class="totalNums">
				<dl>
					<dt>{{$route.query.scanResult}}</dt>
					<dd>库位码</dd>
				</dl>
				<dl>
					<dt>{{$route.query.goodsSize}}</dt>
					<dd>SKU数量</dd>
				</dl>
				<dl>
					<dt>{{$route.query.goodsNum}}</dt>
					<dd>库存总件数</dd>
				</dl>
    	</div>
    	<div class="goodsList">
    		<p class="listTitle"><span>商品信息</span><span>数量</span></p>
    		<div class="listWrap">
						<goods-info-item
							v-for="(item,index) in selectDatas" 
							:sideslip="item.sideslip"
							:type="item.type"
							:depotCode="item.depotCode"
							:code="item.goodsBarCode"
							:name="item.goodsName"
							:totalNum="item.availableNum"
							:unit="item.unit"
							:num="item.num"
							:textNum="item.count"
							:unitq="item.perNum"
							v-model="item.count"
							:time="item.intoWarehouseTime"
							:altogether="item.altogether"
							:key="index">
							<div slot="textNumDom" class="l-list-text">
							{{item.count}}
								</div>
						</goods-info-item>
    		</div>
    	</div>
    </div>
    <!--</scroller>-->
   </div>
    <div class="cm-footer">
      	<button  type="button" class="btnblue-add footer-bottom" @click="complete">确认提交</button>
    </div>
  </div>
</template>
<script>
import { XHeader,Scroller} from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'
import { mapGetters,mapState } from 'vuex'
//import
export default {
  components: {
    XHeader,Scroller
  },
  data() {
    return {
    	dataList:[],
//  	selectDatas:[],
    }
  },
  computed: {
		...mapState({
			addWoreHouseToAmount:state=>state.backCount.addWoreHouseToAmount,
			commonInfo:state=>state.global.commonInfo,
		})
  },
  created() {
  	this.selectDatas=JSON.parse(JSON.stringify(this.addWoreHouseToAmount)).concat([])
  	this.selectDatas.map(e=>e.type='text')
  },
  mounted(){
  },
  methods: {
  	complete(){
  		let toCommitGoods=[]
  		this.selectDatas.map(e=>{
  			toCommitGoods.push({goodsCode:e.goodsCode,goodsWarehouseId:e.id,supplyNum:e.count,warehouseId:e.warehouseId})
  		})
		$request.post("/api/goods-warehouse/v1/protected/warehouse/supply",toCommitGoods).then(res=>{
			if(res.success==true){
  				this.$router.push({path:'/success',query:{title:'提交成功',text:'补货成功',info:'补货成功，请将商品移至卖场',path:'/scanEntry?key=woreHouse',listPath:'/backCount/replenishmentList'}})
			}else{
				this.$router.push({path:'/fail',query:{title:'仓库补货',text:res.message||'补货失败，请重试',path:'/scanEntry?key=woreHouse'}})
			}
  			
		}).catch(err=>{
			this.$router.push({path:'/fail',query:{title:'仓库补货',text:'补货失败，请重试',path:'/scanEntry?key=woreHouse'}})
		})
  	},
  }
}

</script>
<style lang="less" scope> 

</style>
