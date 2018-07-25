<template>
  <div class="shop-supply pick-supply">
  	<x-header class="vux-1px-b difer-header" :left-options="{preventGoBack:true}" @on-click-back="showBackTipinfo">合单拣货详情</x-header>
    <div class="pre-content-title">
    	<div class="picking-title">
    		<div class="counting-time-pic">
    			拣货倒计时 {{time}}
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-content pre-content-pic" ref="scrollWrap">
    	<div class="concat-list-wrap" v-if="datas.ordersequencenos&&datas.ordersequencenos.length>0">
	    	<div class="pic-item-info" >
	    		<div>
	    			<dl class="vux-1px-b">
	    				<dt style="font-weight: 600;">合单信息</dt>
	    				<dd>
	    					<span>拣货员</span>
	    					<span>{{datas.id}} <span style="color: #6fc710;">{{datas.operatorName}}</span></span>
	    				</dd>
	    				<dd>
	    					<span>订单数量</span>
	    					<span v-if="datas">{{datas.ordersequencenos.length}}</span>
	    				</dd>
	    			</dl>
	    		</div>
	    		<div>
	    			<ul class="list-title-concat clearfix">
	    				<li v-for="a,ine in datas.ordersequencenos" class="fl vux-1px-b">
	    					<span :class="'fl list-concat-conlist '+ (((ine+1)%3==2||(ine+1)%3==1)? 'vux-1px-r':'')">
	    						<i>{{ine+1}}</i><span>&nbsp;&nbsp;{{a}}</span></span>
	    				</li>
	    			</ul>
	    		</div>
					<div class="handel-btn"></div>
				</div>
	    	<pre-item-pic v-for="(item,index) in datas.products"
	    		:preCode="item.warehouseCode"
	    		:itemid="item.itemid"
					:nowNum="item.nowNum"
					:code="'商品编码  '+(item.barcode)"
					:name="item.subtitle"
					:imgurl="item.imgurl"
					:unit="item.spec?item.spec.desc:''"
					:unitq="item.price.value"
					:totalNum="item.num"
					:init="item.init"
					:allpick="item.allpick"
					:halfPickNum="item.halfPickNum"
					:topicksum="topicksum"
					:toallpick="toallpick"
					:disbale="true"
					:status="0"
					type="concat"
	    		:phone="item.phone"
	    		:ordersequencenos="item.ordersequenceno"
					:key="index">
	    	</pre-item-pic>
	      <m-empty v-if="datas.products && datas.products.length == 0"></m-empty>
	      <MpopInput :isShow="showPop" :cancel="cancel" :confirm="confirm" :popItem="popItem" v-if="showPop"/>
	    </div>
    </div>
    <div class="pre-footer">
      <div class="btn-add btn-tips-concat" v-if="datas.products&&datas.products.length>0" @click="showConcatOrder=true">
       		<span class="total-pre">
       			<i style="">{{datas.ordersequencenos.length}}</i>个订单<img style="width: 13px;margin-left: 5px;" src="../../../assets/pre/iconNext@2x.png" alt="" />
       		</span>
       		<span class="concat-t-detail">
       			待拣货 {{datas.products.length}} 件,已拣货 <i>{{alreadyPick}}</i> 件
       		</span>
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
    <div v-transfer-dom>
      <x-dialog v-model="showConcatOrder" class="comment-wrap" hide-on-blur>
        <div class="commen-box">
        	<div class="vux-1px-b comment-head">
        		<h5>订单备注</h5>
        		<span v-if="datas.ordersequencenos&&datas.ordersequencenos.length>0">共{{datas.ordersequencenos.length}}单</span>
        	</div>
        	<ul class="vux-1px-b">
        		<li v-for="i,index in datas.orderInfos">
        			<dl>
        				<dt><i>{{index+1}} </i>{{i.ordersequenceno}}</dt>
        				<dd><a :href="'tel:'+i.recvinfo.phone">{{i.recvinfo.name}} {{i.recvinfo.phone}} <img src="../../../assets/pre/iconPhone2x.png"/></a></dd>
        				<dd>{{i.comment}}</dd>
        			</dl>
        		</li>
        	</ul>
        </div>
        <div @click="showConcatOrder=false" class="comment-yes">
          <button>知道了</button>
        </div>
      </x-dialog>
      <x-dialog v-model="!errInfo.success" class="comment-wrap" hide-on-blur v-if="errInfo.message&&errInfo.message.length>0">
        <div class="pick-result" >
        	<h5>拣货结果</h5>
        	<p>
        		共{{datas.ordersequencenos.length}}个拣货订单,
        		{{datas.ordersequencenos.length-errInfo.message.length}}个订单拣货成功,
        		{{errInfo.message.length}}个订单拣货异常
        	</p>
        	<p class="err-info">异常原因：</p>
        	<ul>
        		<li v-for="i,index in errInfo.message">
        			{{i}}
        		</li>
        	</ul>
        </div>
        <div @click="errConfim" class="comment-yes vux-1px-t" style="color: #3DA5FE;padding-top: 20px;">确认</div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import MEmpty from '@/components/MEmpty/index'
import MpopInput from '@/components/MpopInput/index'
import { XHeader,Confirm,TransferDomDirective as TransferDom,PopupPicker,XDialog} from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from "@/func.js"
export default {
	 directives: {
    TransferDom
  },
  components: {
    XHeader, MEmpty,MpopInput,Confirm,PopupPicker ,XDialog
  },
  name: 'pick-list',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
		time:function(){  //现实的倒计时
			return this.formate(parseInt(this.datas.toTime)-this.now);
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
    	showSelectBlue:false, //选择蓝牙
    	slectBlue:[], //选中的蓝牙设备号
    	isConnectDevice:false,
      data: {
      	content:[],
      },
      datas:[],
      showConcatOrder:false,  //合单订单备注信息显示与否
      errInfo:{success:true},   //合并拣货的提示信息
    }
  },
  created() {
		this.getPickingInfo();
    let self = this;
		this.timeIntever = setInterval(function(){
			self.now = new Date().getTime();
			if(self.datas.toTime-self.now<0){
//				clearInterval(self.timeIntever)
			}
//			console.log(self.now,self.datas.toTime)
		}, 1000);
  },
  mounted(){
  	
  },
  destroyed(){
			clearInterval(this.timeIntever)
		},
  methods: {
  	/*
  	 * 异常错误函数
  	 */
  	errConfim(){
  		if(this.datas.ordersequencenos.length-this.errInfo.message.length>0){
  			//部分订单成功
//			this.$router.push({name:"concatSuccessDetail",query:{id:this.$route.query.id}})
			let ids = this.$route.query.id.split("|")
			let pushid=[]
				this.errInfo.message.forEach((e,index)=>{					
					let errid = Object.keys(this.errInfo.message[index])[0]
					ids.forEach((a)=>{
						if(a!=errid){
							pushid.push(a)
						}
					})
				})
				this.$router.push({name:"concatSuccessDetail",query:{id:pushid}})
  		}else{
			this.$router.back()  //全部订单都有问题
//				console.log(this.errInfo.message)
				
  		}
  	},
	/**
	 * 获取拣货单信息
	 */
	getPickingInfo(){
		$request.post("/api/online-order/v1/protected/mergeorderdetails",this.$route.query.id.split("|")).then((res)=>{
			if(res.success==true){
				this.datas=res.data
				this.datas.products.forEach((e)=>{
					e.init=true;
				})
//				this.datas.toTime=new Date().getTime()+30*60*1000;
			}
		},(err)=>{
			console.log(err);
			
		})
	},
  	/**倒计时
  	 * 
  	 */
  	formate(time){
//		console.log(time)
				let hour =parseInt(time/1000/3600);
				let min  = parseInt((time/1000 - hour * 3600)/60)
				let sec = parseInt(time/1000 - hour * 3600 - min * 60)
//				console.log(hour,min,sec)
  		if(time>0){
				return   sec >=0 ? hour + '小时' + min + '分钟' + sec + '秒' :'已超时';
			}else{
				return '已超时'+(-hour) + '小时'+(-min) + '分钟' + (-sec)+'秒'
			}
			
		},
  	/**
  	 * 返回
  	 */
  	back(){
  		this.showbackTip=true;
//		this.$router.back()
  	},
  	showBackTipinfo(){
  		if(this.data.status=='2'){
  			this.showbackTip=true
  		}else{
  			this.$router.back()
  		}
  		
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
  		this.datas.products.forEach((e,index)=>{
			if(e.itemid==id){
				e.init=false;
				e.halfPickNum=num;
			}
		})
  		this.alreadyPick=this.alreadyPick+1
  	},
  	/**
  	 * 缺货按钮点击事件,将输入的值回调给当前点击的halfPickNum
  	 */
  	topicksum(id){
					this.showPop=true;
				const data = this.datas.products.filter((e,index)=>{
					return e.itemid==id
				})
				this.popItem=data[0]
  	},
  	/**
  	 * 全部拣货按钮点击事件
  	 */
  	toallpick(id){
	  		this.datas.products.forEach((e,index)=>{
					if(e.itemid==id){
						e.init=false;
						e.allpick=true;
						e.halfPickNum=e.num
//						console.log(e.halfPickNum,e.init)
					}
				})
	  		this.alreadyPick=this.alreadyPick+1
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
	  				this.data.status=res.data;
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
//  	this.data.status='-1'
    },
    /**
     * 完成拣货
     */
    completeOrder(){
    	//判断是否有未拣货的的商品
//  	console.log(this.alreadyPick)
    	if(this.datas.products.length-this.alreadyPick>0){
    		this.$vux.toast.show({
          type: 'text',
          text:'订单中还有未拣货的商品，请进行拣货后提交!'
        })
    	}else{
				let list = this.datas.orderInfos.map((item)=>{
					let obj = {orderid:item.id,goodsInfoDTOS:[]} 		
						this.datas.products.forEach((e)=>{
							if(e.orderid==item.id){
								let objs ={
						      "desc": e.spec ?e.spec.desc:"",
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
						      "imgurl":e.imgurl,
					    	}
								obj.goodsInfoDTOS.push(objs)
							}
						})
						return obj
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
			    $request.post("/api/online-order/v1/protected/mergefinishpick",list).then(res=>{
			    	if(res.success&&res.success==true){
  						this.$router.push({name:"concatSuccessDetail",query:{id:this.$route.query.id.split("|")}})			    		
			    	}else{
			    		this.errInfo=res;
			    		this.errInfo.message = JSON.parse(this.errInfo.message);
			    	}
			    })
			    
			    
   		}
    }
  },
}

</script>
<style lang="less">
	.comment-wrap{
		
		.weui-dialog{
			padding: 0 10px 20px;
			border-radius: 3px;
		}
		.commen-box{
			.comment-head{
				display: flex;
				justify-content: space-between;
				align-items: center;
				h5{
					font-size: 18px;
					color: #303030;
					line-height: 50px;
				}
				span{
					font-size: 12px;
					color: #999999;
				}
			}
			ul{
				li{
					margin-top: 12px;text-align: left;text-decoration: none;
					dt{
						i{
							font-style: normal;
						}
						
					}
				}
				padding:0 10px 20px;
				margin-bottom:20px;
				
			}
		}
		.comment-yes{
			text-align: center;
			button{
				border: none;
		    background: #3DA5FE;
		    color: #FFFFFF;
		    border-radius: 2px;
		    width: 100%;
		    height: 40px;font-size: 16px;
			}
		}
	}
	.concat-list-wrap{
		.list-title-concat{
				li{
					width: 33%;
					height: 50px;
					text-align: center;
					>span{
						display: block; width: 100%;
						font-size: 16px;
						color: #999999;
						height: 100%;
						&.list-concat-conlist{
							display: flex;
							justify-content: center;
							align-items: center;
						}
						>i{
							padding: 0px 5px;
							background: #FE833D;
							color: #FFFFFF;
							border-radius: 50%;
							 font-style:normal;
							 font-size: 12px;
							 margin-top: -3px;
						}
					}
				}
			
		}
	}
.pick-result{
	h5{
		font-size: 18px;
		color: #333333;
		line-height: 3.5;
	}
	p{
		padding:0 15px;
		text-align: left;
	}
	.err-info{
		margin: 15px 0 5px;
	}
	ul{
		padding:0 15px;
		li{
			line-height: 1.5;text-align: left;margin-bottom: 10px;
		}
	}
}
</style>
