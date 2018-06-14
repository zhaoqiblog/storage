<template>
  <div class="shop-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<span class="icons fl"  @click="back"></span>
    	<span class="txt">补货详情</span>
    </div>
    <div class="pre-content-title pre-detail-title">
    	<div class="picking-title">
    		<div class="counting-time">
    		</div>
    		<div class="pick-code pick-info-wrap">
    			<p>补货单号：<span>{{preSupplyInfo.supplementBillNo}}</span></p>
    			<p>创建日期：<span>{{new Date(preSupplyInfo.creatTime).format("yyyy-MM-dd hh:mm:ss")}}</span></p> 
    			<p>补货SKU总数：<span>{{preSupplyInfo.skuNum}}</span></p>     			
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-supply-list" ref="scrollWrap">
    		<div v-for="e,index in preSupplyInfo.supplyItemDTOS" class="item-pre-supply">
    			<div class="pre-supply-title vux-1px-b">
    				<span class="item-top-left">前置仓 {{e.frontWarehouseCode}}</span>
    				<div class="title-right">
    					<span class="now-num vux-1px-r">现有库存 {{e.frontWarehouseNum}}</span><span class="safe-num">安全库存 <span>{{e.safeNum}}</span></span>
    				</div>
    			</div>
    			<p class="pre-supply-code">商品编码：{{e.goodsBarCode}}</p>
    			<p class="pre-supply-name">{{e.goodsName}}</p>
    			<div class="supply-input vux-1px-t">
    				<span>补货至前置仓</span>
    				<input type="number" v-model="e.supplyNum"  pattern="[0-9]*"/>
    			</div>
    		</div>
    </div>
     <div class="cm-footer">
      <div class="btn-submit">  <!--:disabled=""-->
        <router-link :to="{path:'confirmsupply',query:{id:$route.query.id}}"><button type="button" @click="submitSupply">提交补货信息</button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
	import $request from '@/service/request.js'
import { mapState,mapActions } from 'vuex';
	
	export default {
		components: {},
		computed: mapState({
		    commonInfo: state => state.global.commonInfo,
		    preSupplyInfo:state=>state.prePick.preSupplyInfo
		}),
		data() {
			return {
				data:{}
			}
		},
		created(){
			if(!this.$route.query.back){
				this.getDetail()
			}
		},
		methods:{
			/**
			 * 获取补货单详情信息
			 */
			getDetail(){
				$request.get("/api/supplement-invoices/v1/protected/query/"+this.$route.query.id).then(res=>{
					if(res.success==true){
						this.data=res.data;
						let lists = res.data.supplyItemDTOS.map((e)=>{
							return {...e,supplyNum:''}
						})
						let data = res.data;
						data.supplyItemDTOS =lists
						this.$store.dispatch("setPreSupplyInfo",data)
//						console.log(res.data)
//						setTimeout(()=>{console.log(this.preSupplyInfo)},2000)
					}else{
						this.$vux.toast.show({
	            type: 'text',
	            text: res.message
	          })
					}
				})
			},
			/**
			 * 返回
			 */
			back(){
//				this.$router.back()
				this.$router.push({path:'supplyList'})
				this.$store.dispatch("setPreSupplyInfo",{})
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
	
	.pre-content-title.pre-detail-title .picking-title .pick-code{
		>p{
			color:#999999;
			>span{color: #999999;}
		}
		&.pick-info-wrap{
			height: 99px;
		}
	}
	.pre-supply-list{
		width: 95%;
		margin: 0 auto;
		position: absolute;
		top: 160px;
		margin-bottom: 60px;
		.item-pre-supply{
			padding: 0 10px 0px;
			background: #FFFFFF;
			margin-top: 10px;
			border-radius: 3px;
			.pre-supply-title{
				line-height: 50px;
				display: flex;
				justify-content: space-between;
				span.item-top-left{
					color: #303030;
					font-size: 16px;
					font-weight: 600;
				}
				.title-right{
					.vux-1px-r:after{    border-right: 1px solid #3F3F3F;color: #3F3F3F;}
					span{padding: 0 5px;}
					.now-num{font-size: 12px;color: #FF5800;padding-right: 10px;}
					.safe-num{font-size: 12px;color: #999999;>span{color: #000000;}}
				}
			}
			.supply-input{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				>span{font-size: 13px;color: #999999;font-weight: 600;}
				>input{
					border: 1px solid #DDDDDD;
					border-radius: 4px;width: 37%;height: 33px;
					text-align: center;
				}
			}
			.pre-supply-name{
				margin-bottom: 18px;font-size: 16px;color: #333333;
				font-weight: 600;
				margin-top: 5px;
			}
			.pre-supply-code{
				margin-top: 18px;
				font-size: 13px;
				color: #999999;
			}
		}
	}
	input:focus{outline: none;}
</style>