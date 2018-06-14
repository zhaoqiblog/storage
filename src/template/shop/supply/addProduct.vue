<template>
	<!--卖场补货-->
  <div class="shop-add-product">
    <x-header class="vux-1px-b">添加商品</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="prolist">
        <div class="proname vux-1px-b">
          <div class="code" v-if="data.length">{{data[0].goodsBarCode}}</div>
          <div class="name" v-if="data.length">{{data[0].goodsName}}</div>
        </div>
        <div class="list">
          <goods-info-item v-for="(item, index) in data"
            :key="item.goodsCode"
            :name="item.warehouseName"
            :time="'入库时间：' + item.intoWarehouseTime"
            :totalNum="item.availableNum"
            :unit="item.unit"
            :unitq="item.perNum"
            :num="item.caseNum"
            :type="'input'"
            :label="item.goodsName"
            v-model="item.realityNum"
             @change="listChange">
          </goods-info-item>
        </div>
        <div class="cm-footer">
          <button type="button" class="btnblue-add" @click="addProduct()" :disabled="isDisabled">确认加入清单</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import $request from '@/service/request.js'
import { mapState } from 'vuex'
export default {
  components: {
    XHeader
  },
  name: 'addProduct',
  computed: mapState({
    supplement: state => state.shop.supplement,
    commonInfo: state => state.global.commonInfo,
    costCenterNum: state => state.global.commonInfo.costNumber // 成本中心
  }),
  data() {
    return {
      isDisabled: true,
      data: {} // 商品库位信息
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
      $request.get('/api/goods-warehouse/v1/protected/place_of_goods/to_market', {
        goodsBarCode: this.$route.query.scanResult,
        isMarketToOrigin: 0,
        costCenterNum: this.costCenterNum
      }).then(res => {
        if(res.success) {
          res.data.forEach(function(item) {
            item.realityNum = 0
            item.intoWarehouseTime = item.intoWarehouseTime.substr(0, item.intoWarehouseTime.length - 2)
          })
          const list=JSON.stringify(res.data)
          this.data = JSON.parse(list).concat([])
        } else {
          this.$router.push({path:'/fail',query:{text: res.message,title: '卖场补货',info: '', path: {name: 'scanEntry', query: {key: 'shopSupplying'}}}})
        }
      })
    },
    /**
     * 加入补货清单
     */
    addProduct () {
      if(Object.keys(this.data).length > 0) {
        let list = this.data.filter(item => {
          return (item.realityNum != null && item.realityNum != 0)
        })
        if(this.supplement.filter(item => {
          return this.data[0].goodsBarCode === item[0].goodsBarCode
        }).length > 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '该商品已经添加过了'
          })
          this.$router.push({path: '/shop/addProductList'})
        } else {
          this.$store.dispatch({
            type: 'addSupplement',
            data: list
          })
          this.$router.push({path: '/shop/addProductList'})
        }
      } else {
        this.$vux.toast.show({
          type: 'text',
          text: '请先扫描商品'
        })
      }
    },
    listChange () {
      if(this.data.filter(item => {
        return (item.realityNum != null && item.realityNum != 0 && !isNaN(item.realityNum))
      }).length > 0) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    }
  }
}

</script>
<style lang="less">
@import "../../../css/footer.less";
.cm-store {
  line-height: 40px;
  background-color: #fff;
  text-align: center;
  font-size: 14px;
  color: #303030;
}
.shop-add-product {
  .prolist {
    padding-bottom: 48px;
    margin-top: 10px;
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
    .l-list-code {
      span {
        float: left!important;
      }
    }
    .list {
      background-color: #fff;
    }
  }
}
</style>
