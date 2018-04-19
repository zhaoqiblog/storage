
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
    return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17)} 
}