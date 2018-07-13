
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
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器 
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
		var isAndroid=false;
		/*alert('是否是Android：'+isAndroid); 
		alert('是否是iOS：'+isiOS);*/
		if(isAndroid){
			isAndroid=true;
		}else{
			isAndroid=false;
		}
		console.log("ppp")
		return isAndroid
	}
}