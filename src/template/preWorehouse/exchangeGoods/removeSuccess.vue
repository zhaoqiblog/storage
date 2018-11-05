<template>
	<div class="shop-supply pick-supply">
		<x-header class="vux-1px-b" :left-options="{showBack:false}">前置仓商品状态</x-header>
		<div class="scroll-content pre-content pre-content-pic" ref="scrollWrap">
			<dl class="pick-statius-tip re-rimg">
				<dt>商品移位成功</dt>
				<dd>前置仓货位商品信息已更新！</dd>
			</dl>
			<div class="concat-list-wrap">
				<div>
					<!--货位上有商品时，正常情况-->
					<div v-if="removeResult">
						<!--<p>22222</p>-->
					<pic-exchange-item 
						:data='removeResult'
						:warehouseCode="'前置仓货位  '+removeResult.rightWarehouseCode"	
						rightTxt="已更新"
						:imgurl="removeResult.rightImgurl"
			    		:name="removeResult.rightGoodsName"
			    		:code="removeResult.rightGoodsBarCode"
			    		type="rTxt"
			    		:nowNum="removeResult.rightAvailableNum"
			    		:safeNum="removeResult.rightSafeNum"
					/>
					</div>
					
				</div>
				<div v-if="data">
					<!--<p>4444</p>-->
					<pic-exchange-item 
						:warehouseCode="'前置仓货位  '+removeResult.leftWarehouseCode"	
						rightTxt="已更新"
						:imgurl="removeResult.leftImgurl"
			    		:name="removeResult.leftGoodsName"
			    		:code="removeResult.leftGoodsBarCode"
			    		type="rTxt"
			    		:nowNum="removeResult.leftAvailableNum"
			    		:safeNum="removeResult.leftSafeNum"
			    		:data = "data"
					/>
				</div>
				<div v-if="!data">
					<!--<p>33333</p>-->
				<!--货位上无商品时 :warehouseCode="'将移至原货位  '+removeResult.rightWarehouseCode"	-->
					<pic-exchange-item 
						:data='null'
						:warehouseCode="'前置仓货位  '+removeResult.leftWarehouseCode"
						rightTxt="已更新"
					/>
				</div>
			</div>
		</div>
		<div class="cm-footer">
			<div class="btn-add btn-left">
				<router-link :to="{name: 'scanEntry', query: {key: 'preExchange'}}">
					<span>前置仓商品</span>
				</router-link>
			</div>
			<div class="btn-submit">
				<router-link to="/">
					<button type="button" :disabled="lRemoveGoods.safeNum<=0">返回库位管理</button>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import MpopInput from '@/components/MpopInput/index'
	import { XHeader, Confirm, TransferDomDirective as TransferDom, PopupPicker, XDialog } from 'vux'
	import { mapState } from 'vuex';
	import factory from '@/factory.js'
	import $request from '@/service/request.js'
	import func from "@/func.js"
	export default {
		directives: {
			TransferDom
		},
		components: {
			XHeader,
			MpopInput,
			Confirm,
			PopupPicker,
			XDialog
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
				dataobj:{},
				data1:null,
			}
		},
		created() {
			this.dataobj = this.removeResult
			this.dataobj.leftWarehouseCode = this.dataobj.leftWarehouseCode.substr(0,2)+'-'+this.dataobj.leftWarehouseCode.substr(2,2)+"-"+this.dataobj.leftWarehouseCode.substr(4)
			this.dataobj.rightWarehouseCode = this.dataobj.rightWarehouseCode.substr(0,2)+'-'+this.dataobj.rightWarehouseCode.substr(2,2)+"-"+this.dataobj.rightWarehouseCode.substr(4)
			if(!this.removeResult.leftGoodsBarCode){  //无商品时
				this.data=null;
			}else{this.data=this.removeResult}
		},
		methods: {
		},
	}
</script>
<style lang="less" scoped>
	.pick-statius-tip {
		background: url(../../../assets/pre/complete-2.png) 92% center no-repeat;
		   background-color: rgba(76,199,171,0.80);
	}
	.pre-content-pic {
		top: 44px;
	}
</style>
<style lang="less">
</style>