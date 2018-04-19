<template>
  <div class="backorder-addlist">
    <x-header class="vux-1px-b">返配清单</x-header>
    <div class="scroll-content" ref="scrollWrap">
      <div class="cm-store"><span>{{commonInfo.costName}}</span></div>
      <popup-picker class="backorder-sel" :title="'返配库位'" :show-name="true" :data="backorderList" v-model="currBackorderStorage" :placeholder="'点击选择'"></popup-picker>
      <div class="prolist">
        <goods-info-item :class="{active: LocationProId === item.goodsBarCode}" :id="'a' + item.goodsBarCode" v-for="(item, index) in data"
          :key="index"
          :code="item.goodsBarCode"
          :name="item.goodsName"
          :type="'input'"
          v-model="item.supplyNum"
          :sideslip="true"
          :deleteFunc="goodsInfoItemDelete.bind(this,index)"
          @change="listChange">
        </goods-info-item>
      </div>
    </div>
    <div class="cm-footer">
      <div class="btn-add" @click="scan()">
        <span>继续扫描</span>
      </div>
      <div class="btn-submit">
        <button type="button" @click="backorderSubmit()" :disabled="notSubmit || currBackorderStorage.length == 0">提交返配申请</button>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, PopupPicker } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
export default {
  components: {
    XHeader,
    PopupPicker
  },
  name: 'backOrderList',
  computed: {
    ...mapState({
      commonInfo: state => state.global.commonInfo // 用户信息
    })
  },
  data() {
    return {
      notSubmit: false,
      currBackorderStorage: [], // 当前选中的返配库位
      backorderList: [], // 返配库位列表
      data: [], // 返配清单
      LocationProId: ''
    }
  },
  created() {
    // 获取返配库位
    this.getBackorderList()
    this.getProductInfo(this.$route.query.scanResult)
  },
  methods: {
    /**
     * 获取返配库位列表
     */
    getBackorderList () {
      $request.get('/api/sys-warehouse/v1/protected/queryWarehouses', {
        isReturnPlace: 1,
        costCenterNum: this.commonInfo.costNumber
      }).then(res => {
        if (res.success) {
          if(res.data) {
            let list = []
            res.data.forEach(function(item) {
              list.push({
                name: item.warehousePlaceName,
                value: item.warehousePlaceCode
              })
            })
            this.backorderList.push(list)
            this.listChange()
          }
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 根据商品条码获取商品信息
     */
    getProductInfo (barCode) {
      this.LocationProId = ''
      $request.get('/api/product-query/v1/protected/queryProductInfo', {
        goodsBarCode: barCode,
        costCenterNum: this.commonInfo.costNumber
      }).then(res => {
        if(res.success) {
          if(res.data) {
            this.data.push({
              goodsCode: res.data.goodsid,
              goodsBarCode: res.data.bar_code,
              goodsName: res.data.goodsname,
              supplyNum: 1
            })
            this.listChange()
          }
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 扫描添加商品
     */
    scan () {
      if(window.cordova) {
        factory.scan().then(res => {
          if(this.data.filter(function(item) {
            return item.goodsBarCode === res.text
          }).length > 0) {
            this.$vux.toast.show({
              type: 'text',
              text: '该商品已经在列表中',
              width: '9em'
            })
            this.LocationProId = res.text
            this.$refs.scrollWrap.scrollTop = this.$el.querySelector('#a' + res.text).offsetTop
          } else {
            this.getProductInfo(res.text)
          }
        })
      } else {
        if(this.data.filter(function(item) {
          return item.goodsBarCode === '8996001355602'
        }).length > 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '该商品已经在列表中',
            width: '9em'
          })
          this.LocationProId = '8996001355602'
          this.$refs.scrollWrap.scrollTop = this.$el.querySelector('#a8996001355602').offsetTop
        } else {
          this.getProductInfo('8996001355602')
        }
      }
    },
    /**
     * 提交返配清单
     */
    backorderSubmit () {
      if(this.currBackorderStorage.length === 0) {
        this.$vux.toast.show({
          type: 'text',
          text: '请选择返配库位'
        })
      } else if(this.data.filter(function(item) {
        return item.supplyNum == 0 || isNaN(item.supplyNum)
      }).length > 0) {
        this.$vux.toast.show({
          type: 'text',
          text: '列表中有商品数量未填写或为零'
        })
      } else {
        $request.post('/api/goods-warehouse/v1/protected/shopToReturnWarehouse', {
          costCenterNum: this.commonInfo.costNumber,
          goodsDetailDTOList: this.data,
          targetPlaceCode: this.currBackorderStorage[0]
        }).then(res => {
          if(res.success) {
            this.$router.push({path:'/success',query:{text: '返配成功',title: '卖场返配',info: '请将商品移至返配库位', path: {name: 'scanEntry', query: {key: 'shopBackOrder'}}, listPath: {path: 'shop/backorder'}}})
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: res.message
            })
          }
        })
      }
    },
    /**
     * 删除
     * @param  {[type]} index 商品index
     */
    goodsInfoItemDelete (index){
      this.data.splice(index, 1);
    },
    /**
     * 输入框数量变化时
     */
    listChange () {
      if(this.data.filter(function(item) {
        return item.supplyNum > 0
      }).length > 0) {
        this.notSubmit = false
      } else {
        this.notSubmit = true
      }
    }
  }
}

</script>
<style lang="less">
@import "../../../css/footer.less";
.backorder-addlist {
  .scroll-content {
    overflow-x: hidden;
  }
  .backorder-sel {
    background-color: #48475A;
    color: #fff;
    font-size: 15px;
  }
  .prolist {
    padding-bottom: 47px;
    .item {
      background-color: #fff;
      margin-bottom: 10px;
    }
    .proname {
      padding: 15px;
      .code {
        font-size: 14px;
        line-height: 1;
        margin-bottom: 8px;
      }
      .name {
        font-size: 15px;
        text-align: justify;
        line-height: 20px;
      }
    }
    .goods-info-item.active {
      .l-list-ct {
        background-color: #fffaea;
      }
      .l-list-ctl {
        background-color: #fff;
      }
    }
  }
}
</style>
