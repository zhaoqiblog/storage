<template>
	<Group class="list-pre-search" @click.native="toDetail(id)">
   		<div class="item-top vux-1px-b">
   			<span class="good-code">
   				<span class="order-name">{{orderSequenceNo}}</span>
   				<span class="opera-name" v-if="status=='1'&&operatorName">{{operatorName}} 已完成</span>		   				
   				<span class="opera-name" v-if="status=='0'">待拣货</span>		   				
   				<span class="opera-name" v-if="status=='2'&&operatorName">{{operatorName}} 拣货中</span>		   				
   			</span>
   			<span class="search-time">
   				<span >{{slotType=='expectTime'?'预约送达':'极速送达'}}</span>
   				<span class="order-type">{{new Date(creatTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
   				
   			</span>
   		</div>			       		
   		<div class="pre-list-item-content">
			<ul class="search-item-list">
				<li>
					<img src="../../assets/pre/iconUser@3x.png"/> 
					<span>{{customerName}}</span>
				</li>
				<li>
					<img src="../../assets/pre/iconphone@3x.png"/> 
					<span>{{customerPhone}}</span>
				</li>
			</ul>
   			<div class="button-to-pick">
				<button @click.stop="print(id)"  v-if="status=='1'"
					style="width: 70px;height: 30px;line-height: 29px;padding: 0;"
				>打印{{printCount=='0'?'':printCount}}</button>
   			</div>
   			</label>
   		</div>
   		<div class="vux-1px-t bottomInfo">
   			<span :class="deliverType=='0'?'order-type-dif order-form':'order-form'">{{deliverType=='0'?'自提':'配送'}}</span>
   			<span class="item-bottom-right">
   				<span class="mergeId" v-if="status=='1'">合单号{{mergeId}}</span>
   				<span class="order-id">{{id}}</span>
   			</span>
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
			status:[Number,String],  //状态：1 已完成（历史），0 待拣货，2：拣货中
			creatTime:[Number,String], //时间
			orderSequenceNo:[String],  //订单类别名称
			operatorName:[String],   //操作人名称
			customerPhone:[String],  //用户电话
			customerName:[String],   //用户名
			printCount:[String,Number], //打印次数
			mergeId:[String],         //合单号
			deliverType:[Number,String],  //订单类别（自提，配送
			slotType:[String,Number],  //订单类别（极速达，预约
			printOrder:[Function],  //打印按钮
			toDetailPage:[Function],  // 标签点击进详情页
		},
		methods:{
			print(id){
				this.printOrder(id)
			},
			toDetail(id){
				this.toDetailPage(id)
			}
		}
	}
</script>

<style lang="less">
	.bottomInfo{
		.order-form{padding: 0 8px;}
	}
.list-pre-search{
	width: 95%;margin: 10px auto 0;border-radius: 3px;
	.weui-cells{margin-top: 10px;border-radius: 3px;padding: 0 2.5%;}
	.item-top{display: flex;justify-content: space-between;}
	.search-time{font-size: 12px;color: #6C6C6C;}
	.good-code{font-size: 13px;
		.opera-name{color: #6C6C6C;}
		.order-name{color: #333333;font-weight: 600;font-size: 13px;}		
	}
	.bottomInfo{
		height: 35px;padding-top: 5px;
		display: flex;justify-content: space-between;align-items: center;
		.item-bottom-right{font-size: 12px;
			.mergeId{color: #FE833D;}
			.order-id{color: #6C6C6C;}
		}
		.order-form{}
	}
	.pre-list-item-content{
		display: flex;justify-content: space-between;align-items: center;
		button{background: #3DA5FE;border-radius: 3px;color: #FFFFFF;font-size: 13px;padding: 3px 6px;border: none;}
	}
}
	.item-top{
		line-height: 30px;
	}
	.search-item-list{
		padding: 10px 0;color: #333333;font-size: 14px;
		li{
			img{width: 16px;margin-right: 3px;}
			display: flex;justify-content: flex-start;align-items: center;
			&:nth-child(2){
				margin-top: 8px;
			}
		}
	}
</style>