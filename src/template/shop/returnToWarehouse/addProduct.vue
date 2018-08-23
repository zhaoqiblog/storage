<template>
  <div class="shop-return-add">
    <x-header class="vux-1px-b">添加商品</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="prolist">
        <div class="proname vux-1px-b">
          <div class="code" v-if="productInfo">{{productInfo.goodsBarCode}}</div>
          <div class="name" v-if="productInfo">{{productInfo.goodsName}}</div>
        </div>
        <div class="list">
          <div class="tl">
            <div class="item-left"><span v-if="data.length">该商品现用库位</span><span v-else>该商品没有现用库位</span></div>
            <div class="item-right">还货数量</div>
          </div>
          <goods-info-item v-for="(item, index) in data"
            :key="item.goodsCode"
            :name="'库位号' + item.warehouseName"
            :time="item.intoWarehouseTime ? '入库时间：' + item.intoWarehouseTime : item.intoWarehouseTime"
            :nameSign="item.isOrigin == 1 ? '原库位' : ''"
            :totalNum="item.availableNum"
            :unit="item.unit"
            :unitq="item.perNum"
            :num="item.caseNum"
            :type="'input'"
            :maxBan="true"
            :label="item.goodsName"
            v-model="item.realityNum"
             @change="listChange">
          </goods-info-item>
          <div class="add-warehouse" @click="showAddPopup()">
            +&nbsp;增加其他库位
          </div>
        </div>
      </div>
    </div>
    <div v-transfer-dom class="alert-info return-prompt">
      <confirm v-model="showInput"
      title="输入库位码"
      confirm-text="确认"
      cancel-text=" "
      @on-confirm="confirmInput"
      @on-show="code = ''">
        <div class="vux-prompt"><input placeholder="请输入" v-model.trim="code" class="vux-prompt-msgbox" type="number" pattern="[0-9]*"></div>
      </confirm>
    </div>
    <div class="cm-footer">
      <button type="button" class="btnblue-add" @click="addProduct()" :disabled="isDisabled">确认加入清单</button>
    </div>
  </div>
</template>

<script>
import { XHeader, Confirm, TransferDomDirective as TransferDom } from 'vux'
import $request from '@/service/request.js'
import { mapState } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Confirm
  },
  name: 'shopReturnAdd',
  computed: mapState({
    returnList: state => state.shop.returnList,
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
      showInput: false,
      isDisabled: true,
      code: '',
      data: {}, // 商品库位信息
      productInfo: {}
    }
  },
  created() {
    this.getProductPlace()
  },
  methods: {
    /**
     * 根据商品条码获取库位信息
     */
    getProductPlace () {
//    $request.get('/api/goods-warehouse/v1/protected/queryPlaceByGoodsBarCode', {
      $request.get('/api/goods-warehouse/v1/protected/back_place_of_goods/market_to_origin', {
        goodsBarCode: this.$route.query.scanResult,
        costCenterNum: this.commonInfo.costNumber,
        isMarketToOrigin: 1,
        isShowLastOperate: 1
      }).then(res => {
        if(res.success) {
          res.data.forEach(function(item) {
            item.realityNum = 0
          })
          const list=JSON.stringify(res.data)
          this.data = JSON.parse(list).concat([]).sort(function(a, b) {
            return parseInt(b.isOrigin) - parseInt(a.isOrigin)
          })
          this.productInfo = this.data[0]
          this.data = this.data.filter(function(item) {
            return item.warehouseId !== ''
          })
        } else {
          this.$router.push({path:'/fail',query:{text: res.message,title: '卖场还货',info: '', path: {name: 'scanEntry', query: {key: 'shopReturnWarehouse'}}}})
        }
      })
    },
    /**
     * 加入还货清单
     */
    addProduct () {
//    if(Object.keys(this.data).length > 0) {
        let list = this.data.filter(item => {
          return (item.realityNum != null && item.realityNum != 0)
        })
        if(this.returnList.filter(item => {
          return this.data[0].goodsBarCode === item[0].goodsBarCode
        }).length > 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '该商品已经添加过了'
          })
        } else {
          this.$store.dispatch({
            type: 'addReturn',
            data: list
          })
        }
        this.$router.push({path: '/shop/shopReturnAddList'})
//    } else {
//      this.$vux.toast.show({
//        type: 'text',
//        text: '请先扫描商品'
//      })
//    }
    },
    listChange () {
      if(this.data.filter(item => {
        return (item.realityNum != null && item.realityNum != 0 && !isNaN(item.realityNum))
      }).length > 0) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    showAddPopup () {
      this.showInput = true
    },
    confirmInput () {
      let code = this.code
      if(code) {
        if(this.data.filter(function(item) {
          return item.warehouseId === code
        }).length > 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '该库位已经在列表中'
          })
        } else {
          $request.get('/api/sys-warehouse/v1/protected/query_warehouses', {
            warehousePlaceCode: code,
            costCenterNum: this.commonInfo.costNumber,
            warehouseType: 0
          }).then(res => {
            if(res.success) {
              this.data.push({
                goodsBarCode: this.productInfo.goodsBarCode,
                goodsCode: this.productInfo.goodsCode,
                goodsName: this.productInfo.goodsName,
                caseNum: 0,
                availableNum: 0,
                unit: this.productInfo.unit,
                perNum: this.productInfo.perNum,
                warehouseId: res.data.warehousePlaceId,
                warehouseCode: res.data.warehousePlaceCode,
                warehouseName: res.data.warehousePlaceName,
                intoWarehouseTime: '',
                isOrigin: '0',
                realityNum: 0
              })
            } else {
              this.$vux.toast.show({
                type: 'text',
                text: code + '库位不存在'
              })
            }
          })
        }
      }
    }
  }
}

</script>
<style lang="less">
@import "../../../css/footer.less";
.return-prompt {
  .vux-prompt-msgbox {
    text-align: center;
    padding: 0 10px;
    box-sizing: border-box;
  }
}
.cm-store {
  line-height: 40px;
  background-color: #fff;
  text-align: center;
  font-size: 14px;
  color: #303030;
}
.shop-return-add {
  padding-bottom: 48px;
  .prolist {
    margin-top: 10px;
    padding-bottom: 48px;
    .proname {
      padding: 15px;
      background-color: #fff;
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
    .list {
      .tl {
        display: flex;
        font-size: 14px;
        color: #999;
        line-height: 50px;
        padding: 0 16px;
        .item-right {
          flex: 1;
          text-align: right;
        }
      }
    }
    .add-warehouse {
      color: #3DA5FE;
      line-height: 50px;
      font-size: 16px;
      background-color: #fff;
      text-align: center;
    }
    .l-list-code {
      span {
        float: left!important;
      }
    }
  }
}
</style>
