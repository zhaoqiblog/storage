import Vue from 'vue'
import Axios from 'axios'
import Jsonp from 'jsonp'
import Qs from 'qs/dist/qs'
import CONFIG from 'configuration';
import store from '../vuex/store'

//Axios.defaults.timeout = 100000;
Axios.defaults.withCredentials = true; //默认跨越
Axios.defaults.headers['Content-Type'] = 'application/json';

Axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

Axios.defaults.baseURL = CONFIG.baseUrl;


Axios.interceptors.request.use((config) => {
  Vue.$vux.loading.show({
    text: '加载中'
  })
//console.log(store.getters.getCommonInfo)
  if(store.getters.getCommonInfo.id) {
    config.headers['userName'] = store.getters.getCommonInfo.id
    config.headers['costNumber'] = store.getters.getCommonInfo.costNumber
  }else{
  	config.headers['userName'] = CONFIG.userTest.uid
  	config.headers['costNumber'] = store.getters.getCommonInfo.costNumber
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

Axios.interceptors.response.use((res) => {
  Vue.$vux.loading.hide()
  if (res.status != 200) {
    return Promise.reject(res);
  } else if(res.data.success === null || res.data.success === undefined) {
    Vue.$vux.toast.show({
      type: 'text',
      text: '接口调用错误'
    })
  } else {
    return Promise.resolve(res.data);
  }
}, (error) => {
  Vue.$vux.loading.hide()
  Vue.$vux.toast.show({
    type: 'text',
    text: error.response.data.error
  })
  return Promise.reject(error);
})

const request = {
  get(url, params) {
    var obj = {
      params: params
    }
    return Axios.get(url, obj)
  },
  delete(url, params) {
    var obj = {
      params: params
    }
    return Axios.delete(url, obj)
  },
  post(url, params) {
    return Axios.post(url, params)
  },
  post_formdata(url, params) {
    return Axios.post(url, params, {
      headers: {
        'content-type': 'multipart/form-data; charset=UTF-8'
      }
    })
  },
  post_payload(url, params) {
    return Axios.post(url, Qs.stringify(params), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })
  },
  post_json(url, params) {
    return Axios.post(url, params, {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    })
  },
  put(url, params) {
    return Axios.put(url, params)
  },
  jsonp(url, params) {
    url += (url.indexOf('?') > -1 ? '&' : '?') + Qs.stringify(params)
    var promise = new Promise((resolve, reject) => {
      Jsonp(url, null, function(error, result) {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      });
    });
    return promise
  }
}

export default request;
