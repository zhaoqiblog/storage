<template>
  <div class="self-process">
    <x-header :left-options="{showBack:false}" class="vux-1px-b">{{obj.title}}</x-header>
    <div class="contentWrap difBtn">
    	<div class="successInfo">
    		<img src="../../assets/common/pic_success.png" alt="" />
    		<div class="texts">{{obj.text}}</div>
    		<div class="infos">{{obj.info}}</div>
    	</div>
    	<!--<x-button plain class="bottom" v-if="" @click.native="back">返回</x-button>-->
    	<!--<div class="defers">
    		<button class="backs" @click="back">返回</button> <button class="seeList" @click="seeList">查看我的单</button>
    	</div>-->
    	<div class="">
    		<!--<router-link :to="obj.listpage" v-if="obj.listpage">-->
    			<!--<x-button class="bottom" >查看等待拣货列表</x-button>-->
    		<!--</router-link>-->
    		<!--<router-link :to="obj.detailPage" v-if="obj.listpage">-->
    			<!--<x-button class="bottom">查看该拣货单详情</x-button>-->
    		<!--</router-link>-->
    		
    		<!--<x-button class="bottom"  @click.native="back">返回</x-button>-->
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
    	showPlaceCode:false,
    	text:"",
    	title:"",info:"",
    	lastPath:'',
    	sawList:'',
    	listPath:'',
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
