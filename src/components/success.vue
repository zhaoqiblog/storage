<template>
  <div class="self-process">
    <x-header :left-options="{showBack:false}" class="vux-1px-b">{{title}}</x-header>
    <div class="contentWrap">
    	<div class="successInfo">
    		<img src="../assets/common/pic_success.png" alt="" />
    		<div class="texts">{{text}}</div>
    		<div class="infos">{{info}}</div>
    		<div class="infos" v-if="$route.query.wareHousea">请将库位<span class="houseName">{{$route.query.wareHousea}}</span>的反配商品移至库位<span class="houseName">{{$route.query.wareHouseb}}</span></div>
    		<div class="infos" v-if="$route.query.warehouseA">请将库位<span class="houseName">{{$route.query.warehouseA}}</span>商品移至库位<span class="houseName">{{$route.query.warehouseB}}</span></div>
    	</div>
    	<x-button plain class="bottom" v-if="!this.listPath" @click.native="back">返回</x-button>
    	<div class="defers" v-if="this.listPath">
    		<button class="backs" @click="back">返回</button> <button class="seeList" @click="seeList">查看我的{{$route.query.text.slice(0,-2)}}单</button>
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
  	let textinfo=this.$route.query.text.slice(0,-2)
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
<style lang="less">
/*.vux-header{border-bottom: 1px solid #D5D9DE;}*/
.self-process{height: 100%;background: #FFFFFF;}
	.contentWrap{
		/*background: #FFFFFF;*/
		/*height:*/
		.texts{color: #3DA5FE;font-size: 23px;max-width: 71%;margin: 0 auto;font-weight: 600;}
		.infos{
			color:#666666;
			max-width: 72%;
			margin: 0 auto;
			.houseName{color: #3DA5FE;}
		}
		.successInfo{text-align: center;}
		img{width: 32%;margin: 135px auto 50px;}
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
				bottom: 5%;
				left: 50%;
				margin-left:-160px;
				
				button{border: none;width: 150px;border-radius: 40px;height: 40px;font-size: 16px;}
				.backs{
					color:#3DA5FE;background:#F4F4F4;margin-right: 20px;
					&:active{
						background: #DAE4EC;;
					}
				}
				.seeList{
					color:#F4F4F4;background: #3DA5FE;
					&:active{
						background: #3183CB;
					}
				}
			}
	}
</style>
