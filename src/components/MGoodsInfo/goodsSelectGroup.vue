<template>
	<div class="goods-select-group">
		<slot></slot>
	</div>
</template>

<script>
export default{
	name: 'goods-select-group',
	data(){
		return {
			
		}
	},
	props:{
    keyword: {
      type: String,
      default: 'id'
    },
    value: {
      type: [Array],
      default: ()=>[]
    },
    actualVal:{
    	
    },
    datas: {
    	type: Array,
      required: true
    }
	},
	created(){
		
	},
	methods:{
		filter(value){
			return this.datas.filter(item => value.indexOf(item[this.keyword])>=0)
		}
	},
	watch: {
    value(value) {
    	console.log("pp")
    	this.$emit("input",this.value);
    	this.$emit("change",this.filter(this.value),this.value);
    },
    actualVal(actualVal){
    	console.log("ll")
    	this.$emit("input",this.actualVal);
    }
  }
	
}

</script>
<style lang="less">
.goods-select-group {
	
}


</style>