<template>
	<div class="goods-info-item list-info-cell goods-info-item-pre">
		<div ref="listCt" class="l-list-ct" style="position: relative!important;">
			<div v-if="warehouseCode||typeof warehouseCode != 'undefined'" class="l-list-title clearfix">
				<span v-if="warehouseCode" class="l-title-con fl">
	    			<dl>
	    				<dt>{{titleInfo}}</dt>
	    				<dd>{{warehouseCode}}</dd>
	    			</dl>
	    		</span>
				<div class="title-right fr">
					<span v-if="rightTxt" class="pre-r-txt">{{rightTxt}}</span>
				</div>
			</div>
			<PicItem v-if="data" class="pre-item-ex" :imgurl="imgurl" :name="name" :unit="unit" :code="code">
			</PicItem>
		</div>
		<ul class="pre-ex-num vux-1px-b" v-if="data">
			<li v-if="nowNum!== 'null' && nowNum!== undefined">
				<span>现有库存</span>
				<span class="pre-ex-n" v-if="type=='bBtn'||type=='rTxt'">{{nowNum}}</span>
				<input @input="changeNew" type="number" v-if="type=='rInput'" v-model="newNowNum" pattern="[0-9]" placeholder="请输入库存数" />
			</li>
			<li v-if="safeNum!=='null' && safeNum!== undefined">
				<span>安全库存</span>
				<span class="pre-ex-n" v-if="type=='bBtn'||type=='rTxt'">{{safeNum}}</span>
				<input type="number" @input="changeVal" v-if="type=='rInput'" v-model="newSafe" pattern="[0-9]" placeholder="请输入库存数" />
			</li>
		</ul>
		<div class="pre-h-btn" v-if="type=='bBtn'">
			<button class="pre-btn-l vux-1px-r" @click="showInputs">移动货位</button>
			<button class="pre-btn-r" @click="$emit('exchange')">替换商品</button>
		</div>
		<div v-if="!data" class="pre-ex-none">该库位无商品</div>
	</div>
</template>

<script>
	import PicItem from './common.vue'
	export default {
		name: 'pic-exchange-item',
		data() {
			return {
				newSafe:[Number,String],
				newNowNum:[Number,String],
			}
		},
		components: {
			PicItem
		},
		props: {
			data: [Object, null],  //data为null时，其他东西都不显示，只显示，该货位无商品
			itemid: [String], //当前id
			titleInfo: [String, Number], //标题，库位号上边的内容
			warehouseCode: [String, Number], //顶部的前置仓号,没有则不显示
			rightTxt: [String, Number], //右侧文字
			code: [String, Number], //编号位置文本,没有则不显示，即商品编号
			imgurl: [String], //图片地址
			time: [String], //时间位置文本,没有则不显示，当没有code的时候会靠左
			name: [String], //主体文本位置
			unit: [String, Number], //单位 底部第1个，规格
			unitq: [String, Number], //底部第二个，单价
			type: [String, Number], //类型，决定页面布局  bBtn：底部有按钮 ,此时现有库存和安全库存不可修改，,rInput ：现有库存和安全库存可以修改，rTxt：现有库存和安全库存不恶口修改，且底部无按钮
			nowNum: [String, Number], //现有库存
			safeNum: [String, Number], //安全库存
			status: [String, Number], //是否的是历史单据1：是：不显示现有库存和安全库存，0：否，显示现有库存和安全库存
			showInput: [Function], //移动货位号点击事件
		},
		created() {
			this.newSafe = parseInt(this.safeNum);
			this.newNowNum=this.nowNum
			typeof this.totalNum == "string" && (this.totalNum = parseInt(this.totalNum));
		},

		methods: {
			showInputs() {
				this.$emit("showInput")
			},
			//修改安全库存
			changeVal(){
				if(this.newSafe==''){
					this.$emit("inputSafe",this.newSafe);
				}else{
					this.$emit("inputSafe",parseInt(this.newSafe));
				}
			},
			/*修改现有库存*/
			changeNew(){
				if(this.newNowNum==''){
					this.$emit("inputNow",this.newNowNum)
				}else{
					this.$emit("inputNow",parseInt(this.newNowNum))
				}
			}
		},

	}
</script>
<style lang="less">
	.shop-supply .scroll-content.pre-content .goods-info-item-pre {
		.l-list-title {
			padding: 4px 0;
		}
		.pre-ex-num {
			li {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			input {
				font-size: 16px;
				color: #303030;
				width: 37%;
				height: 33px;
				box-sizing: border-box;
				padding: 0 0 0 2%;
				line-height: 33px;
				border: 1px solid #DDDDDD;
				border-radius: 3px;
				margin: 10px 0;
			}
			::-moz-placeholder {
				color: #c5c5c5;
				font-size: 14px;
			}
			::-webkit-input-placeholder {
				color: #c5c5c5;
				font-size: 14px;
			}
			:-ms-input-placeholder {
				color: #c5c5c5;
				font-size: 14px;
			}
		}
		padding: 0 10px;
		.l-list-ct .l-list-content {
			padding: 10px 0;
		}
		.pre-h-btn {
			display: flex;
			justify-content: space-around;
			align-items: center;
			box-sizing: border-box;
			height: 60px;
			button {
				border: none;
				background: none;
				width: 50%;
				height: 20px;
				font-size: 16px;
			}
			.pre-btn-l {
				color: #4CC7AB;
			}
			.pre-btn-r {
				color: #3DA5FE;
			}
		}
	}
	
	.shop-supply {
		.list-info-cell {
			.pre-item-ex {
				.l-list-title {
					padding: 0;
					font-size: 14px;
					color: #303030;
					font-weight: 100;
					>span {
						font-weight: 100;
						font-size: 14px;
					}
				}
			}
		}
	}
	
	.pre-ex-num {
		padding: 0;
		padding-right: 10px;
		li {
			font-size: 14px;
			color: #333333;
			line-height: 42px;
			display: flex;
			justify-content: space-between;
			.pre-ex-n {
				color: #333333;
			}
		}
	}
	
	.shop-supply .goods-info-item-pre {
		.l-list-ct .l-list-title {
			.l-title-con {
				font-weight: 100;
				dt {
					font-weight: 600;
					font-size: 16px;
				}
				dd {
					font-size: 14px;
					color: #666666;
				}
				line-height:1.8;
			}
		}
	}
	.pre-r-txt{color: #3DA5FE;font-size: 13px;}
	.pre-ex-none{text-align: center;line-height: 46px;color: #999999;font-size: 14px;}
</style>