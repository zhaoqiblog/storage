<template>
  <div class="home">
    <x-header :left-options="{preventGoBack: true}" @on-click-back="back()" class="vux-1px-b">库位管理</x-header>
    <scroller class="scroll-view" lock-x height="-45px">
      <div>
        <popup-picker 
        	:popup-title="'请选择门店'" 
        	show-name 
        	:data="storeList" 
        	v-model="currentStore" 
        	:value-text-align="'center'" 
        	@on-change="storeChange()" 
        	class="store-picker vux-1px-b" 
        	ref="storepicker"></popup-picker>
        <div class="group">
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex === 0}">
            <group-title @click.native="toggle(0)"><i class="i-line"></i>收货口<i class="i-arrow"></i></group-title>
            <div class="content">
              <grid :cols="2">
                <grid-item :link="{name: 'scanEntry', query: {key: 'sampling'}}">
                  <div class="text">
                    <h2>商品抽检</h2>
                    <p>抽检门店贵重商品，检查物流配送质量</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico2.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'receive'}}">
                  <div class="text">
                    <h2>托盘收货</h2>
                    <p>确认托盘及抽检状态，完成收货</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico1.png">
                  </div>
                </grid-item>
                
              </grid>
              <grid :cols="2">
              	<grid-item :link="{name: 'scanEntry', query: {key: 'directOrderInfo'}}">
                  <div class="text">
                    <h2>直送收货</h2>
                    <p>供应商直送商品收货</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico14.png">
                  </div>
                </grid-item>
              </grid>
            </div>
          </div>
          <!--<div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex === 1}">
            <group-title @click.native="toggle(1)"><i class="i-line"></i>周转区<i class="i-arrow"></i></group-title>
            <div class="content">-->
              <!-- <grid :cols="2">
                <grid-item :link="{name: 'scanEntry', query: {key: 'goodsToMall'}}">
                  <div class="text">
                    <h2>商品上架</h2>
                    <p>将周转区的托盘商品直接上架至卖场</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico5.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'goodsTostore'}}">
                  <div class="text">
                    <h2>商品入库</h2>
                    <p>将托盘的商品送至目标库位并完成入库</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico4.png">
                  </div>
                </grid-item>
              </grid> -->
              <!--<grid :cols="2">
                <grid-item :link="{name: 'scanEntry', query: {key: 'goodsTostore'}}">
                  <div class="text">
                    <h2>商品入库</h2>
                    <p>将商品送至目标库位并完成入库</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico4.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'trayStorage'}}">
                  <div class="text">
                    <h2>托盘入库</h2>
                    <p>托盘送至库位，并与库位进行关联</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico3.png">
                  </div>
                </grid-item>
              </grid>-->
            <!--</div>-->
          <!--</div>-->
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex === 3}">
            <group-title @click.native="toggle(3)"><i class="i-line"></i>卖场<i class="i-arrow"></i></group-title>
            <div class="content">
              <grid :cols="2">
                <grid-item :link="{name: 'scanEntry', query: {key: 'shopSupplying'}}">
                  <div class="text">
                    <h2>卖场补货</h2>
                    <p>在卖场查询商品库存信息，进行补货操作</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico10.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'shopReturnWarehouse'}}">
                  <div class="text">
                    <h2>卖场还货</h2>
                    <p>将卖场商品返回至仓库的目标库位</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico12.png">
                  </div>
                </grid-item>
                <!--<grid-item :link="{name: 'scanEntry', query: {key: 'shopBackOrder'}}">
                  <div class="text">
                    <h2>卖场返配</h2>
                    <p>将卖场的返配商品转移至返配库位</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico11.png">
                  </div>
                </grid-item>-->
              </grid>
              <grid :cols="2">
                <!--<grid-item :link="{name: 'scanEntry', query: {key: 'shopReturnWarehouse'}}">
                  <div class="text">
                    <h2>卖场还货</h2>
                    <p>将卖场商品返回至仓库的目标库位</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico12.png">
                  </div>
                </grid-item>-->
              </grid>
            </div>
          </div>
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex === 2}">
            <group-title @click.native="toggle(2)"><i class="i-line"></i>后场<i class="i-arrow"></i></group-title>
            <div class="content">
            	<grid :cols="2">
                <grid-item :link="{name: 'scanEntry', query: {key: 'trayStorage'}}">
                  <div class="text">
                    <h2>托盘入库</h2>
                    <p>托盘送至库位，并与库位进行关联</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico3.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'goodsTostore'}}">
                  <div class="text">
                    <h2>商品入库</h2>
                    <p>将商品送至目标库位并完成入库</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico4.png">
                  </div>
                </grid-item>
              </grid>
              <grid :cols="2">
              	 <grid-item :link="{name: 'scanEntry', query: {key: 'woreHouse'}}">
                  <div class="text">
                    <h2>仓库补货</h2>
                    <p>从仓库将商品补货至卖场</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico7.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'selectMergeGoods'}}">
                  <div class="text">
                    <h2>库位合并</h2>
                    <p>将两个库位的商品进行合并</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico6.png">
                  </div>
                </grid-item>
               
              </grid>
              <grid :cols="2">
                <grid-item :link="{name: 'scanEntry', query: {key: 'inventory'}}">
                  <div class="text">
                    <h2>库位盘点</h2>
                    <p>盘点库位内商品的实际库存</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico8.png">
                  </div>
                </grid-item>
                <!-- <grid-item :link="{name: 'scanEntry', query: {key: 'backMatck'}}">
                <div class="text">
                  <h2>后场返配</h2>
                  <p>将仓库的返配商品转移至返配库位</p>
                </div>
                <div class="img">
                  <img src="../assets/home/ico9.png">
                </div>
              </grid-item> -->
              </grid>
            </div>
          </div>
          
          <!--<div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex === 4}">
            <group-title @click.native="toggle(4)"><i class="i-line"></i>返配仓库<i class="i-arrow"></i></group-title>
            <div class="content">
              <grid :cols="2">
                <grid-item :link="{name: 'scanEntry', query: {key: 'backLogistics'}}">
                  <div class="text">
                    <h2>物流返配</h2>
                    <p>将返配库位的商品返配至物流</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico13.png">
                  </div>
                </grid-item>
              </grid>
            </div>
          </div>-->
          <!--<div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex === 5}">-->
            <!--<group-title @click.native="toggle(5)"><i class="i-line"></i>直送<i class="i-arrow"></i></group-title>-->
            <!--<div class="content">-->
              <!--<grid :cols="2">-->
                <!--<grid-item :link="{name: 'scanEntry', query: {key: 'directOrderInfo'}}">
                  <div class="text">
                    <h2>直送收货</h2>
                    <p>供应商直送商品收货</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/ico14.png">
                  </div>
                </grid-item>-->
                <!-- <grid-item :link="{name: 'scanEntry', query: {key: 'directAddGoods'}}">
                <div class="text">
                  <h2>直送上架</h2>
                  <p>将直送的商品直接上卖场</p>
                </div>
                <div class="img">
                  <img src="../assets/home/ico11.png">
                </div>
              </grid-item> -->
              <!--</grid>-->
              <!-- <grid :cols="2">
              <grid-item :link="{name: 'scanEntry', query: {key: 'directAddToStore'}}">
                <div class="text">
                  <h2>直送入库</h2>
                  <p>将直送商品送至目标库位并完成入库</p>
                </div>
                <div class="img">
                  <img src="../assets/home/ico12.png">
                </div>
              </grid-item>
            </grid> -->
            <!--</div>-->
          <!--</div>-->
        </div>
      </div>
    </scroller>
  </div>
</template>


<script>
import MHeader from '@/components/MHeader/index'
import { mapState } from 'vuex';
import { TransferDom, Scroller, XHeader, PopupPicker, Grid, GridItem, GroupTitle } from 'vux'
import factory from '@/factory'

export default {
  directives: {
    TransferDom
  },
  components: {
    Scroller,
    XHeader,
    PopupPicker,
    Grid,
    GridItem,
    GroupTitle
  },
  name: 'home',
  computed: {
    currentStore: {
      get: function() {
        let store = []
        /*if(this.commonInfo.stores && this.commonInfo.stores.length >= 1) {
          store.push(this.commonInfo.stores[0].storeName)
        } else {
          store.push(this.commonInfo.costName)
        }*/
        store.push(this.commonInfo.costNumber)
        return store
      },
      set: function(newVal) {
//    	console.log("ppp",newVal)
				this.selectstore=newVal
      	return newVal
      }
    },
    storeList: function() {
      let store = [], stores = [];
      if(this.commonInfo.stores && this.commonInfo.stores.length >= 1) {
        this.commonInfo.stores.forEach(function(item) {
          store.push({
            name: item.storeName,
            value: item.storeCode
          })
        })
      } else {

        store.push({
          name: this.currentStore,
          value: this.currentStore
        })
      }
      stores.push(store)
      return stores
    },
    ...mapState({
      commonInfo: state => state.global.commonInfo
    })
  },
  data() {
    return {
    	curr:[],
      showIndex: 0,
      selectstore:'',
      // storeList: [[{name: '永辉-阳光天地店', value: '永辉-阳光天地店'}]]
    }
  },
  created() {
  },
  methods: {
    storeChange (value) {
      const costName = this.$refs.storepicker.getNameValues();
      if(costName){
	      const target = this.storeList[0].filter(item=>this.selectstore==item.value)[0];
//	      console.log(target)
		    this.$store.dispatch("changeCommonInfo", {
		    	costName:target.name,
		    	costNumber:target.value,
//		    	costCenterNum:target.value,
		    });
//		    this.currentStore.splice(0,1,target.name);
		    this.curr=this.currentStore;
		    console.log(this.commonInfo)
      }
    },
    back () {
      factory.exit()
    },
    toggle (index) {
//    console.log(index)
      this.showIndex = index
    }
  }
}

</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
// 门店选择
.store-picker {
  background-color: #fff;
  &:before {
    display: none;
  }
  &:after {
    border-color: #D5D9DE;
  }
  .weui-cell {
    height: 41px;
    box-sizing: border-box;
    padding: 8px 15px;
  }
}
// popupPicker样式复写
.vux-popup-header {
  background-color: #f4f4f4!important;
}
.vux-popup-header-left,.vux-popup-header-right {
  color: #198CFA!important;
}

.home {
  text-align: center;
  .weui-cells__title {
    font-size: 16px;
    color: #999;
    text-align: left;
    margin: 0;
    line-height: 40px;
    padding: 0 15px 0 25px;
    position: relative;
  }
  .weui-grid {
    padding: 15px 12px 15px 16px;
    display: flex;
    align-items: center;
    h2 {
      font-size: 15px;
      color: #333;
      line-height: 20px;
      margin-bottom: 2px;
      text-align: left;
    }
    p {
      font-size: 11px;
      line-height: 16px;
      color: #999;
      text-align: left;
    }
    .text {
      flex: 1;
    }
    .img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 10px;
      img {
        width: 100%;
      }
    }
  }
  .i-line {
    display: block;
    width: 3px;
    height: 14px;
    background-color: #198CFA;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 15px;
    margin-top: -7px;
  }
  .i-arrow {
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C7C7C7;
    border-style: solid;
    transform: rotate(-45deg);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -3px;
    right: 15px;
  }
  .group {
    padding-bottom: 25px;
  }
  .group-item {
    margin-top: 10px;
    background-color: #fff;
    .content {
      height: 0;
      overflow: hidden;
    }
    &.show {
      .content {
        height: auto;
        transition: all .4s;
      }
      .i-arrow {
        transform: rotate(135deg);
        margin-top: -6px;
        transition: all .4s;
      }
    }
    &:after {
      border-color: rgba(0,0,0,0.11);
    }
    &:before {
      left: 50%;
      top: 40px;
      border-color: #D5D9DE;
    }
    .weui-grid {
      &:after, &:before {
        display: none;
      }
    }
  }
  .weui-grids:after {
    display: none;
  }
  .vux-cell-value {
    color: #303030;
    font-size: 14px;
  }
}
</style>
