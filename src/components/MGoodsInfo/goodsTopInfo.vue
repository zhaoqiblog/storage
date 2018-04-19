<template>
	<div class="goods-top-info list-info-cell">
    <div ref="listCt" @touchstart.stop="start" @touchmove.stop="move" @touchend.stop="mytouchend" class="l-list-ct" style="position: relative!important;">
    	<div>
    		<ul class="top-info-ct">
    			<li class="top-info-item">
    				<h2>{{trayCode}}</h2>
    				<p>托盘码</p>
    			</li>
    			<li class="top-info-item">
    				<h2>{{skuCode}}</h2>
    				<p>SKU数量</p>
    			</li>
    			<li class="top-info-item">
    				<h2>{{total}}</h2>
    				<p>库存总件量</p>
    			</li>
    		</ul>
    	</div>
      <div @touchstart.stop.prevent="" @touchend.stop.prevent="deleteItem" class="l-list-delete">删除</div>
    </div>
	</div>
</template>

<script>
export default{
	name: 'goods-top-info',
	data(){
		return {
			
		}
	},
	props:{
 		sideslip: { type: Boolean, default: false },
    trayCode: [String, Number],
    skuCode: [String, Number],
    total: [String, Number],
    deleteFunc: [Function],
	},
	methods:{
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
<style lang="less">
.list-info-cell.goods-top-info{
	.top-info-ct{
		height: 70px;
		padding: 15px 0;
		overflow: hidden;
		width: 100%;
		box-sizing: border-box;
		
		.top-info-item{
			width: 33.33%;
			height: 100%;
			float: left;
			h2{
				width: 100%;
				color: #303030;
				font-size: 20px;
				line-height: 25px;
				text-align: center;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				font-weight: 700;
			}
			p{
				line-height: 22px;
				font-size: 12px;
				color: #999999;
				text-align: center;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				font-weight: 400;
			}
		}
	}
}

</style>