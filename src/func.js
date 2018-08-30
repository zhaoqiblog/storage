import factory from './factory.js'
import $request from '@/service/request.js'
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
	formate(time){
		let hour =parseInt(time/1000/3600);
		let min  = parseInt((time/1000 - hour * 3600)/60)
		let sec = parseInt(time/1000 - hour * 3600 - min * 60)
		if(time>0){
			return   sec >=0 ? hour + '小时' + min + '分钟' + sec + '秒' :'已超时';
		}else{
			return '已超时'+(-hour) + '小时'+(-min) + '分钟' + (-sec)+'秒'
		}
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
      anchor.addEventListener('scroll', function() {
        var scrollTop = document.body.scrollTop;
        let top=anchor.scrollTop,
            sh=anchor.scrollHeight,
            ch=anchor.clientHeight;
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
	/**
	 * 打印之前获取蓝牙列表
	 */
	getBlueList(factory){
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
	},
	/**
	 * 打印记录次数
	 */
	printAdd(dataObj,_this,callback=null){
		$request.post("/api/online-order/v1/protected/printcount",[dataObj.id]).then((res)=>{
			if(res.success==true){
				_this.$vux.toast.show({
		            type: 'text',
		            text: dataObj.ordersequenceno+'打印成功',
		          })
				callback(res)
			}
		},(err)=>{
			_this.$vux.toast.show({
	            type: 'text',
	            text: res.message||'打印次数计数失败',
          })
		})
	},
	/**
	 * 365打印
	 */
	printInfo(data,_this,callback=null){
		let isShort = data.goodsInfoDTOS.some((i)=>{
			return i.diffNum>0
		})
		let printText='',printArray=[]
		printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:'\n\n欢迎光临'+data.shop.shopname+'\n'+'--------------------------------'})
		printArray.push({printSetData:{alignMode:1,charSize:1},printType:0,text:data.ordersequenceno+(data.deliverType==0 ?'-自提\n':'-配送')+(isShort ? '-已调整':'')})
		printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'--------------------------------\n订 单 号：'+
					data.id+'\n打印次数：'+data.printCount+'\n下单时间：'+ new Date(parseInt(data.finishTime)).format("yyyy-MM-dd hh:mm")+'\n'+
					'预约送达: '+new Date(parseInt(data.expectdeliverydatetime.date)).format("yyyy-MM-dd")+' '+data.expectdeliverydatetime.from+'-'+data.expectdeliverydatetime.to+'\n'	+							
					'收 货 人：'+data.recvinfo.name+'\n'+
					'联系电话：'+data.recvinfo.phone+'\n'+(data.deliverType==0 ?'':'收货地址：'+data.recvinfo.address.city+'-'+data.recvinfo.address.detail)})
		printArray.push({printSetData:{alignMode:0,charSize:1},printType:0,text:'备注：'+data.comment})
		printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'--------------------------------\n购买商品'})
		data.goodsInfoDTOS.forEach((e,index)=>{
			if(e.qty>0){
				printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:(index+1)+'.'+e.goodsName+'   '+e.desc})
				printArray.push({printSetData:{alignMode:2,charSize:1},printType:0,text:'X'+e.qty})
				printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:e.goodsBarCode})
				printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'单价￥'+e.saleprice+'金额￥'+(e.saleprice*e.qty)+'\n--------------------------------'})
			}
		})
		printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'商品金额：'+data.amount.goodsamount/100})
		printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'订单运费：'+data.amount.freightamount/100})
		printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'商品优惠：'+(data.amount.coupondiscountamount+data.amount.promotiondiscountamount)/100})
		printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'运费优惠：'+data.amount.freightpromotionamount/100+'\n--------------------------------'})
		printArray.push({printSetData:{alignMode:0,charSize:1},printType:0,text:'订单件数：'+data.amount.productcount/100})
		printArray.push({printSetData:{alignMode:0,charSize:0,feedLine:1},printType:0,text:'应收金额：'+data.amount.totalamount/100+'\n--------------------------------'})
		printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:'谢谢惠顾，欢迎再次光临 \n'+data.shop.address+'\n'+'配送时间:09:00 - 20:00\n联系客服：400-800-5050\n\n提货码:'+data.outerOrderId})
		printArray.push({printSetData:{alignMode:1,charSize:0,feedLine:1,isPrintTextCut:true,height:150,"modelSize":5},printType:1,text:data.outerOrderId})
		printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:"\n签名栏：\n\n\n--------------------------------\n\n"})
		printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:"开票码:\n"})
		printArray.push({printSetData:{alignMode:1,charSize:0,feedLine:1,isPrintTextCut:true,height:150,"modelSize":5},printType:2,text:data.obtaininvoiceurl})
		printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:"\n--------------------------------\n\n"})
		let datas = {datas:printArray}
		factory.print(datas).then((res)=>{
			callback();
		},(err)=>{
			_this.$vux.toast.show({
	            type: 'text',
	            text: data.ordersequenceno+'打印失败',
          })
		})
	},
	/**
	 * setPrintData：设置打印参数（一键打印时）
	 */
	setPrintData(dataList,callback=null){
		let printText='',printArray=[]
		dataList.forEach((data)=>{
			let isShort = data.goodsInfoDTOS.some((i)=>{
				return i.diffNum>0
			})
			printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:'\n\n欢迎光临'+data.shop.shopname+'\n'+'--------------------------------'})
			printArray.push({printSetData:{alignMode:1,charSize:1},printType:0,text:data.ordersequenceno+(data.deliverType==0 ?'-自提\n':'-配送')+(isShort ? '-已调整':'')})
			printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'--------------------------------\n订 单 号：'+
						data.id+'\n打印次数：'+data.printCount+'\n下单时间：'+ new Date(parseInt(data.finishTime)).format("yyyy-MM-dd hh:mm")+'\n'+
						'预约送达: '+new Date(parseInt(data.expectdeliverydatetime.date)).format("yyyy-MM-dd")+' '+data.expectdeliverydatetime.from+'-'+data.expectdeliverydatetime.to+'\n'	+							
						'收 货 人：'+data.recvinfo.name+'\n'+
						'联系电话：'+data.recvinfo.phone+'\n'+(data.deliverType==0 ?'':'收货地址：'+data.recvinfo.address.city+'-'+data.recvinfo.address.detail)})
			printArray.push({printSetData:{alignMode:0,charSize:1},printType:0,text:'备注：'+data.comment})
			printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'--------------------------------\n购买商品'})
			data.goodsInfoDTOS.forEach((e,index)=>{
				if(e.qty>0){
					printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:(index+1)+'.'+e.goodsName+'   '+e.desc})
					printArray.push({printSetData:{alignMode:2,charSize:1},printType:0,text:'X'+e.qty})
					printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:e.goodsBarCode})
					printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'单价￥'+e.saleprice+'金额￥'+(e.saleprice*e.qty)+'\n--------------------------------'})
				}
			})
			
			printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'商品金额：'+data.amount.goodsamount/100})
			printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'订单运费：'+data.amount.freightamount/100})
			printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'商品优惠：'+(data.amount.coupondiscountamount+data.amount.promotiondiscountamount)/100})
			printArray.push({printSetData:{alignMode:0,charSize:0},printType:0,text:'运费优惠：'+data.amount.freightpromotionamount/100+'\n--------------------------------'})
			printArray.push({printSetData:{alignMode:0,charSize:1},printType:0,text:'订单件数：'+data.amount.productcount/100})
			printArray.push({printSetData:{alignMode:0,charSize:0,feedLine:1},printType:0,text:'应收金额：'+data.amount.totalamount/100+'\n--------------------------------'})
			printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:'谢谢惠顾，欢迎再次光临 \n'+data.shop.address+'\n'+'配送时间:09:00 - 20:00\n联系客服：400-800-5050\n\n提货码:'+data.outerOrderId})
			printArray.push({printSetData:{alignMode:1,charSize:0,feedLine:1,isPrintTextCut:true,height:150,"modelSize":5},printType:1,text:data.outerOrderId})
			printArray.push({printSetData:{alignMode:1,charSize:0},printType:0,text:"\n签名栏：\n\n\n--------------------------------\n\n\n"})
		})	
		let datas = {datas:printArray}
		callback(datas)
	},
}