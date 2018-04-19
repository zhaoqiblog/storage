<template>
  <div class="self-process">
    <x-header :left-options="{preventGoBack:true}" @on-click-back="backScan">入库商品选择</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
<div class="scroll-content content-wrap">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
    	<div class="totalNums">
				<dl>
					<dt>{{topInfo.palletCode}}</dt>
					<dd>托盘码/订单号</dd>
				</dl>
				<dl>
					<dt>{{topInfo.goodsSize}}</dt>
					<dd>SKU数量</dd>
				</dl>
				<dl>
					<dt>{{topInfo.goodsNum}}</dt>
					<dd>商品总件数</dd>
				</dl>
    	</div>
    	<div class="goodsList">
    		<p class="listTitle">商品明细清单（{{initData.length}}）</p>
    		<div class="listWrap">
					<goods-select-group :datas="initData" v-model="dataList" @change="selectChange">
						<goods-select-item v-for="a in initData" :key="a.goodsCode"
							:depotCode="a.depotCode"
							:code="a.goodsCode"
							:name="a.goodsName"
							:totalNum="a.availableNum"
							:unit="a.unit"
							:num="a.num"
							:unitq="a.perNum"
							:label="a.id">
						</goods-select-item>
					</goods-select-group>
    		</div>
    	</div>
    </div>
   </div>
    <!--</scroller>-->
    <!--<div class="footer-bottom" @click="complete">完成</div>-->
    <div class="cm-footer"> <!--:disabled=""--> 
      	<button  type="button" class="btnblue-add footer-bottom" :disabled="selectDatas.length<1" @click="complete">完成</button>
    	</div>
  </div>
</template>
<script>
import { XHeader,Scroller} from 'vux'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
import factory from '@/factory'
import $request from '@/service/request.js'
//import
export default {
  components: {
    XHeader,Scroller
  },
  name: 'turnoverIndex',
  data() {
    return {
    	dataList:[],
    	warehousePlaceCode:'A101',  //库位码
    	costCenterNum:'0094281111', //成本中心编码
    	palletCode:'P0000087', //托盘编号
    	sku:0,
    	topInfo:{palletCode:'',goodsNum:0,goodsSize:0},
    	initData:[],
    }
  },
  computed: {
		...mapState({
			selectDatas:state=>state.turnoverArea.goodsToStore.selectData,
			receiveGoodsId:state=>state.turnoverArea.goodsToStore.receiveGoodsId,
			commonInfo:state=>state.global.commonInfo,
		})
  },
  created() {
  	let code = this.$route.query.scanResult
  	this.palletCode=code;
    this.getTrayInfo()
    this.$store.commit("setSelectGoods",[])
  },
  methods: {
  //获取托盘上的商品信息
  getTrayInfo(){
			let obj = {palletCode:this.palletCode,costCenterNum:this.commonInfo.costNumber}
				$request.get("/api/goods-warehouse/v1/protected/queryPalletGoods",obj).then((re)=>{
					if(re.success==true){
						this.palletCode=re.data.palletCode
						this.$store.commit("setreceiveGoodsId",re.data.receiveGoodsId)
						this.topInfo={...re.data}
						this.sku=re.data.goodsSize
						re.data.shopGoodsInfo.forEach(e=>{
							e.goodsInfo.forEach(r=>{
								this.initData.push(r)
							})
						})
					}else{
							this.$router.push({path:'/fail',query:{text: re.message,title: '商品入库',info: '', path:'/scanEntry?key=goodsTostore'}})
					}
				})
		},
  	complete(){
  		this.selectDatas.map(e=>{e.type="input"})
//		if(this.dataList.length>0){
	        this.$router.push({path:'goodsAmount',query:{palletCode:this.palletCode}})
	     //测试数据
//			this.$router.push({path:'goodsAmount',query:{warehousePlaceCode: 'A101',palletCode:this.palletCode}})
//			}else{
//				this.$vux.toast.show({
//	        type: 'text',
//	        text: '请选择要入库的商品'
//	      })
//			}
  	},
    selectChange(filterDatas,value){
			this.$store.commit("setSelectGoods",filterDatas)
		},
		backScan(){
			this.$router.push({path:'/scanEntry',query:{key: 'goodsTostore'}})
		}
  }
}

</script>
<style lang="less">
.totalNums{
	display: flex;justify-content: center;align-items: center;
	box-sizing: border-box;
	background:#FFFFFF;
	height: 72px;
	dl{
		width:33.3%;
		text-align: center;
		dt{
			color: #303030;
			font-size: 20px;
			font-weight: 600;
		}
		dd{
			color: #999999;
			font-size: 12px;
		}
	}
}
.goodsList{
	/*padding-bottom: 48px;*/
	.listTitle{
		padding: 0 16px;
		height: 50px;
		line-height: 50px;
		text-align: left;
		color: #999999;
		font-size: 14px;
	}
}
</style>
