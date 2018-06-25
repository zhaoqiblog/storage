<template>
  <div class="shop-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<span class="icons fl"  @click="back"></span>
    	<span class="txt">补货单详情</span>
    </div>
    <div class="pre-content-title pre-detail-title">
    	<div class="picking-title">
    		<div class="counting-time">
    		</div>
    		<div class="pick-code pick-info-wrap confirm-t-wrap">
    			<div class="confirm-t vux-1px-b">
    				<dl>
    					<dt>补货已完成</dt>
    					<!--<dd>请核对商品补货信息</dd>-->
    				</dl>
    				<img src="../../../assets/pre/icon2.png"/>
    			</div>
    			<p>补货单号：<span>{{data.supplementBillNo}}</span></p>
    			<p>创建日期：<span>{{new Date(data.creatTime).format("yyyy-MM-dd hh:mm:ss")}}</span></p> 
    			<p>补货SKU总数：<span>{{data.skuNum}}</span></p>     			
    			<p>补货总件数：<span>{{data.totalNum}}</span></p>     			
    			<p>补货员：<span>{{data.supplementerName}}</span></p>     			
    			<p>补货完成时间：<span>{{new Date(data.updateTime).format("yyyy-MM-dd hh:mm:ss")}}</span></p>     			
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-supply-list historyDetail-list" ref="scrollWrap">
    		<div v-if="data&&data.supplyItemRequestDTOS" v-for="e,index in data.supplyItemRequestDTOS" class="item-pre-supply">
    			
    			<p class="pre-supply-code">商品编码：{{e.goodsBarCode}}</p>
    			<p class="pre-supply-name">{{e.goodsName}}</p>
    			<div class="pre-supply-title vux-1px-t">
    				<span class="item-top-left">前置仓 {{e.frontWarehouseCode}}</span>
    				<div class="title-right"></div>
    			</div>
    			<div class="supply-other vux-1px-t" v-for="n,ind in e.supplyChannelRequestDTOS">
    				<span v-if="n.fromWarehouseId!=='-1'">库位{{n.fromWarehouseCode}}  补货至前置仓</span>
    				<span v-if="n.fromWarehouseId=='-1'">卖场  补货至前置仓</span>
    				<span v-if="n.fromWarehouseId=='-1'">{{n.supplyNum}}</span>
    				<span v-if="n.fromWarehouseId!=='-1'">{{n.supplyNum}}</span>
    			</div>
    			<!--<div class="supply-other vux-1px-t">
    				<span>库位104  补货至前置仓</span>
    				<span>654</span>
    			</div>
    			<div class="supply-other vux-1px-t">
    				<span>卖场  补货至前置仓</span>
    				<span>10</span>
    			</div>-->
    		</div>
    </div>
  </div>
</template>

<script>
	import $request from '@/service/request.js'
import { mapState } from 'vuex';
	
	export default {
		components: {},
		computed: mapState({
		    commonInfo: state => state.global.commonInfo,
		}),
		data() {
			return {
				data:{}
			}
		},
		created(){
			this.getDetail()
		},
		methods:{
			/**
			 * 获取补货单详情信息
			 */
			getDetail(){
				$request.get("/api/supplement-invoices/v1/protected/query/finish/"+this.$route.query.id).then(res=>{
//				$request.get("protected/query_page"+this.$route.query.id,{supplementBillNo:this.$route.query.id}).then(res=>{
					if(res.success==true){
						this.data=res.data;
					}else{}
				})
			},
			/**
			 * 返回
			 */
			back(){
				this.$router.back()
			},
			/*
			 * 提交捕获信息
			 */
			submitSupply(){
				
			},
		}
	}
</script>

<style lang="less">
.historyDetail-list{top: 295px;margin-bottom: 0px;}
.shop-supply .scroll-content.pre-content .list-pre-item .pre-list-item-content .button-to-pick button.toDetail{
	font-size:12px;
}
</style>