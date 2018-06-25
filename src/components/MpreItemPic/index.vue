<template>
	<div class="goods-info-item list-info-cell goods-info-item-pre">
    <div ref="listCt" class="l-list-ct" style="position: relative!important;">
    	<div v-if="preCode||typeof preCode != 'undefined'" class="l-list-title clearfix"> 
    		<span>前置仓 {{preCode}}</span>
    		<div class="title-right fr" v-if="status!=1">
    			<span class="safe-num">库存 <span>{{nowNum}}</span></span>
    		</div>
    	</div>
    		<div class="l-list-content vux-1px-t">
    			<div class="list-pic-goods">
    				<img :src="imgurl"/>
    				<div>
	    			<p class="l-list-code">
	    				<em v-if="code">{{code}}</em>
	    				<span :class="[typeof code == 'undefined'?'list-code-right':'']" v-if="time">{{time}}</span>
	    			</p>
	    			<!--<div class="l-list-name l-list-nametext">{{name}}</div>-->
	    			<div class="pre-pic">
	    				{{name}}
	    			</div>
	    			<p class="l-list-info clearfix">
	    				<slot name="listInfo" >
		    				<ul v-if="unit||unitq">
		    					<li v-if="typeof unit != 'undefined'">
		    						<span>规格</span>
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
    			<div class="l-list-button  vux-1px-t">
    				<button @click="tolessPick(itemid)" v-if="init" class="no-pick">缺货</button>
    				<button v-if="init" @click="toPickAll(itemid)">全部拣货</button>
    				<button class="all-pick" v-if="halfPickNum==totalNum">全部已拣</button>
    				<button class="half-pick" v-if="halfPickNum>0&&halfPickNum!=0&&halfPickNum!=totalNum">已拣X{{halfPickNum}}</button>
    				<button class="half-no-goods" v-if="halfPickNum>0&&halfPickNum!==0&&totalNum-halfPickNum>0">缺货X{{totalNum-halfPickNum}}</button>
    				<button class="all-no-goods" v-if="halfPickNum==0">全部缺货</button>
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
	    init:[Boolean],				//初始进去显示缺货和全部补货按钮，点击事件之后变为false
	    allpick:[Boolean],				//全部已拣
	    halfPickNum:[String,Number],	//已拣的数量
	    topicksum:[Function],   	//缺货按钮点击事件
	    toallpick:[Function],		//全部拣货按钮点击事件
//	    disbale:[Boolean],  		//是否已经开始拣货，未开始，按钮不可点
		status:[String,Number],  //是否的是历史单据1：是：不显示现有库存和安全库存，0：否，显示现有库存和安全库存
	    
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
		font-size: 12px;
    color: #999999;
    padding-left: 10px;
    >span{
    	color: #303030;
    }
	}
	}
	.list-pic-goods{
		display: flex;
		justify-content: space-between;
		align-items: center;
		>img{
			width: 80px;
		}
		.l-list-info{
			.totalnums{
				font-size: 16px;color: #333333;padding: 4px 0;
			}	
		}
	}
	.pre-pic{
			padding:6px 0 6px 0;
			font-size: 16px;color: #333333;font-weight: 600;line-height: 1.5;
		}
	
</style>
