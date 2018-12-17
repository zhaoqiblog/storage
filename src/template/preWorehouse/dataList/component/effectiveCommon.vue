<template>
	<div>
		<div class="order-plate">
			<dl>
				<dt class="vux-1px-b strong-txt">接单效率</dt>
				<dd class="palte-title-info"><span class="strong-txt">平均接单时间</span> <span>{{Math.floor(data.averageStartTime/60)+':'+data.averageStartTime % 60}}</span></dd>
				<dd class="palte-title-info"><span class="strong-txt">平均拣货时间</span> <span>{{Math.floor(data.averagePickTime/60)+':'+data.averagePickTime % 60}}</span></dd>
				<dd class="palte-title-info"><span class="strong-txt">平均装袋时间</span> <span>{{Math.floor(data.averagePackageTime/60)+':'+data.averagePackageTime % 60}}</span></dd>
			</dl>
		</div>
		<group class="well-cils-wrap">
			<router-link :to="{name:'effectiveTop',query:{beginDate:beginDate,endDate:endDate,type:type}}"><cell title="员工拣货总效率" value="TOP 10" is-link></cell></router-link>
			<router-link :to="{name:'orderTimeTop',query:{beginDate:beginDate,endDate:endDate,type:type}}"><cell title="订单耗时最长" value="TOP 10" is-link></cell></router-link>
		</group>
	</div>
</template>

<script>
	import { Group, Cell } from 'vux';
	import $request from '@/service/request';
	export default {
		name: 'effective-common',
		components: {
			Group,
			Cell
		},
		props:{
			data:[Object],
			type:[String,Number],
			beginDate:[String],
			endDate:[String],
		},
		data() {
			return {}
		},
		created(){console.log(this.type)},
		methods:{
			getTopList(obj){
			}
		}
	}
</script>

<style>

</style>