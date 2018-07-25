import factory from './factory.js'
export default {
	//判断是否是小数
	isDot: function(num) {
	    var result = (num.toString()).indexOf(".");
	    if(result != -1) {
	        return false
	    } else {
	        return true;
	    }
	},
	//时间戳转为字符串
	getLocalTime:function(nS) { 
    	return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17)
   },
    /*
     * 倒计时
     * @params（time）:时间间隔
     */
    formate(time){
		let hour =parseInt(time/1000/3600);
		let min  = parseInt((time/1000 - hour * 3600)/60)
		let sec = parseInt(time/1000 - hour * 3600 - min * 60)
//		console.log(hour + '小时' + min + '分钟' + sec + '秒')
		let ac=[];
		if(sec>=0){
//			ac='剩'+min+'分钟';
			ac=[hour,min,sec]
		}else{
			ac=[];
		}
		return ac
	},
	/**
	 * 吧事件转化成分钟数
	 * 参数：毫秒数
	 */
	timeToMinate(time){
		if(time>0){
		return time/(1000*60)
		}else{
			return false;
		}
	},
	/**
	 * 监听滚动事件
	 * params(this:当前文件的操作对象this，anchor：滚动的界面框元素，callback：滚动到底部执行的函数
	 */
	scrollListen (_this,anchor,callback=null) {
//    const _this = _this
//    let anchor = this.$refs.scrollWrap
      anchor.addEventListener('scroll', function() {
        var scrollTop = document.body.scrollTop;
        let top=anchor.scrollTop,
            sh=anchor.scrollHeight,
            ch=anchor.clientHeight;
//          console.log(sh,top,top+ch)
        if(sh==top+ch) {
          // 触发加载数据
					callback()
        }
      })
   },
	/**
   * 转byte数组
   * @param {Object} param
   *  var param = {text: "我们都是好孩子09365"};
   */
	string2Byte:function(param){
//		return this.callApi(_MIDEA_BLUE,"string2Byte",[param])
//		var param = {
//          text: "我们都是好孩子09365"
//      };
console.log(param)
		let info;
        cordova.exec(function(result) {
//          alert(result);
            info =result
        },
        function(error) {
            alert("Error: " + error);
            info=false;
        },
        "BlueToothPlugin", "string2Byte", [param])
        console.log(info)
        return info;
	},
	/**
	 * 判断是否为ios或者android
	 */
	isOs(){
		var u = navigator.userAgent, app = navigator.appVersion; 
		var isAndroidPlat = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器 
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
		var isAndroid=false;
//		alert('是否是Android：'+isAndroid); 
//		alert('是否是iOS：'+isiOS);
		if(isAndroidPlat){
			isAndroid=true;
		}else{
			isAndroid=false;
		}
		return isAndroid
	},
	/*
	 * 打印功能
	 */
	printInfo(data,_this,callback=null,errCallback=null){
	let test='',byteText="27 97 1 27 33 0 ";
		factory.string2Byte({text:'\n\n欢迎光临'+data.shop.shopname+'\n'+'--------------------------------\n'}).then(res=>{
			byteText +=res
		}).then(()=>{
			factory.string2Byte({text:data.ordersequenceno+(data.deliverType==0 ?'-自提\n':'-配送\n')}).then(res=>{
				byteText +=' 27 97 0 27 33 51 '+res
			}).then(()=>{
				factory.string2Byte({text:'--------------------------------\n订 单 号：'+
					data.id+'\n下单时间：'+ new Date(parseInt(data.finishTime)).format("yyyy-MM-dd hh:mm")+'\n'+
					'预约送达: '+new Date(parseInt(data.expectdeliverydatetime.date)).format("yyyy-MM-dd")+' '+data.expectdeliverydatetime.from+'-'+data.expectdeliverydatetime.to+'\n'	+							
					'收 货 人：'+data.recvinfo.name+'\n'+
					'联系电话：'+data.recvinfo.phone+'\n'+(data.deliverType==0 ?'':'收货地址：'+data.recvinfo.address.city+'-'+data.recvinfo.address.detail+'\n')
					}).then(res=>{
					byteText +=' 27 33 00 '+res
				}).then(()=>{
					factory.string2Byte({text:'备注：'+data.comment+'\n'}).then(res=>{
						byteText +=' 27 33 31 '+res
					}).then(()=>{
						factory.string2Byte({text:'--------------------------------\n购买商品\n'}).then(res=>{
							byteText +=' 27 33 00 '+res
						}).then(()=>{
							var queen = new test(byteText);
							data.goodsInfoDTOS.forEach((a,index)=>{
								let e = a;
								let indexn = index;
								queen.push(indexn,e);
								if(index==data.goodsInfoDTOS.length-1){
									queen.start((lasttext)=>{
//													alert("lasttext---"+lasttext);
										factory.string2Byte({text:'\商品金额：'+data.amount.goodsamount/100}).then(res=>{
											lasttext +=' 27 97 0 27 33 00 '+res
										}).then(()=>{
											factory.string2Byte({text:'\n订单运费：'}).then(res=>{
												lasttext +=' 27 97 0 27 33 00 '+res
											}).then(()=>{
												factory.string2Byte({text:data.amount.freightamount/100}).then(res=>{
													lasttext +=' 27 97 2 27 33 00 '+res
												}).then(()=>{
													factory.string2Byte({text:'\n商品优惠：'}).then(res=>{
														lasttext +=' 27 97 0 27 33 00 '+res
													}).then(()=>{
														factory.string2Byte({text:(data.amount.coupondiscountamount+data.amount.promotiondiscountamount)/100}).then(res=>{
															lasttext +=' 27 97 2 27 33 00 '+res
														}).then(()=>{
															factory.string2Byte({text:'\n运费优惠：'+data.amount.freightpromotionamount/100+'\n'}).then(res=>{
																lasttext +=' 27 97 0 27 33 00 '+res
															}).then(()=>{
																factory.string2Byte({text:'--------------------------------\n'}).then(res=>{
																	lasttext +=' 27 97 0 27 33 00 '+res
																}).then(()=>{
																	factory.string2Byte({text:'订单件数：'+data.amount.productcount/100}).then(res=>{
																		lasttext +=' 27 97 0 27 33 42 '+res
																	}).then(()=>{
																		factory.string2Byte({text:'\n应收金额：'+data.amount.totalamount/100+'\n--------------------------------\n'}).then(res=>{
																			lasttext +=' 27 97 0 27 33 0 '+res
																		}).then(()=>{
																			factory.string2Byte({text:'谢谢惠顾，欢迎再次光临 \n'+data.shop.address+'\n'+'配送时间:09:00 - 20:00\n联系客服：400-800-5050\n\n签名栏：\n\n\n提货码:'+data.outerOrderId}).then(res=>{
																				lasttext +=' 27 97 1 27 33 0 '+res
																			}).then(()=>{
//																							alert(lasttext)
																				if(_this.isConnectDevice){  //如果为true，代表打印机连接成功
//																								alert("开始打印:"+lasttext);
																					let param = {text:lasttext};
																					factory.printBytes(param).then(res=>{
//																									alert(JSON.stringify(res))
																					},(err)=>{
																						alert(err);
																						console.log("打印失败")
																						errCallback();
																					}).then(()=>{
																						let param1 = {text:data.outerOrderId,size: 10};
																						factory.printQRCode(param1).then(()=>{
																							factory.printText({text: "\n\n\n--------------------------------\n\n\n\n"})
																						}).then(()=>{
																							callback()
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
  	},
}