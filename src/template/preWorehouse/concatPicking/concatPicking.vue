<template>
  <div class="shop-supply pick-supply" v-if="datas.toTime">
  	<x-header class="vux-1px-b difer-header" :left-options="{preventGoBack:true}" @on-click-back="showbackTip=true">合单拣货详情</x-header>
    <div class="pre-content-title">
    	<div class="picking-title">
    		<div class="counting-time-pic" v-if="datas.toTime">
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
	    					<span>{{datas.id}} <span style="color: #333333;">{{datas.operatorName}}</span></span>
	    				</dd>
	    				<dd>
	    					<span>订单数量</span>
	    					<span v-if="datas" style="color: #333333;">{{datas.ordersequencenos.length}}</span>
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
				<div class="tab-wrap">
					<tab v-model="index" active-color="#3DA5FE">
			      <tab-item v-for="(i,ins) in ['待拣货('+(datas.products.length-listData.picked.length)+')','已拣货('+(listData.picked.length)+')']" :key="ins">{{i}}</tab-item>
			    </tab>
					<div v-show="index==0" class="noPicks">
			    	<pre-pic-all class="uuuuiuiu" v-if="item.pickStatus=='0'" v-for="(item,index) in datas.products"
			    		:objInfo='item'
			    		:preCode="item.warehouseCode"
			    		:itemid="item.itemid"
							:nowNum="item.nowNum"
							:code="'商品编码  '+(item.barcode)"
							:name="item.subtitle+' '"
							:imgurl="item.imgurl"
							:unit="item.spec?item.spec.desc:''"
							:unitq="item.price.value"
							:totalNum="item.num"
							:init="item.init"
							:allpick="item.allpick"
							:halfPickNum="item.halfPickNum"
							:topicksum="topicksum"
							:toallpick="toallpick"
							:pickAllGoods="pickAllGoods"
							:status="0"
							type="concat"
			    		:phone="item.phone"
			    		:ordersequencenos="item.ordersequenceno"
							:key="index">
			    	</pre-pic-all>
			    	<m-empty class="datas" v-if="listData.picked.length == datas.products.length"></m-empty>
		    	</div>
		    	<div v-show="index==1" class="pickeds">
			    	<pre-pic-all class="popopo" v-if="item.pickStatus=='1'" v-for="(item,index) in datas.products"
			    		:objInfo='item'
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
							:status="0"
							type="concat"
			    		:phone="item.phone"
			    		:ordersequencenos="item.ordersequenceno"
							:key="index">
			    	</pre-pic-all>
			    	<m-empty class="popo" v-if="listData.picked.length==0"></m-empty>
		    	</div>
	    	</div>
	      
	      <MpopInput :isShow="showPop" :cancel="cancel" :confirm="confirm" :popItem="popItem" v-if="showPop"/>
	    </div>
    </div>
    <div class="pre-footer">
      <div class="btn-add btn-tips-concat" v-if="datas.products&&datas.products.length>0" @click="showConcatOrder=true">
       		<span class="total-pre">
       			<i style="">{{datas.ordersequencenos.length}}</i>个订单<img style="width: 13px;margin-left: 5px;" src="../../../assets/pre/iconNext@2x.png" alt="" />
       		</span>
       		<span class="concat-t-detail">
       			待拣货 {{datas.products.length}} 件,已拣货 <i>{{listData.picked.length}}</i> 件
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
      @on-confirm="$router.back()"
      confirm-text="退出拣货">
        <p style="text-align:center;">退出拣货页后，此订单商品的已拣货数据将不保留。建议完成此单拣货任务后，再提交离开。</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showConcatOrder" class="comment-wrap" hide-on-blur v-if="datas.ordersequencenos&&datas.ordersequencenos.length">
        <div class="commen-box">
        	<div class="vux-1px-b comment-head">
        		<h5>订单备注</h5>
        		<span v-if="datas.ordersequencenos&&datas.ordersequencenos.length>0">共{{datas.ordersequencenos.length}}单</span>
        	</div>
        	<ul class="tipsOverflow">
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
        			{{i.name}}
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
import { XHeader,Confirm,TransferDomDirective as TransferDom,PopupPicker,XDialog,Tab, TabItem} from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from "@/func.js"
export default {
	 directives: {
    TransferDom
  },
  components: {
    XHeader, MEmpty,MpopInput,Confirm,PopupPicker ,XDialog,Tab, TabItem
  },
  name: 'pick-list',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
		time:function(){  //现实的倒计时
			return func.formate(parseInt(this.datas.toTime)-this.now);
		}
  }),
  data() {
    return {
    	index:0, // tab切换index
    	showPop:false, //弹窗显示与否按钮
    	popItem:{},  //显示的弹窗的对象信息
//  	picNum:0,	//弹窗绑定的输入框值
    	now:new Date().getTime(),  //倒计时开始时间
    	alreadyPick:0,		//已拣货的商品的种类
    	timeIntever:null,  //倒计时定时器
    	showbackTip:false,  //退出弹框提示
    	showSelectBlue:false, //选择蓝牙
    	slectBlue:[], //选中的蓝牙设备号
    	isConnectDevice:false,
      datas:[],
      showConcatOrder:true,  //合单订单备注信息显示与否
      errInfo:{success:true},   //合并拣货的提示信息
      listData:{'noPick':[],'picked':[]}
    }
  },
  created() {
		this.getPickingInfo();
    let self = this;
		this.timeIntever = setInterval(function(){
			self.now = new Date().getTime();
		}, 1000);
  },
  mounted(){
  	
  },
  destroyed(){
			clearInterval(this.timeIntever)
		},
  methods: {
  	/*
  	 * 提交成功回调异常函数
  	 */
  	errConfim(){
  		clearInterval(this.timeIntever)
  		if(this.datas.ordersequencenos.length-this.errInfo.message.length>0){
  			//部分订单成功
				let ids = this.$route.query.id.split("|")
				let pushid=[]
				let pushids=ids.concat([])
				for(let i=0;i<ids.length;i++){
					let ispush=false;
					this.errInfo.message.forEach((e,indexx)=>{
						if(ids[i]==e.id.slice(0,-1)){
							ispush=true;
							ids.splice(i,1)
						}
					})
				}
				console.log(ids,pushids)
				this.$router.push({name:"concatSuccessDetail",query:{id:ids.join("|")}})
  		}else{
  			console.log('all')
				this.$router.back()  //全部订单都有问题
  		}
  	},
	/**
	 * 获取拣货单信息
	 */
	getPickingInfo(){
		let lists = this.$route.query.id.split("|")
		$request.post("/api/online-order/v1/protected/mergeorderdetails",lists).then((res)=>{
			if(res.success==true){
				this.datas=Object.assign({},res.data)
				let listTmp = []
				let tempObj={}
				this.datas.products.forEach((e,index)=>{
					tempObj[e.id]=e; //对象，利用：对象的键是唯一的
					e.init=true;  //初始状态：缺货和全部拣货按钮显示与否
					e.pickStatus = '0';
				})
				Object.keys(tempObj).forEach((n)=>{
					let oj=Object.assign({},tempObj[n]);
					oj.orders=[Object.assign({},oj)];   //orders 是原始的数据
					this.datas.products.filter((an,ain)=>{
						if(n==an.id&&oj.itemid!==an.itemid){
							oj.num +=an.num;
							oj.orders.push(Object.assign({},an))
						}
					})
					listTmp.push(oj)
				})
				this.datas.products = listTmp;
				this.listData.noPick = this.datas.products.concat([]);
				this.listData.picked = [];
			}
		},(err)=>{
		})
	},
  	/**
  	 * 缺货弹窗取消函数
  	 */
  	cancel(){
  		this.showPop=false;
  	},
  	/**
  	 * 缺货弹窗确认按钮
  	 */
  	confirm(num,pid,id){
  		this.showPop=false;
  		let isExitPicked = this.listData.picked.some((item)=>{return item.itemid==pid})  //判断已拣货的列表里是否有改商品
  		this.datas.products.forEach((e,index)=>{
			if(e.itemid==pid){
				e.init=false;
				e.orders = e.orders.map((n)=>{
					let obj = n
					if(obj.itemid==id){
						obj.halfPickNum=num;   //halfPickNum : 拣货的数量
						obj.init=false;
						obj = Object.assign({},n)
					}
					return obj
				})
				
				if(e.orders.filter((item)=>{return item.init==false}).length==e.orders.length&&!isExitPicked){
					//列表全部拣过货之后
					e.pickStatus=1;
					this.listData.picked.push(e)
				}
			}
		})
  	},
  	/**
  	 * 缺货按钮点击事件,将输入的值回调给当前点击的halfPickNum
  	 */
  	topicksum(pid,id){
			this.showPop=true;
			let seleItem= null;
			this.datas.products.forEach((e,index)=>{
				if(e.itemid==pid){
					seleItem = e.orders.filter((n)=>{
						return n.itemid == id
					})
				}
			})
			this.popItem=seleItem[0];
			this.popItem.pid = pid;
  	},
  	/**
  	 * 全部拣货按钮点击事件
  	 */
  	toallpick(pid,id){
	  		this.datas.products.forEach((e,index)=>{
					if(e.itemid==pid){
						e.init=false;
						e.orders.forEach((n)=>{
							if(n.itemid==id){
								n.halfPickNum=n.num;
								n.init=false;
							}
						})
						if(e.orders.filter((item)=>{return item.init==false}).length==e.orders.length){
							e.pickStatus=1;
							this.listData.picked.push(e)
						}
					}
				})
	  		this.alreadyPick=this.alreadyPick+1
  	},
  	/**
  	 * 一键拣货
  	 */
  	pickAllGoods(id){
//		console.log(this.datas.products)
  		this.datas.products.forEach(e=>{
  			if(e.itemid==id){
  				e.init=false;
  				e.pickStatus=1;
  				e.orders.forEach((n)=>{
  					n.allpick=true
  					n.halfPickNum=n.num
  					n.init=false;
  				})
  				this.listData.picked.push(e)  // 将一键拣货拣过的合并订单放到已拣货中
  			}
  		})
  	},
    /**
     * 完成拣货
     */
    completeOrder(){
    	//判断是否有未拣货的的商品
    	if(this.datas.products.length-this.listData.picked.length>0){
    		this.$vux.toast.show({
          type: 'text',
          text:'需对商品“拣货”确认'
        })
    	}else{
				let allList = [];
				this.datas.products.forEach((e)=>{
					e.orders.forEach((n)=>{
						allList.push(n)
					})
				})
				let lists = this.datas.orderInfos.map((item,indexs)=>{
					let obj = {orderid:item.id,goodsInfoDTOS:[]}
					/*if(indexs==1||indexs==2){
						obj.orderid=item.id+'5'
					}*/
					allList.forEach((e)=>{
						if(e.orderid==item.id){
								let objs ={
						      "desc": e.spec ?e.spec.desc:"",
						      "diffNum": e.num-e.halfPickNum,  //缺货数量
						      "goodsBarCode": e.barcode,
						      "goodsCode": e.goodCode,
						      "goodsName": e.subtitle,  //山滚名称选哪个
						      "goodsWarehouseId": e.goodsWarehouseId,
						      "itemid": e.itemid,
						      "orderid": e.orderid,  //订单id
						      "qty": e.halfPickNum,
						      "saleprice": e.price.value,
						      "skucode": e.id,		//？
						      "stockout": e.num-e.halfPickNum>0 ? 1:0,		//是否缺货
						      "warehouseId": e.warehouseId,
						      "warehouseCode":e.warehouseCode,
						      "imgurl":e.imgurl,
					    	}
								obj.goodsInfoDTOS.push(objs)
							}
					})
					return obj
				})
		    $request.post("/api/online-order/v1/protected/mergefinishpick",lists).then(res=>{
		    	if(res.success&&res.success==true){
						this.$router.push({name:"concatSuccessDetail",query:{id:this.$route.query.id}})			    		
		    	}else{
		    		this.errInfo=res;
		    		let errMsg = res.message
		    		this.errInfo.message = JSON.parse(errMsg);
		    		this.errInfo.message.forEach((e,indexss)=>{
		    			let key = Object.keys(e)[0]
		    				e.name = key+':'+e[key]
		    				e.id=key
		    		})
		    		console.log(this.errInfo.message)
		    	}
		  	})
   		}
    }
  },
}

</script>
<style lang="less">
	.pic-item-info{
		dl{font-size: 13px;}
	}
	.tipsOverflow{max-height: 400px;overflow-y: scroll;}
	.tab-wrap{
		margin-top: 20px;
		position: relative;
		/*z-index: 3;*/
		.vux-tab{
			z-index: 3;
		}
		.empty{
			top:150px;
			margin-top: 0;z-index: 0;
			.text{
				margin-top: 20px;
			}
		}
	}
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
