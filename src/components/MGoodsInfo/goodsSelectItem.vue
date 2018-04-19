<template>
	<div class="goods-select-item list-info-cell">
    <div @click.stop.prevent="check" class="l-list-ct">
    	<div>
    		<div v-if="depotCode" class="l-list-title l-list-afterLine"> 库位号码 {{depotCode}} </div>
    		<div class="l-list-content">
    			<p class="l-list-code">
    				<em v-if="code">{{code}}</em>
    				<span v-if="time">{{time}}</span>
    			</p>
    			<p class="l-list-name"> {{name}} </p>
    			<p class="l-list-info">
    				<slot name="listInfo" >
	    				<ul v-if="totalNum||unit||num||unitq">
	    					<li v-if="typeof totalNum != 'undefined'">
	    						<span>总数量(E)</span>
	    						<span class="l-list-blue">{{totalNum}}</span>
	    					</li>
	    					<li v-if="typeof unit != 'undefined'">
	    						<span>单位(UI)</span>
	    						<span class="l-list-green">{{unit}}</span>
	    					</li>
	    					<li v-if="typeof num != 'undefined'">
	    						<span>件数(C)</span>
									<span class="l-list-violet">{{num}}</span>
	    					</li>
	    					<li v-if="typeof unitq != 'undefined'">
	    						<span>件装数(Q)</span>
									<span class="l-list-croci">{{unitq}}</span>
	    					</li>
	    				</ul>
		 		 		</slot>
    				<span v-if="altogether||typeof altogether != 'undefined'" class="l-list-total">
    					共计<em>{{altogether}}</em>{{unit}}
    				</span>
    			</p>
    			<div @click.stop.prevent="check" class="l-list-checkbox"><span :class="{'active':checkStatus}"></span></div>
    		</div>
    	</div>
    </div>
	</div>
</template>

<script>
export default{
	name: 'goods-select-item',
	data(){
		return {
			
		}
	},
	computed:{
		checkStatus(){
			return this.$parent.value.indexOf(this.label)>=0
		},
	},
	props:{
 		sideslip: { type: Boolean, default: false },
 		type: { type: String, default: 'none' },
    depotCode: [String, Number],//title位置、没有不显示
    code: [String, Number],
    time: [String],
    name: [String],
    totalNum: [String, Number],
    unit: [String],
    num: [String, Number],
    unitq: [String, Number],
    altogether: [String, Number],//共计底部右侧  
    label: {required: true},//
	},
	methods:{
		inputVal(){
			this.$emit("input",this.copyValue);
		},
		check(){
		//	this.checkStatus = !this.checkStatus;
			var index = this.$parent.value.indexOf(this.label);
			if(index >= 0){
				this.$parent.value.splice(index,1);
			}else{
				this.$parent.value.push(this.label);
			}
		},
		
	},
	
}

</script>
<style lang="less">

.goods-select-item.list-info-cell {
  overflow: hidden;
  width: 100%;
  position: relative;
  font-weight: 400;
 /* border-bottom: solid 1px #d5d9de;*/
  
  .l-list-ct {
		
		.l-list-content{
			padding: 10px 15px;
			line-height: 14px;
			overflow: hidden;
			position: relative;
			padding-left: 55px;
			
			.l-list-name{
				height: auto;
				min-height: 30px;
				max-height: 44px;
			}
			
			.l-list-checkbox{
				position: absolute;
				left: 16px;
				top: 50%;
				margin-top: -8px;
				height: 18px;
				width: 18px;
				background: transparent url(imgs/btn_check2.png) no-repeat center center / 18px 18px;
				
				span{
					display: block;
					height: 100%;
					width: 100%;
					float: left;
					transition: .2s opacity ease-in-out;
					opacity: 0;
					&.active{
						opacity: 1;
						background: transparent url(imgs/btn_check1.png) no-repeat center center / 18px 18px;
					}
				}
			}
			
		}
		
	}
}

</style>