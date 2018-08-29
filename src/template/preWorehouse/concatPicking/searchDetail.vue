<template>
  <div class="shop-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<span class="icons fl"  @click="back"></span>
    	<span class="txt">拣货单详情</span>
    </div>
    <div class="scroll-content pre-content pre-content-pic pre-difer" ref="scrollWrap">
    	<div class="pic-item-info">
    		<div class="success-top">
    			<div class="vux-1px-b">
	    			<div>
	    				<h5 >
	    					<span v-if="data.status=='1'"> 拣货已完成 > </span>
	    					<span v-if="data.status=='0'"> 待拣货 </span>
	    					<span v-if="data.status=='2'"> 拣货中 </span>
	    				</h5>
	    				<div class="order-forms">
	    					<span>{{data.ordersequenceno}}</span>
	    					<span :class="data.deliverType=='0'?'order-type-dif order-form':'order-form'">{{data.deliverType=='0'?'自提':'配送'}}</span>
	    					<span v-if="data.expectdeliverydatetime" :class="data.expectdeliverydatetime.slottype=='expectTime'?'':'emiient'">{{data.expectdeliverydatetime.slottype=='expectTime'?'预约送达':'极速达'}}</span>
	    				</div>
	    			</div>
	    			<div v-if="data.status=='1'">
	    				<img src="../../../assets/common/icon_yiwancheng.png"/>
	    			</div>
    			</div>
    		</div>
    		<div>
    			<dl class="vux-1px-b">
    				<dt>订单信息</dt>
    				<dd>
    					<span>订单号</span>
    					<span>{{data.id}}</span>
    				</dd>
    				<dd v-if="data.mergeId">
    					<span>合单号</span>
    					<span>{{data.mergeId}}</span>
    				</dd>
    				<dd>
    					<span>已拣sku</span>
    					<span>{{parseInt(data.finishSkuNum)}}</span>
    				</dd>
    				<dd>
    					<span>缺货sku</span>
    					<span>{{parseInt(data.unFinishSkuNum)}}</span>
    				</dd>
    				<dd v-if="data.status=='2'||data.status=='1'">
    					<span >拣货员</span>
    					<span>{{data.operatorName}}</span>
    				</dd>
    				<dd v-if="data.status=='2'||data.status=='1'">
    					<span>完成时间</span>
    					<span>{{new Date(data.finishTime).format("yyyy-MM-dd hh:mm:ss")}}</span>
    				</dd>
    			</dl>
    		</div>
    		<div style="padding-top: 0;">
    			<dl  class="vux-1px-b">
    				<dt>顾客信息</dt>
    				<dd v-if="data.expectdeliverydatetime" class="fle">
    					<span >收货人</span>
    					<a :href="'tel:'+data.recvinfo.phone" class="phones"><span>{{data.recvinfo.name+data.recvinfo.phone}}</span><img src="../../../assets/pre/iconphone@3x.png"/></a>
    				</dd>
    				<dd v-if="data.recvinfo">
    					<span>配送地址</span>
    					<span>{{data.recvinfo.address.city+data.recvinfo.address.area+data.recvinfo.address.detail}}&nbsp;&nbsp;<span>{{data.recvinfo.phone}}</span></span>
    				</dd>
    				<dd>
    					<span>顾客备注</span>
    					<span>{{data.comment}}</span>
    				</dd>
    			</dl>
    		</div>
				<div class="handel-btn">
					<a v-if="data.recvinfo" :href="'tel:'+data.recvinfo.phone"><button>联系顾客</button></a>
					<button v-if="data.status=='1'"  @click="printOrder(data.id)" >打印 &nbsp;&nbsp; X{{data.printCount}}</button>
				</div>
			</div>
			<div class="other-order-info pic-item-info">
				<div class="pic-item-info">
				<dl  class="vux-1px-b">
    				<dt>配送信息</dt>
    				<dd v-if="data.expectdeliverydatetime">
    					<span >{{data.expectdeliverydatetime.slottype=='immediate'?'极速送达':'预约送达'}}</span>
    					<span>{{new Date(parseInt(data.expectdeliverydatetime.date)).format('yyyy-MM-dd')}}&nbsp;&nbsp;{{data.expectdeliverydatetime.from}}-{{data.expectdeliverydatetime.to}}</span>
    				</dd>
    				<dd v-if="data.recvinfo">
    					<span>送货方式</span>
    					<span>{{data.deliverType=='0'?'自提':'配送'}}</span></span>
    				</dd>
    			</dl>
    			<dl  class="vux-1px-b" v-if="data.amount">
    				<dt>支付信息</dt>
    				<dd v-if="data.expectdeliverydatetime">
    					<span >商品总额</span>
    					<span>￥{{data.amount.goodsamount/100}}</span>
    				</dd>
    				<dd v-if="data.recvinfo">
    					<span>订单运费</span>
    					<span>￥{{data.amount.freightamount/100}}</span>
    				</dd>
    				<dd>
    					<span>包装费</span>
    					<span>￥{{data.amount.packagingamount/100}}</span>
    				</dd>
    				<dd>
    					<span>商品优惠</span>
    					<span>￥{{(data.amount.coupondiscountamount+data.amount.promotiondiscountamount)/100}}</span>
    				</dd>
    				<dd>
    					<span>运费优惠</span>
    					<span>￥{{data.amount.freightpromotionamount/100}}</span>
    				</dd>
    			</dl>
    			</div>
			</div>
    	<pre-item-pic v-for="(item,index) in data.goodsInfoDTOS"
    		:itemid="item.itemid"
    		:imgurl="item.imgurl"
    		type='concat'
				:preCode="item.warehouseCode"
				:code="'商品编码 '+(item.goodsBarCode)"
				:name="item.goodsName"
				:ordersequencenos="item.ordersequencenos"
				:totalNum="item.qty+item.diffNum"
				:unit="item.desc"
				:unitq="item.saleprice"
				:init="item.init"
				:allpick="item.allpick"
				:halfPickNum="item.qty"
				:status="1"
				:isSearch='true'
				:key="index">
    	</pre-item-pic>
    	<m-empty v-if="data.content && data.goodsInfoDTOS.length == 0"></m-empty>
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
	import { XHeader,PopupPicker } from 'vux'
	import $request from '@/service/request.js'
	import factory from '@/factory.js'
	import func from "@/func.js"
	import { mapState } from 'vuex';
	
	export default {
		components: {
			XHeader,PopupPicker
		},
		name: 'search-detail',
	  	computed: mapState({
	    	commonInfo: state => state.global.commonInfo,
	  	}),
		data() {
			return {
				data:{goodsInfoDTOS:[]},
				showSelectBlue:false, //选择蓝牙
	    	slectBlue:[], //选中的蓝牙设备号
	    	isConnectDevice:false,
	    	isAndroid:false,
			}
		},
		created(){
  	  	this.isAndroid =localStorage.getItem("isAndroid");
			this.getDetail();
		},
		methods:{
				/**
			 * 修改蓝牙连接设备
			 */
			changeBlue(){
		//		连接打印机
				if(window.cordova){
					var param1 = { btAddress:sessionStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
					factory.connectBlue(param1).then(res=>{
								this.isConnectDevice=true;
								this.printOrder(this.printId)
							},(err)=>{
								alert("连接打印机失败："+err+'\n'+"请回到首页设置模块修改打印设备")}
							).then(()=>{
								this.printOrder()
							})
					}
			},
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
//				this.$router.back()
				this.$router.push({name:'searchOrder',query:{isBack:true}})
			},
	 /**
	 * 打印小票
	 */
	printOrder(id){
		//开启蓝牙
  		const _this =this;
  		this.printId=id;
		//获取蓝牙连接列表，判断是否之前连接过蓝牙
			//获取打印小票信息
			$request.post("/api/online-order/v1/protected/batchquery/pickdetail",[id]).then((res)=>{
				if(res.success==true){
					func.printInfo(res.data[0],this,()=>{   //打印，成功的回调函数，记录打印次数并显示在界面上
							func.printAdd(res.data[0],this,(count)=>{
								let arrobj = Object.keys(count.data[0])
								this.data.printCount=count.data[0][arrobj]
							})
					})					
				}else{
					this.$vux.toast.show({
            type: 'text',
            text: res.message||'获取该订单数据失败，请联系管理员',
          })
				}
			})
	},
	
		}
	}
</script>
<style lang="less">
	.pre-content-pic .pic-item-info > div {
		dt{font-size: 14px;}
		dd{
			>span:nth-child(2){
				color: #333333;
			}
		}
	}
</style>
<style lang="less" scoped>
	.pic-item-info{
		&.other-order-info{
			margin-top: 10px;
		}
		a:-webkit-any-link{
			color: #333333;
		}
		.phones{
			display: flex;justify-content: flex-start;align-items: center;
			img{width: 15px;margin-left: 5px;}
		}
		.fle{display: flex;justify-content: flex-start;}
		dd{display: flex;justify-content: flex-start;
			>span:nth-child(2){flex: 1;}
		}
	}
	.order-forms {
		span{color: #197FA9;}
		.emiient{
			background: #FEF6E9;
			border: 1px solid #EBD3AF !important;
			border-radius: 1px;
			font-size: 10px;
			color: #A95519;
			text-align: center;
		}
	}
</style>