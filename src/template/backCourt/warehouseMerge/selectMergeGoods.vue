<template>
  <div >
    <x-header :left-options="{backText: '',preventGoBack:true}" @on-click-back="back" >选择将要合并的商品</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    <div class="scroll-content content-wrap">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
    	<div class="totalNums">
				<dl>
					<dt>{{$route.query.scanResult}}</dt>
					<dd>库位码</dd>
				</dl>
				<dl>
					<dt>{{titleInfo.goodsSize}}</dt>
					<dd>SKU数量</dd>
				</dl>
				<dl>
					<dt>{{titleInfo.goodsNum}}</dt>
					<dd>库存总件数</dd>
				</dl>
    	</div>
    	<div class="goodsList">
    		<m-empty v-if="showEmpty"></m-empty>
    		<p class="listTitle" v-if="!showEmpty"><span>商品清单</span><span @click="selectAll" style="color: #3DA5FE;">全选</span></p>
    		<div class="listWrap">
				<goods-select-group :datas="dataList" @change="selectChange" v-model="allSelects" >
					<goods-select-item v-for="a in dataList" :key="a.goodsCode" 
						:code="a.goodsBarCode"
						:name="a.goodsName"
						:totalNum="a.availableNum"
						:unit="a.unit"
						:num="a.num"
						:unitq="a.perNum"
						:id="a.id"
						:label="a.id">
					</goods-select-item>
				</goods-select-group>
    		</div>
    	</div>
    </div>
    <!--</scroller>-->
    </div>
    <!--<div class="footer-bottom" @click="complete">下一步，输入合并数量</div>-->
    <div class="cm-footer">
      	<button  type="button" class="btnblue-add footer-bottom" :disabled="mergeAmountGoods.length<1" @click="complete">下一步，输入合并数量</button>
    	</div>
  </div>
</template>
<script>
import MEmpty from '@/components/MEmpty/index'
import { XHeader,Scroller} from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'
import { mapGetters,mapState,mapActions } from 'vuex'
//import
export default {
  components: {
    XHeader,Scroller,MEmpty
  },
  name: 'turnoverIndex',
  data() {
    return {
    	allSelects:[],
    	titleInfo:{},
			dataList:[],
			showEmpty:false,
			isDisabled:true,
    }
  },
  computed: {
	...mapState({
//		dataList:state=>state.backCount.selectMergeGoods,
		commonInfo:state=>state.global.commonInfo,
		mergeAmountGoods:state=>state.backCount.mergeAmountGoods,
		selectMergeGoods:state=>state.backCount.selectMergeGoods,
	})
  },
  created() {
  	const obj={warehousePlaceCode:this.$route.query.scanResult,
			costCenterNum:this.commonInfo.costNumber,
			warehouseType:0,
//			costCenterNum:'0090120001'
		}
   $request.get("/api/goods-warehouse/v1/protected/queryWarehouseGoods",obj).then(res=>{
   	if(res.success==true){
   		this.showEmpty = res.data.goodsInfo.length>0 ? false:true
	   	this.titleInfo={...res.data}
	    let listd=[...res.data.goodsInfo]
	    this.dataList=listd;
	    this.$store.dispatch("changeselectMergeGoods",JSON.parse(JSON.stringify(listd)).concat([]))
	   }else{
				this.$router.push({path:'/fail',query:{text: res.message||'获取库位上商品信息失败，请重试！',title: '库位合并', path:'/scanEntry?key=selectMergeGoods'}})
	   }
   }).catch(err=>{
   		this.$router.push({path:'/fail',query:{text: "获取库位上商品信息失败，请重试！",title: '库位合并', path:'/scanEntry?key=selectMergeGoods'}})
   })
   this.$store.commit("setmergeAmountGoods",[])
  },
  methods: {
  	/*全选*/
  	selectAll(){
  		if(this.allSelects.length==this.dataList.length){
	  		this.allSelects = []
  		}else{
  			this.allSelects = this.dataList.map(e=>{
	  			return e.id
	  		})
  		}
  	},
    complete(){
    	if(this.mergeAmountGoods.length>0){
				this.$router.push({
					path:'mergeGoodsAmount',
					query:{
						scanResult:this.$route.query.scanResult,
						goodsSize:this.titleInfo.goodsSize,
						goodsNum:this.titleInfo.goodsNum
					}
				})
			}else{
				this.$vux.toast.show({
	     		type:"text",
	     		text:'请选择要合并的商品'
	     	})
			}
    },
    selectChange(filterDatas,value){
    	this.$store.commit("setmergeAmountGoods",filterDatas)
		},
		back(){
			this.$router.push({path:"/scanEntry?key=selectMergeGoods"})
		},
  }
}

</script>
<style lang="less">
	.content-wrap{padding-bottom: 48px;}
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
