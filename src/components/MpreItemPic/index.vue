<template>
	<div class="goods-info-item list-info-cell goods-info-item-pre">
    <div ref="listCt" class="l-list-ct" style="position: relative!important;">
    	<div v-if="preCode||typeof preCode != 'undefined'" class="l-list-title clearfix"> 
    		<span v-if="preCode">{{preCode}}</span>
    		<span v-if="!preCode">卖场</span>
    		<div class="title-right fr" v-if="status!=1">
    			<span v-if="preCode" :class="nowNum<=5 ?'safe-num warn':'safe-num'">库存 <span>{{nowNum}}</span></span>
    		</div>
    	</div>
    		<div class="l-list-content vux-1px-t">
    			<div class="list-pic-goods">
    				<img :src="imgurl"/>
    				<div>
    				<div class="pre-pic">
	    				{{name}} &nbsp;<span v-if="unit">{{unit}}</span>
	    			</div>
	    			<p class="l-list-code">
	    				<em v-if="code">{{code}}</em>
	    				<span :class="[typeof code == 'undefined'?'list-code-right':'']" v-if="time">{{time}}</span>
	    			</p>
	    			<p class="l-list-info clearfix">
	    				<slot name="listInfo" >
		    				<ul v-if="unit||unitq" class="uniqs">
		    					<li v-if="typeof unit != 'undefined'">
		    						<span >规格</span>
		    						<span class="l-list-blue">{{unit}}</span>
		    					</li>
		    					<li v-if="typeof unitq != 'undefined'">
		    						<span>单价</span>
		    						<span class="l-list-green">{{unitq}}</span>
		    					</li>
		    				</ul>
			 		 	</slot>
			 		 	<span class="fr totalnums">x{{totalNum}}</span>
	    			</p>
	    			</div>
    			</div>
    			<div class="l-list-button  vux-1px-t clearfix" v-if="!isSearch">
    				<a :href="'tel:'+phone" v-if="type&&type=='concat'">
	    				<div v-if="type&&type=='concat'" class="fl pre-list-l">
	    					<span style="color: #333333;font-weight: 600;">{{ordersequencenos}}</span> &nbsp;&nbsp;<span class="ordername">联系顾客</span>
	    				</div>
    				</a>
    				<div class="fr">
	    				<button @click="tolessPick(itemid)" v-if="init" class="no-pick">缺货</button>
	    				<button v-if="init" @click="toPickAll(itemid)">全部拣货</button>
	    				<button class="all-pick" @click="tolessPick(itemid)" v-if="halfPickNum==totalNum">全部已拣</button>
	    				<button class="half-pick" @click="tolessPick(itemid)" v-if="halfPickNum>0&&halfPickNum!=0&&halfPickNum!=totalNum">已拣X{{halfPickNum}}</button>
	    				<button class="half-no-goods" @click="tolessPick(itemid)" v-if="halfPickNum>0&&halfPickNum!==0&&totalNum-halfPickNum>0">缺货X{{totalNum-halfPickNum}}</button>
	    				<button class="all-no-goods" @click="tolessPick(itemid)" v-if="halfPickNum==0">全部缺货</button>
    				</div>
    			</div>
    		</div>
    	</div>
	</div>
</template>

<script>
	
export default{
	name: 'pre-item-pic',
	data(){
		return {
		}
	},
	props:{
		itemid:[String],//当前id
	    preCode: [String, Number],//顶部的前置仓号,没有则不显示
	    code: [String, Number],//编号位置文本,没有则不显示，即商品编号
	    nowNum:[String,Number], //现有库存
	    imgurl:[String],	//图片地址
	    time: [String],//时间位置文本,没有则不显示，当没有code的时候会靠左
	    name: [String],//主体文本位置
	    unit: [String,Number],//单位 底部第1个，规格
	    unitq: [String, Number],//底部第二个，单价
	    totalNum: [String, Number],//底部按钮总数
	    alreadyNum:[String,Number],	//已拣货数量
	    toPicking:[Function] ,  	//未拣货按钮的点击事件
	    init:[Boolean],				//初始进去显示缺货和全部补货按钮，点击事件之后变为false,true:状态是：拣货中
	    allpick:[Boolean],				//全部已拣
	    halfPickNum:[String,Number],	//已拣的数量
	    topicksum:[Function],   	//缺货按钮点击事件
	    toallpick:[Function],		//全部拣货按钮点击事件
		status:[String,Number],  //是否的是历史单据1：是：不显示现有库存和安全库存，0：否，显示现有库存和安全库存
		type:[String],  //concat 是否是合单界面
	    phone:[String,Number],  //合单界面：需要需要联系顾客的电话
	    ordersequencenos:[String,Number],  //合单界面需要的内容订单号
	    isSearch:[Boolean],  //是否是设置界面
	},
	created(){
		typeof this.totalNum == "string" && (this.totalNum = parseInt(this.totalNum));
	},
	
	methods:{
		/**
		 * 缺货按钮点击事件
		 */
		tolessPick(id){
			this.topicksum(id)
		},
		/**
		 * 全部拣货按钮点击事件
		 */
		toPickAll(id){
			this.toallpick(id)
		}
	},
	
}

</script>
<style lang="less">
	.title-right{
		>span{
			    padding: 0 5px;
		}
	
	.now-num{
		font-size: 12px;
	    color: #FF5800;
	    padding-right: 10px;
	}
	.safe-num{
		font-size: 13px;
    color: #999999;
    padding-left: 10px;
    >span{
    	color: #303030;
    }
	}
	}
	.list-pic-goods{
		display: flex;
		justify-content:flex-start;
		align-items: center;
		>img{
			width: 80px;
			margin-right: 15px;
		}
		.l-list-info{
			.totalnums{
				font-size: 20px;color: #000000;padding: 4px 0;font-weight: 600;
			}	
		}
	}
	.pre-pic{
			padding:6px 0 6px 0;
			font-size: 16px;color: #333333;font-weight: 600;line-height: 1.5;
		}
	.uniqs{
		li{
			span{font-size: 13px;}
		}
	}
</style>
