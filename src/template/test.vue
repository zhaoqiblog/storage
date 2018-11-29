<template>
	<div>
	    <x-header class="vux-1px-b">test页面</x-header>
		<div>我是test</div>
		 <group title="自定义列表">
	      <datetime v-model="value5" placeholder="请选择字定义日期列表" 
	      	:min-year=2000 :max-year=2016 format="YYYY-MM-DD HH" 
	      	@on-change="change" title="中文" 
	      	year-row="{value}年" 
	      	month-row="{value}月" 
	      	
	      	 :compute-days-function="computeDaysFunction"
	      	 confirm-text="完成" cancel-text="取消">
	      </datetime>
	      <!--:hour-list="[1,2,3,4]"-->
	      	<!--hour-row="第{value}周"--> 
	      <!--:display-format="formatValueFunction"-->
	    </group>
	    <div style="position: relative;">
		    <el-date-picker
		      v-model="value1"
		      type="week"
		      format="yyyy年  第WW周"
		      @change="changeval"
		      :editable='false'
		      :picker-options="pickerOptions1"
		      placeholder="选择日期">
		    </el-date-picker>
		    <span style="position: absolute; left: 250px;">( {{rangeWeek}} )</span>
	    </div>
	</div>
</template>

<script>
	import { XHeader,Datetime, Group} from 'vux'
	import {DatePicker} from 'element-ui';
	export default {
		components:{DatePicker},
		data(){
			return {
				value5:'',
				value1:'',
				datasList:'',
				rangeWeek:'',
				formatValueFunction(val){
					console.log(val)
//					return val.replace(/\s/," 第")+'周'
				},
				computeDaysFunction (options, generateRange) {
					console.log(options,generateRange)
			       return [options.month] // if current month is n, days are [n]
			    },
			    pickerOptions1:{
			    	firstDayOfWeek:1
			    }
			}
		},
		components: { XHeader,Datetime, Group },
		created(){
			this.dataList='[5,8,12,17]'
		},
		methods:{
			change(val){
				console.log(val)
			},
			changeval(val,val2){
			 let date =new Date(new Date(val).getTime()-24*3600*1000);
			 let newdate = new Date(date.getTime()+7*24*60*60*1000-20)
			 let date_value=(date.getMonth() + 1) + '.' + date.getDate()
			 let newdate_val=(newdate.getMonth() + 1) + '.' + newdate.getDate() 
			 this.rangeWeek = date_value+'~'+newdate_val
				console.log(this.rangeWeek )
			}
		}
	}
  
</script>

<style>
</style>