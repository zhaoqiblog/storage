<template>
  <div class="shop-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<span class="icons fl"  @click="back"></span>
    	<span class="txt">拣货单详情</span>
    </div>
    <div class="scroll-content pre-content pre-content-pic pre-difer" ref="scrollWrap">
    	<div class="pic-item-info">
    		<div class="success-top">
    			<div class="vux-1px-b">
	    			<div>
	    				<h5>拣货已完成</h5>
	    				<div class="order-forms"> <span>{{data.ordersequenceno}}</span></div>
	    			</div>
	    			<div>
	    				<img src="../../../assets/common/pic_success.png"/>
	    			</div>
    			</div>
    		</div>
    		<div>
    			<dl class="vux-1px-b">
    				<dt>订单信息</dt>
    				<dd>
    					<span>订单号</span>
    					<span>{{data.id}}</span>
    				</dd>
    				<dd>
    					<span>商品sku</span>
    					<span>{{parseInt(data.finishSkuNum)+parseInt(data.unFinishSkuNum)}}</span>
    				</dd>
    				<dd>
    					<span>已拣sku</span>
    					<span>{{parseInt(data.finishSkuNum)}}</span>
    				</dd>
    				<dd>
    					<span>缺货sku</span>
    					<span>{{parseInt(data.unFinishSkuNum)}}</span>
    				</dd>
    				<dd>
    					<span>拣货员</span>
    					<span>{{data.operatorName}}</span>
    				</dd>
    				<dd>
    					<span>完成时间</span>
    					<span>{{new Date(data.finishTime).format("yyyy-MM-dd hh:mm:ss")}}</span>
    				</dd>
    			</dl>
    		</div>
    		<div style="padding-top: 0;">
    			<!--v-if="data.expectdeliverydatetime"-->
    			<dl  class="vux-1px-b">
    				<dt>顾客信息</dt>
    				<dd v-if="data.expectdeliverydatetime">
    					<span >{{data.expectdeliverydatetime.slottype=='immediate'?'极速送达':'预约送达'}}</span>
    					<span>{{new Date(parseInt(data.expectdeliverydatetime.date)).format('yyyy-MM-dd')}}&nbsp;&nbsp;{{data.expectdeliverydatetime.from}}-{{data.expectdeliverydatetime.to}}</span>
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
					<a v-if="data.recvinfo" :href="'tel:'+data.recvinfo.phone"><button>联系顾客</button></a>
					<!--v-if="isAndroid=='true'"-->
					<button @click="printOrder" >打印小票</button>
					<button v-if="data.status=='0'" class="startPick">开始拣货</button>
				</div>
			</div>
    	<pre-item-pic v-for="(item,index) in data.goodsInfoDTOS"
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
				:key="index">
    	</pre-item-pic>
    	<m-empty v-if="data.content && data.goodsInfoDTOS.length == 0"></m-empty>
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
	import { XHeader,PopupPicker } from 'vux'
	import $request from '@/service/request.js'
import factory from '@/factory.js'
	
import { mapState } from 'vuex';
	
	export default {
		components: {
			XHeader,PopupPicker
		},
		name: 'pick-list',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
  }),
		data() {
			return {
//				data:[
//					{code:"BH955715041315160064",time:'2018-01-23 16:13:17',status:'已完成',total:15,complete:12},
//					{code:"Bertert715041315160064",time:'2018-01-23 16:13:17',status:'已完成',total:22,complete:22},
//				],
				data:{goodsInfoDTOS:[]},
				showSelectBlue:false, //选择蓝牙
	    	slectBlue:[], //选中的蓝牙设备号
	    	isConnectDevice:false,
	    	isAndroid:false,
			}
		},
		created(){
  	this.isAndroid =localStorage.getItem("isAndroid");
			this.getDetail();
			//判断之前是否连结果蓝牙，如果连接过蓝牙，有列表的话，直接连接
//			if(localStorage.getItem("bluedata")&&this.isAndroid){
			if(localStorage.getItem("bluedata")){
				var param1 = { btAddress:localStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
					//连接打印机
					if(window.cordova){factory.connectBlue(param1).then(res=>{
//						alert("连接打印机")
						this.isConnectDevice=true;
					},(err)=>{
						alert("error:打印机 "+err+'， 请点击打印小票按钮重新选择打印机')
						this.isConnectDevice=false
					})
				}
			}
		},
		methods:{
				/**
			 * 修改蓝牙连接设备
			 */
			changeBlue(){
				localStorage.setItem("bluedata",this.slectBlue[0]);
		//		连接打印机
				if(window.cordova){
					var param1 = { btAddress:localStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
					factory.connectBlue(param1).then(res=>{
//								alert("连接打印机")
		//						alert(JSON.stringify(res))
								this.isConnectDevice=true;
							},(err)=>{
								alert("连接打印机失败："+err)}
								
							).then(()=>{
								this.printOrder()
							})
					}
			},
			/**
			 * 获取订单信息
			 */
			getDetail(){
				$request.get("/api/online-order/v1/protected/pickdetail/"+this.$route.query.id).then(res=>{
					if(res.success==true){
						this.data=res.data;
					}else{
						this.$vux.toast.show({
	            type: 'text',
	            text: res.message
	          })
					}
				})
			},
			/**
			 * 返回
			 */
			back(){
				this.$router.back()
			},
				/**
	 * 打印小票
	 */
	printOrder(){	
		//开启蓝牙
  		const _this =this;
  			//获取蓝牙连接列表，判断是否之前连接过蓝牙
  			if(localStorage.getItem("bluedata")&&this.isConnectDevice){
  				let test='',byteText="27 97 1 27 33 0 ";
					factory.string2Byte({text:'\n\n欢迎光临'+this.data.shop.shopname+'\n'+'--------------------------------\n'}).then(res=>{
						byteText +=res
					}).then(()=>{
						factory.string2Byte({text:this.data.ordersequenceno+'-配送\n'}).then(res=>{
							byteText +=' 27 97 0 27 33 51 '+res
						}).then(()=>{
							factory.string2Byte({text:'--------------------------------\n订 单 号：'+
								this.data.id+'\n下单时间：'+ new Date(parseInt(this.data.finishTime)).format("yyyy-MM-dd hh:mm")+'\n'+
								'预约送达: '+new Date(parseInt(this.data.expectdeliverydatetime.date)).format("yyyy-MM-dd")+' '+this.data.expectdeliverydatetime.from+'-'+this.data.expectdeliverydatetime.to+'\n'	+							
								'收 货 人：'+this.data.recvinfo.name+'\n'+
								'联系电话：'+this.data.recvinfo.phone+'\n'+
								'收货地址：'+this.data.recvinfo.address.city+'-'+this.data.recvinfo.address.detail+'\n'
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
										this.data.goodsInfoDTOS.forEach((a,index)=>{
											let e = a;
											let indexn = index;
											queen.push(indexn,e);
											if(index==this.data.goodsInfoDTOS.length-1){
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
																						factory.string2Byte({text:'谢谢惠顾，欢迎再次光临 \n'+this.data.shop.address+'\n'+'配送时间:09:00 - 20:00\n联系客服：400-800-5050\n\n签名栏：\n\n\n提货码:'+this.data.outerOrderId}).then(res=>{
																							lasttext +=' 27 97 1 27 33 0 '+res
																						}).then(()=>{
//																							alert(lasttext)
																							if(this.isConnectDevice){  //如果为true，代表打印机连接成功
//																								alert("开始打印:"+lasttext);
																								let param = {text:lasttext};
																								factory.printBytes(param).then(res=>{
//																									alert(JSON.stringify(res))
																								},(err)=>{alert(err)}).then(()=>{
																									let param1 = {text:this.data.outerOrderId,size: 10};
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
												factory.string2Byte({text:(index+1)+'.'+e.goodsName+'   '+e.desc+'\n'}).then(res=>{
													byteText +=' 27 33 00 '+res
												}).then(()=>{
													factory.string2Byte({text:'X'+e.qty+'\n'}).then(res=>{
														byteText +=' 27 97 2 27 33 52 '+res
													}).then(()=>{
														factory.string2Byte({text:e.goodsBarCode}).then(res=>{
															byteText +=' 27 97 0 27 33 00 '+res
														}).then(()=>{
															factory.string2Byte({text:'\n单价￥'+e.saleprice+'    金额￥'+(e.saleprice*e.qty)+'\n--------------------------------\n'}).then(res=>{
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
					})
				/*let arrays =[{name:'测试设备1',value:"b0:f0:gg：h：er"},{name:'测试设备2',value:"b0:f0:33：hd：68"}]
				this.$store.commit("updateCommonInfo", {
			    	blueList:[arrays],
			    });
				this.showSelectBlue=true;*/
					
			
  			}
	},
		}
	}
</script>

<style lang="less">
	.pre-pic-history-detail{
		/*margin-top: 10px;*/
		
		.detail-top{
			background:#FFFFFF;
			p{padding: 0 20px;}
		}
		.pre-pic-history-detail{
			margin-top: 10px;
		}
	}

	.pre-pic-history-list {
		
	}
	.pre-content-title{
		&.pre-detail-title{
			.picking-title .pick-code{
				top: 10px;
				height: 140px;
				padding-top: 8px;
				box-sizing: border-box;
				p{
					padding: 9px 0 0px 30px;
				}
			}
		}
		
	}
	.pre-difer{
		top: 56px;
		padding-bottom: 0;
	}
	.pre-content-pic{
/*	.pic-item-info{
		.success-top{
			padding: 0 10px;
			
			>div{
				padding: 13px 10px;display: flex;
				justify-content: space-between;
				align-items: center;
				h5{font-size: 18px;color: #303030;line-height: 1.8;}
				.order-form{
					>span{background: #F2FBFE;
						border: 1px solid #AFE2EB;
						border-radius: 1px;
						margin-right: 10px;
						opacity: 0.8;
						padding: 0px 5px;font-size: 10px;
					}
					}
				img{width: 36px;}
			}
		}
	}*/
	}
</style>