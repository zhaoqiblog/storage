<template>
	<div class="l-list-item">
    <div ref="listCt" @touchstart.stop.prevent="start" @touchmove.stop.prevent="move" @touchend.stop.prevent="mytouchend" class="l-list-ct" style="position: relative!important;">
    	<div>
    		<div v-if="depotCode" class="l-list-title l-list-afterLine"> 库位号码 {{depotCode}} </div>
    		<div class="l-list-content">
    			<p class="l-list-code">
    				<em v-if="code">{{code}}</em>
    				<span v-if="time">{{time}}</span>
    			</p>
    			<p class="l-list-name"> {{name}} </p>
    			<slot name="listInfo" >
	    			<p class="l-list-info">
							<span>现有总数量(E)</span>
							<span class="l-list-blue">{{totalNum}}</span>
							<span>单位(UI)</span>
							<span class="l-list-green">{{unit}}</span>
							<span>件数(C)</span>
							<span class="l-list-violet">{{num}}</span>
	    			</p>
	 		 		</slot>
    			<div v-if="type=='text'" class="l-list-text">{{textNum}}</div>
    			<div v-if="type=='input'" class="l-list-ctl">
    				<div @touchstart.stop.prevent="minus"  class="l-list-minus"></div>
    				<input @input="inputVal" v-model="copyValue" type="number" />
    				<div @touchstart.stop.prevent="add"  class="l-list-add"></div>
    			</div>
    		</div>
    	</div>
      <div @touchstart.stop.prevent="deleteItem" class="l-list-delete">删除</div>
    </div>
	</div>
</template>

<script>
export default{
	name: 'goods-info',
	data(){
		return {
			X: 0,//移动距离
			objX: 0,//目标对象位置
			initX: null,
			moveX: null,
			copyValue: null,
			count: -10,//数量
		}
	},
	props:{
 		sideslip: { type: Boolean, default: false },
 		type: { type: String, default: 'none' },
    depotCode: [String, Number],
    code: [String, Number],
    time: [String],
    name: [String],
    totalNum: [String, Number],
    unit: [String],
    num: [String, Number],
    value: [String, Number],
    textNum: [String, Number],
    deleteFunc: [Function],
	},
	created(){
		this.copyValue = parseInt(this.value);
	},
	methods:{
		inputVal(){
			this.$emit("input",this.copyValue);
		},
		minus(){
			this.copyValue = this.copyValue-1<=0 ? 0 : this.copyValue-1;
			this.$emit("input",this.copyValue);
		},
		add(){
			this.copyValue = this.copyValue+1<=0 ? 0 : this.copyValue+1;
			this.$emit("input",this.copyValue);
		},
		deleteItem(event){
			event.preventDefault();
			event.stopPropagation();
			this.deleteFunc();
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
	mounted(){

	},

}

</script>
<style lang="less">
.l-list-ct.animated {
  -webkit-transition: -webkit-transform 0.2s;
  transition: -webkit-transform 0.2s;
  transition: transform 0.2s;
  transition: transform 0.2s, -webkit-transform 0.2s;
}

.l-list-afterLine:after{
	content: "";
	display: inline-block;
	position: absolute;
	left: 0;
	bottom: 0;
	height: 1px;
	border-bottom: solid 1px #d5d9de;
	transform: scale(1, 0.5);
  width: 100%;
}

.l-list-item {
  overflow: hidden;
  width: 100%;
  position: relative;
  font-weight: 400;
  border-bottom: solid 1px #d5d9de;

  .l-list-ct {
	  line-height: 60px;
	  border-bottom: 1px solid #fcfcfc;
	  position: relative;
	  color: #666;
	  background: #ffffff;
	  -webkit-transform: translateX(0px);
	  -webkit-transition: -webkit-transform 0.2s;
	  transition: -webkit-transform 0.2s;
	  transition: transform 0.2s;
	  transition: transform 0.2s, -webkit-transform 0.2s;

	  .l-list-delete {
		  position: absolute;
		  top: 0;
		  right: -80px;
		  text-align: center;
		  background: #FC4B4C;
		  color: #fff;
		  width: 80px;
		  height: 100%;
		  font-size: 17px;
		  display: -webkit-box;
		  -webkit-box-orient: horizontal;
		  -webkit-box-pack: center;
		  -webkit-box-align: center;
		}

		.l-list-title{
			position: relative;
			font-size: 12px;
			line-height: 12px;
			color: #999999;
			padding: 10px;
		}

		.l-list-content{
			padding: 10px;
			line-height: 14px;
			overflow: hidden;
			position: relative;

			.l-list-code{
				padding: 5px 0;
				em{
					font-style:normal ;
					font-size: 14px;
					color: #333333;
					float: left;
					max-width: 50%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				span{
					font-size: 12px;
					color: #C7C7C7;
					float: right;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				&:after{
					display: block;
					content: "";
					height: 0;
					width: 0;
					clear: both;
				}
			}

			.l-list-name{
				line-height: 20px;
				font-size: 15px;
				color: #333333;
				width: 65%;
			}

			.l-list-info{
				font-size: 10px;
				color: #999999;
				line-height: 10px;
				padding: 10px 0;

				.l-list-blue{
					color: #1187f8;
					padding-right: 10px;
					margin-right: 10px;
					border-right: solid 1px #f3f3f3;
				}
				.l-list-green{
					color: #6fc710;
					padding-right: 10px;
					margin-right: 10px;
					border-right: solid 1px #f3f3f3;
				}
				.l-list-violet{
					color: #3A3000;
				}

			}

			.l-list-ctl{
				position: absolute;
				height: 30px;
				width: 100px;
				border: solid 1px #dddddd;
				right: 10px;
				bottom: 15px;
				border-radius: 4px;
				input{
					width: 38px;
					float: left;
					border: none;
					height: 100%;
					line-height: 14px;
					padding: 7px 0;
					color: #333333;
					text-align: center;
					font-size: 14px;
					border-right: solid 1px #e9e9e9;
					border-left: solid 1px #e9e9e9;
				}
				div{
					float: left;
					line-height: 28px;
					text-align: center;
					border: none;
					padding: 0;
					margin: 0;
					height: 100%;
					width: 30px;
					background: transparent;
					-webkit-user-select: none;

					&.l-list-minus{

						background: transparent url(imgs/btn_sub.png) no-repeat center center / 10px auto;
					}
					&.l-list-add{
						background: transparent url(imgs/btn_add.png) no-repeat center center / 10px auto;
					}
					&:active{
						opacity: 0.5;
					}
				}
			}

			.l-list-text{
				position: absolute;
				top: 40px;
				right: 10px;
				font-size: 20px;
				font-weight: 500;
				color: #3DA5FE;
			}

		}



	}
}

</style>