<template>
  <div class="shop-add-prolist">
    <x-header class="vux-1px-b">还货清单</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="prolist">
        <div class="item" v-for="(proDatas, i) in data">
          <div class="proname vux-1px-b">
            <div class="code" v-if="data.length">{{proDatas[0].goodsBarCode}}</div>
            <div class="name" v-if="data.length">{{proDatas[0].goodsName}}</div>
          </div>
          <div class="list">
            <goods-info-item v-for="(item, index) in proDatas"
              :key="item.goodsCode"
              :name="'库位号' + item.warehouseName"
              :time="item.intoWarehouseTime ? '入库时间：' + item.intoWarehouseTime : item.intoWarehouseTime"
              :totalNum="item.availableNum"
              :unit="item.unit"
              :unitq="item.perNum"
              :num="item.caseNum"
              :maxBan="true"
              :type="'input'"
              :label="item.goodsName"
              v-model="item.realityNum"
              :sideslip="true"
              :deleteFunc="goodsInfoItemDelete.bind(this,index,i)"
              @change="listChange">
            </goods-info-item>
          </div>
        </div>
      </div>
    </div>
    <div class="cm-footer">
      <div class="btn-add" @click="scan()">
        <span>扫描商品</span>
      </div>
      <div class="btn-submit">
        <button type="button" @click="returnSubmit()" :disabled="notSubmit">提交还货申请</button>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
export default {
  components: {
    XHeader
  },
  name: 'shopReturnAddList',
  computed: mapState({
    data: state => state.shop.returnList,
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
      notSubmit: true
    }
  },
  created() {
    this.listChange()
  },
  methods: {
    /**
     * 扫描添加商品
     */
    scan () {
      if(window.cordova) {
        factory.scan().then(res => {
          this.$router.push({path: '/shop/shopReturnAdd', query: {scanResult: res.text}})
        })
      } else {
        this.$router.push({path: '/shop/shopReturnAdd', query: {scanResult: '6903148093603'}})
      }
    },
    /**
     * 提交还货清单
     */
    returnSubmit () {
      let goodsDetailDTOList = []
      this.data.forEach(function(arr) {
        arr.forEach(function(item) {
        	console.log(item)
          goodsDetailDTOList.push({
            goodsBarCode: item.goodsBarCode,
            goodsCode: item.goodsCode,
            goodsName: item.goodsName,
            supplyNum: item.realityNum,
            targetPlaceCode: item.warehouseCode,
            targetPlaceId:item.warehouseId
          })
        })
      })
      if(goodsDetailDTOList.filter(function(item) {
        return (item.supplyNum == 0) || (isNaN(item.supplyNum))
      }).length > 0) {
        this.$vux.toast.show({
          type: 'text',
          text: '列表中有商品数量未填写或为零'
        })
      } else {
      	console.log(goodsDetailDTOList)
//      $request.post('/api/goods-warehouse/v1/protected/shopToOriginWarehouse', {
//	 		costCenterNum: this.commonInfo.costNumber,
//        toWarehouseGoodsDTOList: goodsDetailDTOList,

//      }).then(res => {
        $request.post('/api/goods-warehouse/v1/protected/shop_to_origin_warehouse',goodsDetailDTOList).then(res => {
          if(res.success) {
            // 提交成功清除还货清单
            this.$store.commit('clearReturn')
            this.$router.push({path:'/success',query:{text: '还货成功',title: '提交成功',info: '请将商品移至库位', path: {name: 'scanEntry', query: {key: 'shopReturnWarehouse'}}, listPath: {path: 'shop/shopReturnList'}}})
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
     * @param  {[type]} i     库位index
     */
    goodsInfoItemDelete (index, i){
      if(this.data[i].length == 1) {
        this.data.splice(i,1);
      } else {
        this.data[i].splice(index, 1);
      }
      this.listChange()
    },
    /**
     * 数量变化时
     */
    listChange () {
      let num = 0
      console.log(this.data)
      this.data.forEach(function(pro) {
        pro.forEach(function(item){
          if(item.realityNum > 0) {
            num++
          }
        })
      })
      if(num > 0) {
        this.notSubmit = false
      } else {
        this.notSubmit = true
      }
      this.$store.dispatch({
        type: 'updateReturn',
        data: this.data
      })
    }
  }
}

</script>
<style lang="less">
@import "../../../css/footer.less";
.shop-add-prolist {
  .prolist {
    padding-bottom: 47px;
    margin-top: 10px;
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
  }
}
</style>
