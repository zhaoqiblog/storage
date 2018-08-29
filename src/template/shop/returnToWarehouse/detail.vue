<template>
  <div class="shop-supply-detail">
    <x-header class="vux-1px-b">还货单详情</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="topinfo">
        <div class="text">
          <div>还货单号：{{data.toOriginBillNo}}</div>
          <div>还货数量：{{data.operateTotalNum}}</div>
          <div>还货时间：{{data.operateDate}}</div>
        </div>
      </div>
      <div class="prolist" v-if="data.originOperates && data.originOperates.length">
        <div class="tl">
          <div class="item-left">商品信息</div>
          <div class="item-right">数量</div>
        </div>
        <div class="item" v-for="pro in data.originOperates">
          <div class="proname vux-1px-b">
            <div class="code">{{pro.goodsBarCode}}</div>
            <div class="name">{{pro.goodsName}}</div>
          </div>
          <div class="list">
            <goods-info-item v-for="item in pro.goodsWarehouseInfoDTOS"
              :key="item.goodsCode"
              :name="'库位号' + item.warehouseName"
              :unitq="item.perNum"
              :time="'入库时间：' + item.intoWarehouseTime"
              :unit="item.unit"
              :totalNum="item.availableNum"
              :num="item.caseNum"
              :type="'text'">
              <div slot="textNumDom" class="l-list-text listInfo-cell-Info">
                <span>{{pro.operateNum}}</span>
              </div>
            </goods-info-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapState } from 'vuex';
import $request from '@/service/request.js'
export default {
  components: {
    XHeader
  },
  name: 'shopReturnDetail',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
      data: {}
    }
  },
  created() {
    this.getSupplyDetail()
  },
  methods: {
    /**
     * 获取还货单详情
     */
    getSupplyDetail () {
      let orderId = this.$route.query.orderId
      $request.get('/api/warehouse-operate-main/v1/protected/query/', {
        toOriginBillNo: orderId,
        costCenterNum: localStorage.getItem("currentStore") ? localStorage.getItem("currentStore") : this.commonInfo.costNumber
      }).then(res => {
        if(res.success) {
          this.data = res.data
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    }
  }
}

</script>
<style lang="less">
@import "../../../css/footer.less";
.shop-supply-detail {
  .topinfo {
    padding: 8px 15px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    .text {
      flex: 1;
      color: #999;
      font-size: 12px;
      line-height: 1.5;
    }
    .sign {
      width: 52px;
      height: 45px;
      &.sign-supplying {
        background: url('../../../assets/icon_buhuoing.png') no-repeat;
        background-size: cover;
      }
      &.sign-completed {
        background: url('../../../assets/icon_yiwancheng.png') no-repeat;
        background-size: cover;
      }
    }
  }
  .prolist {
    .tl {
      display: flex;
      font-size: 14px;
      color: #999;
      padding: 0 15px;
      line-height: 50px;
      .item-left {
        flex: 1;
      }
    }
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
  }
}
</style>
