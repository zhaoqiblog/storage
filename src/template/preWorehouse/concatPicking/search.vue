<template>
	<div class="search" >
  		<x-header class="vux-1px-b" :left-options="{preventGoBack:true}" @on-click-back="back">搜 索 订 单</x-header>
  		<div  ref="scrollWrap" class="scrol">
			<div class="s-wrap">
				<group>
					<div class="search-in">
						<input placeholder="订单号或序号(如：1) 或客户手机号" type="number" v-model="searchList.searchKey" pattern="[0-9]*"/>
						<i class="iconfonts"></i>
						<i class="del" @click="delect"></i>
					</div>
					<!--<div class="search-order-type">
						<button>永辉</button> <button>京东</button>
					</div>-->
					<div class="checkers">
						<checker
						    v-model="searchList.outerOrderType"
						    default-item-class="demo5-item"
						    selected-item-class="demo5-item-selected"
					    >
					    <checker-item value="0">永辉</checker-item>
					    <checker-item value="2">京东</checker-item>
					    </checker>
					</div>
					<button class="search-btn" @click="searchOrder">搜索</button>				
				</group>
			</div>
			<div class="list-search">
				<p v-if="searchList.totalElements&&searchList.content.length>0" class="total-searchnumber">共{{searchList.totalElements}}个结果</p>
				<pre-search-item v-for="(a,ai) in searchList.content" :key="ai"
					:id="a.id"
					:status="a.status"
					:creatTime="a.toTime"
					:orderSequenceNo="a.orderSequenceNo"
					:operatorName="a.operatorName"
					:customerName="a.customerName"
					:customerPhone="a.customerPhone"
					:printCount="'X'+a.printCount"
					:mergeId="a.mergeId"
					:deliverType="a.deliverType"
					:slotType="a.slotType"
					:toDetailPage="toDetailPage"
					:printOrder="printOrder"
				>
				</pre-search-item>
				<m-empty v-if="searchList.content&&searchList.content.length==0&&isSe"></m-empty>
				<div class="bottom-txt" v-if="page.isEnd">{{'没有更多数据了'}}</div>
			</div>
			
			
		</div>
		 <popup-picker 
    	v-if="commonInfo.blueList" 
    	:show-cell="false" class="showposdiffer"  
    	:data="commonInfo.blueList" 
    	:show="showSelectBlue" 
    	v-model="slectBlue" 
    	@on-change="changeBlue" 
    	show-name 
    	@on-hide="showSelectBlue=false"></popup-picker>
	</div>
</template>

<script>
	import {XHeader,Group,Checker, CheckerItem} from 'vux';
	import MEmpty from '@/components/MEmpty/index'
	import $request from '@/service/request.js'
	import {mapState} from 'vuex'
	import func from '../../../func.js'
	import factory from '@/factory.js'
	export default{
		name:'search',
		components:{XHeader,Group,Checker, CheckerItem,MEmpty},
		data(){
			return {
				showSelectBlue:false, //选择蓝牙
				searchObj:{
					searchKey:'',outerOrderType:'0',shopId:'',content:[],totalElements:''
				},
				page:{page:0,size:20,totalPages:0,isEnd:false},
				searchData:[],
				slectBlue:[], //选中的蓝牙设备号
				isSe:false,
			}
		},
		computed:mapState({
			commonInfo:state=> state.global.commonInfo,
			searchList:state=>state.prePick.searchList,
		}),
		created(){
			this.searchObj.shopId=this.commonInfo.costNumber
			if(!this.$route.query.isBack){
				this.$store.commit("setSearchList",Object.assign({},this.searchObj))
			}
		},
	    mounted() {
		    this.$nextTick(function () {
			    func.scrollListen(this,this.$refs.scrollWrap,()=>{
		    		let e=this.page;
		    		if(e.page<e.totalPages){
		    			this.page.page++;
			    		this.getList()
			    	}else{
			    	}
			    })
		    })
		  },
		methods:{
			searchOrder(){
				this.page.page=1;
				this.getList()				
			},
			delect(){
				this.searchList.searchKey='';
			},
			getList(){
				this.page.isEnd=false;
				let obj = {
					...this.page,
					searchKey:this.searchList.searchKey,outerOrderType:this.searchList.outerOrderType,shopId:this.searchList.shopId
				}
				$request.get("/api/online-order/v1/protected/searchOrders",obj).then((res)=>{
					this.isSe=true;
					if(this.page.page==1){
					this.searchData = res.data.content.concat([]);
					}else{
						this.searchData = this.searchData.concat(res.data.content);
					}
					this.$store.commit("setSearchList",Object.assign(this.searchList,{content:this.searchData,totalElements:res.data.totalElements}))
					if(res.data.content.length>0){
						this.page.page=res.data.number;
						this.page.totalPages=res.data.totalPages;
						if(this.page.page == this.page.totalPages){
							this.page.isEnd=true;
						}else{
							this.page.isEnd=false;
						}
					}
				})
			},
			
	/**
	 * 修改蓝牙连接设备
	 */
	changeBlue(){
		localStorage.setItem("bluedata",this.slectBlue[0]);
		sessionStorage.setItem("bluedata",this.slectBlue[0]);
//		连接打印机
		if(window.cordova){
			var param1 = { btAddress:sessionStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
			factory.connectBlue(param1).then(res=>{
				this.isConnectDevice=true;
				this.printOrder(this.printId)
			},(err)=>{
				alert("连接打印机失败："+err+'\n'+"请回到首页设置模块修改打印设备")}
			)
		}
	},
			  /**
	 * 打印小票
	 */
	printOrder(id){
		//开启蓝牙
  		const _this =this;
		//获取蓝牙连接列表，判断是否之前连接过蓝牙
		if(sessionStorage.getItem("bluedata")){
			//获取打印小票信息
			$request.post("/api/online-order/v1/protected/batchpickdetail",[id]).then((res)=>{
				if(res.success==true){
					this.searchList.content.forEach((r)=>{
						if(r.id==id){
							r.printCount = res.data[0].printCount
						}
					})
					func.printInfo(res.data[0],this,()=>{
						this.$vux.toast.show({
			            type: 'text',
			            text: res.data[0].ordersequenceno+'打印成功',
			          })
					},(err)=>{
						alert(err)
						if(this.commonInfo.blueList[0].length>0){
							this.showSelectBlue=true;
						}else{
							factory.getBlueList().then((res)=>{
							let arrays = res.map((e)=>{
								return {name:e.split("=>")[0],value:e.split("=>")[1]}
							})
							this.$store.commit("updateCommonInfo", {
						    	blueList:[arrays],
						    });
						    this.showSelectBlue=true;
							},(err)=>{
									alert(err);
							})
						}
					})
				}else{
					this.$vux.toast.show({
				          type: 'text',
				          text: res.message||'获取该订单数据失败，请联系管理员',
			          })
				}
			})
		}else{
			factory.getBlueList().then((res)=>{
				let arrays = res.map((e)=>{
					return {name:e.split("=>")[0],value:e.split("=>")[1]}
				})
				this.$store.commit("updateCommonInfo", {
			    	blueList:[arrays],
			    });
			    this.showSelectBlue=true;
				},(err)=>{
						alert(err);
				})
		}
	},
			
			toDetailPage(id){
				this.$router.push({name:'searchDetail',query:{id:id}})
			},
			back(){
				this.$router.push("concatPickList")
			}
		}
	}
</script>

<style lang="less">
	.list-search{
		position: absolute;
	    top: 190px;
	    left: 0;
	    right: 0;
	    bottom: 0;
	}
	.scrol{
	    position: absolute;
	    top: 46px;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    overflow-y: auto;
	    -webkit-overflow-scrolling: touch;
	}
	.bottom-txt{text-align: center;line-height: 3;}
	.total-searchnumber{
		    width: 95%;
    margin: 15px auto 0;
    border-radius: 3px;
    font-size: 13px;
    color: #999999;
	}
	.s-wrap{
		margin: 0;
		.weui-cells{margin: 0;}
		.weui-cells:before{
			border-top: none;
		}
		.search-in{
			position: relative;margin:20px 2.5% 0 2.5%;width: 95%;
		}
		input[type='number']{
			border: none;background: #F4F4F4;line-height: 36px;font-size: 13px;width: 100%;box-sizing: border-box;
			border-radius: 5px;padding-left:30px;
			
		}
		.iconfonts{
			position: absolute;
			width: 15px;height: 15px;
			background: url(../../../assets/common/searchc.png) center center no-repeat;
			background-size: cover;top: 10px;left:8px;color: #CCCCCC;
		}
		.del{
			position: absolute;
			width: 15px;height: 15px;
			background: url(../../../assets/pre/iconClose@3x.png) center center no-repeat;
			background-size: cover;top: 10px;right:8px;color: #CCCCCC;
		}
		.search-btn{
			width: 95%;margin: 0 2.5% 15px;text-align: center;    border-radius: 3px;
			height: 40px;
		    background: #3DA5FE;
		    border: none;
		    font-size: 16px;
		    padding: 4px 8px;
		    color: #FFFFFF;
		}
	}
	.checkers{
		margin: 20px auto 24px;
		width: 95%;
		.vux-checker-box{
			display: flex;
			justify-content: space-between;
		}
		.demo5-item {
		  width: 44.5%;
		  height: 32px;
		  line-height: 32px;
		  text-align: center;
		  border-radius: 3px;
		  border: 1px solid #ccc;
		  background-color: #fff;box-sizing: border-box;
		}
		.demo5-item-selected {
		  border-color: rgba(74,144,226,0.80);;color: #4A90E2;border-width: 2px;
		  line-height: 30px;
		}
	}
</style>