<template>
  <div class="shop-supply">
    <x-header class="" :left-options="{preventGoBack: true}" @on-click-back="back()">我的补货</x-header>
		<tab v-model="index" active-color="#3DA5FE">
			<tab-item v-for="(i,ins) in ['待补货','全部']" :key="ins">{{i}}</tab-item>
		</tab>
    <div class="scroll-content" ref="scrollWrap" style="top: 88px;">
      <!-- <div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div> -->
			
      <m-empty v-if="data.content && data.content.length == 0"></m-empty>
      <div class="list">
        <div class="item vux-1px-tb" v-for="item in data.content" :key="item.id" @click="toDetail(item.supplementBillNo)">
          <div class="tl vux-1px-b">
            <div class="date">{{new Date(item.supplementDate).format('yyyy-MM-dd hh:mm:ss')}}</div>
            <div class="supplying">{{item.status == 0 ? '补货中' : '已完成'}}</div>
            <div class="arrow-right"></div>
          </div>
          <div class="content">
            <div class="cell">
              <div class="name">补货单号：</div>
              <div class="value">{{item.supplementBillNo}}</div>
            </div>
            <div class="cell">
              <div class="name">补货数量：</div>
              <div class="value">{{item.goodsSupplementNum}}</div>
            </div>
            <div class="cell cell-proname">
              <div class="name">补货商品：</div>
              <div class="value">{{item.products}}</div>
            </div>
						<div class="cell" style="font-size: 12px;text-align: right;">
							<button style="background: #FFFFFF;line-height:2;padding: 0 10px;border: 1px solid #D0D0D0;border-radius: 3px;color: #666;">删除此单</button>
							<button style="background: rgb(61, 165, 254);color:#FFFFFF;line-height:2;padding: 0 10px;border: 1px solid #FFFFFF;border-radius: 3px;">去补货</button>
						</div>
          </div>
        </div>
      </div>
      <div v-if="showEnd" class="theEnd">已经到底啦</div>
    </div>
  </div>
</template>

<script>
import MEmpty from '@/components/MEmpty/index'
import { XHeader,Tab,TabItem, } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from '@/func.js'
export default {
  components: {
    XHeader,
    MEmpty,
		Tab,
		TabItem,
  },
  name: 'supply',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
			index:0,  //当前tab
      // 分页
      page: {
        pageNo: 0,
        pageSize: 10,
        totalPage: 1
      },
      data: {
      	content:[],
      },
      showEnd: false // 最后一页
    }
  },
  created() {
    this.getSupplyList()
  },
  methods: {
    /**
     * 获取我的补货单列表
     * @return {[type]} [description]
     */
    getSupplyList () {
    	this.page.pageNo++;
      $request.get('/api/supplement-invoices/v1/protected/query_page', {
        supplementType:"2",
        userNo:localStorage.getItem("userNo"),
//      status:1,//卖场补货不用传status
        pageable: {
          page: this.page.pageNo,
          size: this.page.pageSize
        }
      }).then(res => {
        if(res.success) {
          const datas ={...res.data};
          this.data.content =this.data.content.concat(res.data.content)
          this.data.content.forEach(function(item) {
            let supplyNum = 0, products = []
            // console.log(item)
            /*if(item.supplementInvoicesDetails){
            	console.log( item.supplementInvoicesDetails)
	            item.supplementInvoicesDetails.forEach(function(detail) {
	            	console.log(detail)
	              supplyNum += detail.goodsSupplementNum,
	              products.push(detail.goodsName)
	            })
            }
            item.supplyNum = supplyNum*/
            item.products = item.goodsNames
          })
          this.page.totalPage=res.data.totalPages
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
    /**
     * 去补货详情页
     * @param  {String} orderId 单号
     */
    toDetail (orderId) {
      this.$router.push({name: 'supplyDetail', query: {orderId: orderId}})
    },
    /**
     * 返回扫描页
     */
    back () {
      this.$router.push({name: 'scanEntry', query: {key: 'shopSupplying'}})
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
            _this.getSupplyList()
          } else {
            _this.showEnd = true
          }
        }
      })
    }
  },
  mounted() {
    this.$nextTick(function () {
      // this.scrollListen()
			func.scrollListen(this, this.$refs.scrollWrap, () => {
				
			})
    })
  },
  activated () {
    if(this.$route.query.refresh && 1 == this.$route.query.refresh) {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        totalPage: 1
      }
      this.data = {content:[]}
      this.showEnd = false
      this.getSupplyList()
    }
  }
}

</script>
<style lang="less">
.shop-supply {
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
