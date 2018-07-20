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
    <div class="scroll-content pre-content pre-content-pic clearfix" ref="scrollWrap">
    	<div v-for="a,ins in datas" class="fl concat-list-wrap">
	    	<div class="pic-item-info" >
	    		<div>
	    			<dl class="vux-1px-b">
	    				<dt style="font-weight: 600;">合单信息</dt>
	    				<dd>
	    					<span>拣货员</span>
	    					<span>{{data.id}} <span style="color: #6fc710;">{{data.ordersequenceno}}</span></span>
	    				</dd>
	    				<dd>
	    					<span>订单数量</span>
	    					<span v-if="data.products">{{$route.query.id.split("|").length}}</span>
	    				</dd>
	    				<!--<dd>
	    					<span>拣货员</span>
	    					<span>{{data.status=='0'?'':(data.status=='2'?(data.operatorName ? data.operatorName:commonInfo.name):'')}}</span>
	    				</dd>-->
	    			</dl>
	    		</div>
	    		<div>
	    			<ul class="list-title-concat clearfix">
	    				<!--:class="'fl vux-1px-b '+ ((ine+1)%3==2 ? 'vux-1px-l':'')"-->
	    				<li v-for="a,ine in datas" class="fl vux-1px-b">
	    					<span :class="'fl list-concat-conlist '+ (((ine+1)%3==2||(ine+1)%3==1)? 'vux-1px-r':'')">
	    						<i>{{ine+1}}</i><span>&nbsp;&nbsp;{{a.ordersequenceno}}</span></span>
	    				</li>
	    			</ul>
	    			<!--<dl v-if="data.expectdeliverydatetime" class="vux-1px-b">
	    				<dt>顾客信息</dt>
	    				<dd>
	    					<span>{{data.expectdeliverydatetime.slottype=='immediate'?'极速送达':'预约送达'}}</span>
	    					<span>{{new Date( parseInt(data.expectdeliverydatetime.date)).format('yyyy-MM-dd')}}&nbsp;&nbsp;{{data.expectdeliverydatetime.from}}-{{data.expectdeliverydatetime.to}}</span>
	    				</dd>
	    				<dd v-if="data.recvinfo">
	    					<span>顾客信息</span>
	    					<span>{{data.recvinfo.name}}&nbsp;&nbsp;<span>{{data.recvinfo.phone}}</span></span>
	    				</dd>
	    				<dd>
	    					<span>顾客备注</span>
	    					<span>{{data.comment}}</span>
	    				</dd>
	    			</dl>-->
	    		</div>
					<div class="handel-btn">
						<!--<a v-if="data.recvinfo&&data.recvinfo.phone" :href="'tel:'+data.recvinfo.phone"><button>联系顾客</button></a>
						<button v-if="data.status&&data.status!=2" @click="handelPick" class="startPick" :disabled="data.status=='-1'">{{data.status=='-1'?'已退货':'开始拣货'}}</button>-->
					</div>
				</div>
	    	<pre-item-pic v-for="(item,index) in data.products"
	    		type="concat"
	    		:itemid="item.itemid"
					:preCode="item.warehouseCode"
					:nowNum="item.nowNum"
					:imgurl="item.imgurl"
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
	    	</pre-item-pic>
	      <!--<m-empty v-if="data.content && data.content.length == 0"></m-empty>-->
	      <MpopInput :isShow="showPop" :cancel="cancel" :confirm="confirm" :popItem="popItem" v-if="showPop"/>
	    </div>
    </div>
    <div class="pre-footer">
      <div class="btn-add btn-tips-concat" v-if="data.products&&data.products.length>0" @click="showConcatOrder=true">
       		<!--<i>{{datas.length}}</i>个订单,已拣货 <i>{{alreadyPick}}</i> 件-->
       		<span class="total-pre">
       			<i style="">{{datas.length}}</i>个订单
       		</span>
       		<span class="concat-t-detail">
       			待拣货{{datas.length}}件,已拣货0 件
       		</span>
      </div>
      <div class="btn-submit">  <!--:disabled=""-->
        <button type="button" @click="completeOrder" :disabled="data.status==-1">完成</button>
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
        		<span>共{{datas.length}}单</span>
        	</div>
        	<ul class="vux-1px-b">
        		<li v-for="i,index in datas">
        			<dl>
        				<dt><i>{{index+1}}</i>{{i.ordersequenceno}}</dt>
        				<dd>{{i.recvinfo.name}} {{i.recvinfo.phone}} <img src="../../../assets/pre/iconPhone2x.png"/></dd>
        				<dd>{{i.comment}}</dd>
        			</dl>
        		</li>
        	</ul>
          <!--<img src="https://ws1.sinaimg.cn/large/663d3650gy1fq6824ur1dj20ia0pydlm.jpg" style="max-width:100%">-->
        </div>
        <div @click="showConcatOrder=false" class="comment-yes">
          <button>知道了</button>
        </div>
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
    	showSelectBlue:false, //选择蓝牙
    	slectBlue:[], //选中的蓝牙设备号
    	isConnectDevice:false,
    	isAndroid:false,
      data: {
      	content:[],
      },
      datas:[],
      showConcatOrder:true,  //合单订单备注信息显示与否
    }
  },
  created() {
  	const ids =this.$route.query.id.split("|")
		const _this=this;
		for(var i=0;i<ids.length;i++){
			(function(i){
				_this.getPickingInfo(i)
				setTimeout(()=>{_this.datas},3000)
			})(ids[i])
		}
//	this.getPickingInfo(this.$route.query.id)
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
	/**
	 * 获取拣货单信息
	 */
	getPickingInfo(id){
		$request.get("/api/online-order/v1/protected/orderdetail/"+id).then(res=>{
			if(res.success==true){
				this.data=res.data
				res.data.products.forEach(e=>{
					e.init=true;
				})
				this.datas.push(res.data)
				console.log(this.datas)
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
		            text: '点击「 开始拣货 」',
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
		            text: '点击「 开始拣货 」',
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
			      "imgurl":e.imgurl,
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
	.concat-list-wrap{width: 50%;
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
	@media screen and (max-width:420px ) {
		.concat-list-wrap{
			width: 100%;
		}
	}
</style>
