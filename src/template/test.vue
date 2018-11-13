<template>
	<div>
	    <x-header class="vux-1px-b">test页面</x-header>
		<div>我是test</div>
		 <group title="自定义列表">
	      <datetime v-model="value5" placeholder="请选择字定义日期列表" 
	      	:min-year=2000 :max-year=2016 format="YYYY-MM HH" 
	      	@on-change="change" title="中文" 
	      	:min-day="6" :max-day="15"
	      	year-row="{value}年" 
	      	month-row="{value}月" 
	      	:hour-list="[1,2,3,4]"
	      	hour-row="第{value}周" 
	      	:display-format="formatValueFunction"
	      	 confirm-text="完成" cancel-text="取消">
	      </datetime>
	    </group>
	</div>
</template>

<script>
	import { XHeader,Datetime, Group} from 'vux'
	export default {
		data(){
			return {
				value5:'',
				datasList:'',
				formatValueFunction(val){
					
					return val.replace(/\s/," 第")+'周'
				}
//				:hour-list="['第一周','第二周','第三周','第四周']"
			}
		},
		components: { XHeader,Datetime, Group },
		created(){
			this.dataList='[5,8,12,17]'
		},
		methods:{
			change(val){
				console.log(val)
			}
		}
	}
  
</script>

<style>
</style>