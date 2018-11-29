<template>
	<div class="picker-date">
		<div class="picker-wrap" style="position: relative;">
		    <el-date-picker :class="{'picker':rangeWeek}"
		      v-model="datetime"
		      type="week"
		      format="yyyy年 第WW周"
		      @change="changeval"
		      :editable='false'
		      :picker-options="pickerOptions1"
		      placeholder="选择日期">
		    </el-date-picker>
		    <span class="rangeweeks" style="position: absolute;" v-if="rangeWeek">( {{rangeWeek}} )</span>
	    </div>
	</div>
	
</template>

<script>
	export default {
		name:'picker-data-item',
		data(){
			return{
				pickerOptions1:{
			    	firstDayOfWeek:1
			    },
			    rangeWeek:'',
			    datetime:'',
			}
		},
//		props:{datetime:[String]},
		methods:{
			changeval(val){
				let date =new Date(new Date(val).getTime()-24*3600*1000);
				 let newdate = new Date(date.getTime()+7*24*60*60*1000-20)
				 let date_value=(date.getMonth() + 1) + '.' + date.getDate()
				 let newdate_val=(newdate.getMonth() + 1) + '.' + newdate.getDate() 
				 this.rangeWeek = date_value+'~'+newdate_val
				 console.log(this.rangeWeek)
				 this.$emit("changeTime",val)
			},
		}
	}
</script>

<style lang="less">
	.picker-date{
		background: #FFFFFF;
		.picker-wrap{
			.el-date-editor.el-input, .el-date-editor.el-input__inner{
				width: 170px;
				
			}
			.el-input--prefix .el-input__inner{
				border-radius: 49px;
					width: 170px;
			}
			.picker{
				.el-input__inner{
					padding: 5px 0 20px 30px;
					color: #000000;
				}
			}
			.el-input__prefix{left: auto;right: 9px;font-size: 18px;color: #3DA5FE;padding-left: 2px;border-left: 1px solid #DDDDDD;}
			.rangeweeks{
				position: absolute;font-size: 10px;bottom: 0;left: 100px;
			}
		}
	}
	.el-picker-panel{left: 26px !important;}
	.pick-date-show{display: flex;justify-content: center;width: 60%;height: 40px;border-radius: 49px;border: 1px solid #DDDDDD;}
</style>