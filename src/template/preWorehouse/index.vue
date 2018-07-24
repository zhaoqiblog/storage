<template>
  <div>
  	<!--'concat-pick-list'-->
    <keep-alive :include="['pre']">

      <router-view class="asda"></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
	created(){
		if(window.cordova){
  		//开启蓝牙
	  	factory.openBluetooth().then(res=>{console.log(JSON.stringify(res))},(err)=>{alert("Error:"+err)})	  	
	  }
	}
}

</script>
<style lang="less" >

</style>
