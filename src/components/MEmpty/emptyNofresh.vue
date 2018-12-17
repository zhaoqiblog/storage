<template>
  <div class="empty">
    <div class="img">
      <img src="../../assets/common/pic_null.png">
    </div>
    <p class="text">暂无数据</p>
  </div>
</template>

<script>
export default {
  name: 'm-empty-norefresh',
  created(){
  },
  methods: {
    refreshs(){
    	if(this.refresh){
    		this.refresh()
    	}else{
    		return;
    	}
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="less">
.empty {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -80px;
  transform: translate3d(-50%, -50%, 0);
  text-align: center;
  .img {
    width: 202px;
    height: 145px;
    margin: 0 auto;
    img {
      width: 100%;
    }
  }
  .text {
    margin-top: 60px;
    color: #C7C7C7;
    font-size: 16px;
  }
}
</style>
