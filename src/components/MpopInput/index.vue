<template>
	<!--前置仓拣货数量输入组件-->
	<div >
		<!--<x-switch title="transparent background" v-model="showPop"></x-switch>-->
		<div v-transfer-dom class="pre-pic-wrap">
	      <popup v-model="isShow" height="270px" is-transparent :hide-on-blur="false" >
	      	<p class="pic-popup-header">拣货数量</p>
	        	<div class="pre-pic-content">
			    	<div class="vux-1px-t picking-pops ">
			    		<div class="pre-code">前置仓 {{popItem.warehouseCode}}</div>
			    		<div class="pre-goods">
					    	<div class="pic-goods-name">{{popItem.subtitle}}</div>
					    	<div class="pic-goods-num">x{{popItem.num}}</div>
				    	</div>
			    	</div>
			        <div class="pre-pic-input vux-1px-b">
			          <p>前置仓拣货数量</p>
			          	<inline-x-number width="80px" :min='0' v-model="picNum" :max="popItem.num"></inline-x-number>
			        </div>
			        <div class="pic-btn">
			        	<button @click="cancels">取消</button>
			        	<button @click="confirms">确定</button>
			        </div>
	        </div>
	      </popup>
	    </div>
		
	</div>
</template>

<script>
	import { Popup,XSwitch,TransferDom,PopupHeader,InlineXNumber } from 'vux'
	export default {
		directives: {
		    TransferDom
		  },
		  name: 'm-pop-input',
		components:{Popup,XSwitch,TransferDom,PopupHeader,InlineXNumber },
		data (){
			return {
				picNum:0,
//				showPope:false,
			}
		},
		props:["isShow","cancel","confirm","popItem"],
		methods:{
			cancels(){
				this.cancel()
			},
			confirms(){

				this.confirm(this.picNum,this.popItem.itemid)
			},
		},
		created(){
		}
	}
</script>

<style lang="less">
	.pre-pic-wrap{
		.pic-popup-header{
			background: #FFFFFF;
			line-height:47px;text-align:center;
			.vux-popup-header-title{
				font-weight: 0;
			}
		}
		.vux-number-selector svg{
			fill:#3DA5FE;
		}
		.pre-pic-content{
			background-color:#fff;
			height: 100%;
			width:88%;
			padding:0 6%;
			.picking-pops{
				/*padding: 0 20px;*/
				/*display: flex;*/
				/*justify-content: space-between;*/
				/*align-items: center;*/
				line-height: 2;padding-top:16px;padding-bottom:10px;
				/*<div class="pre-code">前置仓 123456</div>
				    	<div class="pic-goods-name">乐视香脆鸡翅味大波浪薯片</div>
				    	<div class="pic-goods-num">X 3</div>*/
				.pre-code{font-size: 13px;color: #303030;}
				.pre-goods{
					color: #333333;
					display: flex;
					justify-content: space-between;align-items: center;
				}
				.pic-goods-name{font-size: 16px;color: #333333;font-weight: 600;}
				.pic-goods-num{font-size: 16px;color: #333333;}
			}
			.pre-pic-input{
				padding: 13px 0 20px 0;
				display: flex;
				justify-content: space-between;
				align-content: center;
				text-align: center;
				/*height: 33px;*/
				>p{
					/*margin: 20px 0;*/
					line-height: 33px;font-size: 14px;color: #303030;
				}
				/*.vux-inline-x-number{height: 33px;}*/
				.vux-number-selector,.vux-number-input{
					height: 25px;
					line-height: 25px;
				}
			}
			.pic-btn{
				text-align: center;margin-top: 15px;
				button{
					border: 1px solid #D0D0D0;border-radius: 2px;font-size: 15px;width: 32%;height: 40px;
				}
				button:nth-child(1){
					color:#333333 ;
					background: #FFFFFF;margin-right:6% ;
				}
				button:nth-child(2){
					background: #3DA5FE;
					color: #FFFFFF;border:none;
				}
			}
		}
	}
</style>