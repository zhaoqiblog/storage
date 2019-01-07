<template>
	<div class="shop-supply pick-supply">
		<x-header class="vux-1px-b">移动货位确认</x-header>
		<div class="scroll-content pre-content pre-content-pic" ref="scrollWrap">
			<dl class="pick-statius-tip re-rimg">
				<dt>准备移动商品货位</dt>
				<dd>请认真核对商品的移位信息，再点击确认。</dd>
			</dl>
			<div class="concat-list-wrap">
				<div class="re-t-tip">
					<dl>
						<dt>原货位</dt>
						<dd>{{lRemoveGoods.warehouseCode}}</dd>
					</dl>
					<dl>
						<dt>目标货位</dt>
						<dd>{{targetCode}}</dd>
					</dl>
				</div>
				<div v-if="lRemoveGoods">
					<!--<p>111</p>-->
					<pic-exchange-item 
						titleInfo="原货位商品"
						:warehouseCode="'将移至目标货位  '+targetCode"	
						:imgurl="lRemoveGoods.imgurl"
			    		:name="lRemoveGoods.goodsName"
			    		:code="lRemoveGoods.goodsBarCode"
			    		type="rInput"
			    		:nowNum="lRemoveGoods.availableNum"
			    		:safeNum="lRemoveGoods.safeNum"
			    		:data = "lRemoveGoods"
			    		@inputNow="changeNow"
			    		@inputSafe="changeSafe"
					/>
				</div>
				<div v-if="data&&data.goodsBarCode">
					<!--<p>222</p>-->
					<!--货位上有商品时，正常情况-->
					<pic-exchange-item 
						titleInfo="目标货位商品"
						:warehouseCode="'将移至原货位  '+lRemoveGoods.warehouseCode"	
						:imgurl="data.imgurl"
			    		:name="data.goodsName"
			    		:code="data.goodsBarCode"
			    		type="rInput"
			    		:nowNum="data.availableNum"
			    		:safeNum="data.safeNum"
			    		:data='data'
			    		@inputNow="changeRightNow"
			    		@inputSafe="changeRightSafe"
					/>
				</div>
				<div v-if="!data">
					<!--<p>333</p>-->
					<pic-exchange-item 
						:data='data'
						titleInfo="目标货位商品"
						:warehouseCode="'将移至原货位  '+lRemoveGoods.warehouseCode"	
					/>
				</div>
				<div>
					
				</div>
			</div>
		</div>
		<div class="cm-footer">
			<div class="btn-add btn-left">
				<router-link to="/">
					<span>取消</span>
				</router-link>
			</div>
			<div class="btn-submit">
				<!--<router-link :to="{name: 'removeSuccess'}">-->
				<!-- {{lRemoveGoods.safeNum}} -->
				<!-- {{data.safeNum}} -->
				<!-- {{data.data}} -->
				<!-- :disabled="lRemoveGoods.safeNum==''||lRemoveGoods.availableNum==''||data.safeNum==''||data.data==''" -->
					<button type="button" @click="submitRemove" 
					:disabled="data? lRemoveGoods.safeNum==''||lRemoveGoods.availableNum==''||data.safeNum==''||data.data=='' :lRemoveGoods.safeNum==''||lRemoveGoods.availableNum=='' "
					
					>确定</button>
				<!--</router-link>-->
			</div>
		</div>
	</div>
</template>

<script>
	import { XHeader,} from 'vux'
	import { mapState,mapActions } from 'vuex';
	import factory from '@/factory.js'
	import $request from '@/service/request.js'
	import func from "@/func.js"
	export default {
		components: {
			XHeader,
		},
		name: 'concat-detail',
		computed: mapState({
			commonInfo: state => state.global.commonInfo,
   			lRemoveGoods:state=>state.preExchange.lRemoveGoods,
			removeResult:state => state.preExchange.removeResult,
		}),
		data() {
			return {
				data: {},
				targetCode:'',
			}
		},
		created() {
			let code = this.$route.query.code;
			this.targetCode=code.substr(0,2)+"-"+code.substr(2,2)+"-"+code.substr(4);
			this.getPickingInfo(code);
		},
		destory() {
			clearInterval(this.int)
		},
		methods: {
			/**获取前置仓商品库位信息*/
			getPickingInfo(val) {
				$request.get("/api/goods-front-warehouse/v1/protected/queryplace/warehouse", {warehouseCode: val}).then((res) => {
					if(res.success == true) {
						this.data = res.data
						if(res.data){
							this.data.warehouseCode = res.data.warehouseCode.substr(0,2)+"-"+res.data.warehouseCode.substr(2,2)+"-"+res.data.warehouseCode.substr(4)
						}
					}else{
						this.$vux.toast.show({
			                type: 'text',
			                text: res.message,
			                time:1000,
			                onHide: () => {
			                 	this.$router.back()
					        }
			            })
					}
				}).catch(err=>{
					this.$vux.toast.show({
		                type: 'text',
		                text: '系统开小差了，请稍后再试或者更换其他库位哦',
		                time:0,
		                onHide: () => {
		                 	this.$router.back()
				        }
		            })
				})
			},
			/*确认移动*/
			submitRemove(){
				let obj = {
				  "leftGoodsBarCode": this.lRemoveGoods.goodsBarCode,
				  "leftGoodsCode":this.lRemoveGoods.goodsCode,
				  "leftGoodsName": this.lRemoveGoods.goodsName,
				  "leftImgurl": this.lRemoveGoods.imgurl,
				  "leftWarehouseCode": this.lRemoveGoods.warehouseCode.split("-").join(""),
				  "leftAvailableNum": this.lRemoveGoods.availableNum,
				  "leftSafeNum": this.lRemoveGoods.safeNum,
				  "rightAvailableNum":this.data ? this.data.availableNum : null,
				  "rightGoodsBarCode": this.data ? this.data.goodsBarCode: '',
				  "rightGoodsCode":this.data?this.data.goodsCode:'',
				  "rightGoodsName": this.data ? this.data.goodsName: '',
				  "rightImgurl": this.data ? this.data.imgurl: '',
				  "rightSafeNum": this.data ? this.data.safeNum: null,
				  "rightWarehouseCode": this.targetCode.split("-").join(""),
				}
				$request.post("/api/goods-front-warehouse/v1/protected/exchange",obj).then(res=>{
					if(res.success){
						this.$store.commit("setRemoveResult",res.data)
						this.$router.push({name:'removeSuccess'})
					}else{
						this.$router.push({name:'failPage',query:{title:'前置仓商品状态',text:'商品移位失败',info:res.message,btn1Link:'/scanEntry?key=preExchange',btn1Text:'前置仓商品',btn2Link:'/',btn2Text:'返回库位管理',}})
					}
				}).catch(err=>{
					this.$router.push({name:'failPage',query:{title:'前置仓商品状态',text:'商品移位失败',info:'服务器错误，请联系管理员1',btn1Link:'/scanEntry?key=preExchange',btn1Text:'前置仓商品',btn2Link:'/',btn2Text:'返回库位管理',}})
				})
			},
			/*修改现有库存'*/
			changeNow(val){
				console.log(val,this.data)
				this.lRemoveGoods.availableNum=val;
			},
			/*修改安全库存*/
			changeSafe(val){
				this.lRemoveGoods.safeNum =val;
			},
			changeRightNow(val){
				this.data.availableNum=val;
			},
			changeRightSafe(val){
				this.data.safeNum=val;
			}
		},
	}
</script>
<style lang="less" scoped>
	.pick-statius-tip {
		background: url(../../../assets/pre/yd1.png) 92% center no-repeat;	
		background-color: rgba(100, 183, 255, 0.80);
	}
	.pre-content-pic {
		top: 44px;
	}
</style>
<style lang="less">
	.pre-content-pic {
		.pic-item-info {
			.printSingle {
				background: #FFFFFF;
				border: 1px solid #D0D0D0;
				font-size: 14px;
				color: #333333;
				border-radius: 4px;
			}
		}
		.pic-item-info {
			position: relative;
			>div {}
			.print-list {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10px;
				span {
					flex: 1;
				}
			}
			button {
				background: #3DA5FE;
				border-radius: 3px;
				color: #FFFFFF;
				font-size: 13px;
				border: none;
				width: 70px;
				height: 30px;
			}
		}
	}
	.pick-statius-tip {
		padding: 9px 4%;
		margin: 0;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: white;
		background-color: rgba(100, 183, 255, 0.80);
		margin-bottom: 10px;
		dt {
			font-size: 16px;
		}
	}
	.concat-list-wrap{
		/*width: 95%;margin: 0 auto;*/
		.re-t-tip{
			height: 100px;
			width: 94%;margin: 0 auto;
			display: flex; border-radius: 3px;
			justify-content: space-around;
			align-items: center;
			box-sizing: border-box;
			background: url(../../../assets/pre/yd2.png) center center no-repeat;
			background-color: #FFFFFF;
			dl{font-size: 18px;text-align: center;}
			dl:nth-child(1){margin-right: 2%;color: #999999;}
			dl:nth-child(2){margin-left: 2%;color: #333333;}
		}
	}
</style>