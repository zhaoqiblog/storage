<template>
  <div class="shop-supply-detail">
    <x-header :left-options="{preventGoBack: true}" @on-click-back="back()" class="vux-1px-b">拣货单详情已废弃</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="topinfo">
        <div class="text">
          <div>补货单号：{{data.supplementBillNo}}</div>
          <!--<div>补货数量：{{data.supplyNum}}</div>-->
          <div>补货时间：{{(new Date(data.updateTime)).format('yyyy-MM-dd hh:mm:ss')}}</div>
        </div>
        <div class="sign sign-supplying" v-if="data.status == 0"></div>
        <div class="sign sign-completed" v-if="data.status == 1"></div>
      </div>
      <div class="prolist" :class="{'supplying-list': data.status == 0}" v-if="data.supplementInvoicesDetails && data.supplementInvoicesDetails.length">
        <div class="tl">
          <div class="item-left">商品信息</div>
          <div class="item-right">数量</div>
        </div>
        <div class="item" v-for="(item, index) in data.supplementInvoicesDetails">
          <div class="pre-goods-info vux-1px-b">
          	<span>前置仓 123546</span> 
          	<span>现有库存 6</span>
          	<span>安全库存 9</span>
            <!--<div class="code" v-if="item.goodsWarehouse">{{item.goodsWarehouse.goodsBarCode}}</div>-->
            <!--<div class="name">{{item.goodsName}}</div>-->
          </div>
          <div class="list predetail">
            <goods-info-item  v-if="data.status == 0 && item.sysWarehouse && item.goodsWarehouse"
              :key="index"
              :name="item.goodsWarehouse.goodsName"
              :code="item.goodsWarehouse.goodsBarCode"
              :unit="item.goodsWarehouse.unit"
              :totalNum="item.goodsWarehouse.availableNum"
              :altogether="item.num"
              :num="item.goodsWarehouse.num"
              :type="'text'"
              textNum="x2"
              positions="pre"
              :toPicking="toPicking"
              :label="item.id"
              v-model="item.goodsSupplementNum">
            </goods-info-item>
            <goods-info-item v-if="data.status == 1 && item.sysWarehouse && item.goodsWarehouse"
              :key="index"
              :name="'库位号' + item.sysWarehouse.warehousePlaceName"
              :unitq="item.goodsWarehouse.perNum"
              :time="'入库时间：' + (new Date(item.goodsWarehouse.intoWarehouseTime)).format('yyyy-MM-dd')"
              :unit="item.goodsWarehouse.unit"
              :totalNum="item.goodsWarehouse.availableNum"
              :altogether="item.num"
              :num="item.goodsWarehouse.num"
              :type="'text'"
              :label="item.id">
              <div slot="textNumDom" class="l-list-text listInfo-cell-Info">
                <span>{{item.goodsSupplementNum}}</span>
              </div>
            </goods-info-item>
          </div>
        </div>
      </div>
    </div>
    <div class="cm-footer" v-if="data.status == 0">
      <div class="btnblue-del" @click="delOrder()">
        <span>删除此单</span>
      </div>
      <div class="btn-submit">
        <button type="button" @click="complete()">完成补货</button>
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
  name: 'supplyDetail',
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
  	 * 未拣货点击事件
  	 */
  	toPicking(){
  		console.log("拣货")
  	},
    /**
     * 获取补货单详情
     */
    getSupplyDetail () {
      let orderId = this.$route.query.orderId
      $request.get('/api/supplement-invoices/v1/protected/querySupInfo', {
        supplementBillNo: orderId
      }).then(res => {
        if(res.success) {
          this.data = res.data
          this.data.supplyNum = 0
          this.data.supplementInvoicesDetails.forEach(item => {
            this.data.supplyNum += item.goodsSupplementNum
          })
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 删除此单
     * @return {[type]} [description]
     */
    delOrder () {
      $request.get('/api/supplement-invoices/delete/' + this.data.id).then(res => {
        if(res.success) {
          this.$vux.toast.show({
            type: 'text',
            text: res.message,
            onHide: () => {
              this.$router.push({name: 'supply', query: { refresh: '1'}})
            }
          })
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 完成补货
     * @return {[type]} [description]
     */
    complete () {
      let supplementInvoicesDetailsDTO = [], opWarehouseDetailDTOList = []
      this.data && this.data.supplementInvoicesDetails && (this.data.supplementInvoicesDetails.length > 0) && this.data.supplementInvoicesDetails.forEach(function(item) {
        supplementInvoicesDetailsDTO.push({
          goodsCode: item.goodsCode,
          goodsName: item.goodsName,
          goodsSupplementNum: item.goodsSupplementNum,
          id: item.id,
          warehouseAreaId: item.sysWarehouse.warehouseAreaId,
          warehousePlaceId: item.sysWarehouse.warehousePlaceId
        })
        opWarehouseDetailDTOList.push({
          goodsCode: item.goodsCode,
          goodsWarehouseId: item.goodsWarehouse.id,
          supplyNum: item.goodsSupplementNum,
          warehouseId: item.sysWarehouse.warehousePlaceId
        })
      })
      $request.put('/api/supplement-invoices/v1/protected/update', {
        id: this.data.id,
        status: '1',
        supplementInvoicesDetailsDTO: supplementInvoicesDetailsDTO
      }).then(res => {
        if(res.success) {
//        $request.post('/api/goods-warehouse/v1/protected/orderWarehouseSupply', {
          $request.post('/api/supplement-invoices/v1/protected/confirm_supplement', {
            supplementInvoicesMainId: this.data.id,
            opWarehouseDetailDTOList: opWarehouseDetailDTOList
          }).then(result => {
            if(result.success) {
              this.$vux.toast.show({
                type: 'text',
                text: result.message,
                onHide: () => {
                  this.$router.push({name: 'supply', query: { refresh: '1'}})
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'text',
                text: result.message
              })
            }
          })
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    back () {
//    this.$router.push({name: 'supply'})
		this.$router.back()
    }
  }
}

</script>
<style lang="less">
@import "../../../css/footer.less";
.predetail{
	.goods-info-item {
		
		.l-list-name{
			.l-list-text{
				small{
					display:none;
				}
			}
		}
	}
}
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
    &.supplying-list {
      padding-bottom: 48px;
    }
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
    .item {
      margin-bottom: 10px;
      .pre-goods-info{
			background: #FFFFFF;
			font-size: 12px;
			padding: 10px 15px;
		}
    }
  }
}
</style>
