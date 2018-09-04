<template>
  <div class="self-process">
    <x-header :left-options="{preventGoBack:true}" @on-click-back="back">盘点差异结果</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
<div class="scroll-content differ">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{this.commonInfo.costName}}</div>
    	<div class="totalNums">
				<dl>
					<dt>{{thisInfo.originPlaceCode}}</dt>
					<dd>库位码</dd>
				</dl>
				<dl>
					<dt>{{goodsSize}}</dt>
					<dd>SKU数量</dd>
				</dl>
				<dl>
					<dt class="diffNumber">{{differSize}}</dt>
					<dd>差异SKU数</dd>
				</dl>
    	</div>
    	<img class="succes-icon" src="../../../assets/common/icon_yiwancheng.png"/>
    	<keep-alive>
	    	<div class="goodsList list-differ">
	    		<p class="listTitle"><span>商品信息</span><span><span style="margin-right: 17px;">系统数量</span><span>盘点数量</span></span></p>
	    		<div class="listWrap">
	    			<goods-info-item
								v-for="(item,index) in thisInfo.list" 
								:sideslip="item.sideslip"
								:type="item.type"
								:code="item.goodsBarCode"
								:name="item.goodsName"
								:textNum="-item.operateNum"
								:unit="item.goodsWarehouse.unit"
								:key="index"
								:id="'a'+item.id">
								<div slot="textNumDom" class="l-list-text listInfo-cell-Info">
									<span>{{item.firstNum}}</span><span style="color: #FC4A4B;">&nbsp;&nbsp;&nbsp;{{item.afterOperateNum}}</span>
								</div>
							</goods-info-item>
	    		</div>
	    	</div>
    	</keep-alive>
    </div>
    <!--</scroller>-->
   </div>
   <div class="cm-footer">
      <div class="btn-add btn-left">
       <router-link to="/scanEntry?key=inventory"><span>继续盘点</span></router-link>
      </div>
      <div class="btn-submit">
        <router-link to="/"><button type="button">返回主页</button></router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { XHeader,Scroller} from 'vux'
import factory from '@/factory'
import func from '@/func'
import $request from '@/service/request.js'
import { mapGetters,mapState } from 'vuex'
//import
export default {
  components: {
    XHeader,Scroller
  },
  data() {
    return {
    	selectId:'',
    	dataList:[],
    	titleInfo:{goodsNum:'',sumAvailableNum:''},
    	thisInfo:{originPlaceCode:''},
    	goodsSize:0,
    	differSize:0,
    }
  },
  computed: {
	 ...mapState({
				commonInfo:state=>state.global.commonInfo,
				inventoryToConfirm:state=>state.backCount.inventoryToConfirm,
			})
  },
  created() {
		const obj={
			operateType:5,
			pageNumber:1,
			pageSize:1000
//			costCenterNum:'0094281111'
		}
   $request.get("/api/warehouse-operate-main/v1/protected/getWarehouseOperate?warehouseOperateMainId="+this.$route.query.id).then(res=>{
   	if(res.success==true){
	  	let list =[...res.data.content.warehouseOperateDetailList].map(i=>{
				return {
					...i,
					type:'text',
				}
			})
			this.goodsSize=res.data.goodsSize;
			this.differSize=res.data.differSize;
			this.thisInfo=res.data.content
			this.thisInfo.list=list
    }else{
    	this.$router.push({path:'/fail',query:{text: res.message||'服务器错误,获取库位盘点差异结果失败,请重试!',title: '库位盘点', path:'/scanEntry?key=inventory'}})
    }
  	},err=>{
  		this.$router.push({path:'/fail',query:{text:'服务器错误,获取库位盘点差异结果失败,请重试!' ,title: '库位盘点',info: '', path:'/scanEntry?key=inventory'}})
  	})
  },
  methods: {
  	back(){
  		this.$router.push({path:'/'})
  	}
  }
}

</script>
<style lang="less">
	@import url("../../../css/footer.less");
	.totalNums .diffNumber{color: #FC4A4B;}
	.listInfo-cell-Info{
		margin-right: 5px;
		span{display:inline-block;width: 60px;text-align: right;}
		span:nth-child(2){margin-left: 17px;}
	}
	.contentWrap{
		.succes-icon{width: 70px;position: absolute;z-index: 20;top: 30px;right:20%;margin: 0;}
	}
	.list-differ{
		padding-bottom:48px;
	}
.differ .list-info-cell .l-list-ct .l-list-content .l-list-name.l-list-nametext{padding-right:36%}
</style>
