<template>
  <div class="scan-entry">
    <x-header class="vux-1px-b" :left-options="{preventGoBack: true}" @on-click-back="back()">{{data[key].header.title}}<a slot="right" v-if="data[key].header.headerRt" @click="headerRtClick()">{{data[key].header.headerRt.name}}</a></x-header>
    <div class="scroll-content">
      <div class="store-wrap">
        <div class="cm-store"><span>{{commonInfo.costName}}</span></div>
      </div>
      <div class="img">
        <img :src="data[key].scanButton.icons">
      </div>
      <div class="btn-wrap">
        <div class="text-wrap">
          <div class="input-box"><input type="text" v-model.trim="code" :placeholder="'请输入' + data[key].scanButton.name"></div>
          <div class="btn-confirm-box"><button type="button" :disabled="code === ''" @click="confirm()">确定</button></div>
        </div>
        <div class="btn-scan" @click="scan()"><span>请扫描{{data[key].scanButton.name}}</span></div>
        <router-link class="link" :to="item.to" v-for="(item, index) in data[key].linkButton" :key="index">{{item.name}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory'
export default {
  components: {
    XHeader
  },
  name: 'scanEntry',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
      key: '',
      code: '',
      data: {
        /**
         * 收货口
         */
        receive: {
          header: { title: '托盘收货' },
          scanButton: { name: '托盘二维码', to: 'trayReceiving', icons: require('../../assets/scan/pic_scantuopan.png') }
        },
        sampling: {
          header: { title: '托盘抽检' },
          scanButton: { name: '托盘二维码', to: 'sampling', icons: require('../../assets/scan/pic_scantuopan.png') }
        },
        /**
         * 卖场
         */
        shopSupplying: {
          header: { title: '卖场补货', headerRt: { name: '我的补货', to: 'shop/supply' }},
          scanButton: { name: '商品二维码', to: 'addProduct',icons: require('../../assets/scan/pic_scanshangpin1.png') }
          // linkButton: [{ name: '我的补货', to: 'shop/supply' }]
        },
        shopReturnWarehouse: {
          header: { title: '卖场还货', headerRt: { name: '我的还货', to: 'shop/shopReturnList' }},
          scanButton: { name: '商品二维码', to: 'shopReturnAdd',icons: require('../../assets/scan/pic_scanshangpin1.png') }
        },
        /*
         * 周转区
         */
        trayStorage:{
        	 header: { title: '托盘入库' },
          scanButton: { name: '托盘二维码', to: 'associated',icons: require('../../assets/scan/pic_scantuopan.png') }
        },
        goodsTostore:{  //商品入库
        	 header: { title: '商品入库' },
          scanButton: { name: '托盘二维码/订单号', to: 'selectGoods',icons: require('../../assets/scan/pic_scantuopan.png') }
        },
        /*
         * 后场
         */
         inventory:{  //库位盘点
        	 header: { title: '库位盘点' },
          scanButton: { name: '库位二维码', to: 'inventory',icons: require('../../assets/scan/pic_scankuwei.png') }
        },
         selectMergeGoods:{  //库位合并
        	 header: { title: '库位合并' },
          scanButton: { name: '库位二维码', to: 'selectMergeGoods',icons: require('../../assets/scan/pic_scankuwei.png') }
        },
        woreHouse:{  //仓库补货
        	 header: { title: '仓库补货', headerRt: { name: '我的补货', to: 'backCount/replenishmentList' } },
          scanButton: { name: '库位二维码', to: 'addWoreHouse',icons: require('../../assets/scan/pic_scankuwei.png') }
        },
        /**
         * 直送
         * */
        directOrderInfo:{
        	header:{title:'直送收货'},
          scanButton: { name: '订单编号', to: 'directOrderInfo',icons: require('../../assets/scan/pic_scanshangpin1.png') }
        },
        /**
         * 前置仓
         */
        preSupply:{
        	header:{title:'卖场补货至前置仓',headerRt: { name: '我的补货', to: 'preWorehouse/shopHistoryList'}},
        	scanButton:{name:'商品二维码',to:'shopAdd',icons:require('../../assets/scan/pic_scanshangpin1.png')}
        },
        wareHouseAdd:{
        	header:{title:'后场补货至前置仓',headerRt: { name: '我的补货', to: 'preWorehouse/shopHistoryList'}},
        	scanButton:{name:'库位二维码',to:'wareHouseAdd',icons:require('../../assets/scan/pic_scankuwei.png')}
        },
        /*前置仓商品互换*/
       preExchange:{
       	header:{title:'前置仓商品'},
       	scanButton:{name:'商品二维码',to:'preGoodsInfo',icons:require('../../assets/scan/pic_scanshangpin1.png')}
       }
      }
    }
  },
  created () {
    this.key = this.$route.query.key
    this.code = ''
  },
  methods: {
    /**
     * 手机扫描
     */
    scan () {
      if(window.cordova) {
        factory.scan().then(res => {
          this.$router.push({ name: this.data[this.key].scanButton.to, query: { scanResult: res.text }})
        })
      } else {
           this.$router.push({ name: this.data[this.key].scanButton.to, query: { scanResult: '6903244958103' }})   //2311189000001/2304013000001/6951881113720
//      this.$router.push({ name: this.data[this.key].scanButton.to, query: { scanResult: '6907992822730' }})  //4031362199/4031361913/4031193610
//         this.$router.push({ name: this.data[this.key].scanButton.to, query: { scanResult: '101' }})
//         this.$router.push({ name: this.data[this.key].scanButton.to, query: { scanResult: 'P0059342' }}) //P0058891/P0024259/P0059342
      }
    },
    /**
     * 输入二维码
     */
    confirm () {
      this.$router.push({ name: this.data[this.key].scanButton.to, query: { scanResult: this.code }})
    },
    headerRtClick () {
      this.$router.push(this.data[this.key].header.headerRt.to)
    },
    back () {
      this.$router.push({path: '/'})
    }
  },
  activated () {
    this.key = this.$route.query.key
    this.code = ''
  }
}

</script>
<style lang="less">
.scan-entry {
  input {
    &:focus {
      outline: none;
    }
  }
  .scroll-content {
    background-color: #fff;
  }
  .cm-store {
    line-height: 40px;
    background-color: #fff;
    text-align: center;
    font-size: 14px;
    color: #303030;
  }
  .store-wrap {
    background-color: #f4f4f4;
    padding-bottom: 10px;
  }
  .img {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-65%);
    img {
      max-width: 66.67%;
    }
  }
  .btn-wrap {
    position: absolute;
    bottom: 0;
    padding: 0 15px;
    width: 100%;
    box-sizing: border-box;
    .text-wrap {
      display: flex;
      margin-bottom: 20px;
      .input-box {
        flex: 1;
        margin-right: 8px;
        input {
          width: 100%;
          font-size: 16px;
          height: 40px;
          line-height: 22px;
          padding: 9px 15px;
          box-sizing: border-box;
          background-color: #F4F4F4;
          border: none;
          border-radius: 20px;
        }
        ::-webkit-input-placeholder {
          color: #C7C7C7;
        }
      }
      .btn-confirm-box {
        button {
          width: 70px;
          height: 40px;
          border-radius: 40px;
          text-align: center;
          color: #fff;
          background-color: #3DA5FE;
          border: none;
          &:active {
            background-color: #3183CB;
          }
          &:disabled {
            background-color: #C7C7C7;
          }
        }
      }
    }
    .btn-scan, .link {
      line-height: 40px;
      border-radius: 40px;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-scan {
      color: #fff;
      background-color: #3DA5FE;
      &:active {
        background-color: #3183CB;
      }
      span {
        padding-left: 24px;
        background: url('../../assets/common/icon_scan.png') center left no-repeat;
        background-size: 16px;
      }
    }
    .link {
      color: #fff;
      background-color: #FFA948;
      display: block;
      &:active {
        background-color: #FDC163;
      }
    }
  }
}
</style>
