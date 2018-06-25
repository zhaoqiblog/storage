<template>
	<div>
		<x-header class="difer-header" :left-options="{preventGoBack:true}" @on-click-back="showbackTip=true">库位商品信息</x-header>
		<div class="header-wrap pre-header-wrap">
			<div class="shopName vux-1px-tb"><i></i>{{this.commonInfo.costName}}</div>
				<div class="totalNums">
					<dl>
						<dt>{{$route.query.scanResult}}</dt>
						<dd>库位码</dd>
					</dl>
					<dl>
						<dt>{{dataList.goodsSize}}</dt>
						<dd>SKU数量</dd>
					</dl>
					<dl>
						<dt>{{dataList.sumAvailableNum}}</dt>
						<dd>库存数量</dd>
					</dl>
				</div>
		</div>
		<div class="scroll-content pre-back-wrap">
			<div class="prolist" v-if="backSupplyList&&backSupplyList.length" v-for="e,index in backSupplyList">
		        <div class="proname vux-1px-b">
		          <div class="code" >商品编码  {{e.goodsBarCode}}</div>
		          <div class="name" >{{e.goodsName}}</div>
		        </div>
    			<div class="pre-supply-title">
    				<span class="item-top-left">前置仓  {{e.frontWarehouseCode}}</span>
    				<div class="title-right">
    					<span class="now-num vux-1px-r">现有库存 {{e.frontNowNum}}</span><span class="safe-num">安全库存 <span>{{e.safeNum}}</span></span>
    				</div>
    			</div>
    			<div class="supply-input vux-1px-t">
    				<span>补货至前置仓</span>
    				<input type="number" v-model="e.count" @input="isubtn(e.count,index)" pattern="[0-9]*"/>
    			</div>
    			<p class="tips" v-if="e.isOver">库位现有数量为:{{e.availableNum}}&nbsp;不能超过现有库存数量！</p>
		    </div>
				
				<div class="goodsList">
					<m-empty v-if="showEmpty"></m-empty>
				</div>
			<!--</scroller>-->
		</div>
		<div class="cm-footer">
			<div class="btn-submit">
				<!--:disabled=""-->
				<button type="button" @click="toConfirmApply" :disabled="isDisable">提交补货信息</button>
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
	import MEmpty from '@/components/MEmpty/index'
	import { XHeader, TransferDomDirective as TransferDom,Confirm } from 'vux'
	import $request from '@/service/request.js'
	import { mapGetters, mapState } from 'vuex'
	//import
	export default {
		directives: {
	    TransferDom
	  },
		components: {
			XHeader,
			MEmpty,Confirm
		},
		data() {
			return {
				dataList:{},
				showEmpty: false,
				isDisable:true,
				showbackTip:false,
			}
		},
		computed: {
			...mapState({
				commonInfo: state => state.global.commonInfo,
				backSupplyList:state=>state.prePick.backSupplyList,
				backConfirmList:state=>state.prePick.backConfirmList,
			})
		},
		created() {
			
//			if(this.backSupplyList.length<=0){
				this.getGoodsInCode()
//			}else{
				if(this.backSupplyList.some((e)=>{return e.count>0})){
					this.isDisable=false;
				}
//			}
		},
		methods: {
			/*
			 * 获取库位上商品信息
			 */
			getGoodsInCode(){
				const obj = {
				warehousePlaceCode: this.$route.query.scanResult,
				costCenterNum: this.commonInfo.costNumber,
				warehouseType: 0,
				//			costCenterNum:'0090120001'
			}
				$request.get("/api/goods-warehouse/v1/protected/query_warehouse/back_to_pre", {warehousePlaceCode:this.$route.query.scanResult}).then(res => {
				if(res.success == true) {
					this.showEmpty = res.data.goodsInfo.length > 0 ? false : true
					this.dataList=res.data
					if(this.backSupplyList.length<=0){
						this.$store.dispatch("setBackSupplyList", res.data.goodsInfo.map((e)=>{
							return {...e,count:""}
						}))
					}
				} else {
					this.$router.push({path: '/fail',query: {text: res.message || '获取库位上商品信息失败,请重试!',title: '仓库补货至前置仓',path: '/scanEntry?key=wareHouseAdd'}})
				}
			}).catch(err => {
				this.$router.push({
					path: '/fail',
					query: {
						text: '获取库位上商品信息失败,请重试!',
						title: '仓库补货至前置仓',
						path: '/scanEntry?key=wareHouseAdd'
					}
				})
			})
			},
			//输入框事件的点击行为
			isubtn(value,index){
				this.isDisable = this.backSupplyList.some((e)=>{return e.count >0}) ? false : true;
				if(value>this.backSupplyList[index].availableNum){
					this.backSupplyList[index].isOver=true;
					this.backSupplyList[index].count=this.backSupplyList[index].availableNum;
				}else{
					this.backSupplyList[index].isOver=false;
					
				}
			},
			//提交补货申请
			toConfirmApply() {
				this.$store.commit("setBackConfirmList", this.backSupplyList.filter((n) => {
					return n.count > 0
				}))
				this.$router.push({
					path: 'wareHouseConfirm',
					query: {
						scanResult: this.$route.query.scanResult,
						goodsSize: this.dataList.goodsSize,
						sumAvailableNum: this.dataList.sumAvailableNum
					}
				})
			},
			onConfirm(){
				this.$router.back()
				this.$store.dispatch("setBackSupplyList",[])
				this.$store.dispatch("setBackConfirmList",[])
			}
		}
	}
</script>
<style lang="less">
.pre-back-wrap{
	top: 165px;margin-bottom: 50px;
	.tips{
		color: red;
		font-size: 10px;text-align: right;
	}
}

.pre-header-wrap{
	.shopName{
		text-align: center;background: #FFFFFF;height: 40px;line-height: 40px;color: #303030;
	}
	.totalNums dl:nth-child(1){
		/*text-align: left;*/
	}
}
.difer-header{
	background: #3DA5FE !important;
	color: #FFFFFF;
	.vux-header-title{
		color: #FFFFFF !important;
		letter-spacing: 1px;font-weight: 600;
	}
	.vux-header-left .left-arrow{
		background: url(../../../assets/white-arrow.png) center center no-repeat;
	}
}
.pre-back-wrap{
	.empty{margin-top: -90px;}
}
</style>