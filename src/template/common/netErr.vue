<template>
  <div class="self-process">
    <x-header :left-options="{showBack:false}">{{title}}</x-header>
    <div class="contentWrap">
    	<div class="successInfo">
    		<img src="../assets/common/pic_success.png" alt="" />
    		<div class="texts">{{text}}</div>
    		<div class="infos">{{info}}</div>
    	</div>
    	<x-button plain class="bottom" v-if="!this.listPath" @click.native="back">返回</x-button>
    	<div class="defers" v-if="this.listPath">
    		<button class="backs" @click="back">返回</button> <button class="seeList" @click="seeList">查看我的补货单</button>
    	</div>
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
    	text:"",
    	title:"",info:"",
    	lastPath:'',
    	sawList:'',
    	listPath:''
    }
  },
  computed: {

  },
  created() {
  },
  mounted(){
  	this.text=this.$route.query.text
  	this.title=this.$route.query.title
  	this.info=this.$route.query.info
  	this.listPath=this.$route.query.listPath
  	this.sawList=this.$route.query.sawList  //查看我的补货单列表
  	this.lastPath=this.$route.query.path;
  },
  methods: {
     toShowPlace(){  //扫描二维码显示库位码
    	this.showPlaceCode=true;
    },
    back(){
    	this.$router.push(this.lastPath)
    },
    seeList(){
    	this.$router.push(this.listPath)
    }
  }
}

</script>
<style lang="less" scoped>
/*.vux-header{border-bottom: 1px solid #D5D9DE;}*/
.self-process{height: 100%;background: #FFFFFF;}
	.contentWrap{
		background: #FFFFFF;
		/*height:*/
		.texts{color: #3DA5FE;}
		.infos{color:#666666}
		.successInfo{text-align: center;}
		img{width: 200px;margin-top: 60px;margin: 60px auto 30px;}
		.bottom{
			height:40px;border: none;border-radius: 40px;width: 90%;
			margin:60px auto 0;text-align: center;background: #3DA5FE;color: #FFFFFF;
			position:absolute;bottom: 8%;
			left: 50%;
			margin-left: -45%;
			}
			.defers{
				text-align: center;
				position: absolute;
				bottom: 8%;
				left: 50%;
				margin-left:-160px;
				button{border: none;width: 150px;border-radius: 40px;height: 40px;}
				.backs{color:#3DA5FE;background:#F4F4F4;margin-right: 20px;}
				.seeList{color:#F4F4F4;background: #3DA5FE;}
			}
	}
</style>
