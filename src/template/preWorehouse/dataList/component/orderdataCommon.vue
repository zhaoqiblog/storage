<template>
	<!--<div class="tab-swiper vux-center">-->
		<div class="">
			<div class="order-plate">
				<dl>
					<dt class="vux-1px-b strong-txt">订单状态</dt>
					<dd class="palte-title-info"><span class="strong-txt">拣货已完成</span> <span>{{data.finishOrders}}单</span></dd>
					<dd class="palte-title-info"><span class="strong-txt">未接单</span> <span>{{data.newOrders}}单</span></dd>
					<dd class="palte-title-info"><span class="strong-txt">未装袋</span> <span>{{data.completeOrders}}单</span></dd>
					<dd class="palte-title-info"><span class="strong-txt">已超时</span> <span>{{data.timeoutOrders}}单</span></dd>
					<dd class="palte-title-info"><span class="strong-txt">已退款</span> <span>{{data.refundedOrders}}单</span></dd>
				</dl>
			</div>
			<div class="order-plate">
				<dl>
					<dt class="vux-1px-b strong-txt">订单送达类型</dt>
					<dd class="palte-title-info"><span class="strong-txt">门店自提订单</span> <span>{{data.pickSelfOrders}}单</span></dd>
					<dd class="palte-title-info"><span class="strong-txt">定时达</span> <span>{{data.expectTimeOrders}}单</span></dd>
					<dd class="palte-title-info"><span class="strong-txt">及时达</span> <span>{{data.immediateOrders}}单</span></dd>
				</dl>
			</div>
			<div class="order-plate">
				<dl>
					<dt class="vux-1px-b strong-txt">订单平台</dt>
					<dd class="palte-title-info"><span class="strong-txt">永辉生活</span> <span>{{data.jdorders}}单</span></dd>
					<dd class="palte-title-info"><span class="strong-txt">京东到家</span> <span>{{data.yhorders}}单</span></dd>
				</dl>
			</div>
		</div>
	<!--</div>-->
</template>

<script>
	import PickerDataItem from './selectData.vue';
	export default {
		name:'order-data-common',
		components:{PickerDataItem},
			props:{data:[Object]},
		data(){
			return {}
		}
	}
</script>

<style>

</style>