
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
        if(sh==top+ch) {
          // 触发加载数据
					callback()
        }
      })
    }
}