<template>
	<span>{{time}}</span>
</template>

<script>
	export default {
		data(){
			return{
//				time:'',
				now:new Date().getTime(),
				timeIntever:null
			}
			
		},
		
		created(){
			/**
			 * startTime:开始日期：2017/12-45
			 */
			let self = this;
			this.timeIntever = setInterval(function(){
				self.now = new Date().getTime();
			}, 1000);
		},
//		destroyed(){
//			clearInterval(this.timeIntever)
//		},
		props:['startTime'],
		methods:{
			formate(time){
				let hour =parseInt(time/1000/3600);
				let min  = parseInt((time/1000 - hour * 3600)/60)
				let sec = parseInt(time/1000 - hour * 3600 - min * 60)
				return   sec >=0 ? hour + '小时' + min + '分钟' + sec + '秒' :'已超时';
				return   '00:' + min + ':' + sec;
			}
		},
		computed:{
			time:function(){
				return this.formate(new Date(this.startTime).getTime()+30*60*1000 - this.now);
			}
		},
		
	}
</script>

<style>
</style>