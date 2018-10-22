/* var u = navigator.userAgent, app = navigator.appVersion; 
 var isAndroidPlat = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器 
  function setupWebViewJavascriptBridge(callback) {
        //第一次调用这个方法的时候，为false
        if (window.cordova) {
            var result = callback(cordova);
            return result;
        }
        //第一次调用的时候，也是false
        if (window.WVJBCallbacks) {
            var result = window.WVJBCallbacks.push(callback);
            return result;
        }
        
        //把callback对象赋值给对象。
        window.WVJBCallbacks = [callback];
        //这段代码的意思就是执行加载WebViewJavascriptBridge_JS.js中代码的作用
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
            
        }, 0);
    }

    //setupWebViewJavascriptBridge执行的时候传入的参数，这是一个方法。
    function callback(bridge) {
        var uniqueId = 1
        //把WEB中要注册的方法注册到bridge里面
        bridge.registerHandler('OC调用JS提供的方法', function(data, responseCallback) {
            log('OC调用JS方法成功', data)
            var responseData = { 'JS给OC调用的回调':'回调值!' }
            log('OC调用JS的返回值', responseData)
            responseCallback(responseData)
            alert(3)
        })
    };
    //驱动所有hander的初始化
    setupWebViewJavascriptBridge(callback);
    
  function connectcordova(callback) {
        if (window.cordova) {
            callback(cordova)
        } else {
            document.addEventListener(
                'cordovaReady'
                , function() {
                    callback(cordova)
                },
                false
            );
        }
    }

    connectcordova(function(bridge) {
        bridge.init(function(message, responseCallback) {
            var data = {
                'Javascript Responds': '测试中文!'
            };

            if (responseCallback) {
                responseCallback(data);
            }
        });

        bridge.registerHandler("functionInJs", function(data, responseCallback) {
            if (responseCallback) {
                var responseData = "Javascript Says Right back aka!";
                responseCallback(responseData);
            }
        });
    })*/
   let e = 0;
const
  _MIDEA_COMMON = 'MideaCommon',
  _MIDEA_USER = 'MideaUser',
  _MIDEA_BARCODE = 'MideaBarcode',
  _MIDEA_BLUE = "BlueToothPlugin"
export default {
/**
 * 	截取字符串之前的0
 * @param {Object} name
 * @param {Object} method
 * @param {Object} params
 */
  callApi: function(name, params) {
    /**
     * 调用cordova的方法
     * @param name {string} 方法组、类别
     * @param method {string} 方法名称
     * @param params {Array} 参数
     * @return {promise}
     */
//  const _this=this;
    var promise = new Promise((resolve, reject) => {
      if (window.cordova) {
        try {
          cordova.callHandler(name,params || null,function(msg) {
            resolve(msg)
          }, function(msg) {
            reject("ERROR factory:"+msg)
          })
        } catch (e) {
        	alert("factory "+ e)
          reject(e)
        }
      } else {
        reject('Cordova is not exist')
      }
    })
    return promise
  },
  /**
   * 365print
   */
 print(data){
   	return this.callApi("print",data);
 },
  /**
   * 获取用户信息
   * 
   * @return {*|promise}
   */
  getUser: function() {
    return this.callApi('getUserInfo', null)
  },
  getAccessToken:function(){
  	return this.callApi('getAccessToken',null)
  },
  /**
   * 启动扫码
   * @return {*|promise}
   */
  scan: function() {
    return this.callApi('scan')
  },
  hideNav:function(){
  	return this.callApi('hideNav')
  },
  /**
   * 开启蓝牙
   */
  openBluetooth: function(){
		return this.callApi('openBluetooth',null);
  },
  /**
   * 获取蓝牙配对列表
   */
  getBlueList:function(){
  	return this.callApi('getBlueList',null)
  },
  /**
   * 连接蓝牙设备
   * @param {Object} param
   * var param = { btAddress: "蓝牙地址" //这里传入用户点击的目标蓝牙设备地址};
   */
  connectBlue:function(param){
	return this.callApi('connectBlue',param)
  	
  },
  
  /**
   * 打印文字
   * @param {Object} param
   * var param = {text: "小票：270500027719 收银员：010121212122121\n=======\n\n"};
   *  text是需要打印的小票内容，格式适配纸张的宽度，请结合业务需要使用\n换行符来换行调整
   *   小票之间的间隔也使用\n来打印空白行
   */
  printText:function(param){
		return this.callApi(_MIDEA_BLUE,"printText",[param])
  },
  /**
   * byte方式打印
   * @param {Object} param
   *  var param = {text: "27 33 -12 要打印的byte[] 数组"};
   */
  printBytes:function(param){
		return this.callApi(_MIDEA_BLUE,"printByte",[param])
  },
  /**
   * 打印二维码/条码
   * @param {Object} param
   * var param = {text: "我们都是好孩子09365",size: 10};
   * 
   */
  printQRCode:function(param){
		return this.callApi(_MIDEA_BLUE,"printQRCode",[param])
  },
  /**
   * 转byte数组
   * @param {Object} param
   *  var param = {text: "我们都是好孩子09365"};
   */
	string2Byte:function(param){
		return this.callApi(_MIDEA_BLUE,"string2Byte",[param])
	},
  
  /**
   * 退出应用
   * @return {*|promise}
   */
  exit: function() {
    return this.callApi('exit', null)
  },
 
  /**
   * 获取webview信息
   * @return {*|promise}
   */
  webview: function() {
    return this.callApi(_MIDEA_COMMON, 'webview', null)
  },
  /**
   * 获取屏幕信息
   * @return {*|promise}
   */
  screen: function() {
    return this.callApi(_MIDEA_COMMON, 'screen', null)
  },
  /**
   * 获取设备信息
   * @return {*|promise}
   */
  getDeviceInfo: function() {
    return this.callApi(_MIDEA_COMMON, 'getDeviceInfo', null)
  },
  /**
   * 打开通讯录
   * @return {*|promise}
   */
  getPhoneMan: function() {
    return this.callApi(_MIDEA_USER, 'getContact', null)
  },
  /**
   * 打开个人设置页面
   * @return {*|promise}
   */
  goPersonalSet: function() {
    return this.callApi(_MIDEA_COMMON, 'showSetView', null)
  },
  /**
   * 显示键盘
   * @return {*|promise}
   */
  showInput: function() {
    return this.callApi(_MIDEA_COMMON, 'showInput', null)
  },
  /**
   * 隐藏键盘
   * @return {*|promise}
   */
  hideInput: function() {
    return this.callApi(_MIDEA_COMMON, 'hideInput', null)
  },
  /**
   * 批量将图片转换成base64码
   * @param pictureList {array} 图片列表
   * @return {*|promise}
   */
  getBase64CodeFromPictures: function(pictureList) {
    return this.callApi(_MIDEA_COMMON , 'getBase64s', pictureList)
  },
  /**
   * @description 打电话（底座有bug）
   * @param phoneNumber {string}
   * @returns {Promise}
   */
  financeCall: function(phoneNumber) {
    return this.callApi(_MIDEA_COMMON, 'callPhone', [phoneNumber])
  },
    /**
   * 改变状态栏颜色-仅IOS
   * @param p {array} 参数 [r, g, b]
   * @return {*|promise}
   */
  changeColor: function(p) {
    return this.callApi(_MIDEA_COMMON, 'statusBarColor', p)
  },
}
