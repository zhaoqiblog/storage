<template>
  <div class="sampling">
    <x-header class="vux-1px-b">商品抽检</x-header>
    <div class="scroll-content">
      <div class="check-content">
        <div class="cm-store"><span>{{commonInfo.costName}}</span></div>
        <div class="rate">
          <div class="item-left">
            <h2>{{data.checkRatio}}</h2>
            <p>抽检率</p>
          </div>
          <div class="item-right">
            <h2>{{data.checkCompleteRatio}}&nbsp;<span class="slash">/</span>&nbsp;<span class="yellow">{{data.checkRequireRatio}}</span></h2>
            <p>抽检达成率&nbsp;/&nbsp;抽检要求达成率</p>
          </div>
        </div>
        <div data-v-0456b2fb="" class="goods-top-info list-info-cell">
          <div class="l-list-ct" style="position: relative !important;">
            <div>
              <ul class="top-info-ct">
                <li class="top-info-item">
                  <h2>{{data.palletCode}}</h2>
                  <p>托盘码</p>
                </li>
                <li class="top-info-item">
                  <h2>{{data.skuNum}}</h2>
                  <p>SKU数量</p>
                </li>
                <li class="top-info-item">
                  <h2>{{data.totalNum}}</h2>
                  <p>商品总数量</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="tab-wrap">
          <div class="tabs">
            <span @click="tabChange(0)" :class="{active: selectedIndex === 0}">门店必抽商品{{proList.length}}</span>
            <span @click="tabChange(1)" :class="{active: selectedIndex === 1}">选抽商品{{sampleList.length}}</span>
          </div>
          <div class="num">
            实际件数
          </div>
        </div>
        <!-- 必抽商品列表 start -->
        <div class="product-list" v-if="selectedIndex === 0">
          <div class="content">
            <goods-info-item v-for="(item, index) in proList" :key="item.id" :code="item.goodsBarCode" :name="item.goodsName" :totalNum="item.shippedNum" :unit="item.unit" :unitq="item.perNum" :num="item.shippedCaseNum" :type="'input'" :label="item.id" v-model="item.realityNum" @change="prolistChange">
            </goods-info-item>
            <m-empty v-if="proList.length === 0"></m-empty>
          </div>
        </div>
        <!-- 必抽商品列表 end -->
        <!-- 选抽商品列表 start -->
        <div class="sample-list" v-if="selectedIndex === 1">
          <div class="content">
            <goods-info-item v-for="(item, index) in sampleList" :key="item.id" :code="item.goodsBarCode" :name="item.goodsName" :totalNum="item.shippedNum" :unit="item.unit" :unitq="item.perNum" :num="item.shippedCaseNum" :type="'input'" :label="item.id" v-model="item.realityNum" @change="prolistChange">
            </goods-info-item>
            <m-empty v-if="sampleList.length === 0"></m-empty>
          </div>
        </div>
        <!-- 选抽商品列表 end -->
      </div>
    </div>
    <div class="cm-footer">
      <div class="btn-submit">
      	<!--大于0:有必抽商品，<0:没有必抽商品，按钮可以点击-->
        <button v-if="proList.length>0" type="button" :disabled="parseInt(data.checkCompleteRatio) < parseInt(data.checkRequireRatio) || newDisabled" @click="newCheckResult()">完成</button>
        <button v-if="proList.length<=0" type="button" @click="newCheckResult()">完成</button>
      </div>
    </div>
  </div>
</template>

<script>
import MEmpty from '@/components/MEmpty/index'
import { Scroller, XHeader } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory'
import $request from '@/service/request.js'
export default {
  components: {
    MEmpty,
    Scroller,
    XHeader
  },
  name: 'sampling',
  data() {
    return {
      selectedIndex: null,
      newDisabled: true,
      // 托盘上商品信息
      data: {
        checkResultDetailS: []
      },
      palletCode: '' // 托盘码
    }
  },
  computed: {
    // 必抽商品
    proList: function () {
      if(this.data.checkResultDetailS && this.data.checkResultDetailS.length > 0) {
        return (this.data.checkResultDetailS).filter(function(item) {
          return item.isSpotCheckGoods == 1
        })
      } else {
        return []
      }
    },
    // 选抽商品
    sampleList: function () {
      if(this.data.checkResultDetailS && this.data.checkResultDetailS.length > 0) {
        return this.data.checkResultDetailS.filter(function(item) {
          return item.isSpotCheckGoods == 0
        })
      } else {
        return []
      }
    },
    ...mapState({
      commonInfo: state => state.global.commonInfo, // 成本中心
      costCenterNum: state => state.global.commonInfo.costNumber // 成本中心
    })
  },
  created() {
    this.palletCode = this.$route.query.scanResult
    this.getProlist()
//  this.newDisabled
  },
  methods: {
    /**
     * 通过托盘码获取所需抽检信息
     */
    getProlist () {
      $request.get('/api/spot-check-result/v1/protected/queryCheckInfo', {
        palletCode: this.palletCode,
        costCenterNum: this.costCenterNum
      }).then(res => {
        if(res.success) {
          this.data = res.data
          this.data.costCenterNum = this.costCenterNum
          this.prolistChange()
          if(this.proList.length) {
            this.selectedIndex = 0
          } else if(this.sampleList.length) {
            this.selectedIndex = 1
          }
        } else {
          this.$router.push({path:'/fail',query:{text: res.message,title: '商品抽检',info: '', path: {name: 'scanEntry', query: {key: 'sampling'}}}})
        }
      })
    },
    /**
     * 实时计算抽检率和抽检达成率
     * @param  {[type]} value [description]
     */
    prolistChange (value) {
      let shippedNum = 0 // 总数量
      let checkResultDetailS = this.data.checkResultDetailS.filter(function(item) {
        return item.realityNum !== null && !isNaN(item.realityNum)
      })
      let checkCompleteRatioSum = 0
      checkResultDetailS && checkResultDetailS.forEach(function(item, index) {
        item.arrivalRatio = item.realityNum ? (item.realityNum / parseInt(item.shippedNum)).toFixed(4) : 0
        if(item.arrivalRatio > 1) {
          item.arrivalRatio = 1
        }
        shippedNum += item.shippedNum
        checkCompleteRatioSum += parseFloat(item.arrivalRatio)
      })
      let checkRatio = (shippedNum / this.data.totalNum) * 100 > 100 ? 100 : (shippedNum / this.data.totalNum) * 100
      this.data.checkRatio = shippedNum ? (String(checkRatio).indexOf('.') > -1 ? checkRatio.toFixed(2) : checkRatio) + '%' : '0' // 抽检率
      // 抽检达成率
      let checkCompleteRatio = (checkCompleteRatioSum / checkResultDetailS.length) * 100
      this.data.checkCompleteRatio = checkCompleteRatioSum ? (String(checkCompleteRatio).indexOf('.') > -1 ? checkCompleteRatio.toFixed(2) : checkCompleteRatio) + '%' : '0'
      // 完成按钮是否可点
      if(checkResultDetailS.length > 0) {
        this.newDisabled = false
      } else {
        this.newDisabled = true
      }
    },
    /**
     * 添加抽检商品
     */
    addSampling () {
    	if(window.cordova){
	      factory.scan().then(result => {
	        $request.get('/api/spot-check-result/v1/protected/queryPalletGoods', {
	          palletCode: this.palletCode,
	          goodsBarCode: result.text,
	          costCenterNum: this.costCenterNum,
	          spotCheckResultId: this.data.id
	        }).then(res => {
	          if(res.success) {
	            if(this.data.checkResultDetailS.filter(function(item){
	              return item.goodsBarCode === res.data.goodsBarCode
	            }).length > 0) {
	              this.$vux.toast.show({
	                type: 'text',
	                text: '该商品已在列表中'
	              })
	            } else {
	              this.data.checkResultDetailS.push(res.data)
	              this.prolistChange()
	            }
	          } else {
	            this.$vux.toast.show({
	              type: 'text',
	              text: res.message
	            })
	          }
	        })
	      })
      }else{
      	 $request.get('/api/spot-check-result/v1/protected/queryPalletGoods', {
	          palletCode: this.palletCode,
	          goodsBarCode: '6901306180714',
	          costCenterNum: this.commonInfo.costNumber,
	          spotCheckResultId: this.data.id
	        }).then(res => {
	          if(res.success) {
	            if(this.data.checkResultDetailS.filter(function(item){
	              return item.goodsBarCode === res.data.goodsBarCode
	            }).length > 0) {
	              this.$vux.toast.show({
	                type: 'text',
	                text: '该商品已在列表中'
	              })
	            } else {
	              this.data.checkResultDetailS.push(res.data)
	              this.prolistChange()
	            }
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
     * 创建抽检结果
     */
    newCheckResult () {
      let params = JSON.parse(JSON.stringify(this.data).replace(/checkResultDetailS/, 'spotCheckResultDetailS'))
      params.spotCheckResultDetailS = params.spotCheckResultDetailS.filter(function(item) {
        return item.realityNum !== null && !isNaN(item.realityNum)
      })
      $request.post('/api/spot-check-result/v1/protected/create', params).then(res => {
        if(res.success) {
          this.$router.push({path:'/success',query:{text: '抽检成功',title: '商品抽检',info: '', path: {name: 'scanEntry', query: {key: 'sampling'}}}})
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    tabChange (index) {
      this.selectedIndex = index
    }
  }
}

</script>
<style lang="less" scoped>
@import "../../css/footer.less";
.cm-store {
  line-height: 40px;
  background-color: #fff;
  text-align: center;
  font-size: 14px;
  color: #303030;
}
.sampling {
  .rate {
    padding: 15px 25px;
    display: flex;
    background-color: #48475A;
    color: #fff;
    h2 {
      font-size: 20px;
      line-height: 1;
      margin-bottom: 7px;
    }
    p {
      font-size: 12px;
      line-height: 1;
    }
    .item-left {
      flex: 1;
    }
    .item-right {
      text-align: right;
    }
    .slash {
      opacity: .8;
    }
    .yellow {
      color: #FDC163;
    }
  }
  .empty {
    margin-top: 70px;
  }
  .tab-wrap {
    display: flex;
    padding: 0 16px 0 6px;
    line-height: 50px;
    font-size: 14px;
    color: #999;
    .tabs {
      span {
        padding: 0 10px;
        display: inline-block;
        &.active {
          color: #3DA5FE;
          font-weight: bold;
          position: relative;
          &:after {
            content: '';
            display: block;
            width: 60%;
            height: 2px;
            background-color: #3DA5FE;
            position: absolute;
            bottom: 10px;
            left: 20%;
          }
        }
      }
    }
    .num {
      flex: 1;
      text-align: right;
      color: #c7c7c7;
    }
  }
  .check-content {
    padding-bottom: 47px;
  }
  .product-list, .sample-list {
    h2 {
      font-size: 14px;
      line-height: 50px;
      padding-left: 15px;
      color: #999;
    }
    .content {
      background-color: #fff;
    }
  }
  .list-info-cell {
    .l-list-ct:after {
      display: none;
    }
  }
}
</style>
