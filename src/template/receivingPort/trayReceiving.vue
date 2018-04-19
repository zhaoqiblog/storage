<template>
  <div class="tray-receiving">
    <x-header class="vux-1px-b">托盘收货</x-header>
    <div class="scroll-content">
      <div class="cm-store"><span>{{commonInfo.costName}}</span></div>
      <div class="summary">共{{palletData.length}}个托盘</div>
      <div class="list">
        <goods-top-info v-for="(item, index) in palletData" 
        	:key="index" 
        	:trayCode="item.palletCode" 
        	:skuCode="item.skuQuantity" 
        	:total="item.goodsQuantity" 
        	:sideslip="true" 
        	:deleteFunc="delTray.bind(this)"></goods-top-info>
      </div>
    </div>
    <div class="footer">
      <div class="btn-add" @click="scan()">
        <span>继续扫描托盘码</span>
      </div>
      <div class="btn-submit">
        <button type="button" @click="confirmReceiving()" :disabled="palletData.length==0">确认收货</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Scroller, XHeader } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory'
import $request from '@/service/request.js'
export default {
  components: {
    Scroller,
    XHeader
  },
  name: 'trayReceiving',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
    costCenterNum: state => state.global.commonInfo.costNumber // 成本中心
  }),
  data() {
    return {
      palletData: []
    }
  },
  created() {
    this.getPalletInfo(this.$route.query.scanResult)
  },
  methods: {
    getPalletInfo (palletCode) {
      if(this.palletData.filter(function(item){
        return item.palletCode.toUpperCase() === palletCode.toUpperCase()
      }).length > 0) {
        this.$vux.toast.show({
          type: 'text',
          text: '该托盘已经添加过了'
        })
      } else {
        $request.get('/api/receive-goods/v1/protected/queryPallet', {
          palletCode: palletCode,
          costCenterNum: this.costCenterNum
        }).then(res => {
          if(res.success) {
            this.palletData.push(res.data)
          } else {
            this.$router.push({path:'/fail',query:{text: res.message,title: '托盘收货',info: '', path: {name: 'scanEntry', query: {key: 'receive'}}}})
          }
        })
      }
    },
    scan () {
      factory.scan().then(res => {
        this.getPalletInfo(res.text)
      })
    },
    /**
     * 确认收货
     */
    confirmReceiving () {
      $request.post('/api/receive-goods/v1/protected/confirmReceive?palletCodes=' + this.palletData.map(res => res.palletCode).join(',') + '&costCenterNum=' + this.costCenterNum).then(res => {
        if(res.success) {
          this.$router.push({path:'/success',query:{text: '收货成功',title: '托盘收货',info: '', path: {name: 'scanEntry', query: {key: 'receive'}}}})
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 删除某个托盘
     * @param  {Number} index 要删除的托盘
     */
    delTray (index) {
      this.palletData.splice(index, 1)
    }
  }
}

</script>
<style lang="less" scoped>
.cm-store {
  line-height: 40px;
  background-color: #fff;
  text-align: center;
  font-size: 14px;
  color: #303030;
}
.tray-receiving {
  .summary {
    color: #999;
    font-size: 14px;
    padding: 18px 24px;
    line-height: 1;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 16px;
    display: flex;
    height: 48px;
    .btn-add, .btn-submit {
      flex: 1;
      height: 100%;
    }
    .btn-add {
      background-color: #fff;
      color: #3DA5FE;
      span {
        padding-left: 25px;
        background: url('../../assets/common/icon_scanblue.png') left no-repeat;
        background-size: 16px;
        line-height: 48px;
      }
    }
    .btn-submit {
      button {
        background-color: transparent;
        border: none;
        font-size: 16px;
        color: #fff;
        width: 100%;
        height: 100%;
        background-color: #3DA5FE;
        &:disabled {
          background-color: #c7c7c7;
        }
      }
    }
  }
}
</style>
