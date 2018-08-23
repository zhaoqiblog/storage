<template>
	
  <div class="shop-add-prolist">
    <x-header class="vux-1px-b">补货清单</x-header>
    <div class="scroll-content">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="prolist">
        <div class="item" v-for="(proDatas, i) in data">
          <div class="proname vux-1px-b">
            <div class="code">{{proDatas[0].goodsBarCode}}</div>
            <div class="name">{{proDatas[0].goodsName}}</div>
          </div>
          <div class="list">
            <goods-info-item v-for="(item, index) in proDatas"
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
        <button type="button" @click="supplySubmit()" :disabled="notSubmit">提交补货申请</button>
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
  name: 'addProductList',
  computed: mapState({
    data: state => state.shop.supplement,
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
          this.$router.push({path: '/shop/addProduct', query: {scanResult: res.text}})
        })
      } else {
        this.$router.push({path: '/shop/addProduct', query: {scanResult: '6923644212345'}})  //'2104366200000'
      }
    },
    /**
     * 提交补货清单
     */
    supplySubmit () {
      let supplementInvoicesDetailsDTO = []
      this.data.forEach(function(arr) {
        arr.forEach(function(item) {
          supplementInvoicesDetailsDTO.push({
            goodsCode: item.goodsCode,
            goodsBarCode:item.goodsBarCode,
            goodsName: item.goodsName,
            supplyNum: item.realityNum,
            warehousePlaceId: item.warehouseId,
          })
        })
      })
      if(supplementInvoicesDetailsDTO.filter(function(item) {
        return (item.supplyNum == 0) || (isNaN(item.supplyNum))
      }).length > 0) {
        this.$vux.toast.show({
          type: 'text',
          text: '列表中有商品数量未填写或为零'
        })
      } else {
      	const data ={
		  "billNoCode": "MCBH",
		  "supplementInvoicesDetailsDTO":supplementInvoicesDetailsDTO,
		  "supplementType": "2"
		}
        $request.post('/api/supplement-invoices/v1/protected/create', data).then(res => {
        	if(res.success==true){
	          this.$store.dispatch('clearSupplement') // 提交成功清除补货清单
	          this.$router.push({path:'/success',query:{text: '补货成功',title: '提交成功',info: '请将商品移至卖场', path: {name: 'scanEntry', query: {key: 'shopSupplying'}}, listPath: {path: 'shop/supply'}}})
        	}else{
        		this.$router.push({path:'/fail',query:{text: res.message || '提交失败，请重试！',title: '卖场补货',info: '', path:'/scanEntry?key=shopSupplying'}})
        	}
        	}).catch(err=>{
        		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '卖场补货',info: '', path:'/scanEntry?key=shopSupplying'}})
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
     * 输入框数量变化时
     */
    listChange () {
      let num = 0
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
        type: 'updateSupplement',
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
