<template>
  <div class="home">
    <x-header :left-options="{preventGoBack: true}" @on-click-back="back()" class="vux-1px-b">库位管理</x-header>
    <scroller class="scroll-view" lock-x height="-45px">
      <div>
        <popup-picker v-if="storeList.length>0"
        	:popup-title="'请选择门店'" 
        	show-name 
        	:data="storeList" 
        	v-model="currentStore" 
        	:value-text-align="'center'" 
        	@on-change="storeChange" 
        	class="store-picker vux-1px-b" 
        	ref="storepicker"></popup-picker>
        <div class="group">
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 0}" v-if="roles.sim_receive_port">
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
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 1}" v-if="roles.sim_shopping_place">
            <group-title @click.native="toggle(1)"><i class="i-line"></i>卖场<i class="i-arrow"></i></group-title>
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
              </grid>
            </div>
          </div>
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 2}" v-if="roles.sim_back_store">
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
              </grid>
            </div>
          </div>
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 3}" v-if="roles.sim_front_store">
            <group-title @click.native="toggle(3)"><i class="i-line"></i>前置仓<i class="i-arrow"></i></group-title>
            <div class="content">
              <grid :cols="2">
                <grid-item :link="{name: 'concatPickList'}">
                  <div class="text">
                    <h2>合单拣货</h2>
                    <p>前置仓订单合并拣货</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon9.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'supplyList'}">
                  <div class="text">
                    <h2>前置仓补货单</h2>
                    <p>系统智能生成前置仓补货单</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon18.png">
                  </div>
                </grid-item>
                
              </grid>
              <grid :cols="2">
              	<grid-item :link="{name: 'scanEntry', query: {key: 'preSupply'}}">
                  <div class="text">
                    <h2>卖场补货</h2>
                    <p>将卖场商品补货至前置仓</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon9.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'wareHouseAdd'}}">
                  <div class="text">
                    <h2>后场补货</h2>
                    <p>从后场库位将商品补货至前置仓</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon3.png">
                  </div>
                </grid-item>
              </grid>
              <grid :cols="2">
                <grid-item :link="{name: 'setPrinter'}">
                  <div class="text">
                    <h2>设置打印机</h2>
                    <p>前置仓拣货前，优先设置打印设备</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon9.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'scanEntry', query: {key: 'preExchange'}}">
                  <div class="text">
                    <h2>商品互换</h2>
                    <p>在前置仓对商品进行替换、移位等操作</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon19.png">
                  </div>
                </grid-item>
              </grid>
              <grid :cols="2">
              	<grid-item :link="{name: 'dataListHome'}">
                  <div class="text">
                    <h2>数据报表</h2>
                    <p>前置仓订单数据展示</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon20.png">
                  </div>
                </grid-item>
              </grid>
            </div>
          </div>
          <!--<input type="number" pattern="[0-9]*"/>-->
        </div>
      </div>
    </scroller>
  </div>
</template>


<script>
import MHeader from '@/components/MHeader/index'
import { mapState,mapActions, mapGetters } from 'vuex';
import { TransferDom, Scroller, XHeader, PopupPicker, Grid, GridItem, GroupTitle } from 'vux'
import factory from '@/factory'
import $request from '@/service/request.js'
import $conf from 'configuration'
import func from '@/func.js'
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
      showIndex:localStorage.getItem("showIndex") ? localStorage.getItem("showIndex") : 0,
      selectstore:'',
      currentStore:[],
      aaa:this.commonInfo,
      data:{},
      roles:{'sim_receive_port':false,'sim_shopping_place':false,'sim_back_store':false,'sim_front_store':false}
    }
  },
  watch:{
  	
  },
  created(){
  	/*let obj ={a:1,b:2}
  	let c = {...obj,c:3}*/
  },
  mounted() {
  	let _this=this;
	setTimeout(()=>{
  		_this.init();
		factory.hideNav();
	},1000)
  	
  },
  methods: {
    storeChange (value) {
      const costName = this.$refs.storepicker.getNameValues();
      if(costName){
	      const target = this.storeList[0].filter(item=>this.currentStore[0]==item.value)[0];
	      //切换小店时，成本中心要一起修改
		    this.$store.dispatch("changeCommonInfo", {
		    	costName:target.name,
		    	costNumber:target.value,
		    });
		    localStorage.setItem("costNumber",this.currentStore[0])  //成本中心
		    localStorage.setItem("currentStore",this.currentStore[0])
		    localStorage.setItem("costName",target.name);
		    console.log(target.name)
		    this.getUserInfo ()
      }
    },
    getUserInfo(){
    	let lists = Object.keys(this.roles)
		  lists.forEach((n)=>{this.roles[n]=false})
		  /*this.currentStore=[]
		  let currentObj =localStorage.getItem("currentStore");
			this.currentStore[0]=currentObj*/
    		$request.get($conf.simUrl + "/api/user-permit/v1/protected/userinfo").then(res => {
		      if(res.success) {
		        let userInfo = Object.assign(res.data.sysUser);
		        res.data.sysUser.costCenterNum = res.data.sysUser.costNumber
		        this.$store.commit("updateCommonInfo", res.data.sysUser);
		        localStorage.setItem("currentStore",res.data.sysUser.currentStoreCode)
//		        alert(localStorage.getItem('currentStore')+'-----')
		  			const target = res.data.sysUser.stores.filter(item=>this.currentStore[0]==item.storeCode)[0];
			          for(var i=0;i<lists.length;i++){
					    			res.data.sysMenuTree.forEach(e=>{
						    			if(e.data.permission==lists[i]){
						    				this.roles[lists[i]]=true;
						    			}
					    			})
					    	}
			          console.log(this.roles)
								//更新成本中心，成本中心要一起修改					
							    this.$store.commit("updateCommonInfo", {
							    	costName:target.storeName,
							    	costNumber:target.storeCode,
							    });
							    localStorage.setItem("costNumber",target.storeCode)
		      } else {
		       this.$vux.toast.show({
		          type: 'text',
		          text: res.message || '获取用户信息失败2',
		          onHide: () => {
									localStorage.setItem("currentStore",'')
		            factory.exit()
		          }
		        })
		      }
		    })
    },
    init () {
    	let lists = Object.keys(this.roles)
		  lists.forEach((n)=>{this.roles[n]=false})
     if(window.cordova) {
        if(Object.keys(this.commonInfo).length == 0) {
         factory.getUser().then(result => {
          	if(result.info.userNo){
          		localStorage.setItem("userNo",result.info.userNo)
	            $request.get($conf.simUrl + "/api/user-permit/v1/protected/userinfo").then(res => {
//	            	alert(JSON.stringify(res))
	              if(res.success) {
//	              	alert(JSON.stringify(res))
									localStorage.setItem("currentStore",res.data.sysUser.currentStoreCode)
									this.currentStore[0]=res.data.sysUser.currentStoreCode
	                let userInfo = Object.assign(res.data.sysUser);
	                res.data.sysUser.costCenterNum = res.data.sysUser.costNumber
	                this.$store.commit("updateCommonInfo", res.data.sysUser);
	          			const target = res.data.sysUser.stores.filter(item=>this.currentStore[0]==item.storeCode)[0];
				          for(var i=0;i<lists.length;i++){
						    			res.data.sysMenuTree.forEach(e=>{
							    			if(e.data.permission==lists[i]){
							    				this.roles[lists[i]]=true;
							    			}
						    			})
						    	}
									//更新成本中心，成本中心要一起修改					
								    this.$store.commit("updateCommonInfo", {
								    	costName:target.storeName,
								    	costNumber:target.storeCode,
								    });
								    localStorage.setItem("costNumber",target.storeCode)
								    localStorage.setItem("costName",target.storeName)
	              } else {
	               this.$vux.toast.show({
	                  type: 'text',
	                  text: res.message || '获取用户信息失败2',
	                  onHide: () => {
											localStorage.setItem("currentStore",'')
	                    factory.exit()
	                  }
	                })
	              }
	            }).catch((err)=>{
//	            	alert(err)
	            })
            }else{
            	this.$vux.toast.show({
	                type: 'text',
	                text: '获取底座用户信息失败',
	                onHide: () => {
									localStorage.setItem("currentStore",'')
	                  factory.exit()
	                }
	              })
            }
          }).catch((err)=>{
//        	alert(err)
          })
        }
      } else {
    		localStorage.setItem("userNo",$conf.userTest.uid)
    		localStorage.setItem("currentStore",'')
      	$request.get($conf.simUrl+"/api/user-permit/v1/protected/userinfo").then(res=>{
		    		if(res.success) {
							localStorage.setItem("currentStore",res.data.sysUser.currentStoreCode)
							this.currentStore[0]=res.data.sysUser.currentStoreCode
		    			localStorage.setItem("userNo",$conf.userTest.uid)
		    			let userInfo = Object.assign(res.data.sysUser);
	            res.data.sysUser.costCenterNum = res.data.sysUser.costNumber
			        this.$store.commit("updateCommonInfo", res.data.sysUser);
	          	let target = res.data.sysUser.stores.filter(item=>this.currentStore[0]==item.storeCode)[0];
		          for(var i=0;i<lists.length;i++){
				    			res.data.sysMenuTree.forEach(e=>{
					    			if(e.data.permission==lists[i]){
					    				this.roles[lists[i]]=true;
					    			}
				    			})
				    	}
//		          console.log(this.currentStore)
						//更新成本中心，成本中心要一起修改
						if(target){
				    this.$store.commit("updateCommonInfo", {
				    	costName:target.storeName,
				    	costNumber:target.storeCode,
				    })
				     localStorage.setItem("costName",target.storeName)
				   }
						
						console.log(localStorage.getItem("costName"))
          }else{
          	this.$vux.toast.show({
              type: 'text',
              text: res.message || '获取用户信息失败2',
              onHide: () => {
								localStorage.setItem("currentStore",'')
                factory.exit()
              }
            })
          }
		    })
      }
    },
    back () {
			localStorage.setItem("currentStore",'')
      factory.exit()
    },
    toggle (index) {
      this.showIndex = index;
      localStorage.setItem("showIndex",this.showIndex)
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
    	/*transition: all 6s;
    	max-height: 380px;*/
    	.weui-cells__title{
    		background-color: #3891E7;
    		color: #FFFFFF;
    		.i-line{
    			background: #FFFFFF;
    		}
    		.i-arrow{
    			border-color:#FFFFFF;
    		}
    	}
      .content {
        height: auto;
        max-height: 380px;
        transition: max-height 2s;
        -webkit-transition: max-height 1s;
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
