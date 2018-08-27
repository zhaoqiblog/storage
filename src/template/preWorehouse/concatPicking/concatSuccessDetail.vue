<template>
  <div class="shop-supply pick-supply">
  	<x-header class="vux-1px-b difer-header" :left-options="{preventGoBack:true}" @on-click-back="backToPickList">合单拣货完成</x-header>
    <div class="scroll-content pre-content pre-content-pic" ref="scrollWrap">
    	<div class="concat-list-wrap" v-if="datas.ordersequencenos&&datas.ordersequencenos.length>0">
	    	<div class="pic-item-info" >
	    		<div>
	    			<dl class="vux-1px-b">
	    				<dt>合单信息</dt>
	    				<dd>
	    					<span>拣货员</span>
	    					<span>{{datas.id}} <span style="color: #6fc710;">{{datas.operatorName}}</span></span>
	    				</dd>
	    				<dd>
	    					<span>订单数量</span>
	    					<span v-if="datas">{{datas.ordersequencenos.length}}</span>
	    				</dd><dd>
	    					<span>拣货成功</span>
	    					<span v-if="datas.ordersequencenos.length>0" v-for="i in datas.ordersequencenos">{{i}}&nbsp;</span>
	    				</dd>
	    			</dl>
    				<img class="succes-icon" src="../../../assets/common/icon_yiwancheng.png"/>	    			
	    		</div>
	    		<div>
	    			<dl>
	    				<dt class="pick-success-print">
	    					<span v-if="datas.mergeId">合单号&nbsp;{{datas.mergeId}}</span>
	    					<span @click="printAll(null)"><button>一键打印</button></span>
	    					<!--<span v-if="!datas.mergeId">小票分单打印</span>-->
	    				</dt>
	    				<dd class="print-list" v-for="e in datas.orderInfos">
	    					<span>{{e.ordersequenceno}}&nbsp;&nbsp;{{e.id}}</span>
	    					<button  @click="printAll(e.id)">打印 X{{e.printCount}}</button>
	    				</dd>
	    			</dl>
	    		</div>
				</div>
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
  }),
  data() {
    return {
      data: {},
      datas:[],
      isAndroid:false,
      printId:'',
      int:null,
    }
  },
  created() {
  	this.isAndroid=localStorage.getItem("isAndroid");
		this.getPickingInfo();
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
//				_this.printId=[id];
//			 _this.printOrders(1,[id])
			 _this.printOrders([id])
		}else{
//			_this.printId=ids;
//	     _this.printOrders(ids.length,ids)  //这里执行函数， 传入的参数为：3，【1223，234，23424】
	     _this.printOrders(ids)  //这里执行函数， 传入的参数为：3，【1223，234，23424】
		}
		
	},
	printOrders(ids,callback=null){		
		$request.post("/api/online-order/v1/protected/batchpickdetail",ids).then((res)=>{
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
	printOrders1(length,ids,callback=null){
	//开启蓝牙
	const _this =this;
	let ind=0;  //默认为0
		//获取打印小票信息
		if(length==1){
			$request.post("/api/online-order/v1/protected/batchpickdetail",ids).then((res)=>{
				if(res.success==true){
					this.datas.orderInfos.forEach((r)=>{
						if(r.id==ids[0]){
							r.printCount = res.data[0].printCount
						}
					})
					func.printInfo(res.data[0],this,()=>{   //打印，成功的回调函数，记录打印次数并显示在界面上
						func.printAdd(res.data[0],this,(count)=>{
							callback()
						})
					})					
				}
			})
		}else{		  //进来函数之后length>1，执行else内容
			let _thiss= this
			var callbacks=function(){
				ind++;
				if(ind>=length){  //11.进来这里，退出循环
					return;
				}else{ //4.进来这里
					_thiss.printOrders(1,[ids[ind]],callbacks) //5.执行这个，完成之后执行回调函数  //8，再一次执行，完成回调
				}
			}
			_thiss.printOrders(1,[ids[0]],callbacks)  //1，首先执行这里，传入回掉函数callbacks，第一遍执行完，执行回掉函数
		}

},
	/**
	 * 获取拣货单信息
	 */
	getPickingInfo(){
		let ids = this.$route.query.id.split("|")
		$request.post("/api/online-order/v1/protected/mergepickdetail",ids).then((res)=>{
			if(res.success==true){
				this.datas=res.data
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
  },
}

</script>
<style lang="less" scoped>
	.pre-content-pic{top: 56px;
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
			font-size: 13px;border: none;width: 70px;height: 30px;
		}
	}
	}
	.pick-success-print{display: flex;justify-content: space-between;align-items: center;margin-bottom: 10px;}
	.succes-icon{width: 75px;position: absolute;top: 15px;right: 5%;}
</style>
