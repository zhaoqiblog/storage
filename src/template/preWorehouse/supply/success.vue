<template>
  <div class="self-process">
    <x-header :left-options="{showBack:false}" class="vux-1px-b">{{obj.title}}</x-header>
    <div class="preWrap1">
    	<div class="successInfo">
    		<img src="../../../assets/pre/icon2.png" alt="" />
    		<div class="title">{{obj.text}}成功</div>
    		<div class="infos">{{obj.info}}</div>
    	</div>
    	<div class="success-handelbtn">
    		<router-link :to="obj.btn1link" v-if="obj.btn1link"><x-button class="bottom blue" >{{obj.btn1Text}}</x-button></router-link>
    		<router-link :to="obj.btn2link" v-if="obj.btn2link"><x-button class="bottom">{{obj.btn2Text}}</x-button></router-link>
    		
    		<x-button class="bottom"  @click.native="back">返回</x-button>
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
    	obj:{},
    }
  },
  computed: {

  },
  created() {
  	this.obj=this.$route.query
  },
  mounted(){
  },
  methods: {
//   toShowPlace(){  //扫描二维码显示库位码
//  	this.showPlaceCode=true;
//  },
    back(){
    	this.$router.push(this.obj.backpath)
    },
    seeList(){
//  	this.$router.push(this.listPath)
    }
  }
}

</script>
<style type="text/css" lang="less" scoped>
	.self-process{height: 100%;background: #FFFFFF;}
</style>
<style lang="less">
.router-view{height: 100%;}
	.preWrap1{
		.title{color: #333333;font-size: 22px;max-width: 71%;margin: 0 auto;font-weight: 600;}
		.infos{
			color:#666666;
			max-width: 72%;
			margin: 0 auto;
			.houseName{color: #3DA5FE;}
		}
		.successInfo{text-align: center;}
		img{width: 52%;margin: 85px auto 50px;}
		.success-handelbtn{
			width: 90%;
			/*margin: 0 auto;*/
			position: absolute;
			bottom: 45px;
			left:5%;
			button:nth-child(2){
				margin-top: 40px;
			}
			.bottom{
				height:40px;
				border-radius: 3px;
				width: 100%;font-size: 16px;
				text-align: center;;color: #FFFFFF;
				background: #FFFFFF;
				margin-top: 15px;
				border: 1px solid #D0D0D0;
				font-size: 16px;
				color: #333333;
				/*position:absolute;bottom: 8%;*/
				/*left: 50%;*/
				/*margin-left: -45%;*/
				}
				.weui-btn:after{
			    border: none;
				}
				.blue{background: #3DA5FE;border: none;color: #FFFFFF;}
				button:last-child{/*background: #3DA5FE;border: none;color: #FFFFFF;*/}
		}
		
	}
</style>
