<template>
  <div class="back-logistics">
    <x-header class="vux-1px-b" :left-options="{preventGoBack: true}" @on-click-back="back()">我的返配</x-header>
    <div class="scroll-content" ref="scrollWrap">
      <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>
      <m-empty v-if="data.content && data.content.length === 0"></m-empty>
      <div class="list">
        <div class="item vux-1px-tb" v-for="item in data.content" :key="item.id" @click="toDetail(item.returnBillNo)">
          <div class="tl vux-1px-b">
            <div class="date">{{item.operateDate}}</div>
            <div class="arrow-right"></div>
          </div>
          <div class="content">
            <div class="cell">
              <div class="name">返配单号：</div>
              <div class="value">{{item.returnBillNo}}</div>
            </div>
            <div class="cell">
              <div class="name">返配数量：</div>
              <div class="value">{{item.operateTotalNum}}</div>
            </div>
            <div class="cell cell-proname">
              <div class="name">返配商品：</div>
              <div class="value">
                {{item.operateGoodsName}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showEnd && data.content && data.content.length > 0" class="theEnd">已经到底啦</div>
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
    MEmpty,
    XHeader
  },
  name: 'backLogistics',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
      // 分页
      page: {
        pageNo: 1,
        pageSize: 10,
        totalPage: 1
      },
      isEmpty: false, // 数据为空
      data: {},
      showEnd: false // 最后一页
    }
  },
  created() {
    this.getBackLogistics()
  },
  methods: {
    /**
     * 获取我的返配单列表
     * @return {[type]} [description]
     */
    getBackLogistics () {
      $request.get('/api/return-operate/v1/protected/queryPage', {
        pageable: {
          page: this.page.pageNo,
          size: this.page.pageSize
        }
      }).then(res => {
        if(res.success) {
          this.data = res.data
          this.page.totalPage = res.data.totalPages
          if(this.page.totalPage === 1) {
            this.showEnd = true
          }
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 去返配详情页
     * @param  {String} orderId 单号
     */
    toDetail (orderId) {
      this.$router.push({name: 'backLogisticsDetail', query: {orderId: orderId}})
    },
    /**
     * 返回扫描页
     */
    back () {
      this.$router.push({name: 'scanEntry', query: {key: 'backLogistics'}})
    },
    /**
     * 监听滚动事件触发下拉加载
     */
    scrollListen () {
      const _this = this
      let anchor = this.$refs.scrollWrap
      anchor.addEventListener('scroll', function() {
        var scrollTop = document.body.scrollTop;
        let top=anchor.scrollTop,
            sh=anchor.scrollHeight,
            ch=anchor.clientHeight;
        if(sh==top+ch) {
          // 触发加载数据
          if(_this.page.pageNo < _this.page.totalPage) {
            _this.page.pageNo++
            _this.getBackLogistics()
          } else {
            _this.showEnd = true
          }
        }
      })
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.scrollListen()
    })
  }
}

</script>
<style lang="less">
.back-logistics {
  .item {
      margin-top: 10px;
      background-color: #fff;
    .tl {
      display: flex;
      font-size: 12px;
      line-height: 33px;
      padding: 0 15px;
      align-items: center;
      justify-content: center;
      .date {
        flex: 1;
        color: #999;
      }
      .supplying {
        color: #FFA948;
      }
      .completed {
        color: #77D151;
      }
      .arrow-right {
        width: 6px;
        height: 6px;
        border-top: 1px solid #999;
        border-right: 1px solid #999;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        margin-left: 5px;
      }
    }
    .content {
      padding: 10px 15px;
      line-height: 1.5;
      text-align: justify;
      color: #666;
    }
    .cell {
      display: flex;
      font-size: 14px;
      font-weight: bold;
      .value {
        flex: 1;
      }
      &.cell-proname {
        color: #999;
        font-weight: normal;
      }
    }
  }
  .theEnd {
    font-size: 14px;
    line-height: 1;
    margin: 16px 0;
    color: #bbb;
    text-align: center;
  }
}
</style>
