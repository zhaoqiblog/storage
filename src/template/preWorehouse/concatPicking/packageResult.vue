<template>
  <div class="shop-supply pick-supply">
  	<x-header class="vux-1px-b" :left-options="{showBack: false}">
  		拣货结果
  		<!--<a slot="right" class="picking-right" > <span @click="cancelSave" v-if='isTmpexit'>取消暂存</span><span@click="tmpSave">&nbsp;&nbsp;&nbsp;暂存</span></a>-->
  	</x-header>
    <div class="pre-content-title">
    	<div class="picking-title" v-if="isdata">
    		<div :class="{'isErr':isErr,'pag-success':true}">
    			<div v-if="isdata&&!isErr">装袋完成，成功订单发给配送！</div>
    			<div v-if="isdata&&isErr">订单异常。拣货失败！</div>
    				<img v-if="!isErr" src="../../../assets/pre/packageSuccess@2x.png"/>
    				<img v-if="isErr" src="../../../assets/pre/packageErr@2x.png"/>
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-content-pag" ref="scrollWrap">
    	<div class="pag-result-list" v-if="isdata">
    		<dl>
    			<dt>拣货装袋结果：</dt>
    			<!--所有订单拣货失败-->
    			<dd class="vux-1px-b" v-if="isdata&&dataObj.length==idlength">共{{idlength}}个拣货订单，0个订单拣货成功，{{dataObj.length}}个订单拣货失败</dd>   
    			<!--有拣货成功的订单-->
    			<dd class="vux-1px-b" v-if="isdata&&dataObj.length!=idlength">共{{idlength}}个拣货订单，{{idlength-dataObj.length}}个订单拣货成功，{{dataObj.length}}个订单拣货失败</dd>
    		</dl>
    		<dl v-if="isdata&&dataObj.length>0">
    			<dt class="err-list-title">异常原因：</dt>
    			<dd>
	    			<ul>
	    				<li v-for="item,n in dataObj">{{item.name}}</li>
	    			</ul>
    			</dd>
    		</dl>
    	</div>
    </div>
     <div class="cm-footer">
			<div class="btn-add btn-left">
				<router-link to="/">
	       			<span>返回主页</span>
	      </router-link>
    	</div>
      	<div class="btn-submit">
      		<router-link :to="{name: 'concatPickList'}">
        		<button type="button">继续拣货</button>
        	</router-link>
        </div>
    </div>
  </div>
</template>

<script>
import MEmpty from '@/components/MEmpty/index'
import MpopInput from '@/components/MpopInput/index'
import { XHeader,Confirm,TransferDomDirective as TransferDom,PopupPicker,XDialog,Tab, TabItem} from 'vux'
import md5 from 'js-md5';
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from "@/func.js"
export default {
	 directives: {
    TransferDom
  },
  components: {
    XHeader, MEmpty,MpopInput,Confirm,PopupPicker ,XDialog,Tab, TabItem
  },
  name: 'pick-package-result',
  computed: mapState({
    commonInfo: state => state.global.commonInfo,
  }),
  data() {
    return {
    	dataObj:[],
    	isErr:false,
    	idlength:0,
    	isdata:false,  //是否去获取数据
    }
  },
  created() {
  	this.idlength = this.$route.query.id.split("|").length
  	console.log(this.$route.query.id.split("|").length,this.dataObj)
  	this.completePackage()
  },
  methods: {
  	/*完成装袋*/
  	completePackage(){
  		let ids = this.$route.query.id.split("|")
//  	ids[0]=ids[0]+"5"
//  	ids[1]=ids[1]+"5"
    	$request.post("/api/online-order/v1/protected/complete",ids).then(res=>{
    		if(res.success&&res.success==true){
    			if(res.data){  //有订单提交失败
    				this.dataObj =JSON.parse(res.data);
    				if(this.dataObj.length>=ids.length){this.isErr=true}else{this.isErr=false}
    				this.dataObj.forEach((e,indexss)=>{
		    			let key = Object.keys(e)[0]
		    				e.name = key+':'+e[key]
		    				e.id=key
		    		})
    			}else{  //所有订单提交成功
    				
    			}
    			this.isdata=true
		    }else{
		    		this.isAllPicked=false;
		    		this.$vux.toast.show({
	          type: 'text',
	          text:res.message
	        })
		    }
    	}).catch(err=>{
    		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '前置仓商品装袋',info: '', path:{name:'concatPickList'}}})
        })
  	}
  },
}

</script>
<style lang="less">
	.pag-success{
		background: #4CC7AB;color: #FFFFFF;font-size: 14px;height: 64px;line-height: 64px;padding: 0 8.5% 0 4.5%;letter-spacing: 1px;
		display: flex;justify-content: space-between;align-items: center;
		img{width:8.5%;height: auto;margin-top: 1%;}
		&.isErr{background:rgba(250,106,62,0.90);;}
	}
	.pre-content-pag{top: 120px;
    padding-bottom: 60px}
    .pag-result-list{
    	margin: 0 2.9%;background: #FFFFFF;padding: 15px 3.5%;
    	dt{font-weight: 600;font-size: 14px;}
    	dd{color: #666666;font-size: 13px;line-height: 3;}
    }
    .err-list-title{margin-top: 10px;}
</style>
