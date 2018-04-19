<template>
  <div >
    <x-header >仓库补货</x-header>
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
	    		<p class="listTitle" v-if="!showEmpty"><span>商品信息</span><span>数量</span></p>
	    		<div class="listWrap">
	    			<!--@change="changeCount"-->
							<goods-info-item  :class="selectId=='a'+item.goodsBarCode?'active':''"
								@change="changeCount"
								v-for="(item,index) in addWoreHouse" 
								:sideslip="item.sideslip"
								:type="item.type"
								:code="item.goodsBarCode"
								:name="item.goodsName"
								:totalNum="item.availableNum"
								:unit="item.unit"
								:num="item.num"
								:textNum="item.textNum"
								:unitq="item.perNum"
								v-model="item.count"
								:time="item.intoWarehouseTime"
								:key="index"
								:id="'a'+item.goodsBarCode">
							</goods-info-item>
	    		</div>
	    	</div>
    </div>
    <!--</scroller>-->
   </div>
    <div class="cm-footer">
      <div class="btn-add">
       <span @click="toInfo()">扫描商品</span>
      </div>
      <div class="btn-submit">  <!--:disabled=""-->
        <button type="button" @click="toConfirmApply" :disabled="addWoreHouseToAmount.length<1">提交补货申请</button>
      </div>
    </div>
  </div>
</template>
<script>
import MEmpty from '@/components/MEmpty/index'
import { XHeader,Scroller} from 'vux'
import factory from '@/factory'
import service from '@/service'
import func from '@/func'
import $request from '@/service/request.js'
import { mapGetters,mapState } from 'vuex'
//import
export default {
  components: {
    XHeader,Scroller,MEmpty
  },
  data() {
    return {
    	selectId:'',
    	dataList:[],
    	titleInfo:{goodsNum:'',sumAvailableNum:''},
    	selectData1:[],
    	showEmpty:false,
    }
  },
  computed: {
	 ...mapState({
				commonInfo:state=>state.global.commonInfo,
				addWoreHouse:state=>{ 
					return state.backCount.addWoreHouse
				},
				addWoreHouseToAmount:state=>state.backCount.addWoreHouseToAmount,
			})
  },
  created() {
  	this.$store.commit("setaddWoreHouseToAmount",[])
		const obj={
			warehousePlaceCode:this.$route.query.scanResult,
			costCenterNum:this.commonInfo.costNumber,
			warehouseType:0,
//			costCenterNum:'0090120001'
		}
   $request.get("/api/goods-warehouse/v1/protected/queryWarehouseGoods",obj).then(res=>{
   	if(res.success==true){
   		this.showEmpty = res.data.goodsInfo.length>0 ? false:true
	   	this.titleInfo={...res.data}
	    let listd = [...res.data.goodsInfo].map(e=>{
		  	return {
		  		...e,
		  		type:"input",
		  		count:0,
		  		intoWarehouseTime:"入库时间:"+new Date(e.intoWarehouseTime).format("yyyy-MM-dd"),
		  	}
	  	})
	   	this.selectDatas = listd;
	   	this.$store.commit("setAddWoreHouse",listd)
	   }else{
	   	this.$router.push({path:'/fail',query:{text: res.message||'获取库位上商品信息失败,请重试!',title: '仓库补货', path:'/scanEntry?key=woreHouse'}})
	   }
   }).catch(err=>{
   	this.$router.push({path:'/fail',query:{text:'获取库位上商品信息失败,请重试!',title: '仓库补货', path:'/scanEntry?key=woreHouse'}})
   })
  },
  methods: {
  	//提交补货申请
  	toConfirmApply(){
			this.$store.commit("setaddWoreHouseToAmount",this.addWoreHouse.filter((n)=>{
				return n.count>0
			}))
			if(this.addWoreHouseToAmount.length>0){
		 		this.$router.push({path:'addRepDetail',query:{scanResult:this.$route.query.scanResult,goodsSize:this.titleInfo.goodsSize,goodsNum:this.titleInfo.goodsNum}})
  		}else{
  			this.$vux.toast.show({
			    type: 'text',
			    text: '请输入要补货的商品的数量',
			  })
  		}
		},
    /*扫描商品*/
  	toInfo() {
  		if(window.cordova) {
        factory.scan().then(res => {
        	let isWareCode = this.addWoreHouse.filter(i=>{
        		return i.goodsBarCode==res.text
        	})
        	if(isWareCode.length>0){
	        	const selector="#a" + res.text
			  		this.selectId=selector.slice(1)
				    var anchor = this.$el.querySelector(selector)
				    this.$el.querySelector(".scroll-content").scrollTop = anchor.offsetTop
			    }else{
			    	this.$vux.toast.show({
						 	type:'text',
						 	text:'此商品不是当前库位上的商品！',
						 	time:5000,
						 })
			    }
        })
      } else {
      	const selector="#a6907469011834"
	  		this.selectId=selector.slice(1)
		    var anchor = this.$el.querySelector(selector)
		    this.$el.querySelector(".scroll-content").scrollTop = anchor.offsetTop
      }
  		
   },
		changeCount(e,index){
			this.$store.commit("setaddWoreHouseToAmount",this.addWoreHouse.filter((n)=>{
				return n.count>0
			}))
		}
  }
}

</script>
<style lang="less">
	@import url("../../../css/footer.less");
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
	.active{
		.l-list-ct{background: #DBEEFF;
		.l-list-content .l-list-name{
			.l-list-ctl{
				input{
					background: #DBEEFF;
				  border-right: solid 1px #DDDDDD;
					border-left: solid 1px #DDDDDD;
				}
			}
			}
		}
	}
}
</style>
