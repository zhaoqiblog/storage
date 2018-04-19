import Vue from 'vue'
import factory from '../factory'
import store from '../vuex/store'
import $request from './request'
import $conf from 'configuration'
import $requestUri from './requestUri.js'

let service = {
  getUser() {
    return new Promise((resolve, reject) => {
      let user = store.getters.user
      if (user) {
        // 如果存在缓存，直接resolve缓存
        resolve(user)
      } else {
        if (window.cordova) {
          // 不存在缓存的情况下，调用底座接口获取
          factory.getUser().then(function(response) {
            if (response) {
              // 缓存用户信息
              store.commit('updateUser', response)
            }
            resolve(response);
          }, function() {
            reject('获取用户失败')
          });
        } else {
          store.commit('updateUser', $conf.userTest)
          resolve($conf.userTest);
        }
      }
    })
  },
  setLoginName(respond, params) {
    var uid = respond.uid || ($conf.product ? '' : $conf.userTest.uid)
    this.setHolderValue(params, $conf.uidPlaceholder, uid)
    return params
  },
  setToken(respond, params) {
    var ssoToken = respond.ssoToken || ($conf.product ? '' : $conf.userTest.ssoToken)
    this.setHolderValue(params, $conf.ssoTokenPlaceholder, ssoToken)
    return params
  },
  setHolderValue(object, placeholder, value) {
    for (var key in object) {
      if (object[key] === placeholder) {
        var reg = new RegExp(placeholder, 'g')
        object[key] = object[key].replace(reg, value)
      }
    }
  },

  request(key, params, option) {
    Vue.$vux.loading.show();
    key = key || ''
    params = params || {}
    option = option || {}

    let
      config = {},
      url = key,
      baseUrl = option.hasOwnProperty('baseUrl') ? option.baseUrl : $conf.baseUrl,
      keyExtend = option.hasOwnProperty('keyExtend') ? option.keyExtend : '',
      urlParams = option.hasOwnProperty('urlParams') ? option.urlParams : {},
      logError = (msg, status, headers, config_) => {
        try {
          var err = {}
          err.err = 1
          err.key = key
          err.params = params
          err.msg = msg
          err.status = status
          err.headers = headers
          err.config = config_
          Vue.$vux.loading.hide();
          return err
        } catch (e) {
          return e
        }
      }

    if ($conf.isMock) {
      url = $conf.mockPath + key + '.json'
    } else {
      if (url && url.indexOf('http://') < 0 && url.indexOf('https://') < 0 && $requestUri && $requestUri.hasOwnProperty(key)) {
        url = baseUrl + $requestUri[key]
      }
    }

    if ($conf.isMock) {
      config = Vue.copy(option, {
        method: 'get'
      });
    } else {
      config = Vue.copy({
        method: 'JSONP'
      }, option);
    }

    let self = this;
    return this.getUser().then(function(respond) {
      if (respond) {
        self.setLoginName(respond, params);
        self.setToken(respond, params);
      }

      // 根据不同的请求方式，使用不同的请求方法
      if (config.method == 'POST_FORMDATA') {
        // 'Content-Type'为 'multipart/form-data; charset=UTF-8'
        var fd = new FormData()
        for (var i in params) {
          fd.append(i, params[i])
        }
        return new Promise((resolve, reject) => {
          $request.post_formdata(url, fd).then(
            result => {
              resolve(result.data)
              Vue.$vux.loading.hide()
            },
            logError
          )
        })
      } else if (config.method === 'POST_PAYLOAD') {
        // 'Content-Type'为 'application/x-www-form-urlencoded; charset=UTF-8'
        return new Promise((resolve, reject) => {
          $request.post_payload(url, params).then(
            result => {
              resolve(result.data)
              Vue.$vux.loading.hide();
            },
            logError
          )
        })
      } else if (config.method == 'post' || config.method == 'POST_JSON') {
        if (config.method == 'POST_JSON') {
          params = JSON.stringify(params)
        }

        return new Promise((resolve, reject) => {
          $request.post_json(url, params).then(
            result => {
              resolve(result.data)
              Vue.$vux.loading.hide()
            },
            logError
          )
        })
      } else if (config.method == 'get') {
        return new Promise((resolve, reject) => {
          $request.get(url, params).then(
            result => {
              resolve(result.data)
              Vue.$vux.loading.hide()
            },
            logError
          )
        })
      } else if (config.method == 'delete') {
        return new Promise((resolve, reject) => {
          $request.delete(url, params).then(
            result => {
              resolve(result.data)
              Vue.$vux.loading.hide()
            },
            logError
          )
        })
      } else {
        return new Promise((resolve, reject) => {
          $request.jsonp(url, params).then(
            result => {
              resolve(result.data)
              Vue.$vux.loading.hide()
            },
            logError
          )
        })
      }
    })
  },
  /* 自定义方法 start */
  signList(params) {
    return this.request('signList', params, {
      method: 'POST_PAYLOAD'
    })
  },
  // 获取本地可配置选择器数据
  getSelectData(params) {
    return this.request('selectData', params, {
      method: 'POST_JSON'
    })
  }
}

export default service
