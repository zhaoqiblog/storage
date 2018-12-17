<template>
	<div class="summary-Thumbnail">
		<div class="summary-sale other-summary vux-1px-b">
			<dl class="pay-total today-total ">
				<dt class="summary-title">付款订单总数</dt>
				<dd><strong>{{data.payedOrders}}</strong><span class="small">&nbsp;&nbsp;单</span></dd>
			</dl>
			<dl class="order-middle today-total vux-1px-l">
				<dt class="summary-title">每笔订单均价</dt>
				<dd><span class="small">每单&nbsp;&nbsp;</span><strong>{{data.ordersAveragePrice}}</strong></dd>
			</dl>
		</div>
		<div class="summary-sale other-summary">
			<dl class="reback-total today-total today-total-dif">
				<dt class="summary-title">退款订单总数</dt>
				<dd><strong>{{data.refundedOrders}}</strong><span class="small">&nbsp;&nbsp;单</span></dd>
			</dl>
			<dl class="reback-total-money today-total vux-1px-l  today-total-dif">
				<dt class="summary-title">退款订单总额</dt>
				<dd><span class="small">每单&nbsp;&nbsp;</span><strong>{{data.refundedAmount}}</strong></dd>
			</dl>
		</div>
	</div>
</template>

<script>
	import { Group, Cell } from 'vux';
	export default {
		name: 'sales-common',
		props:{data:[Object]},
		components: {
			Group,
			Cell
		},
		created(){
		},
		data() {
			return {}
		},
	}
</script>

<style>

</style>