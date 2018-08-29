<template>
  <div >
    <x-header>扫描库位码</x-header>
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div>
    	<div class="locationCode" v-if="showPlaceCode">
    		库位码：{{warehousePlaceCode}}
    	</div>
    	<div class="wraps differWraps">
    		<ul>
    			<li class="detailnum"><span class="goodsName">托盘码:&nbsp;&nbsp;</span>{{trayInfo.palletCode}}</li>
    			<li>
    				<dl>
	    				<!--<dt class="clearfix"><span class="goodsName fl">门店：&nbsp;</span><span class="fl listInfo">{{commonInfo.costName}}</span></dt>-->
	    				<dt class="clearfix"><span class="goodsName fl">数量:&nbsp;&nbsp;</span><span class="fl listInfo">{{trayInfo.goodsSize}}</span></dt>
	    				<dd class="detailnum clearfix">
	    					<span for="" class="goodsName fl" style="">商品:&nbsp;&nbsp;</span>
	    					<span class="fl listInfo"  style="display: inline-block;width: 84%;">{{trayInfo.goodslist}}</span>
	    				</dd>
    				</dl>
    			</li>
    		</ul>
    	</div>
    	<!--<div class="footer-bottom" @click="toShowPlace" v-if="!showPlaceCode"><i></i>&nbsp;&nbsp;请扫描库位二维码</div>-->
	  	<div class="cm-footer" v-if="!showPlaceCode">
	      <div class="btn-add" @click="toShowPlace()">
	        <span><i></i>&nbsp;&nbsp;请扫描库位码</span>
	      </div>
	      <div class="btn-submit" @click="inputCode">
	        <button type="button">输入库位码</button>
	      </div>
	    </div>
    	
    	<div class="footer-bottom" v-if="showPlaceCode" @click="gotosuccess">确认关联</div>
    </div>
		<div v-transfer-dom class="alert-info">
      <confirm v-model="showInput"
	      title="输入库位码"
	      confirm-text="确认"
	      @on-confirm="confirmInput">
	      <div class="vux-prompt"><input placeholder="请输入" type="number" pattern="[0-9]*" v-model.trim="warehousecode" class="vux-prompt-msgbox"></div>
      </confirm>
    </div>
     <toast v-model="tipsobj.showPositionValue" type="text" :time="800" is-show-mask :text="tipsobj.errmsg" position="middle"></toast>
  </div>
</template>
<script>
//import MHeader from '@/components/MHeader/index'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
import { XHeader,XButton,Toast,Confirm,TransferDomDirective as TransferDom } from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'
//import 
export default {
	directives: {
    TransferDom
  },
  components: {
    XHeader,XButton,Toast,Confirm 
  },
  name: 'turnoverIndex',
  data() {
    return {
    	warehousecode:'',
    	showInput:false,
    	showPlaceCode:false,
    	trayInfo:{palletCode:'',goodslist:""}, //托盘上的商品信息
    	warehousePlaceCode:'',  //库位码
    	costCenterNum:'', //成本中心编码
    	palletCode:'', //托盘编号
    	tipsobj:{showPositionValue:false,errmsg:''}
    }
  },
  computed: {
		...mapState({
			commonInfo:state=>state.global.commonInfo,
		})
  },
  created() {
  	let code = this.$route.query.scanResult
  	this.palletCode=code;
		this.getTrayInfo()
  },
  mounted(){
  },
  methods: {
//	获取托盘信息
		getTrayInfo(){
			let obj = {palletCode:this.palletCode,costCenterNum:localStorage.getItem("currentStore") ? localStorage.getItem("currentStore") : this.commonInfo.costNumber}
				$request.get("/api/goods-warehouse/v1/protected/queryPalletGoods",obj).then((re)=>{
					if(re.success==true){
						this.palletCode=re.data.palletCode
						let listNames =[],goodsInfos;
						this.trayInfo=re.data
						re.data.shopGoodsInfo.forEach(e=>{
							e.goodsInfo.forEach(r=>{
								listNames.push(r.goodsName)
							})
						})
	//				listNames=re.data.goodslist.split(",")
						if(listNames.length>3){
							this.trayInfo.goodslist=listNames.splice(0,4).join(",")
							this.trayInfo.goodslist+="..."
						}else{
							this.trayInfo.goodslist=listNames.splice(0,4).join(",")
						}
					}else{
						 this.$router.push({path:'/fail',query:{text: re.message,title: '托盘入库',info: '', path:'/scanEntry?key=trayStorage'}})
					}
				})
	},
     toShowPlace(){  //扫描二维码显示库位码
     	if(window.Cordova){
	     	factory.scan().then(res=> {
	        let code = res.text
					this.warehousePlaceCode=code
	    		this.showPlaceCode=true;
	      })
     	}else{
     		this.warehousePlaceCode='101'
	    		this.showPlaceCode=true;
     	}
    },
    /**
     * 请输入二维码
     */
    inputCode(){
    	this.showInput=true;
    },
    /**
     * 输入确认关闭
     */
    confirmInput(val){
    	if(this.warehousecode){
    		this.warehousePlaceCode=this.warehousecode;
    		this.showPlaceCode=true;
    	}else{
    		
    	}
    },
    gotosuccess(){  //确认关联
    	const obj={
    		palletCode:this.palletCode,
    		costCenterNum:localStorage.getItem("currentStore") ? localStorage.getItem("currentStore") : this.commonInfo.costNumber,
    		warehousePlaceCode:this.warehousePlaceCode
    	}
    	$request.get("/api/goods-warehouse/v1/protected/palletToWarehouse",obj).then(res=>{
    		if(res.success==true){
    			this.$router.push({path:'/success',query:{text:`关联成功`,title:"托盘入库",path:'/scanEntry?key=trayStorage'}})
    		}else{
					 this.$router.push({path:'/fail',query:{text: res.message,title: '托盘入库',info: '', path:'/scanEntry?key=trayStorage'}})
    		}
    	}).catch((err)=>{
    		this.$router.push({path:'/fail',query:{text: '操作失败，请重试',title: '托盘入库',info: '', path:'/scanEntry?key=trayStorage'}})
    	})
    }
  }
}

</script>
<style lang="less">
	.inputGroup{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.locationCode{
		background: #48475A;height: 72px;color: #ffffff;font-size: 20px;line-height: 72px;font-weight: 600;
		text-align: center;
			&.success{
				background: #6CC60A;
			}
		}
	.wraps{
		background: #ffffff;
		font-size: 14px;
		padding: 10px 0;
		ul{
			padding: 0 16px;
			.detailnum{color: #999999;}
			li{
				text-align: left;
				dt{font-weight: 700;color: #666666;line-height: 14px;margin-bottom: 7px;}
				dd{line-height: 20px;padding-bottom: 13px;}
				&.detailnum{
					font-size: 14px;
					font-weight: 700;
	    		color: #666666;
	    		padding-top: 16px;
	    		padding-bottom: 7px;
	    		}
				.goodsName{
					display: inline-block;
				}
				.listInfo{
					display: inline-block;width: 84%;
				}
			}
		}
	}
	.footer-bottom{
		display: flex;
		border: none;
		align-items: center;
		justify-content: center;
		>div{width: 50%;border: none;}
		.changeCode{
			color: #3DA5FE;
			background: #FFFFFF;
			i{
				display: inline-block;width: 16px;height: 16px;
				/*background: url() center center no-repeat;background-size: cover;*/
				background: url(../../assets/common/icon_scanblue.png) center center no-repeat;background-size: cover;
            /*position: relative;top: 2px;left: 0;*/
			}
		}
	}
	.alert-info{
		.vux-x-dialog .weui-dialog .weui-dialog__hd{
			padding: 20px 0 28px 0;
		}
		.weui-dialog__title{
			font-size: 16px;
			color: #303030;
		}
		/*.weui-dialog__hd{margin-bottom: 15px;}*/
		.vux-prompt-msgbox{height: 40px;border-radius: 4px;padding: 0;width: 90%;z-index: 99999;}
		.vux-prompt{padding-bottom: 28px;}
		.weui-dialog__btn_default{display: none;}
		.vux-x-dialog .weui-dialog .weui-dialog__ft{
			width: 90%;margin: 0 auto;background: #3DA5FE;color: #FFFFFF;
			border-radius: 4px;
			margin-bottom: 15px;
			height: 40px;
			}
		.vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn{
			color: #FFFFFF;
			line-height: 40px;
		}
	}
</style>
