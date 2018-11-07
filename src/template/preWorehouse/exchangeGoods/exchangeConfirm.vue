<template>
	<div class="shop-supply pick-supply">
		<x-header class="vux-1px-b">商品替换确认</x-header>
		<div class="scroll-content pre-content pre-content-pic" ref="scrollWrap">
			<dl class="pick-statius-tip re-rimg">
				<dt>准备替换商品</dt>
				<dd>请认真核对商品的移位信息，再点击确认。</dd>
			</dl>
			<div class="concat-list-wrap">
				<div class="re-t-tip">
					<dl>
						<dt>原商品货位</dt>
						<dd>{{lRemoveGoods.warehouseCode}}</dd>
					</dl>
					<dl>
						<dt>目标商品货位</dt>
						<dd v-if="data">{{data.warehouseCode ? data.warehouseCode : '无'}}</dd>
					</dl>
				</div>
				<div>
					<!--货位上有商品时，正常情况-->
					<pic-exchange-item v-if="data"
						:data='data'
						titleInfo="目标商品"
						:warehouseCode="'将移至  '+lRemoveGoods.warehouseCode"	
						:imgurl="data.imgurl"
			    		:name="data.goodsName"
			    		:code="data.goodsBarCode"
			    		type="rInput"
			    		:nowNum="data.availableNum"
			    		:safeNum="data.safeNum"
			    		@inputNow="changeNow"
			    		@inputSafe="changeSafe"
					/>
					
				</div>
				<div v-if="lRemoveGoods&&data">
					<!--原货位商品-->
					<pic-exchange-item 
						titleInfo="原货位商品"
						:warehouseCode="data.warehouseCode ? '将移至目标货位  '+data.warehouseCode : '确认替换后，该商品下架'"	
						:imgurl="lRemoveGoods.imgurl"
			    		:name="lRemoveGoods.goodsName"
			    		:code="lRemoveGoods.goodsBarCode"
			    		type="rInput"
			    		:nowNum="lRemoveGoods.availableNum"
			    		:safeNum="lRemoveGoods.safeNum"
			    		:data = "lRemoveGoods"
			    		@inputNow="changeRightNow"
			    		@inputSafe="changeRightSafe"
					/>
				</div>
				
				<div>
					
				</div>
			</div>
		</div>
		<div class="cm-footer" v-if="data">
			<div class="btn-add btn-left">
				<router-link to="/">
					<span>取消</span>
				</router-link>
			</div>
			<div class="btn-submit">
				<!--<router-link :to="{name: 'removeSuccess'}">-->
					<!--<button type="button" @click="submitRemove"  :disabled="data.safeNum<=0">确定</button>-->
					<button type="button" @click="submitRemove" :disabled="lRemoveGoods.safeNum===''||lRemoveGoods.availableNum===''||data.safeNum===''||data.availableNum===''">确定</button>
					
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
				data: null,
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
				$request.get("/api/goods-front-warehouse/v1/protected/queryplace/barcode", {goodsBarCode: val}).then((res) => {
					if(res.success == true) {
						this.data =Object.assign(res.data)
						if(res.data.warehouseCode){
							this.data.warehouseCode = res.data.warehouseCode.substr(0,2)+"-"+res.data.warehouseCode.substr(2,2)+"-"+res.data.warehouseCode.substr(4)
						}
					}else{
						this.$vux.toast.show({
			                type: 'text',
			                text: res.message,
			                onHide: () => {
			                 	this.$router.back()
					        }
			            })
					}
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
				  "rightWarehouseCode": this.data.warehouseCode?this.data.warehouseCode.split("-").join(""):'',
				}	
				$request.post("/api/goods-front-warehouse/v1/protected/exchange",obj).then(res=>{
					if(res.success){
						this.$store.commit("setRemoveResult",res.data)
						this.$router.push({name:'exchangeSuccess'})
					}else{
						this.$router.push({name:'failPage',query:{title:'前置仓商品状态',text:'商品替换失败',info:res.message,btn1Link:'/scanEntry?key=preExchange',btn1Text:'前置仓商品',btn2Link:'/',btn2Text:'返回库位管理',}})
					}
				}).catch(err=>{
					this.$router.push({name:'failPage',query:{title:'前置仓商品状态',text:'商品替换失败',info:'服务器错误，请联系管理员2',btn1Link:'/scanEntry?key=preExchange',btn1Text:'前置仓商品',btn2Link:'/',btn2Text:'返回库位管理',}})
				})
			},
			/*修改现有库存'*/
			changeNow(val){
				this.data.availableNum=val;
			},
			/*修改安全库存*/
			changeSafe(val){
				this.data.safeNum =val;
			},
			changeRightNow(val){
				this.lRemoveGoods.availableNum=val;
			},
			changeRightSafe(val){
				this.lRemoveGoods.safeNum=val;
			}
		},
	}
</script>
<style lang="less" scoped>
	.pick-statius-tip {
		background: url(../../../assets/pre/th1.png) 92% center no-repeat;	
		background-color: rgba(100, 183, 255, 0.80);
	}
	.pre-content-pic {
		top: 44px;
	}
	.concat-list-wrap .re-t-tip{
		background:url(../../../assets/pre/th2.png) center center no-repeat;
		background-color: #FFFFFF;
	}
</style>
<style lang="less">
</style>