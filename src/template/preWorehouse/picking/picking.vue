<template>
  <div class="shop-supply pick-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<span class="icons fl"  @click="back"></span>
    	<span class="txt">{{data.status==0 ?'拣货详情页':'拣货中'}}</span>
    	<span class="fr startPick" v-if="data.status==0" @click="handelPick"><span>开始拣货</span></span>
    </div>
    <div class="pre-content-title">
    	<div class="picking-title">
    		<div class="counting-time">
    			拣货倒计时 {{time}}
    		</div>
    		<!--<div class="none-info"></div>-->
    		<div class="pick-code" :style="{height:data.status==0?'90px':'120px'}">
    			<p>拣货单号：{{$route.query.id}} <span>{{data.ordersequenceno}}</span></p>
    			<p>创建时间：{{new Date($route.query.creatTime).format("yyyy-MM-dd hh:mm:ss")}}</p> 
    			<p v-if="data.status!=0">拣货员：{{commonInfo.name}}</p> 
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-content pre-content-pic" ref="scrollWrap" :style="{top:data.status==0?'175px':'210px'}">
    	<pre-item-info v-for="(item,index) in data.products"
    		:itemid="item.itemid"
				:preCode="item.stockout==2?'门店无此商品':item.warehouseCode"
				:nowNum="item.nowNum"
				:safeNum="item.safeNum"
				:code="'商品编码  '+(item.barcode)"
				:name="item.subtitle"
				:totalNum="item.num"
				:unit="item.spec.desc"
				:unitq="item.price.value"
				:init="item.init"
				:allpick="item.allpick"
				:halfPickNum="item.halfPickNum"
				:topicksum="topicksum"
				:toallpick="toallpick"
				:disbale="true"
				:status="0"
				:key="index">
    	</pre-item-info>
      <!--<m-empty v-if="data.content && data.content.length == 0"></m-empty>-->
      <MpopInput :isShow="showPop" :cancel="cancel" :confirm="confirm" :popItem="popItem" v-if="showPop"/>
    </div>
    <div class="pre-footer">
      <div class="btn-add btn-tips" v-if="data.products&&data.products.length>0">
       		待拣货共 <i>{{data.products.length}}</i> 件,已拣货 <i>{{alreadyPick}}</i> 件
      </div>
      <div class="btn-submit">  <!--:disabled=""-->
        <button type="button" @click="completeOrder">完成</button>
      </div>
    </div>
    <div v-transfer-dom class="pre-confirm">
      <confirm v-model="showbackTip"
      title="确定退出拣货？"
      @on-cancel="showbackTip==true"
      @on-confirm="onConfirm"
      confirm-text="退出拣货">
        <p style="text-align:center;">退出拣货页后，此订单商品的已拣货数据将不保留。建议完成此单拣货任务后，再提交离开。</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import MEmpty from '@/components/MEmpty/index'
import MpopInput from '@/components/MpopInput/index'
import { XHeader,Confirm,TransferDomDirective as TransferDom} from 'vux'
import { mapState } from 'vuex';
//import factory from '@/factory.js'
import $request from '@/service/request.js'
export default {
	 directives: {
    TransferDom
  },
  components: {
    XHeader, MEmpty,MpopInput,Confirm
  },
  name: 'pick-list',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
		time:function(){  //现实的倒计时
			return this.formate(this.$route.query.toTime-this.now);
		}
  }),
  data() {
    return {
    	showPop:false, //弹窗显示与否按钮
    	popItem:{},  //显示的弹窗的对象信息
    	picNum:0,	//弹窗绑定的输入框值
    	now:new Date().getTime(),  //倒计时开始时间
    	alreadyPick:0,		//已拣货数量
    	timeIntever:null,  //倒计时定时器
    	showbackTip:false,  //退出弹框提示
      data: {
      	content:[],
      },
    }
  },
  created() {
  	this.getPickingInfo(this.$route.query.id)
    let self = this;
		this.timeIntever = setInterval(function(){
			self.now = new Date().getTime();
			if(self.$route.query.toTime-self.now<0){
				clearInterval(self.timeIntever)
			}
		}, 1000);
  },
  destroyed(){
			clearInterval(this.timeIntever)
		},
  methods: {
//	/**
//	 * 获取拣货单信息
//	 */
	getPickingInfo(id){
		$request.get("/api/online-order/v1/protected/orderdetail/"+id).then(res=>{
			if(res.success==true){
				this.data=res.data
				this.data.products.forEach(e=>{
					e.init=true;
				})
			}else{
				
			}
		})
	},
  	/**倒计时
  	 * 
  	 */
  	formate(time){
  		if(time>0){
				let hour =parseInt(time/1000/3600);
				let min  = parseInt((time/1000 - hour * 3600)/60)
				let sec = parseInt(time/1000 - hour * 3600 - min * 60)
				return   sec >=0 ? hour + '小时' + min + '分钟' + sec + '秒' :'已超时';
			}else{
				return '已超时'
			}
		},
  	/**
  	 * 返回
  	 */
  	back(){
  		this.showbackTip=true;
//		this.$router.back()
  	},
  	onConfirm(){
  		this.$router.back()
  	},
  	/**
  	 * 弹窗取消函数
  	 */
  	cancel(){
  		this.showPop=false;
  	},
  	/**
  	 * 弹窗确认按钮
  	 */
  	confirm(num,id){
  		this.showPop=false;
  		this.data.products.forEach((e,index)=>{
			if(e.itemid==id){
				e.init=false;
				e.halfPickNum=num;
//				console.log(e,e.halfPickNum)
			}
		})
  		this.alreadyPick=this.alreadyPick+1
  	},
  	/**
  	 * 缺货按钮点击事件,将输入的值回调给当前点击的halfPickNum
  	 */
  	topicksum(id){
  		if(this.data.status==0){
  			this.$vux.toast.show({
		            type: 'text',
		            text: '点击右上角「 开始拣货 」',
		            width:'60%',
		          })
			
			}else{
					this.showPop=true;
				const data = this.data.products.filter((e,index)=>{
					return e.itemid==id
				})
				this.popItem=data[0]
			}
//			console.log(this.popItem)
  	},
  	/**
  	 * 全部拣货按钮点击事件
  	 */
  	toallpick(id){
  		if(this.data.status==0){
  			this.$vux.toast.show({
		            type: 'text',
		            text: '点击右上角「 开始拣货 」',
		            width:'60%',
		          })
			
			}else{
	  		this.data.products.forEach((e,index)=>{
					if(e.itemid==id){
						e.init=false;
						e.allpick=true;
						e.halfPickNum=e.num
					}
				})
	  		this.alreadyPick=this.alreadyPick+1
	  	}
  	},
    /**
     * 去补货详情页
     * @param  {String} orderId 单号
     */
    toDetail (orderId) {
      this.$router.push({name: 'pickDetail', query: {orderId: orderId}})
    },
    /**
     * 开始拣货点击事件
     */
    handelPick(){   	
    	$request.get("/api/online-order/v1/protected/startpick/"+this.$route.query.id).then(res=>{
	  			if(res.success==true){
	  				this.data.status=2;
	  				this.$vux.toast.show({
	            type: 'text',
	            text: '拣货任务开始'
	          })
	  			}else{
	  				this.$vux.toast.show({
	            type: 'text',
	            text: res.message
	          })
	  			}
	  		})
    },
    /**
     * 完成拣货
     */
    completeOrder(){
    	//判断是否有未拣货的的商品
    	if(this.data.products.length-this.alreadyPick>0){
    		this.$vux.toast.show({
          type: 'text',
          text:'订单中还有未拣货的商品，请进行拣货后提交!'
        })
    	}else{
		    let obj=	{
				  "goodsInfoDTOS": [],
				  "orderid": this.$route.query.id
				}
		    this.data.products.forEach((e,index)=>{
		    	let objs ={
			      "desc": e.spec.desc,
			      "diffNum": e.num-e.halfPickNum,  //缺货数量
			      "goodsBarCode": e.barcode,
			      "goodsCode": e.goodCode,
			      "goodsName": e.subtitle,  //山滚名称选哪个
			      "goodsWarehouseId": e.goodsWarehouseId,
			      "itemid": e.itemid,
			      "orderid": this.$route.query.id,  //是否是订单id
			      "qty": e.halfPickNum,
			      "saleprice": e.price.value,
			      "skucode": e.id,		//？
			      "stockout": e.num-e.halfPickNum>0 ? 1:0,			//是否缺货
			      "warehouseId": e.warehouseId,
			      "warehouseCode":e.warehouseCode,
		    	}
		    	obj.goodsInfoDTOS.push(objs)
		    })
		    let obje={
					path:'/preSuccess',
					query:{
						text: '拣货',
						title: '前置仓拣货',
						info:'请将商品打包装袋，放置「 取货区 」',
						type:'pre',
						detailPage:"/preWorehouse/historyDetail?id="+this.$route.query.id,
						listpage:"/preWorehouse/pickList",
						path:"/"
				}}
//		    console.log(obje)
//		    this.$router.push(obje)
		    
			    $request.post("/api/online-order/v1/protected/finishpick",obj).then(res=>{
			    	if(res.success&&res.success==true){
			    		this.$router.push(obje)
			    	}else{
			    		this.$vux.toast.show({
		            type: 'text',
		            text: res.message
		          })
			    	}
			    })
			    
			    
   		}
    }
  },
  mounted() {
  },
}

</script>
<style lang="less">
	.shop-supply{
		.list-info-cell .l-list-ct .l-list-title{
			line-height: 30px;
			>span{
				color: #333333;font-weight: 600;font-size: 16px;
				/*line-height: 30px;*/
			}
		}
	}
	.pre-content{
		.list-info-cell .l-list-ct .l-list-content .l-list-code em{
			width: auto;
			max-width: 100%;color: #999999;
		}
	}
	.pre-confirm{
		.weui-dialog{
			width: 75%;
			border-radius: 5px;
			.weui-dialog__hd{
				margin-top: 12px;
				color: #333333;
				.weui-dialog__title{
					font-weight: 600;
					font-size: 18px;
				}
			}
			.weui-dialog__bd{margin: 10px 0;font-size: 14px;
				p{
					text-align: center;
	    		padding: 0 30px;
				}
			}
		}
		.vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn{
			font-size: 16px;
			&.weui-dialog__btn_primary{
				color: #333333;
			}
		}
	}
	@header-background-color:#fff;
	.pre-picking-header{
		background: #3DA5FE !important;
		height: 44px;
		text-align: center;color: #FFFFFF;line-height: 44px;
		padding: 0;
		.icons{
			position: absolute;
			z-index: 2;
			display: block;
			padding: 13px 13px;
			width: 20px;height: 18px;
			background: url(../../../assets/white-arrow.png) center center no-repeat;
		}
		.startPick{
			z-index: 2;
			position: absolute;
			right: 15px;font-size: 13px;
			>span{
				background: orange;
				padding: 3px 8px;
				border-radius: 15px;
			}
		}
		.txt{
			/*margin-left: -46px;*/
			font-size: 18px;
			position: absolute;
			display: block;
			width: 100%;
			top: 0;left: 0;
			text-align: center;
			z-index: 1;
		}
		img{
			
		}
	}
	.pre-content-pic{
		top: 210px;padding-bottom: 60px;
	}
	.pre-content-title{
		/*top: 44px;*/
		.picking-title{
			height: 126px;
			position:relative;
			.counting-time{
				height: 77px;
				background: #3DA5FE;text-align: center;color: #FFFFFF;font-size: 18px;font-weight: 500;line-height: 25px;
			}
			.none-info{}
			.pick-code{
				p{ font-size: 14px;color: #303030;
					padding: 20px 0 0 32px;
				line-height: 1;
					>span{
						color: #6fc710;
					}
				}
				p:nth-child(1){
					font-weight: 600;
				}
				background: #FFFFFF;width: 94%;border-radius: 3px;
				position: absolute;top: 36px; left: 3%;height: 90px;
			}
		}
	}
	.pre-footer{
		position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 16px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 48px;
    .btn-add{
    	padding-left: 20px;text-align: left;
    	flex: 1;
    	    background-color: #fff;
    color: #333333;
    box-shadow: 0 -3px 8px 0 rgba(12, 12, 12, 0.08);
    line-height: 50px;
    font-size: 14px;	
    i{color: #3DA5FE;font-weight: 700;font-size: 16px; font-style:normal}
    }
    .btn-submit{
    	/*flex: 1;*/
    	/*width: 35.7%;*/
    	button{
	    	background-color: transparent;
		    border: none;
		    font-size: 16px;
		    color: #fff;
		    height: 100%;
		    width: 135px;
		    /*padding: 0 13.6%;*/
		    background-color: #3DA5FE;
		    }
	    }
	}
	.pre-content{
		.list-info-cell .l-list-ct .l-list-title{
			
		}
	}
</style>
