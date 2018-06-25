const
  _MIDEA_COMMON = 'MideaCommon',
  _MIDEA_USER = 'MideaUser',
  _MIDEA_BARCODE = 'MideaBarcode',
  _MIDEA_MAP = 'MideaMap',
  _MIDEA_ANNTO = 'MideaAnnto',
  _MIDEA_SALE = 'MideaSale',
  _MIDEA_PDF = "MideaPdf",
  _MIDEA_ORG = "Organization"

export default {
/**
 * 	截取字符串之前的0
 * @param {Object} name
 * @param {Object} method
 * @param {Object} params
 */
	spistr(str){
		var arr = str.split("");
		if(arr[0]!=="0"){
			return str
		}else{
			return this.spistr(arr.slice(1).join(""))
		}
	},
  callApi: function(name, method, params) {
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
          cordova.exec(function(msg) {
            resolve(msg)
          }, function(msg) {
            reject(msg)
          }, name, method, params || [])
        } catch (e) {
          console.log('_error', 'widget error:', e)
          reject(e)
        }
      } else {
        console.log('_debug', 'Cordova is not exist')
        reject('Cordova is not exist')
      }
    })

    return promise
  },
  /**
   * 验证密码，主要用于hr自助认证
   * @return {promise}
   */
  password: function() {
    return this.callApi(_MIDEA_COMMON, 'authPassword').then(function(message) {
        if (message === 0) {
          this.password()
        } else if (message === -1) {
          this.exit()
        }
      })
  },
  /**
   * 显示菜单
   * @return {*|promise}
   */
  showMenu: function() {
    return this.callApi(_MIDEA_COMMON, 'showMenu', null)
  },
  /**
   * 显示导航
   * @return {*|promise}
   */
  showNav: function() {
    return this.callApi(_MIDEA_COMMON, 'showNav', null)
  },
  /**
   * 隐藏导航
   * @return {*|promise}
   */
  hideNav: function() {
    return this.callApi(_MIDEA_COMMON, 'hideNav', null)
  },
  /**
   * 退出应用
   * @return {*|promise}
   */
  exit: function() {
    return this.callApi(_MIDEA_COMMON, 'exit', null)
  },
  /**
   * 后退
   * @return {*|promise}
   */
  goBack: function() {
    return this.callApi(_MIDEA_COMMON, 'goBack', null)
  },
  /**
   * 部门单选
   * @return {*|promise}
   */
  departmentChoose: function() {
    return this.callApi(_MIDEA_USER, 'departmentChoose', null)
  },
  /**
   * 开始监听手机摇动
   * @return {*|promise}
   */
  shake: function() {
    return this.callApi(_MIDEA_COMMON, 'shake', null)
  },
  /**
   * 停止监听手机摇动
   * @return {*|promise}
   */
  shakeStop: function() {
    return this.callApi(_MIDEA_COMMON, 'shakeStop', null)
  },
  /**
   * 显示悬浮菜单
   * @return {*|promise}
   */
  showFloat: function() {
    return this.callApi(_MIDEA_COMMON, 'showFloat', null)
  },
  /**
   * 隐藏悬浮菜单
   * @return {*|promise}
   */
  hideFloat: function() {
    return this.callApi(_MIDEA_COMMON, 'hideFloat', null)
  },
  /**
   * 获取当前语言
   * @return {*|promise}
   */
  language: function() {
    return this.callApi(_MIDEA_COMMON, 'language', null)
  },
  /**
   * 获取用户信息
   * @return {*|promise}
   */
  getUser: function() {
    return this.callApi(_MIDEA_USER, 'getUser', null)
  },
  /**
   * 获取用户信息-直通宝
   * @return {*|promise}
   */
  getUserMap: function() {
    return this.callApi(_MIDEA_USER, 'getUserMap', null)
  },
  /**
   * 启动扫码
   * @return {*|promise}
   */
  scan: function() {
    return this.callApi(_MIDEA_BARCODE, 'scan', null)
  },
  scans:function(){
  	return this.scans().then(function(res,errs){
  		return  new Promise((resolve,reject)=>{ 			
  			resolve(res)
  		});
  	})
  },
  /**
   * 启动扫码
   * @return {*|promise}
   */
  scanNow: function() {
    return this.callApi(_MIDEA_BARCODE, 'scanNow', null)
  },
  /**
   * 获取扫码结果
   * @return {*|promise}
   */
  getScanExtra: function() {
    return this.callApi(_MIDEA_BARCODE, 'getScanExtra', null)
  },
  /**
   * 获取位置信息
   * @param arr {array} 参数
   * @return {*|promise}
   */
  location: function(arr) {
    return this.callApi(_MIDEA_MAP, 'location', arr)
  },
  /**
   * 开始更新位置信息
   * @param arr {array} 参数
   * @return {*|promise}
   */
  startUpdatingLocation: function(arr) {
    return this.callApi(_MIDEA_MAP, 'startUpdatingLocation', arr)
  },
  /**
   * 停止更新位置信息
   * @return {*|promise}
   */
  stopUpdatingLocation: function() {
    return this.callApi(_MIDEA_MAP, 'stopUpdatingLocation', null)
  },
  /**
   * 导航
   * @param arr {array} 参数
   * @return {*|promise}
   */
  navigation: function(arr) {
    return this.callApi(_MIDEA_MAP, 'navTo', arr)
  },
  /**
   * 开启订单跟踪-直通宝
   * @param p {array} 参数
   * @return {*|promise}
   */
  startOrder: function(p) {
    return this.callApi(_MIDEA_ANNTO, 'startOrder', p)
  },
  /**
   * 结束订单跟踪-直通宝
   * @param p {array} 参数
   * @return {*|promise}
   */
  stopOrder: function(p) {
    return this.callApi(_MIDEA_ANNTO, 'stopOrder', p)
  },
  /**
   * 拍照或选择图片
   * @param params {object} 参数
   * @return {*}
   */
  getPicture: function(params) {
    var promise = new Promise((resolve, reject) => {
      try {
        navigator.camera.getPicture(function(msg) {
            resolve(msg)
          }, function(msg) {
            reject(msg)
          },
          params)
      } catch (e) {
        console.log('_warn', 'Cordova maybe not exist.')
        reject(e)
      }
    })
    return promise
  },
  /**
   * 获取通讯录
   * @param fields {string} 查找内容
   * @param options {array} 参数
   * @return {*}
   */
  getContact: function(fields, options) {
    var promise = new Promise((resolve, reject) => {
      try {
        navigator.service.contacts.find(fields,
          function(msg) {
            resolve(msg)
          }, function(msg) {
            reject(msg)
          },
          params)
      } catch (e) {
        console.log('_warn', 'Cordova maybe not exist.')
        reject(e)
      }
    })

    return promise
  },
  /**
   * 组织架构单选
   * @return {*|promise}
   */
  orgChoose: function() {
    return this.callApi(_MIDEA_USER, 'orgChoose', null)
  },
  /**
   * 组织架构多选
   * @param p {array} 参数
   * @return {*|promise}
   */
  orgMuChoose: function(p) {
    return this.callApi(_MIDEA_USER, 'orgMuChoose', p)
  },
  /**
   * 改变状态栏颜色-仅IOS
   * @param p {array} 参数 [r, g, b]
   * @return {*|promise}
   */
  changeColor: function(p) {
    return this.callApi(_MIDEA_COMMON, 'statusBarColor', p)
  },
  /**
   * 登出，注销用户
   * @return {*|promise}
   */
  logout: function() {
    return this.callApi(_MIDEA_COMMON, 'logout', null)
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
   * 获取额外启动参数
   * @param params {array} 参数
   * @return {*|promise}
   */
  getExtra: function(params) {
    return this.callApi(_MIDEA_COMMON, 'getExtra', params)
  },
  /**
   * 获取设备信息
   * @return {*|promise}
   */
  getDeviceInfo: function() {
    return this.callApi(_MIDEA_COMMON, 'getDeviceInfo', null)
  },
  /**
   * 用外部浏览器打开链接
   * @param url {string} 链接地址url
   * @return {*|promise}
   */
  openUrl: function(url) {
    return this.callApi(_MIDEA_COMMON, 'openSysBrowser', [url])
  },
  /**
   * h5事件监听
   * @param params {array} 参数
   * @return {*|promise}
   */
  statistics: function(params) {
    return this.callApi(_MIDEA_COMMON, 'onEvent', params)
  },
  /**
   * 分享
   * @param params {array} 参数
   * @return {*|promise}
   */
  share: function(params) {
    return this.callApi(_MIDEA_COMMON, 'share', params)
  },
  /**
   * 打开应用页面
   * @return {*|promise}
   */
  showAppView: function() {
    return this.callApi(_MIDEA_COMMON, 'showAppView', ['messageView'])
  },
  /**
   * 打开时间日期选择
   * @param params {array} 参数
   * @return {*}
   */
  showPicker: function(params) {
    var promise = new Promise((resolve, reject) => {
      if (window.datePicker) {
        params = angular.extend({
          date: new Date(),
          mode: 'date',
          type: 'day'
        }, params)

        datePicker.show(params, function(date) {
          resolve(date)
        })
      } else {
        reject()
      }
    })
    return promise
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
   * 打开“我的”页面
   * @return {*|promise}
   */
  goMyView: function() {
    return this.callApi(_MIDEA_COMMON, 'showMyView', null)
  },
  /**
   * 打开widget
   * @param params {array} 参数
   * @return {*|promise}
   */
  showWidget: function(params) {
    return this.callApi(_MIDEA_COMMON, 'showWidget', params)
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
   * 打开消息页面
   * @return {*|promise}
   */
  showMessageView: function() {
    return this.callApi(_MIDEA_COMMON, 'showAppView', ['messageView'])
  },
  /**
   * 打开美的通导购的意见反馈
   * @return {*|promise}
   */
  showFeedback: function() {
    return this.callApi(_MIDEA_SALE, 'showFeedback', null)
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
   * 跳转到系统设置页面，
   * @param arr arr[0]为要跳转的对应的设置页面，暂时支持  蜂窝网络：CellularNetWork，WIFI：WIFI
   * @returns {*}
   */
  gotoSystemSetting: function(arr) {
    return this.callApi(_MIDEA_COMMON , 'gotoSystemSetting', arr)
  },
  /**
   * 附件展示
   * @param param {array} 附件链接url列表
   * @return {Promise}
   */
  showPdf: function (param) {
    return this.callApi(_MIDEA_PDF, 'showPdf',param)
  },
  /**
   * 附件txt展示
   * @param param {array} 参数
   * @return {Promise}
   */
  showTxt: function (param) {
    return this.callApi(_MIDEA_PDF, 'showTxt',param)
  },
  /**
   * @description c4a对称加密
   * @param params {string} 字符串
   * @returns {Promise}
   */
  financeAesEncrypt: function(params) {
    return this.callApi('MideaFinancePlugin', 'AESEncrypt', [params])
  },
  /**
   * @description c4a对称解密
   * @param params {string} 字符串
   * @returns {Promise}
   */
  financeAesDecrypt: function(params) {
    return this.callApi('MideaFinancePlugin', 'AESDecrypt', [params])
  },
  /**
   * @description c4a非对称加密
   * @param params {string} 字符串
   * @returns {Promise}
   */
  financeRsaEncrypt: function(params) {
    return this.callApi('MideaFinancePlugin', 'RSAEncrypt', [params])
  },
  /**
   * @description c4a非对称解密
   * @param params {string}
   * @returns {Promise}
   */
  financeRsaDecrypt: function(params) {
    return this.callApi('MideaFinancePlugin', 'RSADecrypt', [params])
  },
  /**
   * @description 返回c4a获取密钥的url
   * @param params {object} 对象，{baseUrl，keygroup，keyversion}
   * @returns {Promise}
   */
  financeSecurityKey: function(params) {
    return this.callApi('MideaFinancePlugin', 'getSecurityKeyUrl', [params])
  },
  /**
   * @description 获取底座密码
   * @returns {Promise}
   */
  financeUserPassWord: function() {
    return this.callApi(_MIDEA_USER, 'getUserPassword', [])
  },
  /**
   * @description 美的金融保存json
   * @param key {string}
   * @param value {string}
   * @returns {Promise}
   */
  financeSaveJson: function(key, value) {
    return this.callApi('MideaFinancePlugin', 'saveJson', [key, value])
  },
  /**
   * @description 美的金融读取json
   * @param key {string}
   * @returns {Promise}
   */
  financeGetJson: function(key) {
    return this.callApi('MideaFinancePlugin', 'getJson', [key])
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
   * @description 获取美的金融底座版本信息
   * @param params {string}
   * @returns {Promise}
   */
  financeGetVersionInfo: function(params) {
    return this.callApi('MideaFinancePlugin', 'getVersionInfo', [params])
  },
  /**
   * @description 更新美的金融底座版本
   * @param params {string}
   * @returns {Promise}
   */
  financeUpdateApp: function(params) {
    return this.callApi('MideaFinancePlugin', 'updateApp', [params])
  },
  fetchDepart: function(param) {
    return this.callApi(_MIDEA_ORG, 'fetchDepart', [param]);
  }
}
