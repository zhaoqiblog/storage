<template>
  <div class="backLogistics-detail">
    <x-header class="vux-1px-b">返配单详情</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="topinfo">
        <div class="text">
          <div>返配单号：{{data.returnBillNo}}</div>
          <div>返配数量：{{data.totalNum}}</div>
          <div>返配时间：{{data.operateDate}}</div>
        </div>
      </div>
      <div class="prolist" v-if="data.returnOperates && data.returnOperates.length">
        <div class="tl">
          <div class="item-left">商品信息</div>
          <div class="item-right">数量</div>
        </div>
        <div class="item">
          <div class="list">
            <goods-info-item v-for="item in data.returnOperates"
              :key="item.goodsCode"
              :name="item.goodsName"
              :code="item.goodsBarCode"
              :textNum="item.returnNum"
              :type="'text'">
              <div slot="textNumDom" class="l-list-text listInfo-cell-Info">
                <span>{{item.returnNum}}</span>
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
  name: 'backLogisticsDetail',
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
     * 获取返配单详情
     */
    getSupplyDetail () {
      let orderId = this.$route.query.orderId
      $request.get('/api/return-operate/v1/protected/query/'+ orderId).then(res => {
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
.backLogistics-detail {
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
