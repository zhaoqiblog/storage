<template>
  <div class="self-process">
    <x-header :left-options="{showBack:false}" class="vux-1px-b">{{title}}</x-header>
    <div class="contentWrap">
    	<div class="successInfo">
    		<img src="../../../assets/common/pic_success.png" alt="" />
    		<div class="texts">{{text}}</div>
    		<div class="infos">{{info}}</div>
    	</div>
    	<div class="defers">
    		<button class="backs" @click="back">返回</button> <button class="seeList" @click="seeList">继续选择商品</button>
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
  name: '',
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
  },
  methods: {
    /**
     * 返回
     */
    back(){
//  	this.$router.push(this.$route.query.path)
    	this.$router.push('/')
    },
    /**
     * 继续选择商品
     */
    seeList(){
    	this.$router.push({path:'/turnover/selectGoods?scanResult='+this.$route.query.scanResult})
    }
  }
}

</script>
<style type="text/css" lang="less" scoped>
	.self-process{height: 100%;background: #FFFFFF;}
</style>
<style lang="less">
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
