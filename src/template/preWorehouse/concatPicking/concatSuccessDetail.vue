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
	    				<dt><span v-if="datas.mergeId">合单号&nbsp;{{datas.mergeId}}</span><span v-if="!datas.mergeId">小票分单打印</span></dt>
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
    }
  },
  created() {
  	this.isAndroid=localStorage.getItem("isAndroid");
	this.getPickingInfo();
	//判断之前是否连接过蓝牙
//	if(localStorage.getItem("bluedata")&&this.isAndroid){
	if(localStorage.getItem("bluedata")){
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
	}
  },
  methods: {
  	/**
	 * 修改蓝牙连接设备
	 */
	changeBlue(){
		localStorage.setItem("bluedata",this.slectBlue[0]);
		alert(this.slectBlue[0])
//		连接打印机
		if(window.cordova){
			var param1 = { btAddress:localStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
			factory.connectBlue(param1).then(res=>{
//				alert("连接打印机成功")
				this.isConnectDevice=true;
				this.printOrder(this.printId)
			},(err)=>{
				alert("连接打印机失败："+err)}				
			)
		}else{
//			console.log(this.slectBlue)
		}
	},
  	/**
	 * 打印小票
	 */
	printOrder(id){
		//开启蓝牙
  		const _this =this;
  		this.printId=id;
		//获取蓝牙连接列表，判断是否之前连接过蓝牙
		if(localStorage.getItem("bluedata")&&this.isConnectDevice){
			//获取打印小票信息
			$request.post("/api/online-order/v1/protected/batchpickdetail",[id]).then((res)=>{
				if(res.success==true){
					this.datas.orderInfos.forEach((r)=>{
						if(r.id==id){
							r.printCount = res.data[0].printCount
						}
					})
					console.log(this.datas.orderInfos)
					func.printInfo(res.data[0],this,()=>{
						this.$vux.toast.show({
			            type: 'text',
			            text: '打印成功',
			          })
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
				})
		}
	},
	/**
	 * 获取拣货单信息
	 */
	getPickingInfo(){
		$request.post("/api/online-order/v1/protected/mergepickdetail",this.$route.query.id).then((res)=>{
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
	.succes-icon{width: 75px;position: absolute;top: 15px;right: 5%;}
</style>
