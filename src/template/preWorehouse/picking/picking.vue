<template>
  <div class="shop-supply pick-supply">
  	<x-header class="vux-1px-b difer-header" :left-options="{preventGoBack:true}" @on-click-back="showBackTipinfo">拣货单详情</x-header>
    <div class="pre-content-title">
    	<div class="picking-title">
    		<div class="counting-time-pic">
    			拣货倒计时 {{time}}
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-content pre-content-pic" ref="scrollWrap">
    	<div class="pic-item-info">
    		<div>
    			<dl class="vux-1px-b">
    				<dt>订单信息</dt>
    				<dd>
    					<span>订单号</span>
    					<span>{{data.id}} <span style="color: #6fc710;">{{data.ordersequenceno}}</span></span>
    				</dd>
    				<dd>
    					<span>商品sku</span>
    					<span v-if="data.products">{{data.products.length}}</span>
    				</dd>
    				<dd>
    					<span>拣货员</span>
    					<span>{{data.status=='0'?'':(data.status=='2'?(data.operatorName ? data.operatorName:commonInfo.name):'')}}</span>
    				</dd>
    			</dl>
    		</div>
    		<div>
    			<dl v-if="data.expectdeliverydatetime" class="vux-1px-b">
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
    			</dl>
    		</div>
				<div class="handel-btn">
					<a v-if="data.recvinfo&&data.recvinfo.phone" :href="'tel:'+data.recvinfo.phone"><button>联系顾客</button></a>
					<!--<button @click="printOrder" v-if="isAndroid=='true'">打印小票</button>-->
					<!--v-if="data.status==-1 || data.status==0"-->
					<button v-if="showStartPick" @click="handelPick" class="startPick" :disabled="data.status=='-1'">{{data.status=='-1'?'已退货':'开始拣货'}}</button>
				</div>
			</div>
    	<pre-item-pic v-for="(item,index) in data.products"
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
    <div class="pre-footer">
      <div class="btn-add btn-tips" v-if="data.products&&data.products.length>0">
       		待拣货共 <i>{{data.products.length}}</i> 件,已拣货 <i>{{alreadyPick}}</i> 件
      </div>
      <div class="btn-submit">  <!--:disabled=""-->
        <button type="button" @click="completeOrder" :disabled="data.status!=2">完成</button>
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
    
    <popup-picker 
    	v-if="commonInfo.blueList" 
    	:show-cell="false" class="showposdiffer"  
    	:data="commonInfo.blueList" 
    	:show="showSelectBlue" 
    	v-model="slectBlue" 
    	@on-change="changeBlue" 
    	show-name @on-hide="showSelectBlue=false">
    </popup-picker>
  </div>
</template>

<script>
import MEmpty from '@/components/MEmpty/index'
import MpopInput from '@/components/MpopInput/index'
import { XHeader,Confirm,TransferDomDirective as TransferDom,PopupPicker } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from "@/func.js"
export default {
	 directives: {
    TransferDom
  },
  components: {
    XHeader, MEmpty,MpopInput,Confirm,PopupPicker 
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
      showStartPick:false,  //开始拣货按钮是否显示
    }
  },
  created() {
  	this.isAndroid =localStorage.getItem("isAndroid");
//	alert(this.commonInfo.isAndroid)
  	this.getPickingInfo(this.$route.query.id)
    let self = this;
		this.timeIntever = setInterval(function(){
			self.now = new Date().getTime();
			if(self.$route.query.toTime-self.now<0){
				clearInterval(self.timeIntever)
			}
		}, 1000);
		
		//判断之前是否连结果蓝牙，如果连接过蓝牙，有列表的话，直接连接
		/*if(localStorage.getItem("bluedata")&&this.isAndroid){
			var param1 = { btAddress:localStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
				//连接打印机
				if(window.cordova){factory.connectBlue(param1).then(res=>{
					this.isConnectDevice=true;
//					alert("蓝牙设备连接成功")
				},(err)=>{alert("error:"+(err||'连接蓝牙设备失败'))})
			}
		}*/
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
				if(res.data.status==0){
					this.showStartPick=true;
				}else{
					this.showStartPick=false;
				}
				this.data.products.forEach(e=>{
					e.init=true;
				})
			}else{
				
			}
		})
	},
	/**
	 * 修改蓝牙连接设备
	 */
	changeBlue(){
		localStorage.setItem("bluedata",this.slectBlue[0]);
//		console.log("pop")
//		连接打印机
		if(window.cordova){
			var param1 = { btAddress:localStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
			factory.connectBlue(param1).then(res=>{
//						alert("连接打印机")
//						alert(JSON.stringify(res))
						this.isConnectDevice=true;
					},(err)=>{alert("连接打印机失败："+err)}).then(()=>{
						this.printOrder()
					})
			}
	},
	/**
	 * 打印小票
	 */
	printOrder(){
		//开启蓝牙
  		const _this =this;
  			//获取蓝牙连接列表，判断是否之前连接过蓝牙
  			if(localStorage.getItem("bluedata")){
  				let test='',byteText="27 97 1 27 33 0 ";
					factory.string2Byte({text:'\n\n欢迎光临'+(this.data.shop.shopname?this.data.shop.shopname:'')+'\n'+'--------------------------------\n'}).then(res=>{
						byteText +=res
					}).then(()=>{
						factory.string2Byte({text:(this.data.ordersequenceno?this.data.ordersequenceno:'')+'-配送\n'}).then(res=>{
							byteText +=' 27 97 0 27 33 51 '+res
						}).then(()=>{
							factory.string2Byte({text:'--------------------------------\n订 单 号：'+
								this.data.id+'\n下单时间：'+ new Date(parseInt(this.data.generatetime)).format("yyyy-MM-dd hh:mm")+'\n'+
								'预约送达: '+new Date(parseInt(this.data.expectdeliverydatetime.date)).format("yyyy-MM-dd")+' '+this.data.expectdeliverydatetime.from+'-'+this.data.expectdeliverydatetime.to+'\n'+
								'收 货 人：'+this.data.recvinfo.name+'\n'+
								'联系电话：'+this.data.recvinfo.phone+'\n'+
								'收货地址：'+this.data.recvinfo.address.city+'-'+this.data.recvinfo.address.city+'-'+this.data.recvinfo.address.detail+'\n'
								}).then(res=>{
								byteText +=' 27 33 00 '+res
							}).then(()=>{
								factory.string2Byte({text:'备注：'+this.data.comment+'\n'}).then(res=>{
									byteText +=' 27 33 31 '+res
								}).then(()=>{
									factory.string2Byte({text:'--------------------------------\n购买商品\n'}).then(res=>{
										byteText +=' 27 33 00 '+res
									}).then(()=>{
										var queen = new test(byteText);
										this.data.products.forEach((a,index)=>{
											let e = a;
											let indexn = index;
											queen.push(indexn,e);
											if(index==this.data.products.length-1){
												queen.start((lasttext)=>{
//													alert("lasttext---"+lasttext);
													factory.string2Byte({text:'\商品金额：'+this.data.amount.goodsamount/100}).then(res=>{
														lasttext +=' 27 97 0 27 33 00 '+res
													}).then(()=>{
														factory.string2Byte({text:'\n订单运费：'}).then(res=>{
															lasttext +=' 27 97 0 27 33 00 '+res
														}).then(()=>{
															factory.string2Byte({text:this.data.amount.freightamount/100}).then(res=>{
																lasttext +=' 27 97 2 27 33 00 '+res
															}).then(()=>{
																factory.string2Byte({text:'\n商品优惠：'}).then(res=>{
																	lasttext +=' 27 97 0 27 33 00 '+res
																}).then(()=>{
																	factory.string2Byte({text:(this.data.amount.coupondiscountamount+this.data.amount.promotiondiscountamount)/100}).then(res=>{
																		lasttext +=' 27 97 2 27 33 00 '+res
																	}).then(()=>{
																		factory.string2Byte({text:'\n运费优惠：'+this.data.amount.freightpromotionamount/100+'\n'}).then(res=>{
																			lasttext +=' 27 97 0 27 33 00 '+res
																		}).then(()=>{
																			factory.string2Byte({text:'--------------------------------\n'}).then(res=>{
																				lasttext +=' 27 97 0 27 33 00 '+res
																			}).then(()=>{
																				factory.string2Byte({text:'订单件数：'+this.data.amount.productcount/100}).then(res=>{
																					lasttext +=' 27 97 0 27 33 42 '+res
																				}).then(()=>{
																					factory.string2Byte({text:'\n应收金额：'+this.data.amount.totalamount/100+'\n--------------------------------\n'}).then(res=>{
																						lasttext +=' 27 97 0 27 33 0 '+res
																					}).then(()=>{
																						factory.string2Byte({text:'谢谢惠顾，欢迎再次光临 \n'+this.data.shop.address+'\n'+'配送时间:09:00 - 20:00\n联系客服：400-800-5050\n\n签名栏：\n\n\n提货码:'+this.data.outerorderid}).then(res=>{
																							lasttext +=' 27 97 1 27 33 0 '+res
																						}).then(()=>{
//																							alert(lasttext)
																							if(this.isConnectDevice){  //如果为true，代表打印机连接成功
//																								alert("开始打印:"+lasttext);
																								let param = {text:lasttext};
																								factory.printBytes(param).then(res=>{
//																									alert(JSON.stringify(res))
																								},(err)=>{alert("错误提示:"+(err||'打印失败'))}).then(()=>{
																									let param1 = {text:this.data.outerorderid,size: 10};
																									factory.printQRCode(param1).then(()=>{
																										factory.printText({text: "\n\n\n"})
																									}).then(()=>{
																										this.$vux.toast.show({
																			                type: 'text',
																			                text: '打印成功',
																			              })
																									})
																								})
																							}else{
																								alert("还未连接打印机,请先连接打印机")
																							}
																						})
																					})
																				})
																			})
																		})
																	})
																})
															})
														})
													})
												})
											}
										})
										
										
										function test(byteText){
											var funarry = [];
											var Ind = 0;
											var byteText = byteText;
											function func(byteText,callback){
												let index = funarry[Ind][0];
												let e = funarry[Ind][1];
												factory.string2Byte({text:(index+1)+'.'+e.title+'\n'}).then(res=>{
													byteText +=' 27 33 00 '+res
												}).then(()=>{
													factory.string2Byte({text:'X'+e.num+'\n'}).then(res=>{
														byteText +=' 27 97 2 27 33 52 '+res
													}).then(()=>{
														factory.string2Byte({text:e.barcode}).then(res=>{
															byteText +=' 27 97 0 27 33 00 '+res
														}).then(()=>{
															factory.string2Byte({text:'\n单价￥'+e.price.value+'    金额￥'+e.price.total+'\n--------------------------------\n'}).then(res=>{
																byteText +=' 27 97 0 27 33 00 '+res
															}).then(()=>{
																callback(byteText);
																
															})
														})
													})
												})
											}
											return {
												push:function(indexn,e){
													funarry.push([indexn,e]);
												},
												start:function(end){
												//	alert(JSON.stringify(funarry));
														var callback = function(byteText){
															Ind++;
															if(Ind>=funarry.length){
																return end(byteText);
															}
															func(byteText,callback);
														}
														func(byteText,callback)
												}
											}
										}
									})
								})
							})
						})
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
//				    console.log(this.commonInfo,this.showSelectBlue)
					})
  			}
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
  		if(this.data.status!='2'){
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
  		if(this.data.status!='2'){
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
	  				if(res.data=='2'){
	  					this.showStartPick=false;
	  				}
	  				this.$vux.toast.show({
	            type: 'text',
	            text: '拣货任务开始'
	          })
	  			}else{
	  				this.data.status=res.errorCode;  //-1 已退款：按钮不可用，置灰 ， -2 ：退款审核中：完成按钮不可用 ，其他：按钮不可操作，开始拣货可以点击
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
	.shop-supply{
		.list-info-cell .l-list-ct .l-list-title{
			line-height: 30px;
			>span{
				color: #333333;font-weight: 600;font-size: 16px;
				/*line-height: 30px;*/
			}
		}
		.showposdiffer:before{
			border-top: none;
		}
		.weui-cell_access{
		.weui-cell__ft:after{
			border: none;}
			}
	}
	.pre-content{
		.list-info-cell .l-list-ct .l-list-content .l-list-code em{
			width: auto;
			max-width: 100%;color: #333333;
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
		top: 98px;padding-bottom: 60px;
		.pic-item-info{
			width: 94%;margin: 0 auto;
			background: #FFFFFF;
			box-sizing: content-box;
			.handel-btn{
				text-align: right;
				padding-bottom: 10px;
				button{
					background: #FFFFFF;
					border: 1px solid #D0D0D0;
					border-radius: 4px;
					font-size: 13px;
					color: #333333;
					padding: 6px 10px;
					margin-left: 10px;
					&.startPick{
						background: orange;color: #FFFFFF;border-color: orange;
					}
				}
			}
			>div{
				padding: 10px;
				font-size: 12px;
				padding-bottom: 0;
				dl{padding: 10px;}
				dt{color: #303030;}
				dd{color: #999999;
				
					/*display: flex;*/
					/*justify-content: flex-start;*/
					>span:nth-child(1){
						display: inline-block;
						width: 60px;
					}
				}
			}
			>div:nth-child(2){
				padding-top: 0;
				padding-bottom: 0;
			}
		}
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
			.counting-time-pic{
				background: #FEEEE9;
				border: 0 solid #EBBDAF;
				font-size: 13px;
				color: #D0021B;
				line-height: 40px;padding-left: 5%;

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
		    button:disabled{
		    	background-color: #c7c7c7;
		    }
	    }
	}
	.pre-content{
		.list-info-cell .l-list-ct .l-list-title{
			
		}
	}
	.pre-content-pic .pic-item-info .handel-btn button.startPick:disabled{
		background-color:#c7c7c7;
		border:none;
	}
	
</style>
