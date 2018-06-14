<template>
	<div class="goods-info-item list-info-cell">
    <div ref="listCt" @touchstart.stop="start" @touchmove.stop="move" @touchend.stop="mytouchend" class="l-list-ct" style="position: relative!important;">
    	<div>
    		<div v-if="depotCode||typeof depotCode != 'undefined'" class="l-list-title l-list-afterLine"> 库位号码 {{depotCode}} </div>
    		<div class="l-list-content">
    			<p class="l-list-code">
    				<em v-if="code">{{code}}</em>
    				<span :class="[typeof code == 'undefined'?'list-code-right':'']" v-if="time">{{time}}</span>
    				<span class="indexNum" v-if="type=='bottomdate'">序号：{{textNum}}</span>
    			</p>
    			<div :class="['l-list-name',type=='text'||type=='none'?'l-list-nametext':'']">
    				{{name}} 
    				<em v-if="nameSign">{{nameSign}}</em>
    				<slot name="textNumDom">
		    			<div v-if="type=='text'" class="l-list-text">
		    				{{textNum}}<small>件</small>
		    			</div>
	    			</slot>
	    			<div v-if="type=='input'" class="l-list-ctl">
	    				<div @touchstart.stop.prevent="minus"  class="l-list-minus"></div>
	    				<input @input="inputVal" v-model="copyValue" type="number" />
	    				<div @touchstart.stop.prevent="add"  class="l-list-add"></div>
	    			</div>
    			</div>
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
    				<span class="item-picking" v-if="positions=='pre'" @click="toPicking">
    					未拣
    				</span>
    			</p>
    			<!--<slot name="textNumDom">
	    			<div v-if="type=='text'" :class="['l-list-text',code||time?'':'l-list-textreset']">
	    				{{textNum}}<small>件</small>
	    			</div>
    			</slot>
    			<div v-if="type=='input'" :class="['l-list-ctl',code||time?'':'l-list-ctlreset']">
    				<div @touchstart.stop.prevent="minus"  class="l-list-minus"></div>
    				<input @input="inputVal" v-model="copyValue" type="number" />
    				<div @touchstart.stop.prevent="add"  class="l-list-add"></div>
    			</div>-->
    		</div>
    	</div>
      <div @touchend.stop.prevent="" @touchstart.stop.prevent="deleteItem" class="l-list-delete">删除</div>
      
    </div>
    <div class="goods-info-item-bottom" v-if="type=='bottomdate'">
      	<group class="bottom-data-group" v-if="timeValue||typeof timeValue != 'undefined'">
	      <datetime
	      	format='YYYY-MM-DD'
	      	placeholder='请选择'
	      	v-model="timeValue"
	      	@on-change="changedates"
	        title="生产日期">
	      </datetime>
	      <div class="direct-box">
	      	<label for="">实际收货数量</label>
	      	<div class="l-list-ctl">
				<div @touchstart.stop.prevent="minusActual"  class="l-list-minus"></div>
				<input v-model="actualValue" type="number" @input='inputActaul'/>
				<div @touchstart.stop.prevent="addActual"  class="l-list-add"></div>
			</div>
	      </div>
	       <div class="direct-box last-line">
	      	<label for="">赠品数量</label>
	      	<div class="l-list-ctl">
				<div @touchstart.stop.prevent="minusGifts"  class="l-list-minus"></div>
				<input @input="inputGifts" v-model="giftsValue" type="number" />
				<div @touchstart.stop.prevent="addGifts"  class="l-list-add"></div>
			</div>
	      </div>
	    </group>
      </div>
      <div class="goods-info-item-bottom b-text" v-if="type=='bottomText'">
      	<group class="bottom-data-group ">
      		<ul>
      			<li><label for="">生产日期：</label>{{timeSel}}</li>
      			<li><label for="">实际收货数量：</label>{{actualVal}}</li>
      			<li><label for="">赠品数量：</label>{{giftsVal}}</li>
      		</ul>
      	</group>
      </div>
    <p :class="['goods-info-error',errorText?'active':'']"> <span>{{errorText}}</span> </p>
	</div>
</template>

<script>
	import { Datetime,Group } from 'vux'
export default{
	name: 'goods-info-item',
	components:{Datetime,Group},
	data(){
		return {
			X: 0,//移动距离
			objX: 0,//目标对象位置
			initX: null,
			moveX: null,
			copyValue: null,
			actualValue:null, 	//实际收货数量
			giftsValue:null,	//赠品数量
			count: -10,//数量
			errorText: '',//错误提示
			timeout:null,
			timeValue:null,
		}
	},
	props:{
 		sideslip: { type: Boolean, default: false },//滑动开关
 		type: { type: String, default: 'none' },//可选：'input'：有输入框时,'none'：右侧没有蓝色字体和输入框时，'text'为右侧有蓝色数字的时候;默认‘none’,'bottomdate'，有底部属性,bottomText
	    depotCode: [String, Number],//顶部的库位号,没有则不显示
	    code: [String, Number],//编号位置文本,没有则不显示
	    time: [String],//时间位置文本,没有则不显示，当没有code的时候会靠左
	    name: [String],//主体文本位置
	    totalNum: [String, Number],//总数。底部第1个；可使用listInfo将底部一行替换
	    unit: [String],//单位 底部第2个；可使用listInfo将底部一行替换
	    num: [String, Number],//件数；底部第3个 可使用listInfo将底部一行替换
	    unitq: [String, Number],//件装数 底部第4个 可使用listInfo将底部一行替换
	    altogether: [String, Number],//共计底部右侧  
	    value: [String, Number],//输入框默认值
	    textNum: [String, Number],//蓝色的文本数字
	    deleteFunc: [Function],
	    change: [Function],
	    changeActual:[Function],
	    changeDate:[Function],
	    maxBan: { type: [String, Boolean], default: false },//是否限制最大
	    nameSign: { type: [String, Boolean], default: false },//name 旁边的绿色标签
	    timeSel:[String],	//日期绑定的值
//	    productDate:[String],	//底部模块生产日期
	    actualVal:[String, Number], //实际收货数量的绑定值
	    giftsVal:[String, Number], //赠品数量
	    positions:[String],	//判断是否从前置仓过来，是否有拣货按钮
	    toPicking:[Function] ,  	//未拣货按钮的点击事件
	    
	},
	created(){
		this.copyValue = typeof this.value == "string" ? parseInt(this.value) : this.value;
		typeof this.totalNum == "string" && (this.totalNum = parseInt(this.totalNum));
		this.actualValue=typeof this.actualVal == "string" ? parseInt(this.actualVal) : this.actualVal;
		this.giftsValue=typeof this.giftsVal == "string" ? parseInt(this.giftsVal) : this.giftsVal;
		this.timeValue=this.timeSel
	},
//	updated(){
//		this.copyValue = parseInt(this.value);
//	},
	watch: {
	  value:{	
	    immediate: true,
      handler(value) {
        let newVal = Number(value);
        if (isNaN(newVal)) return;
        this.copyValue != newVal && (this.copyValue = newVal);
      }
	  },
	  actualVal:{
	  	immediate: true,
	  	handler(actualVal) {
	        let newVal = Number(actualVal);
	        if (isNaN(newVal)) return;
	        this.actualValue != newVal && (this.actualValue = newVal);
	      }
	  },
	  giftsVal:{
	  	immediate: true,
	  	handler(giftsVal) {
	        let newVal = Number(giftsVal);
	        if (isNaN(newVal)) return;
	        this.giftsValue != newVal && (this.giftsValue = newVal);
	      }
	  },
	  timeSel:{
	  	immediate: true,
	  	handler(timeSel) {
	        if (isNaN(timeSel)) return;
	        this.timeValue=timeSel;
	      }
	  }
	},
	methods:{
		popError(textVal){
			this.errorText = textVal;
			this.timeout && clearTimeout(this.timeout);
			this.timeout = setTimeout(()=>{
				this.errorText = '';
			},1500);
		},
		pop(value){
			if(!this.maxBan){
				if(typeof this.totalNum != 'undefined' && value > this.totalNum){
					this.copyValue = this.totalNum;
					this.popError('不能超过总数量！');
				}
			}
			this.$emit("input",this.copyValue);
			this.$emit("change",this.copyValue,this.$options._parentVnode.key);
		},
		inputVal(){
			if(typeof parseInt(this.copyValue) != "number"){
				return this.popError('请输入数字！');
			}
			typeof this.copyValue != "number" && (this.copyValue = parseInt(this.copyValue));
			this.pop(this.copyValue);
		},
		inputActaul(){
			if(typeof parseInt(this.actualValue) != "number"){
				return this.popError('请输入数字！');
			}
			typeof this.actualValue != "number" && (this.actualValue = parseInt(this.actualValue));
			this.$emit("input",this.actualValue);
			this.$emit("changeActual",this.actualValue,this.$options._parentVnode.key);
		},
		inputGifts(){
			if(typeof parseInt(this.giftsValue) != "number"){
				return this.popError('请输入数字！');
			}
			typeof this.giftsValue != "number" && (this.giftsValue = parseInt(this.giftsValue));
			this.$emit("input",this.giftsValue);
			this.$emit("changeGift",this.giftsValue,this.$options._parentVnode.key);
		},
		changedates(){
			this.$emit("changeDate",this.timeValue,this.$options._parentVnode.key);
		},
		minus(){
			this.copyValue = this.copyValue-1<=0 ? 0 : this.copyValue-1;
			this.pop(this.copyValue);
		},
		add(){
			this.copyValue = this.copyValue+1<=0 ? 0 : this.copyValue+1;
			this.pop(this.copyValue);
		},
		minusActual(){
			this.actualValue = this.actualValue-1< 0 ? 0 : this.actualValue-1;
			this.$emit("changeActual",this.actualValue,this.$options._parentVnode.key);
		},
		addActual(){
			this.actualValue = this.actualValue+1< 0 ? 0 : this.actualValue+1;
			this.$emit("changeActual",this.actualValue,this.$options._parentVnode.key);
		},
		minusGifts(){
			this.giftsValue=this.giftsValue-1< 0 ? 0 : this.giftsValue-1;
			this.$emit("changeGift",this.giftsValue,this.$options._parentVnode.key);
		},
		addGifts(){
			this.giftsValue=this.giftsValue+1< 0 ? 0 : this.giftsValue+1;
			this.$emit("changeGift",this.giftsValue,this.$options._parentVnode.key);
		},
		deleteItem(event){
			this.$refs.listCt.style.WebkitTransform = "translateX(" + 0 + "px)";
			this.deleteFunc(this.$options._parentVnode.key);
		},
		start(event){
			if(!this.sideslip){return false;}
      var obj = this.$refs.listCt;
      if(this.objX <= -80){
      	obj.style.WebkitTransform = "translateX(" + 0 + "px)";
      	this.objX = 0;
      }
      this.initX = event.targetTouches[0].pageX;
      this.objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
		},
		move(event){
			if(!this.sideslip){return false;}
			if (this.objX == 0){
        var obj = this.$refs.listCt;
        this.moveX = event.targetTouches[0].pageX;
        this.X = this.moveX - this.initX;
        if (this.X  >= 0) {
          obj.style.WebkitTransform = "translateX(" + 0 + "px)";
        } else if (this.X  < 0) {
          var l = Math.abs(this.X );
          obj.style.WebkitTransform = "translateX(" + -l + "px)";
          if (l > 80) {
            l = 80;
            obj.style.WebkitTransform = "translateX(" + -l + "px)";
          }
        }
			}else if (this.objX < 0) {
          var obj = this.$refs.listCt;
          this.moveX = event.targetTouches[0].pageX;
          this.X = this.moveX -  this.initX;
          if (this.X  >= 0) {
            var r = -80 + Math.abs(this.X );
            obj.style.WebkitTransform = "translateX(" + r + "px)";
            if (r > 0) {
              r = 0;
              obj.style.WebkitTransform = "translateX(" + r + "px)";
            }
          } else { //向左滑动
            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
          }
      }
		},
		mytouchend(event){
			if(!this.sideslip){return false;}
      var obj = this.$refs.listCt;
      this.objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
      if (this.objX > -40) {
        obj.style.WebkitTransform = "translateX(" + 0 + "px)";
        this.objX = 0;
      } else {
        obj.style.WebkitTransform = "translateX(" + -80 + "px)";
        this.objX = -80;
      }
		},
	},
	
}

</script>
