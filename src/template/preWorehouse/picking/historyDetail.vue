<template>
  <div class="shop-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<span class="icons fl"  @click="back"></span>
    	<span class="txt">拣货单详情</span>
    </div>
    <div class="pre-content-title pre-detail-title">
    	<div class="picking-title">
    		<div class="counting-time">
    			<!--拣货倒计时 {{time}}-->
    		</div>
    		<!--<div class="none-info"></div>-->
    		<div class="pick-code">
    			<p>拣货单号：{{$route.query.id}} &nbsp;&nbsp;&nbsp;<span style="color: #6fc710;">{{data.ordersequenceno}}</span></p>
    			<!--<p>创建时间：{{new Date(data.creatTime).format('yy-MM-dd hh:mm:ss')}}</p>--> 
    			<p>拣货sku：{{data.finishSkuNum}}</p> 
    			<p>缺货sku：{{data.unFinishSkuNum}}</p> 
    			<p>拣货员：{{data.operatorName}}</p> 
    			<p>拣货完成时间：{{new Date(data.finishTime).format('yy-MM-dd hh:mm:ss')}}</p> 
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-content pre-content-pic-detail" ref="scrollWrap">
    	
    	<pre-item-info v-for="(item,index) in data.goodsInfoDTOS"
    		:itemid="item.itemid"
				:preCode="item.warehouseCode"
				:code="'商品编码 '+(item.goodsBarCode)"
				:name="item.goodsName"
				:totalNum="item.qty+item.diffNum"
				:unit="item.desc"
				:unitq="item.saleprice"
				:init="item.init"
				:allpick="item.allpick"
				:halfPickNum="item.qty"
				:status="1"
				:key="index">
    	</pre-item-info>
    	<m-empty v-if="data.content && data.goodsInfoDTOS.length == 0"></m-empty>
    </div>
  </div>
</template>

<script>
	import { XHeader } from 'vux'
	import $request from '@/service/request.js'
	export default {
		components: {
			XHeader
		},
		data() {
			return {
//				data:[
//					{code:"BH955715041315160064",time:'2018-01-23 16:13:17',status:'已完成',total:15,complete:12},
//					{code:"Bertert715041315160064",time:'2018-01-23 16:13:17',status:'已完成',total:22,complete:22},
//				],
				data:{goodsInfoDTOS:[]}
			}
		},
		created(){
			this.getDetail()
		},
		methods:{
			/**
			 * 获取订单信息
			 */
			getDetail(){
				$request.get("/api/online-order/v1/protected/pickdetail/"+this.$route.query.id).then(res=>{
					if(res.success==true){
						this.data=res.data;
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
				this.$router.back()
			},
//			toDetail(id){
//				console.log(id)
//				
//			}
		}
	}
</script>

<style lang="less">
	.pre-pic-history-detail{
		/*margin-top: 10px;*/
		
		.detail-top{
			background:#FFFFFF;
			p{padding: 0 20px;}
		}
		.pre-pic-history-detail{
			margin-top: 10px;
		}
	}

	.pre-pic-history-list {
		
	}
	.pre-content-title{
		&.pre-detail-title{
			.picking-title .pick-code{
				top: 10px;
				height: 140px;
				padding-top: 8px;
				box-sizing: border-box;
				p{
					padding: 9px 0 0px 30px;
				}
			}
		}
		
	}
	.pre-content-pic-detail{
		    top: 200px;
    		padding-bottom: 20px;
	}
	/*.pre-content-title .picking-title .pick-code p*/
</style>