<template>
	<div class="shop-supply">
		<x-header class="vux-1px-b">历史拣货单</x-header>
		<div class="scroll-content pre-content history-list-content" ref="scrollWrap">
			<div class="container-list" v-for="e,index in data.content">
				<router-link :to="{path:'historyDetail',query:{id:e.id}}">
			       <Group class="list-pre-item">
		       		<cell  :value="new Date(e.finishTime).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre">
		       			<!--:title="'已完成(拣货员：'+e.operatorName+')'"-->
		       			<span slot="title" style="font-size: 12px;">{{e.operatorName}}  已完成 </span>
		       		</cell>
		       		<!--<cell :title="'已完成(拣货员：'+e.operatorName+')'" :value="new Date(e.finishTime).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre"></cell>-->
		       		<div class="pre-list-item-content pre-list-wrap">
		       			<div>
		       				<dl>
		       					<dt>{{e.id}} <span></span></dt>
		       					<dd>
		       						<!--共{{e.skuNum}}件商品，已拣{{e.finishSkuNum}}件 <span>{{e.ordersequenceno}}</span>-->
		       						<span class="order-form order-jkd" v-if="e.outerOrderType==2">{{e.orderSequenceNo}}</span>
		       						<span class="order-form" v-if="e.outerOrderType==0">{{e.orderSequenceNo}}</span>
		       						<span class="order-form">{{e.deliverType=='0'?'自提':'配送'}}</span>
		       						<span class="order-form-immedirte" v-if="e.deliverType!=='0'&&e.slotType!=='expectTime'">{{e.slotType=='expectTime'?'':'极速达'}}</span>
		       					</dd>
		       				</dl>
		       			</div>
		       			<div class="button-to-pick"><router-link :to="{path:'historyDetail',query:{id:e.id}}"><button class="toDetail">查看详情</button></router-link></div>
		       		</div>
		       </Group>
		       </router-link>
		    </div>
		<!--</div>-->
      		<div v-if="showEnd" class="theEnd">已经到底啦</div>
      		<m-empty v-if="data.content && data.content.length == 0"></m-empty>
		</div>
	</div>
</template>

<script>
	import MEmpty from '@/components/MEmpty/index'
	import { XHeader,Group,Cell } from 'vux'
	import { mapState } from 'vuex';
	import $request from '@/service/request.js'
	import func from '../../../func.js'
	import config from '@/configuration/product'
	export default {
		components: {
			XHeader,Group,Cell,MEmpty
		},
		computed: mapState({
		    commonInfo: state => state.global.commonInfo
		  }),
		data() {
			return {
				datas:[
					{code:"BH955715041315160064",time:'2018-01-23 16:13:17',status:'已完成',total:15,complete:12},
					{code:"Bertert715041315160064",time:'2018-01-23 16:13:17',status:'已完成',total:22,complete:22},
				],
				data:{content:[]},
				showEnd:false,
				page: {pageNo: 0,pageSize: 8,totalPage: 1},
			}
		},
		created(){
			this.getPreList()
		},
		mounted(){
			//监听滚动事件
			 this.$nextTick(function () {
			 	const e=this.page;
		        func.scrollListen(this,this.$refs.scrollWrap,()=>{
		        	if(e.pageNo<e.totalPage){
		        		this.getPreList()
		        	}else{
		        		this.showEnd=true;
		        	}
		        })
		    })
		},
		methods:{
			/**
			 * 获取历史拣货单列表
			 */
			getPreList () {
		    	this.page.pageNo++;
//		    	const  pageable= {page: this.page.pageNo,size: this.page.pageSize}
//		    	const obj={shopId:this.commonInfo.costNumber,status:1,page: this.page.pageNo,size: this.page.pageSize,operatorNo:this.commonInfo.userNo}
		    	const obj={shopId:this.commonInfo.costNumber,status:1,page: this.page.pageNo,size: this.page.pageSize}
		      $request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
		        if(res.success) {
		        	let listData=[];
//		        	 if(config.filterStore.some((e)=>{return e == this.commonInfo.costNumber})){  //过滤掉永辉生活的订单，不在列表中的门店不需要过滤
//			          	listData = res.data.content.filter((aItem,inde)=>{
//			          		return aItem.outerOrderType!==0
//			          	})
//			         }else{
//			         	listData=res.data.content
//			         }
			         listData=res.data.content
		          this.data.content =this.data.content.concat(listData)
		          this.page.totalPage=res.data.totalPages
		        } else {
		          this.$vux.toast.show({
		            type: 'text',
		            text: res.message
		          })
		        }
		      })
		    },
		}
	}
</script>

<style lang="less">
	.pre-pic-history-list {
		margin-top: 10px;
		.item{
			.content{
				.pic-result{
					font-size: 10px;
					color: #666666ba;
				}
			}
		}
	}
	.history-list-content{
		/*padding-bottom: 15px;*/
	}
	.shop-supply .scroll-content.pre-content .list-pre-item .pre-list-item-content .button-to-pick button{
		&.toDetail{
			border: 1px solid #D0D0D0;
			/*border-radius: 2px;*/
			font-size: 15px;
			color: #333333;
			background: #FFFFFF;
		}
	}
	.pre-list-item-content{
		&.pre-list-wrap{
			display: flex;justify-content: space-between;align-items: flex-end;
		}
		dd{
			>span{
				padding: 2px 5px;margin-right: 5px;
			}
			.order-form{
				color: #197FA9;background: #F2FBFE;border: 1px solid #AFE2EB;border-radius: 1px;font-size: 10px;
				&.order-jkd{color: #6DA919;background: #F1FEE9;border: 1px solid #C4EBAF;border-radius: 0px;}
			}
			.order-form-immedirte{
				background: #FEF6E9;border: 1px solid #EBD3AF;border-radius: 1px;color: #A95519;
			}
		}
	}
</style>