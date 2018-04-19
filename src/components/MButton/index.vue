<template>
  <div class="m-button">
    <button class="btn"><slot></slot></button>
  </div>  
</template>       
<script>
export default {
  name: 'm-header',
  props: {
     exit: Boolean
  },
  beforeMount () {
    
  },
  computed: {
    
  },
  methods: {
    onClickBack () {
      if (this.exit) {
        // 如果存在exit，跳出浏览器
      } else {
        this.$router ? this.$router.back() : window.history.back()
      }
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less">
@import "../../css/style.less";

.m-button{
  display: block;
	margin: 25px 30px;
  .btn{
  	display: block;
  	width: 100%;
  	height: 40px;
  	line-height: 40px;
  	border: none;
  	border-radius: 20px;
  	text-align: center;
  	color:white;
  	background: @main-color;
  	font-size: 15px;
    outline: none;
  	&:active{
  		background: #2779d5;
  	}
  }
}
</style>
