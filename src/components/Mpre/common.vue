<template>
	<!--<div class="goods-info-item list-info-cell goods-info-item-pre">-->
    <!--<div ref="listCt" class="l-list-ct" style="position: relative!important;">-->
    	<!--<div v-if="warehouseCode||typeof warehouseCode != 'undefined'" class="l-list-title clearfix"> 
    		<span v-if="warehouseCode">{{warehouseCode}}</span>
    		<div class="title-right fr" >
    			<span v-if="rightTxt" class="safe-num">{{rightTxt}}</span>
    		</div>
    	</div>-->
    		<div class="l-list-content vux-1px-t">
    			<div class="list-pic-goods">
    				<img :src="imgurl" v-if="imgurl"/>
    				<img src="../../assets/common/noPic.png" v-if="!imgurl"/>
    				<div class="l-list-prename">
    				<div class="pre-pic">
	    				{{name}} &nbsp;<span v-if="unit">{{unit}}</span>
	    			</div>
	    			<p class="l-list-code">
	    				<em v-if="code">{{code}}</em>
	    			</p>
	    			<p class="l-list-info clearfix" v-if="unit||unitq">
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
			 		 	<span class="fr totalnums" v-if="totalNum">x{{totalNum}}</span>
	    			</p>
	    			</div>
    			</div>
    		</div>
    	<!--</div>-->
	<!--</div>-->
</template>

<script>
	
export default{
	name: 'pic-item',
	data(){
		return {
		}
	},
	props:{
		itemid:[String],//当前id
	    warehouseCode: [String, Number],//前置仓或者卖场货位号，后端返回，没有的话返回为汉字
	    rightTxt:[String,Number],  //右侧是否有文字，有显示，没有则不现实
	    code: [String, Number],//编号位置文本,没有则不显示，即商品编号
	    imgurl:[String],	//图片地址
	    time: [String],//时间位置文本,没有则不显示，当没有code的时候会靠左
	    name: [String],//主体文本位置
	    unit: [String,Number],//单位 底部第1个，规格
	    unitq: [String, Number],//底部第二个，单价
	    totalNum: [String, Number],//底部按钮总数
		status:[String,Number],  //是否的是历史单据1：是：不显示现有库存和安全库存，0：否，显示现有库存和安全库存
	},
	created(){
//		console.log(this.rightTxt,"09090989")
		typeof this.totalNum == "string" && (this.totalNum = parseInt(this.totalNum));
	},
	
	methods:{
		
	},
	
}

</script>
<style lang="less">
	.l-list-prename{
		.pre-pic{padding-bottom: 0;}
		.l-list-info {padding-top: 5px;}
	}
	
</style>
