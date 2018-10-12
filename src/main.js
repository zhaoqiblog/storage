// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 var u = navigator.userAgent, app = navigator.appVersion; 
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
    })
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import $conf from 'configuration'
import { LoadingPlugin } from 'vux'
import fastclick from 'fastclick'
import $request from './service/request.js'

import components from './components/MGoodsInfo';
Vue.use(components);

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(LoadingPlugin);
import { ToastPlugin, AlertPlugin, ConfirmPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.prototype.$toastPostion = $conf.toastPostion
/*
 * @param {Object} target 目标对象。
 * @param {Object} source 源对象。
 * @param {boolean} deep 是否复制(继承)对象中的对象。
 * @returns {Object} 返回继承了source对象属性的新对象。
 */
Vue.copy = function(target, source, deep) {
  target = target || {};
  var sType = typeof source,
    i = 1,
    options
  if (sType === 'undefined' || sType === 'boolean') {
    deep = sType === 'boolean' ? source : false
    source = target
    target = this
  }
  if (typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]')
    source = {}
  while (i <= 2) {
    options = i === 1 ? target : source
    if (options != null) {
      for (var name in options) {
        var src = target[name],
          copy = options[name]
        if (target === copy)
          continue;
        if (deep && copy && typeof copy === 'object' && !copy.nodeType)
          target[name] = this.copy(src ||
            (copy.length != null ? [] : {}), copy, deep)
        else if (copy !== undefined)
          target[name] = copy
      }
    }
    i++;
  }
  return target;
};
let init = () => {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
}

var u = navigator.userAgent
var isRunBeforeCordova = $conf.product && /MissonWebKit/.test(u) && window.location.href.indexOf("http") === -1
Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}
if (window.cordova || isRunBeforeCordova) {
  document.addEventListener('deviceready', init, false)
} else {
  init()
}
