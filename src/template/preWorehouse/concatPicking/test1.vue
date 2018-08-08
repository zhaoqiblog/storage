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
	    					<span @click="printAll"><button>一键打印</button></span>
	    					<!--<span v-if="!datas.mergeId">小票分单打印</span>-->
	    				</dt>
	    				<dd class="print-list" v-for="e in datas.orderInfos">
	    					<span>{{e.ordersequenceno}}&nbsp;&nbsp;{{e.id}}</span>
	    					<!--v-if="isAndroid=='true'"-->
	    					<button  @click="printOrder(e.id)">打印 X{{e.printCount}}</button>
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
    	showSelectBlue:false, //选择蓝牙
    	slectBlue:[], //选中的蓝牙设备号
    	isConnectDevice:false,
      data: {
      },
      datas:[],
      isAndroid:false,
      isConnectDevice:false,  //打印机是否连接成功
      slectBlue:[], //选中的蓝牙设备号
      showSelectBlue:false, //选择蓝牙弹框显示与否
      printId:'',
      int:null,
    }
  },
  created() {
  	this.isAndroid=localStorage.getItem("isAndroid");
	this.getPickingInfo();
	//判断之前是否连接过蓝牙
//	if(localStorage.getItem("bluedata")&&this.isAndroid){
	/*if(localStorage.getItem("bluedata")){
		//如果之前连结果蓝牙，直接连接
		let param1 = { btAddress:localStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
		//连接打印机
		if(window.cordova){
			factory.connectBlue(param1).then(res=>{
				this.isConnectDevice=true;
			},(err)=>{
				alert("error:打印机 "+err)
				this.isConnectDevice=false
			})
		}
	}*/
  },
  destory(){
  	console.log("dis")
  	clearInterval(this.int)
  },
  methods: {
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
				this.isConnectDevice=true;  //连接打印机之后打印，调用打印方法
//				this.printOrder(this.printId)
				this.printOrders(this.printId.length,this.printId)
			},(err)=>{
				alert("连接打印机失败："+err+'\n'+"请回到首页设置模块修改打印设备")}
			)
		}
	},
	//一键打印
	printAll(){
		let i = 0;		
		let ids = this.$route.query.id.split("|")
		let _this = this;
//		for(let i = 0;i<ids.length;i++){
//			(function)(i)  //这个方法之前试过了，不行，主要是因为他要执行的是两个异步函数，不是i一个异步函数也就是说所有异步执行完了之后才打印，不是，方法是：先打印文字，在打印二维码，需要这两个在同一张单子上，
////			现在的结果是，文字和二维码不在同一个单子上，明白了！那你的callback哪里出问题？？callback是执行了的，否则不会打三次，我的意思是你的callback问题在哪
////没有解决
////嗯嗯，怎么弄
//		}
		
//  for(let i = 0;i < ids.length ; i ++){
//		  setTimeout(function(){
//		     _this.printOrder(ids[i])
//		  }, 10 * i);
//  }  //看这里之前注释掉的，这种方法是可疑的，但是就是会出现，我说的，先把所有的一个方法执行完，在之心下一个
     _this.printOrders(ids.length,ids)  //这里执行函数， 传入的参数为：3，【1223，234，23424】
	},
	printOrders(length,ids,callback=null){
	//开启蓝牙
	const _this =this;
	this.printId=ids;
	let ind=0;  //默认为0
	//获取蓝牙连接列表，判断是否之前连接过蓝牙
	if(sessionStorage.getItem("bluedata")){
		//获取打印小票信息
		if(length==1){ //这里直接一个for循环不好吗 ，异步执行的函数，佛如循环不会等待
			
			$request.post("/api/online-order/v1/protected/batchpickdetail",ids).then((res)=>{
				if(res.success==true){
					this.datas.orderInfos.forEach((r)=>{
						if(r.id==ids[0]){
							r.printCount = res.data[0].printCount
						}
					})
					func.printInfo(res.data[0],this,()=>{   //func。printInfo：函数是一个包含两个一部函数的的函数
						callback(); //回调函数在这里执行   这里不会执行吗？等等，我试一下看会不会
						this.$vux.toast.show({
	            type: 'text',
	            text: res.data[0].ordersequenceno+'打印成功',  //这个弹框只执行了一次
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
				}
			})
}else{		  //进来函数之后length>1，执行else内容
	let _thiss= this
			var callbacks=function(){  //2.回调函数进来这里  //6.又进来这里  //9，进来这里，就是这里啊什么问题，我不知道什么问题，那你写的这个没成功
//				成功了,是会执行三次的，不成功的话不会执行三次，就职可能这里写的有问题，实现你要的结果不就，关键是没有啊你不是说打印了三次吗，可是三次的文字和二维码不是一起打的，是打了三次文字，三次二维码，我要的是三次的文字+二维码，不是分开
//也就是说打印了 6次嗯，因为这个文字和二维码都是异步
				
				ind++;  //3.第一次回调 ind ：1  ///7. ind：2  //10.ind :3
				if(ind>=length){  //11.进来这里，退出循环
					return;
				}else{ //4.进来这里
					console.log("第"+ind+"打印")
					_thiss.printOrders(1,[ids[ind]],callbacks) //5.执行这个，完成之后执行回调函数  //8，再一次执行，完成回调
				}
			}
			console.log("第一次打印")
			_thiss.printOrders(1,[ids[0]],callbacks)  //1，首先执行这里，传入回掉函数callbacks，第一遍执行完，执行回掉函数
		}
	}else{
		//蓝牙未连接，提示选择连接哪个蓝牙,获取已配对的蓝牙设备列表
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
	
	
	
	
  /**
	 * 打印小票
	 */
	printOrder(id,callback=null){
		//开启蓝牙
  		const _this =this;
  		this.printId=id;
		//获取蓝牙连接列表，判断是否之前连接过蓝牙
		if(sessionStorage.getItem("bluedata")){
			//获取打印小票信息
			$request.post("/api/online-order/v1/protected/batchpickdetail",[id]).then((res)=>{
				if(res.success==true){
					this.datas.orderInfos.forEach((r)=>{
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
			//蓝牙未连接，提示选择连接哪个蓝牙,获取已配对的蓝牙设备列表
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
	/**
	 * 获取拣货单信息
	 */
	getPickingInfo(){
		$request.post("/api/online-order/v1/protected/mergepickdetail",this.$route.query.id.split("|")).then((res)=>{
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
