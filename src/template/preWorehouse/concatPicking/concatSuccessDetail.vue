<template>
  <div class="shop-supply pick-supply">
  	<x-header class="vux-1px-b difer-header" :left-options="{preventGoBack:true}" @on-click-back="backToPickList">合单拣货详情</x-header>
  	 <div class="pre-content-title">
    	<div class="picking-title">
    		<div class="counting-time-pic" v-if="datas.toTime">
    			拣货倒计时 {{time}}
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-content pre-content-pic" ref="scrollWrap">
    	<!--<dl class="pick-statius-tip">
    		<dt>待分单</dt>
    		<dd>合单商品拣货完成！需打印小票，分单装袋。</dd>
    	</dl>-->
    	<div class="concat-list-wrap" v-if="datas.ordersequencenos&&datas.ordersequencenos.length>0">
	    	<div class="pic-item-info" >
	    		<div>
	    			<dl class="vux-1px-b">
	    				<dt>合单信息</dt>
	    				<dd>
	    					<span>拣货员</span>
	    					<span>{{datas.id}} <span>{{datas.operatorName}}</span></span>
	    				</dd>
	    				<dd>
	    					<span>订单数量</span>
	    					<span v-if="datas">{{datas.ordersequencenos.length}}</span>
	    				</dd><dd>
	    					<span>拣货成功</span>
	    					<span v-if="datas.ordersequencenos.length>0" v-for="i in datas.ordersequencenos">{{i}}&nbsp;</span>
	    				</dd>
	    			</dl>
	    		</div>
	    		<div>
	    			<dl>
	    				<dt class="pick-success-print vux-1px-b">
	    					<span v-if="datas.mergeId">合单号&nbsp;{{datas.mergeId}}</span>
	    					<span @click="printAll(null)"><button>一键打印</button></span>
	    				</dt>
	    				<dd class="toHide" @click="expendList">
	    					{{expend?'展开':'收起' }}&nbsp;&nbsp;
	    					<img class="expendImg" :class="{'isTop':expend}" src="../../../assets/pre/Shape1.png"/>
	    				</dd>
	    				<!--<div class="expendImg" :class="{'isExpend':expend}">-->
		    				<dd class="print-list" v-for="e in datas.orderInfos" v-if="!expend">
		    					<span>{{e.ordersequenceno}}&nbsp;&nbsp;{{e.id}}</span>
		    					<button  @click="printAll(e.id)" class="printSingle">打印 X{{e.printCount}}</button>
		    				</dd>
	    				<!--</div>-->
	    			</dl>
	    		</div>
				</div>
				<div class="pick-toBag">
					<div>
    					<p>打印小票后，拿着小票将商品分单装袋。</p>
    					<p>装袋完成，确认后可分单配送。</p>
					</div>
					<button @click="completeOrder">确认装袋</button>
				</div>
				<p style="font-size: 13px;color: #999999;margin: 20px 3% 0">已拣商品</p>
		    	<pre-item-pic v-for="(item,index) in datas.goodsInfoDTOS"
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
					:key="index"				
					>
		    	</pre-item-pic>
	      		<m-empty v-if="datas.products && datas.products.length == 0"></m-empty>
	    </div>
    </div>
    <div class="cm-footer">
			<div class="btn-add btn-left">
				<router-link to="/">
	       			<span>返回主页</span>
	      </router-link>
    	</div>
      	<div class="btn-submit">
      		<router-link :to="{name: 'concatPickList'}">
        		<button type="button">继续拣货</button>
        	</router-link>
        </div>
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
  name: 'concat-detail',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
    time:function(){  //现实的倒计时
			return func.formate(parseInt(this.datas.toTime)-this.now);
		}
  }),
  data() {
    return {
      data: {},
      datas:[],
      isAndroid:false,
      now:new Date().getTime(),  //倒计时开始时间
      printId:'',
      int:null,
      expend:true,
    }
  },
  created() {
  	this.isAndroid=localStorage.getItem("isAndroid");
		this.getPickingInfo();
		let self = this;
			this.timeIntever = setInterval(function(){
			self.now = new Date().getTime();
		}, 1000);
  },
  destory(){
  	clearInterval(this.int)
  },
  methods: {
	//一键打印
	printAll(id){
		let i = 0;	
		let _this = this;
		let ids = _this.$route.query.id.split("|")
		if(id){
			 _this.printOrders([id])
		}else{
	     _this.printOrders(ids) 
	  }
	},
	printOrders(ids,callback=null){		
		$request.post("/api/online-order/v1/protected/batchquery/pickdetail",ids).then((res)=>{
				if(res.success==true){
					func.setPrintData(res.data,(callData)=>{
						factory.print(callData).then((printdata)=>{
							$request.post("/api/online-order/v1/protected/printcount",ids).then((res2)=>{
								if(res2.success==true){
									this.datas.orderInfos.forEach((r)=>{
										for(var i=0;i<res2.data.length;i++){
											let arrobj = Object.keys(res2.data[i])
											if(r.id==arrobj){
												r.printCount = res2.data[i][arrobj]
											}
										}
									})
									if(ids.length<2){
										this.$vux.toast.show({
					            type: 'text',
					            text: res.data[0].ordersequenceno+'打印成功',
					          })
									}else{
										this.$vux.toast.show({
					            type: 'text',
					            text: '打印成功',
					          })
									}
									
								}
							},(err)=>{
								this.$vux.toast.show({
				            type: 'text',
				            text: res.message||'打印次数计数失败',
			          })
							})
						},(err)=>{
							this.$vux.toast.show({
		            type: 'text',
		            text: '打印失败',
		          })
						})
					})
				}
			})
	},
	/**
	 * 获取拣货单信息
	 */
	getPickingInfo(){
		let ids = this.$route.query.id.split("|")
//		let ids = ['1204210270074031','1204210470064071']
		$request.post("/api/online-order/v1/protected/mergepickdetail",ids).then((res)=>{
			if(res.success==true){
				this.datas=res.data
				console.log(this.datas.toTime)
				this.datas.orderInfos=res.data.orderInfos.map((e)=>{
					return {...e,printCount:0}
				})
			}
		})
	},
  	
    /**
     * 返回主页
     * @param  {String} orderId 单号
     */
    backToPickList () {
      this.$router.push({name:'concatPickList'})
    },
    //展开收起
    expendList(){this.expend=!this.expend},
    /**
     * 完成装袋
     */
    completeOrder(){
    	let ids = this.$route.query.id.split("|")
    	this.$router.push({name:'packageResult',query:{id:this.$route.query.id}})
    },
  },
}

</script>
<style lang="less" scoped>
	.pre-content-pic{
	.pic-item-info{
		.printSingle{
			background: #FFFFFF;
			border: 1px solid #D0D0D0;
			font-size: 14px;
			color: #333333;
			border-radius: 4px;
		}
	}
	.pic-item-info{
		position: relative;	
		/*dt{line-height: 40px;}*/
		>div{
			
		}
		.print-list{
			display: flex;justify-content: space-between;align-items: center;
			margin-bottom: 10px;
			span{
				flex: 1;
			}
		}
		button{
			background: #3DA5FE;
			border-radius: 3px;
			color: #FFFFFF;
			font-size: 13px;border: none;width: auto;height: 30px;
			padding: 0 10px;
			/*.pre-picking .pre-pick-list .list-pre-item .pre-list-item-content dt span*/
			/*.pre-picking .pre-pick-list .list-pre-item .pre-list-item-content.concat dt span*/
		}
	}
	}
	.pick-success-print{display: flex;justify-content: space-between;align-items: center;padding-bottom: 10px;margin-bottom: 10px;}
	.succes-icon{width: 75px;position: absolute;top: 15px;right: 5%;}
	.pick-statius-tip{
		padding: 9px 4%;margin: 0;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color:white;
		background: url(../../../assets/pre/iconFile.png) 92% center no-repeat;
		background-color: rgba(100,183,255,0.80);
		margin-bottom: 10px;
		dt{font-size: 16px;}
	}
	.pick-toBag{display: flex;align-items: center;justify-content: space-between;
	/*background: rgba(216,216,216,0.20);*/
		width: 94%;margin: 0 auto;padding: 10px 4%;line-height: 1.5;box-sizing: border-box;border-radius: 0 0 3px 3px;
		box-shadow: 0px 0 5px 0 #DDDDDD;
		p{color: #666666;font-size: 13px;}
		button{background: #2DC7EC;border-radius: 3px;color: #FFFFFF;border: none;width: 72px;height: 28px;}
	}
	.toHide{
		color: #999999;font-size: 14px;
		display: flex;justify-content: center;align-items: center;
		text-align: center;
		.toBottom{}
		.isTop{
			transform: rotate(180deg);
		}
		.expendImg{transition: all 0.4s;}
		
	}
</style>
