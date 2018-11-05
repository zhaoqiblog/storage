<template>
  <div class="self-process">
    <x-header :left-options="{showBack:false}" class="vux-1px-b">{{obj.title}}</x-header>
    <div class="contentWrap difBtn">
    	<div class="successInfo">
    		<img src="../../assets/common/pic_fail.png" alt="" />
    		<div class="texts">{{obj.text}}</div>
    		<div class="infos">{{obj.info}}</div>
    	</div>
    	<div class="">
    	</div>
    	<router-link :to="obj.btn1Link" v-if="obj.btn1Text">
    		<x-button class="btn btn-f">{{obj.btn1Text}}</x-button>
    	</router-link>
    	<router-link :to="obj.btn2Link" v-if="obj.btn2Text">
    		<x-button class="btn btn-n">{{obj.btn2Text}}</x-button>
    	</router-link>
    </div>
  </div>
</template>
<script>
import { XHeader,XButton} from 'vux'
//import 
export default {
  components: {
    XHeader,XButton
  },
  name: 'turnoverIndex',
  data() {
    return {
    	text:"",
    	title:"",info:"",
    	sawList:'',
    	obj:{}
    }
  },
  computed: {

  },
  created() {
		this.obj=this.$route.query;
  },
  mounted(){
  },
  methods: {
  }
}

</script>
<style type="text/css" lang="less" scoped>
	.self-process{height: 100%;background: #FFFFFF;}
	.difBtn{
		.btn{margin-top: 5%;width: 83%;border: 1px solid  #D0D0D0;background: #FFFFFF;}
		.btn-f,.btn-n{margin-top:5%;}
		.btn-n{}
		.weui-btn:after {border: none;}		
		
	}
	.infos{color: #999999;font-size: 14px;margin-bottom: 40px;}
	.texts{color: #000000;margin-bottom: 10px;}
	.contentWrap img{margin-top: 100px;margin-bottom: 10px;}
</style>
<style lang="less">
	
</style>
