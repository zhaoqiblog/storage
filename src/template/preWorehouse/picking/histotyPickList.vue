<template>
	<div class="shop-supply">
		<x-header class="vux-1px-b">我的拣货单</x-header>
		<div class="scroll-content pre-content history-list-content" ref="scrollWrap">
			<div class="container-list" v-for="e,index in data.content">
				<router-link :to="{path:'historyDetail',query:{id:e.id}}">
			       <Group class="list-pre-item">
		       		<cell title="已完成" :value="new Date(e.finishTime).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre"></cell>
		       		<div class="pre-list-item-content">
		       			<div>
		       				<dl>
		       					<dt>{{e.code}}</dt>
		       					<dd>共{{e.skuNum}}件商品，已拣{{e.finishSkuNum}}件 <span>{{e.ordersequenceno}}</span></dd>
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
//		        	console.log(this.page.pageNo)
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
		    	const obj={shopId:this.commonInfo.costNumber,status:1,page: this.page.pageNo,size: this.page.pageSize,userName:this.commonInfo.userNo}
		      $request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
		        if(res.success) {
		          this.data.content =this.data.content.concat(res.data.content)
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
</style>