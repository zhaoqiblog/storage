<template>
  <div class="self-process">
    <x-header >补货单详情</x-header>
    
<div class="scroll-content">
    <div class="contentWrap">
    	<!----> 
    	<div class="totalNums vux-1px-b vux-1px-t noshdaw">
				<dl>
					<dt>{{info.originPlaceCode}}</dt>
					<dd>库位码</dd>
				</dl>
				<dl>
					<dt>{{goodsSize}}</dt>
					<dd>SKU数量</dd>
				</dl>
    	</div>
    	<p class="operateTime vux-1px-b"><span>补货时间：{{info.operateDate}}</span></p>
    	<div class="goodsList">
    		<p class="listTitle"><span>商品信息</span><span>数量</span></p>
    		<!--<scroller class="scroll-view" height="-45px">-->
    			<p v-for="(item,index) in detailData.warehouseOperateDetailList" >{{-item.operateNum}}</p>
	    		<div class="listWrap">
								<goods-info-item
								v-for="(item,index) in detailData.list" 
								:sideslip="item.sideslip"
								:type="item.type"
								:code="item.goodsBarCode"
								:name="item.goodsName"
								:time="item.toHouseTime"
								:textNum="-item.operateNum"
								:num="item.goodsWarehouse.num"
								:totalNum="item.goodsWarehouse.availableNum"
								:unitq="item.goodsWarehouse.perNum"
								:unit="item.goodsWarehouse.unit"
								:key="index"
								:id="'a'+item.id">
								<div slot="textNumDom" class="l-list-text">
								{{-item.operateNum}}<span></span>
								</div>
									
							</goods-info-item>
	    		</div>
    		<!--</scroller>-->
    	</div>
    	
    </div>
    
   </div>
  </div>
</template>
<script>
import { XHeader,Scroller} from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'
//import
export default {
  components: {
    XHeader,Scroller
  },
  data() {
    return {
    	dataList:[],
    	detailData:{list:[]},
    	goodsSize:0,
    	info:{},
    }
  },
  computed: {

  },
  created() {
		$request.get("/api/warehouse-operate-main/v1/protected/getWarehouseOperate?warehouseOperateMainId="+this.$route.query.ids).then(res=>{
			if(res.success==true){
				let list =[...res.data.content.warehouseOperateDetailList].map(i=>{
					return {
						...i,
						type:'text', 
						toHouseTime: "入库时间：" + new Date(i.goodsWarehouse.intoWarehouseTime).format("yyyy-MM-dd")
					}
				})
				this.goodsSize=res.data.goodsSize;
				this.info=res.data.content
				this.info.operateDate=new Date(this.info.operateDate).format("yyyy-MM-dd")
				this.detailData.list=list
			}else{
				this.$router.push({path:'/fail',query:{text: res.message||"获取补货单信息失败",title: '仓库补货', path:'/scanEntry?key=woreHouse'}})
			}
		}).catch(err=>{
			this.$router.push({path:'/fail',query:{text: '获取补货单信息失败',title: '仓库补货', path:'/scanEntry?key=woreHouse'}})
		})
 	},
  methods: {
  }
}

</script>
<style lang="less" scoped> 
.alertips{color: #FC4A4B;}
/*.totalNums{border-top: 1px solid #d5d9de;border-bottom: 1px solid #d5d9de;}*/
.operateTime{
	position: relative;
	height: 38px;line-height: 38px;font-size: 12px;color: #999999;padding: 0 16px;background: #FFFFFF;
	/*&:after{
		content: ' ';
		 position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
		border-bottom: 1px solid #DDDDDD;
		color: #DDDDDD;
		height: 1px;
		-webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
   
	}*/
}
.noshdaw{box-shadow: none;}
</style>
