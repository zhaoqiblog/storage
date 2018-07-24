<template>
  <div class="pre-picking">
    <x-header class="vux-1px-b" :left-options="{preventGoBack:true}" @on-click-back="back">
    	前置仓拣货
    	<a slot="right"><router-link to="historyPickList">历史拣货单</router-link></a>
    </x-header>
    <tab v-model="index" active-color="#3DA5FE">
	      <tab-item v-for="(i,ins) in ['待拣货','拣货中']" :key="ins" @on-item-click="clickItem">{{i}}</tab-item>
	    </tab>
    <div class="scroll-content pre-pick-list" ref="scrollWrap">
    	<!--<scroller lock-x>-->
        <div v-if="index==0">
          	<div class="container-list" >
			        <Group class="list-pre-item" v-if="data.noPick&&data.noPick.length>0" v-for="e,index in data.noPick" :key="index" @click.native="goToPick(e.id,e.toTime,e.creatTime)">
			       		<div class="item-top vux-1px-b">
			       			<span class="good-code">{{e.id}}</span>
			       			<span class="good-time-type">
			       				<span class="order-type">{{new Date(e.creatTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
			       			</span>
			       		</div>
			       		<div class="pre-list-item-content">
			       			<div>
			       				<dl>
			       					<dt v-if="e.isOver" class="overTime">已超时</dt>
			       					<dt v-if="!e.isOver">
			       						剩余 
			       						<span>{{e.OverText}}</span> 分钟
			       					</dt>
			       					<dd>
			       						商品SKU&nbsp;{{e.skuNum}}
			       						<span class="order-form order-jkd" v-if="e.outerOrderType==2">{{e.orderSequenceNo}}</span>
			       						<span class="order-form" v-if="e.outerOrderType==0">{{e.orderSequenceNo}}</span>
			       						<span class="order-form">{{e.deliverType=='0'?'自提':'配送'}}</span>
			       						<span class="order-form-immedirte" v-if="e.deliverType!=='0'&&e.slotType!=='expectTime'">{{e.slotType=='expectTime'?'':'极速达'}}</span>
			       					</dd>
			       				</dl>
			       			</div>
			       			<div class="button-to-pick">
			       					<button @click="goToPick(e.id,e.toTime,e.creatTime)">去拣货</button>
			       			</div>
			       		</div>
			        </Group>
			    </div>
			    <m-empty v-if="data.noPick && data.noPick.length == 0"></m-empty>
			    <div v-if="page.isEnd" class="theEnd">已经到底啦</div>
        </div>
        <div v-if="index==1">
          	<div class="container-list" >
			        <Group class="list-pre-item" v-for="e,index in data.picking" :key="index" @click.native="goToPick(e.id,e.toTime,e.creatTime)">
			       		<!--<cell :title="'拣货单号：'+e.id" :value="new Date(e.creatTime).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre"></cell>-->
			       		<div class="item-top vux-1px-b">
			       			<span class="good-code">{{e.id}}</span>
			       			<span class="good-time-type">
			       				<!--<span class="order-type">预约送达6.18</span>-->
			       				<span class="order-type">{{new Date(e.creatTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
			       				<!--<span class="order-time">{{new Date(e.creatTime).format('hh:mm')}}-{{new Date(e.creatTime).format('hh:mm')}}</span>-->
			       			</span>
			       		</div>
			       		<div class="pre-list-item-content">
			       			<div>
			       				<dl>
			       					<dt v-if="e.isOver" class="overTime">已超时</dt>
			       					<dt v-if="!e.isOver">
			       						剩余 
			       						<span>{{e.OverText}}</span> 分钟
			       					</dt>
			       					<dd>商品SKU&nbsp;{{e.skuNum}}
			       						<span class="order-form order-jkd" v-if="e.outerOrderType==2">{{e.orderSequenceNo}}</span>
			       						<span class="order-form" v-if="e.outerOrderType==0">{{e.orderSequenceNo}}</span>
			       						<span class="order-form">{{e.deliverType=='0'?'自提':'配送'}}</span>
			       						<span class="order-form-immedirte" v-if="e.deliverType!=='0'&&e.slotType!=='expectTime'">{{e.slotType=='expectTime'?'':'极速达'}}</span>
			       					</dd>
			       				</dl>
			       			</div>
			       			<div class="button-to-pick">
			       					<button @click="goToPick(e.id,e.toTime,e.creatTime)" class="picking-btn">拣货中</button>
			       			</div>
			       		</div>
			        </Group>
			    </div>
			    <div v-if="page1.isEnd" class="theEnd">已经到底啦</div>
			    <m-empty v-if="data.picking && data.picking.length == 0"></m-empty>
        </div>
      <!--</scroller>-->
      
    </div>
  </div>
</template>
<style lang="less">
	.pre-picking{
		.pre-pick-list{
			top: 90px;
			.list-pre-item{
				width: 95%;
				margin:0 auto;
				border-radius: 3px;
				.weui-cells{
					margin-top: 10px;
				}
				.item-top{
					display:flex;
					justify-content: space-between;align-items:center;line-height:30px;
					margin:0 2.7%;
					.good-code{
						font-size: 13px;color: #999999;
					}
					.good-time-type{
						font-size: 12px;
						.order-type{color: #999999;}
						.order-time{color: #3DA5FE;}
					}
				}
				.pre-list-item-content{
					padding: 7px 0 10px 0;
					margin: 0 2.7%;
					display: flex;justify-content: space-between;align-items: flex-end;
					dt{
						font-size: 18px;font-weight: 600;color: #333333;line-height: 1.6;
						&.overTime{color: #D0021B;}
						span{color: #3DA5FE;}
					}
					dd{font-size: 12px;color: #999999;line-height: 2;
					>span{
						padding: 2px 5px;margin-right: 5px;
					}
						.order-form{
							color: #197FA9;background: #F2FBFE;border: 1px solid #AFE2EB;border-radius: 1px;font-size: 10px;
							&.order-jkd{color: #6DA919;background: #F1FEE9;border: 1px solid #C4EBAF;border-radius: 0px;}
							}
							.order-form-immedirte{
								background: #FEEEE9;border: 1px solid #EBBDAF;border-radius: 1px;color: #D0021B;
							}
					}
					.button-to-pick{
						button{border-radius: 3px;background: #3DA5FE;border: none;font-size: 13px;padding: 4px 8px;color: #FFFFFF;
							&.picking-btn{opacity: 0.6;}
						}
					}
				}
			}
			.theEnd {
		    font-size: 14px;
		    line-height: 1;
		    margin: 16px 0;
		    color: #bbb;
		    text-align: center;
		  }
		}
	}
	.container-list{
		margin-top: 10px;
	}

</style>
<script>
	import MEmpty from '@/components/MEmpty/index'
import MpopInput from '@/components/MpopInput/index'
import { XHeader,Group,Tab, TabItem,Cell,Swiper, SwiperItem,Scroller } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import config from '@/configuration/product'
import func from '../../../func.js'
export default {
  components: {
    XHeader,Cell,Tab, TabItem,Group,Swiper, SwiperItem,
    MEmpty,MpopInput,Scroller
  },
name: 'pick-list',
//name:'pre',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
    	index:0,
      // 分页 page:未拣货，page1：拣货中
      page: {
        pageNo: 0,
        pageSize: 20,
        totalPage: 1,
        isEnd:false,
      },
      page1:{
      	pageNo: 0,
        pageSize: 20,
        totalPage: 1,
        isEnd:false,
      },
      data: {
      	'noPick':[],
      	'picking':[],
      },
      showEnd: false, // 最后一页
      timer:null,
    }
  },
    mounted() {
    this.$nextTick(function () {
	    func.scrollListen(this,this.$refs.scrollWrap,()=>{
	    	if(this.index==0){
	    		let e=this.page;
	    			if(e.pageNo<e.totalPage){
//		    		console.log("加载下一页")
		    		this.getSupplyList(0)
		    	}else{
		    		this.page.isEnd=true;
		    	}
	    	}else{
	    		let e=this.page1;
	    			if(e.pageNo<e.totalPage){
//		    		console.log("加载下一页333")
		    		this.getSupplyList(2)
		    	}else{
		    		this.page1.isEnd=true;
		    	}
	    	}
	    })
	    this.timer = setInterval(()=>{
			this.page.pageNo=1;
			this.$refs.scrollWrap.scrollTop=0
    	this.getSupplyList(0,this.page.pageNo)  
    },30000)
    })
   	
  },
  created() {
    this.getSupplyList(0)
  },
  destroyed(){
  	clearInterval(this.timer)
  },
  methods: {
  	back(){
  		clearInterval(this.timer)
  		this.$router.back();
  	},
  	clickItem(index){
  		if(index==0){  //待拣货
  			this.data.noPick=[];
  			this.getSupplyList(0,1)
  		}else{
  			this.data.picking=[];
  			this.getSupplyList(2,1);
  		}
  	},
  	/*
  	 *去拣货  status,
  	 */
  	goToPick(id,toTime,creatTime){
  		this.$router.push({path:'picking',query:{'id':id,toTime:toTime,creatTime:creatTime}})
  	},
  	/**
  	 * 查看改该货单详情
  	 */
  	ToPickLook(id){
  		
  	},
    /**
     * 获取前置仓拣货列表
     * @param[status] : 0：待拣货; 1:拣货完成; 2:开始拣货 0：待拣货时不用传工号，其他传工号
     * 这里只需要传连两个：0：2
     * @params（pageNo： 如果pageNo 传入且值为1：说明重新加载，这时，双方都是从第一页开始加载，否则是按照页码填加新的
     */
    getSupplyList (status,pageNo) {
    	let pageNow;
    	if(!pageNo){  //pageno不存在，累加，不是i重新加载
    		if(status==0){
    			this.page.pageNo++;
    			pageNow = this.page.pageNo
    		}else{
    			this.page1.pageNo++;
    			pageNow = this.page1.pageNo
    		}
    		
    	}else{//pageNo存在 : 重新加载，从第一页开始，此时传入的页码是第一页
    		pageNow = pageNo;
    		if(status==0){
    			this.page.pageNo=pageNo;
    		}else{
    			this.page1.pageNo=pageNo;
    		}
    	}
    	let obj;
//  	let obj={shopId:this.commonInfo.costNumber,status:status,page:pageNow,size: this.page.pageSize}
    	if(status==0){
    		obj={shopId:this.commonInfo.costNumber,status:status,page:pageNow,size: this.page.pageSize}
    	}else{
    		obj={operatorNo:this.commonInfo.userNo,shopId:this.commonInfo.costNumber,status:status,page: pageNow,size: this.page1.pageSize}
    	}
      $request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
        if(res.success) {
        	let listData=[];
//      	 if(config.filterStore.some((e)=>{return e == this.commonInfo.costNumber})){  //过滤掉永辉生活的订单，不在列表中的门店不需要过滤
//	          	listData = res.data.content.filter((aItem,inde)=>{
//	          		return aItem.outerOrderType!==0
//	          	})
//	         }else{
//	         	listData=res.data.content
//	         }
	         listData=res.data.content
        	if(status==0){
	          if(pageNow==1){
	         		this.data.noPick=[];
	         	}	          	         
	         this.data.noPick =this.data.noPick.concat(listData)
		          this.data.noPick.forEach(function(item) {
		            let supplyNum = 0, products = []
		            let a = parseInt(item.toTime-new Date().getTime())
		            if(a>0){
		            	item.isOver=false;
		            	item.OverText=parseInt(a/(1000*60));
		            	
		            }else{
		            	item.isOver=true;
		            }
	          })
		         
        		this.page.totalPage=res.data.totalPages
        	}else{ //拣货中
        		 this.data.picking =this.data.picking.concat(listData)
	          this.data.picking.forEach(function(item) {
	            let supplyNum = 0, products = []
	            let a =item.toTime-new Date().getTime()
	            if(a>0){
	            	item.isOver=false;
	            	item.OverText=parseInt((item.toTime-new Date().getTime())/(1000*60));
	            }else{
	            	item.isOver=true;
	            }
	          })
        		this.page1.totalPage=res.data.totalPages
        		
        	}
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
  },

  activated () {
    if(this.$route.query.refresh && 1 == this.$route.query.refresh) {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        totalPage: 1
      }
      this.data = {}
      this.showEnd = false
      this.getSupplyList(0)
    }
  }
}

</script>

