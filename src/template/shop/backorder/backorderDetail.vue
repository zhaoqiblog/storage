<template>
  <div class="shop-backorder-detail">
    <x-header class="vux-1px-b">返配单详情</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="topinfo">
        <div class="text">
          <div>补货单号：{{data.id}}</div>
          <div>补货数量：{{data.totalNum}}</div>
          <div>补货时间：{{(new Date(data.operateDate)).format('yyyy-MM-dd hh:mm:ss')}}</div>
          <div>返配库位：{{data.targetPlaceName}}</div>
        </div>
      </div>
      <div class="prolist">
        <div class="tl">
          <div class="item-left">商品信息</div>
          <div class="item-right">数量</div>
        </div>
        <div class="list">
          <goods-info-item v-if="item.goodsWarehouse" v-for="(item,index) in data.warehouseOperateDetailList"
            :key="index"
            :code="item.goodsBarCode"
            :name="item.goodsName"
            :time="'入库时间：' + (new Date(item.goodsWarehouse.intoWarehouseTime)).format('yyyy-MM-dd')"
            :unit="item.goodsWarehouse.unit"
            :unitq="item.goodsWarehouse.perNum"
            :type="'text'">
              <div slot="textNumDom" class="l-list-text listInfo-cell-Info">
                <span>{{item.operateNum}}</span>
              </div>
          </goods-info-item>
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
  name: 'backorderDetail',
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
     * 获取补货单详情
     */
    getSupplyDetail () {
      let orderId = this.$route.query.orderId
      $request.get('/api/warehouse-operate-main/v1/protected/getWarehouseOperate', {
        warehouseOperateMainId: orderId
      }).then(res => {
        if(res.success) {
          this.data = res.data.content
          this.data.totalNum = 0
          this.data.warehouseOperateDetailList.forEach(item => {
            this.data.totalNum += item.operateNum
          })
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
.shop-backorder-detail {
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
