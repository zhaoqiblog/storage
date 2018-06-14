<template>
  <div class="self-process">
    <x-header :left-options="{backText: '',preventGoBack:true}" @on-click-back="back">我的补货单</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    
		<div class="scroll-content" id="scrol-wrap">
	    <div class="contentWrap">
	    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
	      <m-empty v-if="showEmptty"></m-empty>
	      <keep-alive>
	    	<div class="wraps">
	    		<!--<keep-alive>-->
	    		<div v-for="a in data" class="listIndex vux-1px-tb">
	    			<div @click="goTodetail(a)" class="differCell">
	    				<router-link :to="{path:'/backCount/replenishmentDetail',query:{ids:a.id}}">
		    		<cell :title="a.dates" is-link class='vux-1px-tb'></cell>
						<dl class="replenishIntroduce" >
							<dt class="clearfix"><span class="goodsName fl">补货单号：&nbsp;</span><span class="fl listInfo">{{a.id}}</span></dt>
							<dt class="clearfix"><span class="goodsName fl">补货数量：&nbsp;</span><span class="fl listInfo">{{-a.operNum}}件</span></dt>
							<dd class="detailnum"><span for="" class="goodsName" style="">补货商品：&nbsp;</span> <span class="listInfo">{{a.listGoodsLists}}</span></dd>
						</dl>
						</router-link>
					</div>
	    		</div>
	    		<div v-if="showEnd" class="theEnd">已经是最后一页了!</div>
	    			<!---->
	    	</div>
	    	</keep-alive>
	    </div>
    <!--</scroller>-->
   	</div>
   
  </div>
</template>
<script>
import MEmpty from '@/components/MEmpty/index'
import { XHeader,Scroller,Cell} from 'vux'
import factory from '@/factory'
import func from '@/func'
import $request from '@/service/request.js'
import { mapGetters,mapState } from 'vuex'
//import
export default {
  components: {
    XHeader,Scroller,Cell,MEmpty
  },
  name:'replenishmentList',
  data() {
    return {
    	data:[],
    	pageObj:{
    		pageNumber:1,
    		pageSize:5,
    		totalPage:1,
    	},
    	showEnd:false,
    	showEmptty:false,
    }
  },
  computed: {
	...mapState({
		commonInfo:state=>state.global.commonInfo,
		myaddWroseList:state=>state.backCount.myaddWroseList
	})
  },
  created() {
  	this.data=this.myaddWroseList.concat([])
  	var obj ={operateType:1,operatorNo:this.commonInfo.id,pageNumber:this.pageObj.pageNumber,pageSize:this.pageObj.pageSize}
  	$request.get("/api/warehouse-operate-main/v1/protected/query/warehouseOperatePage",obj).then(res=>{
  		if(res.success==true){
  			this.pageObj.pageNumber++;
  			this.pageObj.totalPage=res.data.totalPages
  			if(res.data.content.length>0){
  				this.showEmptty=false;
  			}else{
  				this.showEmptty=true;
  			}
		  	const lists=[...res.data.content];
				lists.map(i=>{
					i.operNum=0
					i.dates=new Date(i.operateDate).format("yyyy-MM-dd hh:mm:ss")
					i.listInfos=i.warehouseOperateDetailList.map(item=>{return item.goodsName})
					i.warehouseOperateDetailList.map(item=>{i.operNum+=item.operateNum})
					i.listGoodsLists = i.listInfos.length>4?(i.listInfos.slice(0,4).join("，")+'...等'+i.listInfos.length+'类商品'):i.listInfos.join(",")
				})
				this.data=JSON.parse(JSON.stringify(lists)).concat([])
		    this.$store.dispatch("changemyaddWroseList", lists)
    	}else{
    		this.$router.push({path:'/fail',query:{text: res.message||'获取我的仓库补货单列表失败,请重试',title: '仓库补货', path:'/'}})
  		}
  	},err=>{
  		this.$router.push({path:'/fail',query:{text: '获取我的仓库补货单列表失败,请重试',title: '仓库补货', path:'/'}})
  	})
  
  },
  mounted(){
		const _this=this;
		var anchor = this.$el.querySelector("#scrol-wrap")  
  	anchor.addEventListener('scroll', function() {
		  var scrollTop = document.body.scrollTop;
		  let top=anchor.scrollTop,
					sh=anchor.scrollHeight,
					ch=anchor.clientHeight;
		  if(sh==top+ch) {
		    // 触发加载数据 
		    _this.loadMore();
		  }
		});
  },
  methods: {
  	loadMore(){
  		var obj ={operateType:1,operatorNo:this.commonInfo.id?this.commonInfo.id:'80006096',pageNumber:this.pageObj.pageNumber,pageSize:this.pageObj.pageSize}
  		if(this.pageObj.pageNumber<=this.pageObj.totalPage){
		  	$request.get("/api/warehouse-operate-main/v1/protected/query/warehouseOperatePage",obj).then(res=>{
		  		if(res.success==true){
		  				this.pageObj.pageNumber++;
		  				this.showEnd=false;
					  	const lists=[...res.data.content];
							lists.map(i=>{
								i.operNum=0
								i.dates=new Date(i.operateDate).format("yyyy-MM-dd")
								i.listInfos=i.warehouseOperateDetailList.map(item=>{return item.goodsName})
								i.warehouseOperateDetailList.map(item=>{i.operNum+=item.operateNum})
								i.listGoodsLists = i.listInfos.length>4?(i.listInfos.slice(0,4).join("，")+'...等'+i.listInfos.length+'类商品'):i.listInfos.join(",")
							})
							let listsed=this.data.concat(JSON.parse(JSON.stringify(lists)).concat([]))
							this.data=listsed
							this.$store.dispatch("changemyaddWroseList", listsed)
					}else{
						this.$router.push({path:'/fail',query:{text: res.message||'获取我的仓库补货单列表失败,请重试',title: '仓库补货', path:'/'}})
					}
		  	},err=>{
		  		this.$router.push({path:'/fail',query:{text: '获取我的仓库补货单列表失败,请重试',title: '仓库补货', path:'/'}})
		  	})
	  	}else{
	  		this.showEnd=true;
	  	}
  	},
  	goTodetail(a){
//		to="{path:'/backCount/replenishmentDetail',query:{ids:a.id}}"
			var anchor = this.$el.querySelector("#scrol-wrap")  
			let top=anchor.scrollTop,
					sh=anchor.scrollHeight,
					ch=anchor.clientHeight;
  	},
    back(){
    	this.$router.push({path:"/scanEntry?key=woreHouse"})
    },
  }
}

</script>
<style lang="less" scoped>

.contentWrap .wraps{
	background: #f4f4f4;
	margin-top: 10px;
	
	.weui-cell{
		border-bottom: 1px solid #DDDDDD;
		border-top: 1px solid #DDDDDD;
		padding: 5px 16.5px;
	}
	.weui-cell_access{
		color: #999999;
		font-size: 12px;
		line-height: 14px;
		height: 33px;
		box-sizing: border-box;
		
	}
	.differCell{
		
	}
	/*.vux-label{color: #999999;}
	.weui-cell_access .weui-cell__ft:after{border-width: 1px 1px 0 0;}*/
	
	.listIndex{margin-bottom: 10px;background: #FFFFFF;border-left:none;border-right: none;}
	.replenishIntroduce{padding: 14px 16px;
		dt{font-weight: 600;color: #666666;}
		dd{
			color: #999999;
			&.detailnum{display: flex;justify-content: center;align-items: flex-start;}
			.listInfo{flex: 1;}
		}
	}
	
	}
	.theEnd{color: #bbb;
    text-align: center;}
</style>
<style lang="less">
	.contentWrap .wraps .differCell{
		.weui-cell{
			border:0px;
		}
		/*.weui-cell__ft{
			&:after{border-width: 1px 1px 0 0;}
		}*/
		}
</style>
