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
	    				<h5>拣货已完成</h5>
	    				<div class="order-forms"> <span>{{data.ordersequenceno}}</span></div>
	    			</div>
	    			<div>
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
    				<dd>
    					<span>拣货员</span>
    					<span>{{data.operatorName}}</span>
    				</dd>
    				<dd>
    					<span>完成时间</span>
    					<span>{{new Date(data.finishTime).format("yyyy-MM-dd hh:mm:ss")}}</span>
    				</dd>
    			</dl>
    		</div>
    		<div style="padding-top: 0;">
    			<!--v-if="data.expectdeliverydatetime"-->
    			<dl  class="vux-1px-b">
    				<dt>顾客信息</dt>
    				<dd v-if="data.expectdeliverydatetime">
    					<span >{{data.expectdeliverydatetime.slottype=='immediate'?'极速送达':'预约送达'}}</span>
    					<span>{{new Date(parseInt(data.expectdeliverydatetime.date)).format('yyyy-MM-dd')}}&nbsp;&nbsp;{{data.expectdeliverydatetime.from}}-{{data.expectdeliverydatetime.to}}</span>
    				</dd>
    				<dd v-if="data.recvinfo">
    					<span>顾客信息</span>
    					<span>{{data.recvinfo.name}}&nbsp;&nbsp;<span>{{data.recvinfo.phone}}</span></span>
    				</dd>
    				<dd>
    					<span>顾客备注</span>
    					<span>{{data.comment}}</span>
    				</dd>
    			</dl>
    		</div>
				<div class="handel-btn">
					<a v-if="data.recvinfo" :href="'tel:'+data.recvinfo.phone"><button>联系顾客</button></a>
					<!--v-if="isAndroid=='true'"-->
					<button  @click="printOrder(data.id)" >打印 &nbsp;&nbsp; X{{data.printCount}}</button>
					<button v-if="data.status=='0'" class="startPick">开始拣货</button>
				</div>
			</div>
    	<pre-item-pic v-for="(item,index) in data.goodsInfoDTOS"
    		:itemid="item.itemid"
    		:imgurl="item.imgurl"
				:preCode="item.warehouseCode"
				:code="'商品编码 '+(item.goodsBarCode)"
				:name="item.goodsName"
				:totalNum="item.qty+item.diffNum"
				:unit="item.desc"
				:unitq="item.saleprice"
				:init="item.init"
				:allpick="item.allpick"
				:halfPickNum="item.qty"
				:status="1"
				:key="index">
    	</pre-item-pic>
    	<m-empty v-if="data.content && data.goodsInfoDTOS.length == 0"></m-empty>
    </div>
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
		name: 'pick-list',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
  }),
		data() {
			return {
				data:{goodsInfoDTOS:[]},
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
				this.$router.back()
			},
	 /**
	 * 打印小票
	 */
	printOrder(id){
		//开启蓝牙
  		const _this =this;
			//获取打印小票信息
//			if(window.cordova){
				$request.post("/api/online-order/v1/protected/batchpickdetail",[id]).then((res)=>{
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
			/*}else{
				alert("当前非手机环境")
			}*/
	},
	
		}
	}
</script>

<style lang="less">
	.pre-pic-history-detail{
		/*margin-top: 10px;*/
		
		.detail-top{
			background:#FFFFFF;
			p{padding: 0 20px;}
		}
		.pre-pic-history-detail{
			margin-top: 10px;
		}
	}

	.pre-pic-history-list {
		
	}
	.pre-content-title{
		&.pre-detail-title{
			.picking-title .pick-code{
				top: 10px;
				height: 140px;
				padding-top: 8px;
				box-sizing: border-box;
				p{
					padding: 9px 0 0px 30px;
				}
			}
		}
		
	}
	.pre-difer{
		top: 56px;
	}
	.pre-content-pic{
	.pic-item-info{
		.success-top{
			padding: 0 10px;
			
			>div{
				padding: 13px 10px;display: flex;
				justify-content: space-between;
				align-items: center;
				h5{font-size: 18px;color: #303030;line-height: 1.8;}
				.order-forms{
					>span{background: #F2FBFE;
						border: 1px solid #AFE2EB;
						border-radius: 1px;
						margin-right: 10px;
						opacity: 0.8;
						padding: 0px 5px;font-size: 10px;
					}
					}
				img{width: 70px;position: absolute;top: 10px;right: 15px;}
			}
		}
	}
	}
</style>