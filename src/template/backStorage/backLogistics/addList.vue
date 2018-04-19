<template>
  <div class="backLogistics-list">
    <x-header class="vux-1px-b">物流返配清单</x-header>
    <div class="scroll-content" ref="scrollWrap">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <div class="summary">
        <div>
          <h2>{{warehouseCode}}</h2>
          <p>返配库位码</p>
        </div>
        <div>
          <h2>{{data.goodsSize}}</h2>
          <p>SKU数量</p>
        </div>
        <div>
          <h2>{{data.goodsNum}}</h2>
          <p>库存总件数</p>
        </div>
      </div>
      <div class="prolist">
        <div class="list">
          <goods-info-item :class="{active: LocationProId === item.goodsBarCode}" :id="'a' + item.goodsBarCode" v-for="(item, index) in data.goodsInfo"
            :key="item.goodsBarCode"
            :code="item.goodsBarCode"
            :name="item.goodsName"
            :time="'入库时间：' + new Date(item.intoWarehouseTime).format('yyyy-MM-dd')"
            :totalNum="item.availableNum"
            :unit="item.unit"
            :unitq="item.perNum"
            :num="item.num"
            :type="'input'"
            :label="item.goodsName"
            v-model="item.returnNum"
            :sideslip="true"
            :deleteFunc="goodsInfoItemDelete.bind(this,index)"
            @change="listChange">
          </goods-info-item>
        </div>
      </div>
      <m-empty v-if="data.goodsInfo && data.goodsInfo.length === 0"></m-empty>
    </div>
    <div class="cm-footer">
      <div class="btn-add" @click="scan()">
        <span>扫描定位商品</span>
      </div>
      <div class="btn-submit">
        <button type="button" @click="supplySubmit()" :disabled="notSubmit">确认提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import MEmpty from '@/components/MEmpty/index'
import { XHeader } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
export default {
  components: {
    XHeader,
    MEmpty
  },
  name: 'backLogisticsAddList',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
      notSubmit: false,
      warehouseCode: '',
      data: {},
      LocationProId: ''
    }
  },
  created() {
    this.warehouseCode = this.$route.query.scanResult
    this.getProlist()
  },
  methods: {
    /**
     * 根据库位码获取商品信息
     */
    getProlist () {
      $request.get('/api/goods-warehouse/v1/protected/queryWarehouseGoods', {
        warehousePlaceCode: this.warehouseCode,
        warehouseType: 1,
        costCenterNum: this.commonInfo.costNumber
      }).then(res => {
        if(res.success) {
          this.data = res.data
          this.data.goodsInfo.forEach(function(item) {
            item.returnNum = item.availableNum
          })
        } else {
          this.$router.push({path:'/fail',query:{text: res.message,title: '物流返配',info: '', path: {name: 'scanEntry', query: {key: 'backLogistics'}}}})
        }
      })
    },
    /**
     * 扫描定位商品
     */
    scan () {
      if(window.cordova) {
        factory.scan().then(pro => {
          if(this.data.goodsInfo.filter(item =>{
            return item.goodsBarCode == pro.text
          }).length > 0) {
            this.LocationProId = pro.text
            this.$refs.scrollWrap.scrollTop = this.$el.querySelector('#a' + pro.text).offsetTop
          } else {
            this.LocationProId = ''
            this.$vux.toast.show({
              type:'text',
              text:'此商品不是当前库位上的商品！',
              width: '15em',
              time:5000
            })
          }
        })
      } else {
        if(this.data.goodsInfo.filter(item =>{
            return item.goodsBarCode == '6948195802631'
          }).length > 0) {
            this.LocationProId = '6948195802631'
            this.$refs.scrollWrap.scrollTop = this.$el.querySelector('#a6948195802631').offsetTop
          } else {
            this.LocationProId = ''
            this.$vux.toast.show({
              type: 'text',
              text: '此商品不是当前库位上的商品！',
              width: '15em',
              time: 5000
            })
          }
      }
    },
    /**
     * 提交补货清单
     */
    supplySubmit () {
      let returnOperates = []
      const _this = this
      this.data.goodsInfo.forEach(function(item) {
        if(item.returnNum > 0) {
          returnOperates.push({
            goodsBarCode: item.goodsBarCode,
            goodsCode: item.goodsCode,
            goodsName: item.goodsName,
            returnNum: item.returnNum,
            returnPlaceCode: _this.warehouseCode
          })
        }
      })
      $request.post('/api/return-operate/v1/protected/create', {
        costCenterNum: this.commonInfo.costNumber,
        returnOperates: returnOperates
      }).then(res => {
        if(res.success) {
          this.$router.push({path:'/success',query:{text: '返配成功',title: '物流返配',info: '请将商品移至物流', path: {name: 'scanEntry', query: {key: 'backLogistics'}}, listPath: {path: 'backStorage/backLogistics'}}})
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 删除
     * @param  {[type]} index 商品index
     * @param  {[type]} i     库位index
     */
    goodsInfoItemDelete (index){
      this.data.goodsInfo.splice(index, 1)
    },
    /**
     * 输入框数量变化时
     */
    listChange () {
      if(this.data.goodsInfo.filter(function(item) {
        return item.returnNum !== 0
      }).length === 0) {
        this.notSubmit = true
      } else {
        this.notSubmit = false
      }
    }
  }
}

</script>
<style lang="less">
@import "../../../css/footer.less";
.backLogistics-list {
  .summary {
    display: flex;
    text-align: center;
    background-color: #fff;
    padding: 15px 0;
    & > div {
      flex: 1;
    }
    h2 {
      color: #303030;
      font-size: 20px;
      height: 20px;
      line-height: 20px;
      margin-bottom: 5px;
    }
    p {
      font-size: 12px;
      color: #999;
      line-height: 1;
    }
  }
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
