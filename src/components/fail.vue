<template>
  <div class="self-process">
    <x-header :left-options="{showBack:false}" class="vux-1px-b">{{title}}</x-header>
    <div class="contentWrap">
    	<div class="successInfo">
    		<img src="../assets/common/pic_fail.png" alt="" />
    		<div class="texts">{{text}}</div>
    		<div class="infos">{{$route.query.text}}</div>
    	</div>
    	<x-button plain class="bottom" @click.native="back">返回</x-button>
    	<!--<div class="defers" v-if="listPath">
    		<button class="backs" @click="back">返回</button> <button class="seeList" seelistPath="listPath">查看我的补货单</button>
    	</div>-->
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
    	showPlaceCode:false,
    	text:"操作失败",
    	title:"失败",
    	info:"请重新操作",
//  	lastPath:'',
//  	listPath:'',
    }
  },
  computed: {

  },
  created() {
  },
  mounted(){
	this.title=this.$route.query.title
	this.text=this.$route.query.info?this.$route.query.info:this.text
  },
  methods: {
     toShowPlace(){  //扫描二维码显示库位码
    	this.showPlaceCode=true;
    },
    back(){
    	this.$router.push(this.$route.query.path)
    },
//  listPath(){
//  	this.$router.push(this.listPath)
//  }
  }
}

</script>
<style lang="less" scoped>
	.texts{color: #FC4A4B;}
</style>
