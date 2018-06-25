<template>
	<!--卖场补货给前置仓：添加商品-->
  <div class="shop-supply">
    <x-header class="vux-1px-b difer-header" :left-options="{preventGoBack:true}" @on-click-back="showbackTip=true">添加商品</x-header>
    <div class="scroll-content shop-supply-list">
      <div class="prolist" v-if="shopSupplyList&&shopSupplyList.length" v-for="e,index in shopSupplyList">
        <div class="proname vux-1px-b">
          <div class="code" >商品编码  {{e.goodsBarCode}}</div>
          <div class="name" >{{e.goodsName}}</div>
        </div>
        <!--<div v-for="e,index in preSupplyInfo.supplyItemDTOS" class="item-pre-supply">-->
    			<div class="pre-supply-title">
    				<span class="item-top-left">前置仓  {{e.targetPlaceCode}}</span>
    				<div class="title-right">
    					<span class="now-num vux-1px-r">现有库存 {{e.nowNum}}</span><span class="safe-num">安全库存 <span>{{e.safeNum}}</span></span>
    				</div>
    			</div>
    			<div class="supply-input vux-1px-t">
    				<span>补货至前置仓</span>
    				<input type="number" v-model="e.num" @input="isubtn(e.num)" pattern="[0-9]*"/>
    			</div>
      </div>
    </div>
    <div class="cm-footer">
      <div class="btn-add" @click="scan">
        <span>扫描添加商品</span>
      </div>
      <div class="btn-submit">
        <button type="button" @click="confirm" :disabled="notSubmit">提交补货信息</button>
      </div>
    </div>
     <div v-transfer-dom class="pre-confirm">
      <confirm v-model="showbackTip"
      title="确定退出补货？"
      @on-cancel="showbackTip==true"
      @on-confirm="onConfirm"
      confirm-text="确认退出">
        <p style="text-align:center;">退出后，本次补货数据将不保存</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { XHeader,TransferDomDirective as TransferDom,Confirm } from 'vux'
	
	import $request from '@/service/request.js'
	import { mapState,mapActions } from 'vuex'
	import factory from '@/factory'
	export default {
		directives: {
	    TransferDom
	  },
		components: {XHeader,Confirm},
		computed: mapState({
		    commonInfo: state => state.global.commonInfo,
		    shopSupplyList:state=>state.prePick.shopSupplyList,
		    confirmShopList:state=>state.prePick.confirmShopList
		    
		}),
		data() {
			return {
				data:[{num:0}],
				datas:[{
					
				}],
				showbackTip:false,
				notSubmit:true,
				arrs:[{num:10},{num:60},{num:20},{num:50},{num:10},{num:30},{num:80},{num:60},]
			}
		},
		created(){
			this.isubtn()
				if(this.shopSupplyList.length<=0){
					this.getGoodsInfo(this.$route.query.scanResult)
				}
		},
		methods:{
			onConfirm(){
				this.$router.back()
				this.$store.dispatch("setConfirmShopList",[])
				this.$store.dispatch("setShopSupplyList",[])
			},
			getGoodsInfo(code){
				const isExit=this.shopSupplyList.some((e,it)=>{
					return e.goodsBarCode == code
				})
				this.isubtn();
				if(!isExit){
					$request.get("/api/goods-warehouse/v1/protected/pre_place_of_goods/market_to_pre",{goodsBarCode:code}).then(res=>{
						if(res.success==true){
								this.$store.dispatch("addShopSupplyList",res.data[0])
						}else{
							this.$vux.toast.show({
					            type: 'text',
					            text: res.message
					          })
						}
					})
				}else{
					this.$vux.toast.show({
            type: 'text',
            text: '该商品已在列表中'
          })
				}
			},
			isubtn(){
				let isOk = this.shopSupplyList.some((e,index)=>{
					return e.num>0
				})
				if(isOk){
					this.notSubmit=false;
				}else{
					this.notSubmit=true;
				}
			},
			scan(){
				this.isubtn()
				if(window.cordova){
					factory.scan().then(res => {
			          //请求后台。获取商品信息
			          this.getGoodsInfo(res.text)
			        })
				}else{
						this.getGoodsInfo('2303607000007') //6901668200631
				}
			},
			confirm(){
				let isOk = this.shopSupplyList.filter((e,index)=>{
					return e.num>0
				})
				if(isOk.length>0){
					this.$store.dispatch("setConfirmShopList",isOk);
					this.$router.push({name:"confirmShopAdd",query:{id:this.$route.query.scanResult}})
				}else{
//					this.$vux.toast.show({
//          type: 'text',
//          text: res.message
//        })
				}
			},
			/*
			update(num,arrNum){
				var arr = [];
				for(var i = 0;i<arrNum.length;i++){
					arr[i] = arrNum[i];
					if(num>arrNum[i].num){
						num = num - arrNum[i].num;
						arr[i].num = arrNum[i].num
					}else{
						arr[i].num = num;
						break;
					}
				}
				return arr;
			}
			*/
		}
	}
</script>
<style lang="less">
	.shop-supply-list{
		margin-bottom: 50px;
	}
	.prolist{
		margin: 10px auto;width: 95%;background: #FFFFFF;border-radius: 3px;box-shadow: 0 0 6px 0 #cdcdcd63; padding: 10px;box-sizing: border-box;
		.proname{
			padding:6px 0;
			.code{font-size: 13px;color: #999999;}
			.name{font-size: 16px;color: #333333;line-height: 2.5;font-weight: 600;}
			
		}
		.pre-supply-title{
			display: flex;
			justify-content: space-between;
			align-items: center;line-height: 50px;
			.item-top-left{
				font-size: 14px;color: #333333;font-weight: 600;
			}
			.title-right{font-size: 12px;color: #999999;
				.now-num{color: #FF5800;padding-right: 10px;}
				.safe-num{padding-left: 9px;color: #999999;span{color: #303030;}}
			}
		}
		.supply-input{
			line-height: 50px;
			display: flex;justify-content: space-between;align-items: center;
			>span{color: #999999;font-size: 12px;}
			span:nth-child(2){
				font-size: 16px;
			}
			input{
				border: 1px solid #DDDDDD;border-radius: 4px;text-align: center;width: 140px;height: 33px;box-shadow: none;
			}
		}
	}
</style>
