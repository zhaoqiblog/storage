<template>
	<Group class="list-pre-search">
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
   					<!--<dt class="overTime">已超时 {{OverText}} 分钟</dt>-->
   					<dt>
   						剩余 
   						<span></span> 分钟
   					</dt>
   					<dd>
   						商品SKU&nbsp;
   						<!--<span class="category-num" v-if="classInfo">生鲜{{classInfo.freshFoodNum}}个,</span>
   						<span class="category-num" v-if="classInfo">加工品{{classInfo.processedFoodNum}}个,</span>
   						<span class="category-num" v-if="classInfo">冻品{{classInfo.frozenFoodNum}}个</span>-->
   					</dd>
   				</dl>
   			</div>
   			<div class="button-to-pick" v-if="connectReceive">
				<button @click="connectReceive(id)" 
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
		name:'pre-search-item',
		components:{Group},
		data(){
			return {
				
			}
		},
		created(){
		},
		props:{
			id:[String], //id
			creatTime:[Number,String], //时间
			orderSequenceNo:[String],  //订单类别名称
			deliverType:[Number,String],  //订单类别（自提，配送
			slotType:[String,Number],  //订单类别（极速达，预约
			connectReceive:[Function],  //是否显示接单按钮
		}
	}
</script>

<style lang="less">
.list-pre-search{
	width: 95%;margin: 10px auto 0;border-radius: 3px;
	.weui-cells{margin-top: 10px;border-radius: 3px;padding: 0 2.5%;}
}
	.item-top{
		line-height: 30px;
	}
</style>