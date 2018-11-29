<template>
	<div class="dataWrap">
		<x-header class="vux-1px-b">数据报表</x-header>
		<div class="dataList-content contentWrap">
			<p class="shopName">{{costName}}</p>
			<div class="dataList-info">
				<div class="data-total-wrap">
					<dl class="summary-sale vux-1px-b">
						<dt class="summary-title">今日销售总额（元）</dt>
						<dd><strong class="summary-data">1450.00</strong></dd>
						<dd class="more" @click="moreSale">更多&nbsp;&nbsp;></dd>
					</dl>
					<div class="summary-sale other-summary">
						<dl class="today-total-order">
							<dt class="summary-title">今日订单总数</dt>
							<dd><strong>1450</strong><span class="small">&nbsp;&nbsp;单</span></dd>
							<dd class="more">订单数据&nbsp;&nbsp;></dd>
						</dl>
						<dl class="today-total-effective">
							<dt class="summary-title">今日拣货总效率</dt>
							<dd><span class="small">每单&nbsp;&nbsp;</span><strong>16：20</strong></dd>
							<dd class="more">拣货效率&nbsp;&nbsp;></dd>
						</dl>
					</div>
				</div>
				<div class="order-plate">
					<dl>
						<dt class="vux-1px-b strong-txt">订单平台</dt>
						<dd class="palte-title-info"><span class="strong-txt">永辉生活</span> <span >12454</span></dd>
						<dd class="palte-title-info"><span class="strong-txt">京东到家</span> <span>1236</span></dd>
					</dl>
					
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {XHeader} from 'vux';
	export default {
		components:{XHeader},
		computed:{
			costName(){
				return localStorage.getItem("costName")
			}
		},
		data(){
			return {
				
			}
		},
		methods:{
			moreSale(){
				this.$router.push({path:'storeSaleData'})
			}
		}
		
	}
</script>

<style lang="less">
	.dataList-info{width: 95%;margin: 15px auto 0;}
	.data-total-wrap{
		background: #FFFFFF;text-align: center;border-radius: 3px;
		.more{font-size: 12px;color: #3DA5FE;}
		.small{font-size: 12px;color: #666666;line-height: 35px;}
	}
	.other-summary{display: flex;justify-content: space-around;}
	.summary-sale{padding: 20px 4%;margin:0 4%;}
	.order-plate{
		background: #FFFFFF;margin-top: 10px;padding: 0 4%;line-height: 2.5;
		dd,dt{font-size: 14px;}
		.strong-txt{color: #666666;}
	}
	.palte-title-info{display: flex;justify-content: space-between;color: #333333;}
	.summary-title{color: #666666;font-size: 14px;}
	.summary-data{color: #333333;font-size: 28px;}
	.today-total-order{padding-top:50px;background: url(../../../assets/pre/orderTotal.png) top center no-repeat;}
	.today-total-effective{padding-top:50px;background: url(../../../assets/pre/effective.png) top center no-repeat;}
</style>