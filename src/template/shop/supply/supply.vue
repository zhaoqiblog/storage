<template>
	<div class="shop-supply">
		<x-header class="vux-1px-b" :left-options="{preventGoBack: true}" @on-click-back="back()">我的补货</x-header>
		<tab v-model="index" active-color="#3DA5FE" style="margin-top: 2px;" class="vux-1px-b">
			<tab-item  v-for="(i,ins) in ['待补货','已完成']" :key="ins" @on-item-click="changeList">{{i}}</tab-item>
		</tab>
		<div class="scroll-content" ref="scrollWrap" style="top: 88px;">

			<div class="list" v-if="index==0">
				<m-empty v-if="data.noSupply && data.noSupply.length == 0"></m-empty>
				<div class="item vux-1px-tb" v-for="(item,inde) in data.noSupply" :key="item.id+inde" v-if="data.noSupply.length>0"
				>
					<div class="tl vux-1px-b">
						<div class="date">{{new Date(item.supplementDate).format('yyyy-MM-dd hh:mm:ss')}}</div>
						<router-link :to="{name:'supplyDetail',query:{orderId:item.supplementBillNo}}"><div class="supplying">{{item.status == 0 ? '补货中' : '已完成'}}</div></router-link>
						<div class="arrow-right"></div>
					</div>
					<div class="content">
						<div class="cell">
							<div class="name">补货单号：</div>
							<div class="value">{{item.supplementBillNo}}</div>
						</div>
						<div class="cell">
							<div class="name">补货数量：</div>
							<div class="value">{{item.goodsSupplementNum}}</div>
						</div>
						<div class="cell cell-proname">
							<div class="name">补货商品：</div>
							<div class="value">{{item.goodsNames}}</div>
						</div>
						<div class="cell cell-handel" style="font-size: 12px;text-align: right;">
							<button @click="delOrder(item.id)" style="background: #FFFFFF;line-height:2;padding: 0 10px;border: 1px solid #D0D0D0;border-radius: 3px;color: #666;">删除此单</button>
							<button  @click="toDetail(item.supplementBillNo)" style="background: rgb(61, 165, 254);color:#FFFFFF;line-height:2;padding: 0 10px;border: 1px solid #FFFFFF;border-radius: 3px;">去补货</button>
						</div>
					</div>
				</div>
			</div>
			<div class="list" v-if="index==1">
				<m-empty v-if="data.finish && data.finish.length == 0"></m-empty>
				<div class="item vux-1px-tb" v-for="(item,inde) in data.finish" :key="item.id+inde" v-if="data.finish.length>0"
				 @click="toDetail(item.supplementBillNo)">
					<div class="tl vux-1px-b">
						<div class="date">{{new Date(item.supplementDate).format('yyyy-MM-dd hh:mm:ss')}}</div>
						<div class="supplying">{{item.status == 0 ? '补货中' : '已完成'}}</div>
						<div class="arrow-right"></div>
					</div>
					<div class="content">
						<div class="cell">
							<div class="name">补货单号：</div>
							<div class="value">{{item.supplementBillNo}}</div>
						</div>
						<div class="cell">
							<div class="name">补货数量：</div>
							<div class="value">{{item.goodsSupplementNum}}</div>
						</div>
						<div class="cell cell-proname">
							<div class="name">补货商品：</div>
							<div class="value">{{item.goodsNames}}</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="showEnd" class="theEnd">已经到底啦</div>
		</div>
	</div>
</template>

<script>
	import MEmpty from '@/components/MEmpty/index'
	import {
		XHeader,
		Tab,
		TabItem,
	} from 'vux'
	import {
		mapState
	} from 'vuex';
	import factory from '@/factory.js'
	import $request from '@/service/request.js'
	import func from '@/func.js'
	export default {
		components: {
			XHeader,
			MEmpty,
			Tab,
			TabItem,
		},
		name: 'supply',
		computed: mapState({
			commonInfo: state => state.global.commonInfo
		}),
		data() {
			return {
				index: 0, //当前tab
				// 分页
				page: {
					pageNo: 0,
					pageSize: 10,
					totalPage: 1
				},
				data: {
					content: [],
					noSupply: [],
					finish: []
				},
				showEnd: false // 最后一页
			}
		},
		created() {
			this.getSupplyList()
		},
		methods: {
			/**
			 * 获取我的补货单列表
			 * @return {[type]} [description]
			 */
			getSupplyList() {
				this.page.pageNo++;
				$request.get('/api/supplement-invoices/v1/protected/query_page', {
					supplementType: "2",
					userNo: localStorage.getItem("userNo"),
					//      status:1,//卖场补货不用传status
						page: this.page.pageNo,
						size: this.page.pageSize,
					status: this.index
				}).then(res => {
					if (res.success) {
						const datas = { ...res.data
						};
						if (this.index == 0) {
							this.data.noSupply = this.page.pageNo == 1 ? res.data.content.concat([]) : this.data.noSupply.concat(res.data.content)
						} else {
							this.data.finish = this.page.pageNo == 1 ? res.data.content.concat([]) : this.data.finish.concat(res.data.content)
						}
						this.page.totalPage = res.data.totalPages
						this.showEnd = res.data.totalPages == res.data.number ? true :false
					} else {
						this.$vux.toast.show({
							type: 'text',
							text: res.message
						})
					}
				})
			},
			/*切换tab*/
			changeList() {
				this.page.pageNo = 0;
				this.getSupplyList()
			},
			/**
			 * 去补货详情页
			 * @param  {String} orderId 单号
			 */
			toDetail(orderId) {
				this.$router.push({
					name: 'supplyDetail',
					query: {
						orderId: orderId
					}
				})
			},
			/**
			 * 返回扫描页
			 */
			back() {
				this.$router.push({
					name: 'scanEntry',
					query: {
						key: 'shopSupplying'
					}
				})
			},
			/*删除此单*/
			 delOrder (id) {
			  $request.get('/api/supplement-invoices/delete/' + id).then(res => {
			    if(res.success) {
			      this.$vux.toast.show({
			        type: 'text',
			        text: res.message,
			        onHide: () => {
			          // this.$router.push({name: 'supply', query: { refresh: '1'}}),
								this.data.noSupply = this.data.noSupply.filter(n=>{
									return n.id!==id
								})
			        }
			      })
			    } else {
			      this.$vux.toast.show({
			        type: 'text',
			        text: res.message
			      })
			    }
			  })
			},
		},
		mounted() {
			this.$nextTick(function() {
				func.scrollListen(this, this.$refs.scrollWrap, () => {
					let top = this.$refs.scrollWrap.scrollTop;
					if (top !== 0 && !this.showEnd) {
						this.getSupplyList()
					}
				})
			})
		},
		activated() {
			if (this.$route.query.refresh && 1 == this.$route.query.refresh) {
				this.page = {
					pageNo: 1,
					pageSize: 10,
					totalPage: 1
				}
				this.data = {
					content: []
				}
				this.showEnd = false
				this.getSupplyList()
			}
		}
	}
</script>
<style lang="less">
	.shop-supply {
		.vux-tab-ink-bar{z-index: 1;}
		.vux-tab-wrap.vux-1px-b:after{
			z-index: 1;
		}
		.item {
			margin-top: 10px;
			background-color: #fff;
			
			.tl {
				display: flex;
				font-size: 12px;
				line-height: 33px;
				padding: 0 15px;
				align-items: center;
				justify-content: center;

				.date {
					flex: 1;
					color: #999;
				}

				.supplying {
					color: #FFA948;
				}

				.completed {
					color: #77D151;
				}

				.arrow-right {
					width: 6px;
					height: 6px;
					border-top: 1px solid #999;
					border-right: 1px solid #999;
					transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
					margin-left: 5px;
				}
			}

			.content {
				padding: 10px 15px;
				line-height: 1.5;
				text-align: justify;
				color: #666;
			}

			.cell {
				display: flex;
				font-size: 14px;
				font-weight: bold;

				.value {
					flex: 1;
				}

				&.cell-proname {
					color: #999;
					font-weight: normal;
				}
			}
		}

		.theEnd {
			font-size: 14px;
			line-height: 1;
			margin: 16px 0;
			color: #bbb;
			text-align: center;
		}
		.cell-handel{
			font-size: 12px;
			margin-top: 10px;
			justify-content: flex-end;
		button{text-align: right;margin-left: 15px;}
		}
	}
	
</style>
