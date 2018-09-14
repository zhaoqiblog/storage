<template>
	<Group class="list-pre-item">
   		<div class="item-top vux-1px-b">
   			<span class="good-code">
   				<span class="order-name">{{orderSequenceNo}}</span>
   				<span :class="deliverType=='0'?'order-type-dif order-form':'order-form'">{{deliverType=='0'?'自提':'配送'}}</span>
   				<span class="order-form-immedirte" v-if="deliverType!=='0'&&slotType!=='expectTime'">{{slotType=='expectTime'?'':'极速达'}}</span>
   			</span>
   			<span class="good-time-type">
   				<span class="order-type">{{new Date(creatTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
   			</span>
   		</div>			       		
   		<div class="pre-list-item-content">
   			<div>
   				<dl>
   					<dt v-if="isOver" class="overTime">已超时 {{OverText}} 分钟</dt>
   					<dt v-if="!isOver">
   						剩余 
   						<span>{{OverText}}</span> 分钟
   					</dt>
   					<dd>
   						商品SKU&nbsp;{{skuNum}},
   						<span class="category-num" v-if="classInfo">生鲜{{classInfo.freshFoodNum}}个,</span>
   						<span class="category-num" v-if="classInfo">加工品{{classInfo.processedFoodNum}}个,</span>
   						<span class="category-num" v-if="classInfo">冻品{{classInfo.frozenFoodNum}}个</span>
   					</dd>
   				</dl>
   			</div>
   			<div class="button-to-pick" v-if="receiveOrder">
				<button @click="receiveOrders(id)" :disabled="isHttps"
					style="width: 70px;height: 30px;line-height: 29px;padding: 0;"
				>接单</button>
   			</div>
   			</label>
   		</div>
   		
    </Group>
</template>

<script>
import {Group} from 'vux'
	
	export default{
		name:'pre-list-concats',
		components:{Group},
		data(){
			return {
				isHttps:false
			}
		},
		created(){
		},
		updated(){
		},
		methods:{
			receiveOrders(id){
				this.isHttps=true;
				this.receiveOrder(id,()=>{
					this.isHttps=false;
				});
			}
		},
		props:{
			id:[String], //id
			isOver:[Boolean],
			creatTime:[Number,String], //时间
			outerOrderType:[String,Number],
			OverText:[String,Number],  //超时时间，毫秒数
			skuNum:[Number,String], //sku数量
			orderSequenceNo:[String],  //订单类别名称
			deliverType:[Number,String],  //订单类别（自提，配送
			slotType:[String,Number],  //订单类别（极速达，预约
			receiveOrder:[Function],  //是否显示接单按钮
			classInfo:[Object,String],  //生鲜，冻品，加工
			type:[String],   //订单类型（未超时已超时）
		}
	}
</script>

<style lang="less">
	.order-name{margin-right: 10px;font-size: 12px;}
	.order-form{
		color: #197FA9;background: #F2FBFE;border: 1px solid #AFE2EB;border-radius: 1px;font-size: 10px;padding: 2px 5px;
    	margin-right: 5px;
		&.order-jkd{color: #6DA919;background: #F1FEE9;border: 1px solid #C4EBAF;border-radius: 0px;}
		&.order-type-dif{color: #417505;background: #F8FFF1;border-color: #91CE4A;}
	}
	.pre-picking .pre-pick-list .list-pre-item .pre-list-item-content dd > span{
		&.category-num{
			color: #999999;margin-right: 0;padding: 0;
		}
	}
	.order-form-immedirte{
		background: #FEF6E9;border: 1px solid #EBD3AF;border-radius: 1px;color: #A95519;
	}
	.pre-picking .pre-pick-list .list-pre-item .pre-list-item-content .button-to-pick button:disabled{
		background: #d5d5d6;
	}
</style>