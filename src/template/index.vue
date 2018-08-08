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
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 0}">
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
            <!--</div>-->
          <!--</div>-->
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 1}">
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
            </div>
          </div>
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 2}">
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
          
          <div class="group-item vux-1px-b vux-1px-l" :class="{show: showIndex == 3}">
            <group-title @click.native="toggle(3)"><i class="i-line"></i>前置仓<i class="i-arrow"></i></group-title>
            <div class="content">
              <grid :cols="2">
                <grid-item :link="{name: 'pickList'}">
                  <div class="text">
                    <h2>前置仓拣货</h2>
                    <p>接收线上订单，开始挑拣商品</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon17.png">
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
              	<grid-item :link="{name: 'concatPickList'}">
                  <div class="text">
                    <h2>合单拣货</h2>
                    <p>前置仓订单合并拣货</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon9.png">
                  </div>
                </grid-item>
                <grid-item :link="{name: 'setPrinter'}">
                  <div class="text">
                    <h2>设置打印机</h2>
                    <p>前置仓拣货前，优先设置打印设备</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon9.png">
                  </div>
                </grid-item>
              </grid>
              <grid :cols="2">
              	<grid-item :link="{name: 'test',query:{id:'1202840630069000|1205100470016021|1205100170026011'}}">
                  <div class="text">
                    <h2>测试单据</h2>
                    <p>前置仓订单合并拣货</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon9.png">
                  </div>
                </grid-item>
                <!--<grid-item :link="{name: 'setPrinter'}">
                  <div class="text">
                    <h2>设置打印机</h2>
                    <p>前置仓拣货前，优先设置打印设备</p>
                  </div>
                  <div class="img">
                    <img src="../assets/home/icon9.png">
                  </div>
                </grid-item>-->
              </grid>
            </div>
          </div>
          <!--<div>
          	<button @click="printCode">打印</button>
          	<button @click="printtext">打印文字，text方法</button>
          	<button @click="printByte">byte方法打印</button>
          	<button @click="printByte2">打印二维码</button>
          	<button @click="printCode">打印</button>
          </div>-->
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
    /*currentStore: {
      get: function() {
        let store = []
        store.push(this.commonInfo.costNumber)
        return store
      },
      set: function(newVal) {
//    	console.log("ppp",newVal)
				this.selectstore=newVal
      	return newVal
      }
    },*/
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
      blueList:[],
      inputss:"",
    }
  },
  watch:{
  	
  },
  created(){
  	this.init();
  },
  mounted() {
//	setTimeout(()=>{
//		$request.post("/api/online-order/v1/protected/batchpickdetail",['1205100770095081']).then((res)=>{
//		
//		})
//	},3000)
  	
  },
  methods: {
  	printByte(){
  		let param = {text: "我们都是好孩子09365",size: 10}
  		factory.string2Byte(param).then((res)=>{
  			alert("success"+res)
  			let params={text:'27 97 1 27 33 0 '+res}
  			factory.printBytes(params).then((res)=>{
  				alert("打印成功")
  			},(err)=>{alert("打印失败"+err)})
  		},(err)=>{
  			alert("转byte数组失败"+err)
  		})
  		
  	},
  	printByte2(){
  		let param = {text: "我们都是好孩子09365",size: 10}
  		factory.string2Byte(param).then((res)=>{
  			alert("success"+res)
  			let params={text:'27 97 1 27 33 0 '+res}
  			alert(JSON.stringify(params))
  			factory.printBytes(params).then((res)=>{
  				alert("打印成功 "+res)
	  			factory.printBytes({text:'27 33 -12 '+res}).then((res)=>{
	  				alert("第二次打印成功"+res)
	  			},(err)=>{
	  				alert("第二次打印失败"+res)
	  			})
  				
  			},(err)=>{alert("打印失败"+err)})
  		},(err)=>{
  			alert("转byte数组失败"+err)
  		})
  		
  	},
  	printtext(){
  		var param = {text: "小票：270500027719 收银员：010121212122121\n=======\n\n"};
  		factory.printText(param).then((res)=>{
  			alert("success"+res)
  		},(err)=>{
  			alert("打印失败"+err)
  		})
  	},
  	printCode(){
  		let param1 = {text:'打印二维码带下测试',size: 10};
			factory.printQRCode(param1).then(()=>{
				factory.printQRCode({text:'打印二维码带下测试',size: 20}).then(()=>{
						factory.printQRCode({text:'打印二维码带下测试',size: 30}).then(()=>{
							factory.printQRCode({text:'打印二维码带下测试',size: 40}).then(()=>{
								factory.printQRCode({text:'打印二维码带下测试',size: 50}).then(()=>{
									factory.printQRCode({text:'打印二维码带下测试',size: 100}).then(()=>{
										factory.printQRCode({text:'打印二维码带下测试',size: 55}).then(()=>{
											factory.printQRCode({text:'打印二维码带下测试',size: 22}).then(()=>{
												factory.printQRCode({text:'打印二维码带下测试',size: 33}).then(()=>{
												
											})
									})
									})
								})
							})
						})
					})
				})
			})
  	},
    storeChange (value) {
      const costName = this.$refs.storepicker.getNameValues();
      if(costName){
	      const target = this.storeList[0].filter(item=>this.currentStore==item.value)[0];
	      //切换小店时，成本中心要一起修改
		    this.$store.dispatch("changeCommonInfo", {
		    	costName:target.name,
		    	costNumber:target.value,
		    });
		    this.curr=this.currentStore;
		    //将状态保存到本地，下次进来还是当前的状态，选中的小店，上次操作的是卖场还是前置仓
    		localStorage.setItem("currentStore",this.currentStore)
		    
      }
    },
    init () {
      if(window.cordova) {
        if(Object.keys(this.commonInfo).length == 0) {
          factory.getUser().then(result => {
          	if(result.uid){
	            $request.get($conf.upmUrl + "/api/v1/public/user/" + result.uid).then(res => {
	              if(res.success) {
	                let userInfo = Object.assign(res.data);
	                res.data.costCenterNum = res.data.costNumber
	                this.$store.commit("updateCommonInfo", res.data);
	               	let className=res.data.costName.slice(res.data.costName.indexOf("-")+1)
	               	let aaa =localStorage.getItem("currentStore")?localStorage.getItem("currentStore"):this.commonInfo.costNumber;
									this.currentStore.push(aaa)
	          			const target = this.commonInfo.stores.filter(item=>this.currentStore[0]==item.storeCode)[0];
									//更新成本中心，成本中心要一起修改
								    this.$store.dispatch("changeCommonInfo", {
								    	costName:target.storeName,
								    	costNumber:target.storeCode,
//								    	isAndroid:func.isOs
								    });
//								    console.log(target,this.commonInfo)
	                //获取用户所在小店
	                $request.get("/api/shop-goods/v1/protected/query/className",{className:res.data.costName,costCenterNum:res.data.costNumber})
	                	.then(response=>{
	                		let storeInfos= response.data==null ? {} : response.data 
	                		this.$store.dispatch("changetoreInfo",storeInfos)
	                })
	              } else {
	                this.$vux.toast.show({
	                  type: 'text',
	                  text: res.message || '获取用户信息失败',
	                  onHide: () => {
	                    factory.exit()
	                  }
	                })
	              }
	            }, error => {
	              this.$vux.toast.show({
	                type: 'text',
	                text: '获取用户信息失败',
	                onHide: () => {
	                  factory.exit()
	                }
	              })
	            })
            }else{
            	this.$vux.toast.show({
	                type: 'text',
	                text: '获取用户信息失败',
	                onHide: () => {
	                  factory.exit()
	                }
	              })
            }
          })
        }
      } else {
        $request.get($conf.upmUrl + "/api/v1/public/user/" + $conf.userTest.uid).then(res => {
          if(res.success) {
            let userInfo = Object.assign(res.data);
            res.data.costCenterNum = res.data.costNumber
		        this.$store.commit("updateCommonInfo", res.data);
            let className=res.data.costName.slice(res.data.costName.indexOf("-")+1)
            let aaa =localStorage.getItem("currentStore")?localStorage.getItem("currentStore"):this.commonInfo.costNumber;
						this.currentStore.push(aaa)
//						console.log(res.data.stores)
	          let target = res.data.stores.filter(item=>this.currentStore[0]==item.storeCode)[0];
//	          console.log(target)
					//更新成本中心，成本中心要一起修改
					    this.$store.dispatch("changeCommonInfo", {
					    	costName:target.storeName,
					    	costNumber:target.storeCode,
//					    	isAndroid:func.isOs()
					    });
//					    console.log(target,this.commonInfo)
            //获取用户所在小店 .//res.data.costNumber
            $request.get("/api/shop-goods/v1/protected/query/className",{className:className,costCenterNum:'0094281202'})
            	.then(response=>{
            		let storeInfos= response.data==null ? {}: response.data
            		this.$store.dispatch("changetoreInfo",storeInfos)
            })
          } else {
            this.$vux.toast.show({
              type: 'text',
              text: res.message || '获取用户信息失败',
              onHide: () => {
                factory.exit()
              }
            })
          }
        }, error => {
          this.$vux.toast.show({
            type: 'text',
            text: '获取用户信息失败',
            onHide: () => {
              factory.exit()
            }
          })
        })
      }
    },
    back () {
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
