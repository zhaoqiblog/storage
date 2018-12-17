<template>
	<div class="picker-date">
		<div class="picker-wrap" style="position: relative;">
			<div v-if="index==1">
			    <el-date-picker :class="{'picker':rangeWeek}"
			      v-model="weekDate"
			      type="week"
			      format="yyyy 第WW周"
			      @change="changeval"
			      :editable='false'
			      :picker-options="pickerOptions1"
			      placeholder="选择日期">
			    </el-date-picker>
			    <span class="rangeweeks" style="position: absolute;" v-if="rangeWeek">( {{rangeWeek}} )</span>
		    </div>
		    <div class="datepicker" v-if="index==0">
		    	<datetime v-model="datetime" @on-confirm="changeTime" class='' format='YYYY-MM-DD' placeholder='请选择'></datetime>
		    </div>
		    <div class="datepicker" v-if="index==2">
		    	<datetime v-model="datetime" class='' @on-confirm="changeTime" format='YYYY-MM' placeholder='请选择'></datetime>
		    </div>
	    </div>
	</div>
	
</template>

<script>
	import {Datetime } from 'vux'
	export default {
		  components: {
		    Datetime
		  },
		name:'picker-data-item',
		props:{value:[String]},
		data(){
			return{
				pickerOptions1:{
			    	firstDayOfWeek:1
			    },
			    rangeWeek:'',
			    datetime:null,
			    weekDate:new Date(),
			}
		},
		computed:{
			datetime1(){
				 return this.datetime
			}
		},
		created(){
			//星期默认值i初始化
			let startdate =new Date(new Date().getTime()-(24*3600*1000)*(new Date().getDay()-1));
				let year = startdate.getFullYear();
				 let newdate = new Date(startdate.getTime()+(6*24*60*60*1000-20))
				 let date_value=(startdate.getMonth() + 1) + '.' + startdate.getDate()
				 let newdate_val=(newdate.getMonth() + 1) + '.' + newdate.getDate() 
				 this.rangeWeek = date_value+'~'+newdate_val
			//月和天初始化	 
			this.datetime= this.value ? this.value:(this.index==2 ?  new Date().format("YYYY-MM") : new Date().format("YYYY-MM-dd"));
		},
		props:{index:[Number]},
		methods:{
			changeTime(){
				this.$emit("input",this.datetime)
				this.$emit("changeTime",this.datetime)
				
			},
			changeval(val){
				let date =new Date(new Date(val).getTime()-24*3600*1000);
				let year = date.getFullYear();
				 let newdate = new Date(date.getTime()+7*24*60*60*1000-20)
				 let date_value=(date.getMonth() + 1) + '.' + date.getDate()
				 let newdate_val=(newdate.getMonth() + 1) + '.' + newdate.getDate() 
				 this.rangeWeek = date_value+'~'+newdate_val
				 let finalyVal = year+'-'+((date.getMonth() + 1)>10 ? (date.getMonth() + 1) : ('0'+(date.getMonth() + 1))) + '-' + (date.getDate()<10 ? '0'+date.getDate() :date.getDate())+'~'+ year+'-'+((newdate.getMonth() + 1)>10 ? (newdate.getMonth() + 1) :('0'+(newdate.getMonth() + 1))) + '-' + (newdate.getDate()<10 ? '0'+ newdate.getDate() :newdate.getDate())
				 this.$emit("input",val)
				 this.$emit("changeTime",finalyVal)
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
				position: absolute;font-size: 10px;bottom: 0;left: 50%;margin-left: -56px;
			}
		}
	}
	.el-picker-panel{left: 26px !important;}
	.pick-date-show{display: flex;justify-content: center;width: 60%;height: 40px;border-radius: 49px;border: 1px solid #DDDDDD;}
</style>