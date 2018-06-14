<template>
  <div class="pre-picking">
    <x-header class="vux-1px-b">
    	前置仓拣货
    	<a slot="right"><router-link to="historyPickList">我的拣货单</router-link></a>
    </x-header>
    <tab v-model="index" active-color="#3DA5FE">
	      <tab-item v-for="(i,ins) in ['待拣货','拣货中']" @on-item-click="clickItem">{{i}}</tab-item>
	    </tab>
    <div class="scroll-content pre-pick-list" ref="scrollWrap">
        <div v-if="index==0">
          	<div class="container-list" >
			        <Group class="list-pre-item" v-for="e,index in data.noPick" :key="index">
			       		<div class="item-top vux-1px-b">
			       			<span class="good-code">{{e.id}}</span>
			       			<span class="good-time-type">
			       				<span class="order-type">预约送达6.18</span>
			       				<span class="order-time">{{new Date(e.creatTime).format('hh:mm')}}-{{new Date(e.creatTime).format('hh:mm')}}</span>
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
			       					<dd>共{{e.skuNum}}件商品<span class="order-form">{{e.ordersequenceno}}</span></dd>
			       				</dl>
			       			</div>
			       			<div class="button-to-pick">
			       					<button @click="goToPick(e.id,e.toTime,e.creatTime)">去拣货</button>
			       			</div>
			       		</div>
			        </Group>
			    </div>
			    <div v-if="page.isEnd" class="theEnd">已经到底啦</div>
        </div>
        <div v-if="index==1">
          	<div class="container-list" >
			        <Group class="list-pre-item" v-for="e,index in data.picking" :key="index">
			       		<!--<cell :title="'拣货单号：'+e.id" :value="new Date(e.creatTime).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre"></cell>-->
			       		<div class="item-top vux-1px-b">
			       			<span class="good-code">{{e.id}}</span>
			       			<span class="good-time-type">
			       				<span class="order-type">预约送达6.18</span>
			       				<span class="order-time">{{new Date(e.creatTime).format('hh:mm')}}-{{new Date(e.creatTime).format('hh:mm')}}</span>
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
			       					<dd>共{{e.skuNum}}件商品</dd>
			       				</dl>
			       			</div>
			       			<div class="button-to-pick">
			       					<button @click="goToPick(e.id,e.toTime,e.creatTime)" class="picking-btn">拣货中</button>
			       			</div>
			       		</div>
			        </Group>
			    </div>
			    <div v-if="page1.isEnd" class="theEnd">已经到底啦</div>
        </div>
      <m-empty v-if="data.content && data.content.length == 0"></m-empty>
      
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
					justify-content: space-between;align-items:center;line-height:50px;
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
					padding: 7px 0 15px 0;
					margin: 0 2.7%;
					display: flex;justify-content: space-between;align-items: flex-end;
					dt{
						font-size: 18px;font-weight: 600;color: #333333;line-height: 2;
						&.overTime{color: #D0021B;}
						span{color: #3DA5FE;}
					}
					dd{font-size: 12px;color: #999999;line-height: 2;
						.order-form{color: #197FA9;background: #F2FBFE;border: 0 solid #AFE2EB;border-radius: 1px;font-size: 10px;padding: 3px 5px;margin-left: 5px;}
					}
					.button-to-pick{
						button{border-radius: 3px;background: #3DA5FE;border: none;font-size: 13px;padding: 4px 8px;color: #FFFFFF;
							&.picking-btn{opacity: 0.8;}
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
import { XHeader,Group,Tab, TabItem,Cell,Swiper, SwiperItem } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from '../../../func.js'
export default {
  components: {
    XHeader,Cell,Tab, TabItem,Group,Swiper, SwiperItem,
    MEmpty,MpopInput
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
        pageSize: 5,
        totalPage: 1,
        isEnd:false,
      },
      page1:{
      	pageNo: 0,
        pageSize: 5,
        totalPage: 1,
        isEnd:false,
      },
      data: {
      	'noPick':[],
      	'picking':[],
      },
      showEnd: false // 最后一页
    }
  },
  created() {
    this.getSupplyList(0)
  },
  methods: {
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
//		const datas = this.data.content.filter(e=>{
//			return e.id==id
//		})[0]
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
    	if(status==0){
    		obj={shopId:this.commonInfo.costNumber,status:status,page:pageNow,size: this.page.pageSize}
    	}else{
    		obj={operatorNo:this.commonInfo.userNo,shopId:this.commonInfo.costNumber,status:status,page: pageNow,size: this.page1.pageSize}
    	}
      $request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
        if(res.success) {
        	let listName = '';
        	if(status==0){
        		listName='noPick'  //未拣货
        		 this.data.noPick =this.data.noPick.concat(res.data.content)
	          this.data.noPick.forEach(function(item) {
	            let supplyNum = 0, products = []
	            let a =item.toTime-new Date().getTime()
	            if(a>0){
	            	item.isOver=false;
	            	item.OverText=parseInt((item.toTime-new Date().getTime())/(1000*60));
	            }else{
	            	item.isOver=true;
	            }
          })
        		this.page.totalPage=res.data.totalPages
        	}else{
        		listName='picking' //拣货中
        		 this.data.picking =this.data.picking.concat(res.data.content)
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
  mounted() {
    this.$nextTick(function () {
	    func.scrollListen(this,this.$refs.scrollWrap,()=>{
	    	if(this.index==0){
	    		let e=this.page;
	    			if(e.pageNo<e.totalPage){
		    		console.log("加载下一页")
		    		this.getSupplyList(0)
		    	}else{
		    		this.page.isEnd=true;
		    	}
	    	}else{
	    		let e=this.page1;
	    			if(e.pageNo<e.totalPage){
		    		console.log("加载下一页333")
		    		this.getSupplyList(2)
		    	}else{
		    		this.page1.isEnd=true;
		    	}
	    	}
	    })
    })
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

