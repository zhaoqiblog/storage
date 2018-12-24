<template>
	<div class="dataWrap">
		<x-header class="vux-1px-b">数据报表</x-header>
		<div class="dataList-content contentWrap">
			<p class="shopName">{{costName}}</p>
			<div class="dataList-info">
				<div class="data-total-wrap">
					<dl class="summary-sale vux-1px-b">
						<dt class="summary-title">今日销售总额（元）</dt>
						<dd><strong class="summary-data">{{mainData.totalSales}}</strong></dd>
						<dd class="more" @click="moreSale">更多&nbsp;&nbsp;></dd>
					</dl>
					<div class="summary-sale other-summary">
						<router-link :to="{name:'orderData'}">
						<dl class="today-total-order">
							<dt class="summary-title">今日订单总数</dt>
							<dd><strong>{{mainData.totalOrders}}</strong><span class="small">&nbsp;&nbsp;单</span></dd>
							<dd class="more">订单数据&nbsp;&nbsp;></dd>
						</dl>
						</router-link>
						<router-link :to="{name:'effectiveData'}">
						<dl class="today-total-order today-total-effective">
							<dt class="summary-title">今日拣货总效率</dt>
							<dd>
								<span class="small">每单&nbsp;&nbsp;</span>
								<strong>{{Math.floor(mainData.pickEfficiency/60)+':'+mainData.pickEfficiency%60}}</strong> 
								<span class="small"></span>
							</dd>
							<dd class="more">拣货效率&nbsp;&nbsp;></dd>
						</dl>
						</router-link>
					</div>
				</div>
				<div class="order-plate">
					<dl>
						<dt class="vux-1px-b strong-txt">订单平台</dt>
						<dd class="palte-title-info"><span>永辉生活</span> <span class="strong-txt">{{mainData.yhshOrders}} 单</span></dd>
						<dd class="palte-title-info"><span>京东到家</span> <span class="strong-txt">{{mainData.jddjOrders}} 单</span></dd>
					</dl>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { XHeader } from 'vux';
	import $request from '@/service/request';
	import CONFIG from 'configuration';
	export default {
		components: {
			XHeader
		},
		computed: {
			costName() {
				return localStorage.getItem("costName")
			}
		},
		data() {
			return {
				mainData: {
					jddjOrders: 0,
					pickEfficiency: 0,
					totalOrders: 0,
					totalSales: 0,
					yhshOrders: 0
				}
			}
		},
		created() {
			this.getdata()
		},
		methods: {
			getdata() {
				$request.get(CONFIG.reportUrl + "/api/online-order-report/v1/protected/main").then(res => {
					if(res.success) {
						this.mainData = { ...res.data
						}
					} else {
						this.$vux.toast.show({
							type: text,
							text: res.message
						})
					}
				})
			},
			moreSale() {
				this.$router.push({
					path: 'storeSaleData'
				})
			}
		}

	}
</script>

<style lang="less">
	.dataList-info {
		width: 95%;
		margin: 15px auto 0;
	}
	
	.data-total-wrap {
		background: #FFFFFF;
		text-align: center;
		border-radius: 3px;
		.more {
			font-size: 12px;
			color: #3DA5FE;
		}
		.small {
			font-size: 12px;
			color: #666666;
			line-height: 35px;
		}
	}
	
	.other-summary {
		display: flex;
		justify-content: space-around;
	}
	
	.summary-sale {
		padding: 20px 4%;
		margin: 0 4%;
		.datepicker {
			width: 170px;
			margin: 0 auto;
			border-radius: 49px;
			border: 1px solid #dcdfe6;
			height: 40px;
			box-sizing: border-box;
			line-height: 40px;
			.vux-datetime {
				padding: 0 30px 0 20px;
				>div:nth-child(1) {
					/*padding-right: 20px;*/
					/*width: 90%;*/
					width: 0;
					p {
						text-align: left;
						color: #606266;
					}
				}
				.vux-datetime-value {
					position: static;
					text-align: center;
					margin-right: 10px;
					padding-right: 0;
					border-right: 1px solid #ddd;
					height: 40px;
					width: 0;
					.vux-cell-placeholder {
						text-align: center;
					}
					.vux-cell-value {
						color: #000000;
						font-size: 14px;
					}
				}
				.vux-datetime-value:after {
					display: none;
				}
				.vux-input-icon {
					display: block !important;
					width: 18px;
					height: 18px;
					background: url(../../../assets/pre/cleander.png) center center no-repeat;
					right: 15px;
					top: 50%;
					margin-top: -9px;
					position: absolute;
					&:before {
						content: " ";
					}
				}
			}
		}
	}
	
	.order-plate {
		background: #FFFFFF;
		margin-top: 10px;
		padding: 0 4%;
		padding-bottom: 10px;
		line-height: 2.5;
		dd,
		dt {
			font-size: 14px;
		}
		.strong-txt {
			color: #333333;
		}
	}
	
	.palte-title-info {
		display: flex;
		justify-content: space-between;
		color: #666666;
	}
	
	.summary-title {
		color: #666666;
		font-size: 14px;
	}
	
	.summary-data {
		color: #333333;
		font-size: 28px;
	}
	
	.today-total-order {
		padding-top: 50px;
		margin: 20px 0;
		background: url(../../../assets/pre/orderTotal.png) top center no-repeat;
		dd{
			strong{color: #2c3e50;}
		}
	}
	.today-total-effective {
		padding-top: 50px;
		margin: 20px 0;
		background: url(../../../assets/pre/effective.png) top center no-repeat;
	}
</style>