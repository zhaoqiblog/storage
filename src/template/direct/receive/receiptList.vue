<template>
  <div class="self-process">
    <x-header :left-options="{preventGoBack:true}" @on-click-back="backScan">添加商品</x-header>
    <!--<scroller class="scroll-view" lock-x height="-45px">-->
    	<div class="scroll-content">
    <div class="contentWrap">
    	<div class="shopName vux-1px-tb"><i></i>{{commonInfo.costName}}</div></keep-alive>
    	<div class="storeSelect">
	      	<div class="top-margin">
		      	<goods-info-item
					v-for="(item,index) in initData" 
					:type="item.type"
					:code="item.goodsBarCode"
					:name="item.goodsName"
					:totalNum="item.sysNum"
					:unit="item.unit"
					:num="item.caseNum"
					:unitq="item.perNum"
					:timeSel="item.timeSel"
					:actualVal="item.actualVal"
					:giftsVal="item.giftsVal"
					:textNum="item.textNum"
					@changeActual="changeActual"
					@changeGift="changeGifts"
					@changeDate="changeDate"
					:sideslip="true"
					:deleteFunc="goodsInfoItemDelete.bind(this,index)"
					:key="index">
				</goods-info-item>
			</div>
						<!--&&initData.intarger.length>0-->
    	</div>
	   
    </div>
    <!--</scroller>-->
    </div>
    	 <div class="cm-footer">
	      <div class="btn-add">
	       <span @click="addGoods()">扫描下一个</span>
	      </div>
	      <div class="btn-submit">  <!--:disabled=""-->
	        <button type="button" @click="gotoConfirm" :disabled="disableds">确认收货清单</button>
	      </div>
    	</div>
    	<x-dialog v-model="showDialog" class="dialog-tips">
        <div>
          <h3>提示</h3>
          <p class="info">
          	<span>该商品已过保质期</span>
          	<br />
          	<span>是否进行删除？</span>
          </p>
          
        </div>
        <div @click="" class="click-btn">
         <button type="button" @click="cancel">取消</button>
         <button type="button" :index='delIndex' @click="goodsInfoItemDelete(delIndex)">确定</button>
        </div>
      </x-dialog>
    	<x-dialog v-model="showPassOver" class="dialog-tips">
        <div>
          <h3>提示</h3>
          <p class="info-pass">
          	<span>{{passText}}</span>
          </p>
          
        </div>
        <div @click="" class="click-btn">
         <button type="button" :index='delIndex' @click="showPassOver=false" class="sub">确定</button>
        </div>
      </x-dialog>
      <div v-transfer-dom class="alert-info-difer">
	      <confirm
	      v-model="showNotEnough"
	      :close-on-confirm="false"
	      @on-confirm="confirmToNext"
	      title="提示">
	        <p style="text-align:left;padding-left: 20px;">当前订单上还有：</p>
	        <p v-for="item in notScanGoods" style="text-align:center;padding: 10px;">{{item.goodsBarCode}}{{item.goodsName}}</p>
	        <p style="text-align:left;padding-left: 20px;">等{{notScanGoods.length}}件商品未扫描</p>
	      </confirm>
	    </div>
  </div>
</template>
<script>
import { Confirm,XHeader,XDialog,TransferDomDirective as TransferDom} from 'vux'
import factory from '@/factory'
import func from '@/func'
import $request from '@/service/request.js'
import {mapState,mapMutations} from 'vuex'
//import
export default {
	directives: {
    TransferDom
  },
  components: {
    XHeader,XDialog,Confirm
  },
  data() {
    return {
    	initData:[],  //列表tab切换请求数据
			disableds:true,
			showDialog:false,  // 过期提示框
			showPassOver:false,  // 过期超过2/3提示框
			showNotEnough:false,  //扫描商品不够订单上商品总数的提示框
			passText:'',		//提示文字信息
			delIndex: 0,	//提示删除的index
			notScanGoods:[],
			beforeData:[],
  	}
  },
  computed: {
  	...mapState({
  		commonInfo:state=>state.global.commonInfo,
  		directReceiveShowList:state=>state.direct.directReceiveShowList, //上一页数据
  		directReceiveAddGoods:state=>state.direct.directReceiveAddGoods,  //当前页数据
  		directReceiveConfirm:state=>state.direct.directReceiveConfirm  //去下一页数据
  	}),
  },
  created() {
  	let isBack = this.$route.query.isBack;
  	if(isBack){
  		console.log("上一页返回过来的");
  		this.initData=this.directReceiveAddGoods;
  		this.disableds=false;
  	}else{
  		this.scanGoods(this.$route.query.goodsBarCode)
  		
  	}
  },
   mounted(){
  },
  methods: {
  	/*
  	 * 扫描商品并请求函数
  	 */
  	scanGoods(goodBarCode){
  		let isExit = this.initData.some(n=>{
					return n.goodsBarCode == goodBarCode
				})
			if(isExit){
				this.disableds=false;
				this.$vux.toast.show({
            type: 'text',
            text: goodBarCode+' 商品已经在列表中',
          })
			}else{
	  		let obj ={goodsBarCode:goodBarCode,costCenterNum:this.commonInfo.costNumber,orderNo:this.$route.query.orderCode}
		  	$request.get("/api/product-query/v1/protected/queryNoRceiveProductInfo",obj).then(res=>{		  		
		  		if(res.success==true){
		  			if(res.data){
		  				this.disableds=true;
		  				this.beforeData.unshift({
		  					...res.data,
		  					type:'bottomdate',
								timeSel:'',
								actualVal:0,
								giftsVal:0,
								textNum:res.data.orderItem,  //右侧序列号
		  				})
		  				this.beforeData.sort((a,b)=>{
		  					return a.orderItem - b.orderItem
		  				})
		  				this.initData=this.beforeData
		  			}
		  		}else{
		  			 this.$vux.toast.show({
              type: 'text',
              text: res.message || '获取商品信息失败',
            })
//		  			this.$router.push({path:'/fail',query:{text: res.message,title: '直送收货', path:'/scanEntry?key=directOrderInfo'}})
		  		}
		  	},err=>{
		  		 this.$vux.toast.show({
              type: 'text',
              text: res.message || '获取商品信息失败',
            })
//		  		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '直送收货', path:'/scanEntry?key=directOrderInfo'}})
		  	})
	  	}
  	},
  	/**
     *继续扫描 
     **/
    addGoods(){
    	if(window.cordova){
    		factory.scan().then(i=>{
    			this.scanGoods(i.text)
    		})
    	}else{
    		const arrs = [6914782207721,6914782109599,6914782114371,6914782209947,6914782114395,6914782208117];
    		arrs.forEach(es=>{
    			this.scanGoods(es)
    		})
    	}
    },
	/*
	 确认收货清单按钮
	 **/
    gotoConfirm(){
			this.$store.commit("setReceiveAddGoods",this.initData)  //当前页面上的数据，使返回按钮返回到当前页数据不丢失
			this.$store.commit("setdirectReceiveConfirm",this.initData)  //去下一个页面的数据（确认收货清单的数据）
			if(this.initData.length<this.directReceiveShowList.length){
				
				this.notScanGoods= [];
				this.directReceiveShowList.forEach(e=>{
					let isSame=false;
					this.initData.forEach(a=>{
						if(e.goodsBarCode==a.goodsBarCode){
							isSame=true;
							return false;
						}
						
					})
					if(!isSame){
						this.notScanGoods.push(e);
					}
				})
//				console.log(JSON.stringify(this.directReceiveShowList))
				this.showNotEnough = true;
//				this.notScanGoods = this.directReceiveShowList.filter(e=>{return e.goodsBarCode!==})
			}else{
				this.$router.push({path:'receiptListConfirm',query:{orderDate:this.$route.query.orderDate,purchaseOrderNo:this.$route.query.orderCode}})
			}
    },
    /**
     * 确认收货清单按钮去下一页
     */
    confirmToNext(){
    	this.$store.commit("setReceiveAddGoods",this.initData)  //当前页面上的数据，使返回按钮返回到当前页数据不丢失
			this.$store.commit("setdirectReceiveConfirm",this.initData)  //去下一个页面的数据（确认收货清单的数据）
//			console.log(this.directReceiveConfirm)
    	this.$router.push({path:'receiptListConfirm',query:{orderDate:this.$route.query.orderDate,purchaseOrderNo:this.$route.query.orderCode}})
    },
    /**
     * 取消:备注:此时下边确认清单按钮要置灰
     */
    cancel(){
    	
    	this.disableds=true;
    	this.showDialog=false;
    },
    /**
     * 修改实际及收货数量
     */
    changeActual(val,index){
    	const overNum=this.initData[index].sysNum
    	if(val){
    		this.initData[index].actualVal=val;
//  		let day = this.initData[index].validDays;  // 过期天数
//	    	let dateArr = this.initData[index].timeSel.split("-");
//	    	let productionDate = new Date(dateArr[0],dateArr[1]-1,dateArr[2]).getTime();//生产日期
//	    	let expirationDate = new Date(dateArr[0],dateArr[1]-1,parseInt(dateArr[2]) +day).getTime();//过期日期
//	   
//	   		let newDate =  new Date()
//	    	let toYear  = newDate.getFullYear();
//	    	let toMonth = newDate.getMonth();
//	    	let toDate  = newDate.getDate();
//	    	let todayDate = new Date(toYear,toMonth,toDate).getTime();//今天的日期
    		
    		
    		
//  		if(productionDate>todayDate){
//  			this.disableds = true;
//  		}else{
//	    		if(todayDate>=expirationDate){
//		    		this.delIndex=index
//		    		console.log(this.delIndex)
//		    		this.disableds = true;
//		    	}else{
//	//	    		this.disableds = false;
//		    		this.disableds = ! (this.initData.every(e=>{
//			    			return e.actualVal>0&&e.timeSel
//			    		}))
//		    	}
//	    	}
			const isAllInput =this.initData.every((value)=>{
				return value.actualVal>0
			})

			if(val>overNum){
				this.passText='实际收货数量不能超过总数量'
    		this.showPassOver=true;
				this.disableds = true;
			}else{
				if(isAllInput){
					this.disableds = false;
				}else{this.isAllInput==true}
			}
			
			
    	}else{
    		this.initData[index].actualVal=0
    		this.disableds=true
    	}
    },
    /**
     * 修改赠品数量
     */
    changeGifts(val,index){
    	if(val){
    		this.initData[index].giftsVal=val;
    	}
    },
    changeDate(val,index){
//  	console.log(this.initData[index])
//  	 （生产日期的毫秒数+保质期天数*12*60*60*1000)-当前日期的毫秒数/（生产日期的毫秒数+保质期天数*12*60*60*1000)  不能小于1/3
    	if(val){
    	this.initData[index].timeSel=val;
    	let day = this.initData[index].validDays ? this.initData[index].validDays:100000000;  // 过期天数
    	let dateArr = val.split("-");
    	let productionDate = new Date(dateArr[0],dateArr[1]-1,dateArr[2]).getTime();//生产日期
    	let expirationDate = new Date(dateArr[0],dateArr[1]-1,parseInt(dateArr[2]) +day).getTime();//过期日期
   
   		let newDate =  new Date()
    	let toYear  = newDate.getFullYear();
    	let toMonth = newDate.getMonth();
    	let toDate  = newDate.getDate();
    	let todayDate = new Date(toYear,toMonth,toDate).getTime();//今天的日期
    	if(productionDate>todayDate){
    		this.passText='生产日期不能超过今天'
    		this.showPassOver=true;
    		this.disableds=true;
//  		console.log("生产日期不能超过今天！")
    	}else{
    	//根据需要可以将">"改成">=";
	    	if(todayDate>=expirationDate){
	    		console.log("过期啦！");
	    		this.delIndex=index
	    		this.showDialog=true;  	//已过期商品提示框
//	    		this.passText=''
	    		this.disableds = true;
	    	}else{
	    		let outTime = todayDate - productionDate;  //生产日期到今天的时间
	    		let allTime = expirationDate - productionDate;	//过期日期到生产日期的时间
	    		//判断时间是否过去2/3啦
//	    		console.log(outTime,allTime)
	    		if(outTime>(allTime/3)*2){
	    			console.log("快过期啦");
	    			this.showPassOver=true;
	    			this.passText='该商品已超过保质期时间的2/3'
	    		}else{
	    			console.log("OK！没问题");
	    			this.disableds=! (this.initData.every(e=>{
//	    				console.log(e.actualVal,e.timeSel)
		    			return e.actualVal<=e.sysNum&&e.timeSel
		    		}))
//						console.log(this.initData[index].sysNum>=this.initData[index].actualVal,this.disableds)
//	    			this.disableds = (this.initData[index].sysNum>=this.initData[index].actualVal)&&isOverdate
	    		}
	    	}
	    }
    	}else{
    		this.initData[index].actualVal=0
    		this.disableds = true
    	}
    },
    /**
     * 删除
     * @param  {[type]} index 商品index
     * @param  {[type]} i     库位index
     */
    goodsInfoItemDelete (index, i){
    	this.initData.splice(index,1)
    	console.log(this.initData)
    	this.showDialog=false;
    },
    /**
     * 返回
     */
    backScan(){
//  	query:{scanResult:}
    	this.$router.push({path:'directOrderInfo',query:{scanResult:this.$route.query.orderCode}})
    }
  }
}

</script>
<style lang="less" scoped>
.contentWrap{
	.wraps{margin: 0;padding: 0;}
	.storeSelect-wrap{
			background: #48475A;height: 44px;
			color: #FFFFFF;
			text-align: center;
			line-height: 44px;
	}
	.storeSelect{
		padding-bottom: 48px;
	}
	.top-margin{margin-top: 10px;
	.goods-info-item{
		margin-top: 10px;
	}
	}
	.wipeList{margin-top: 10px;}
}
.dialog-tips{
	
	h3{
		height: 56px;
		line-height: 56px;
		font-size: 16px;
		color: #303030;
		font-weight: 600;
	}
	p{
		font-size: 13px;
		color: #666666;
		height: 70px;
		margin-top: 8px;
		&.info-pass{margin: 0;padding-top: 15px;box-sizing: border-box;}
	}
	
}
</style>
<style lang="less">
	.dialog-tips{
		.weui-dialog{
		width: 78.1%;
		border: 1px solid #979797;
		border-radius: 4px;
		padding-bottom: 15px;
		/*max-width: 205px;*/
		.click-btn {
			display: flex;
			justify-content: center;
			color:red;
			button{
				width: 130px;
				height: 40px;
				border: none;
		    font-size: 16px;
		    color: #fff;
		    background-color: #3DA5FE;
		    border-radius: 4px;
		    &:nth-child(1){
		    	background: #FFFFFF;
		    	
		    	color: #666666;
		    	border: 1px solid #D5D9DE;
		    	margin-right: 5px;
		    	&.sub{
		    		background-color: #3DA5FE;
		    		width: 87%;
		    		color: #FFFFFF;
		    		border: none;
		    	}
		    }
	    }
		}
	}
	}
	.alert-info-difer{
		.vux-x-dialog .weui-dialog .weui-dialog__hd{
			padding: 20px 0 10px 0;
		}
		.weui-dialog__title{
			font-size: 16px;
			color: #303030;
		}
		/*.weui-dialog__hd{margin-bottom: 15px;}*/
		.vux-prompt-msgbox{height: 40px;border-radius: 4px;padding: 0;width: 90%;z-index: 99999;}
		.vux-prompt{padding-bottom: 28px;}
		.weui-dialog__btn_default{}
		.vux-x-dialog .weui-dialog .weui-dialog__bd{
			padding-bottom: 20px;
			p{font-size: 12px;}
			}
		/*.vux-x-dialog .weui-dialog .weui-dialog__ft .weui-dialog__btn{
			color: #FFFFFF;
			line-height: 40px;
		}*/
	}
</style>
