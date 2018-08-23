<template>
  <div>
  	<!--'concat-pick-list'-->
    <keep-alive :include="['pre']">

      <router-view ></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
}

</script>
<style lang="less" >

</style>
