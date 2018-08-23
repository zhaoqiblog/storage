<template>
  <div class="shop-supply">
    <x-header class="vux-1px-b">
    	我的补货单
    </x-header>
    <div class="scroll-content pre-content" ref="scrollWrap">
    	<!--<div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>-->
    	<!--<MpopInput :isShow="showPop"></MpopInput>-->
    	 <div class="container-list">
    	 	<router-link :to="{path:'preShopDetail',query:{id:e.id}}" v-for="e,index in data.content" :key="index">
	       <Group class="list-pre-item" >
	       		<cell title="补货至前置仓" :value="new Date(e.supplementDate).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre"></cell>
	       		<div class="pre-list-item-content">
	       			<div>
	       				<dl>
	       					<dt>
	       						{{e.supplementBillNo}}
	       					</dt>
	       					<dd class="list-contents">补货SKU总数 {{e.skuNum}} | 补货总数量 {{e.goodsSupplementNum}}
	       						<router-link :to="{path:'preShopDetail',query:{id:e.id}}"><button class="toDetail">查看详情</button></router-link>
	       					</dd>
	       				</dl>
	       			</div>
	       			<!--<div class="button-to-pick">
	       					<router-link :to="{path:'preShopDetail',query:{id:e.id}}"><button class="toDetail">查看详情</button></router-link>
	       			</div>-->
	       		</div>
	       </Group>
	       </router-link>
	    </div>
      <m-empty v-if="data.content && data.content.length == 0"></m-empty>
      <div v-if="showEnd" class="theEnd">已经到底啦</div>
    </div>
  </div>
</template>

<script>
	import MEmpty from '@/components/MEmpty/index'
import MpopInput from '@/components/MpopInput/index'
import { XHeader,Group,Cell  } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from '../../../func.js'
export default {
  components: {
    XHeader,Cell,Group,
    MEmpty,MpopInput
  },
name: 'supply-list-history',
//name:'pre',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
//  	showPop:false,
      // 分页
      page: {
        pageNo: 0,
        pageSize: 5,
        totalPage: 1
      },
      data: {
      	content:[],
      },
      datas:[{
      		init:true, //初始状态
      		allpick:false,  //全部已拣
      		halfPickNum:-1, //已拣的数量
					preCode:'125478965412365',
					code:'11111111111',
					time:'入库时间 2017-05-22',
					name:'全部的参数全部的参数全部的参数全部的参数全部的参数全部的参数全部的参数全部的参数',
					totalNum:22,
					unit:'件',
					unitq:5,
				},],
      showEnd: false // 最后一页
    }
  },
  created() {
    this.getSupplyList();
  },
  methods: {
    /**
     * 获取前置补货单列表
     * 
     */
    getSupplyList () {
    	this.page.pageNo++;
    	const obj={status:1,supplementType:3,page: this.page.pageNo,size: this.page.pageSize,userNo:this.commonInfo.userNo}
      $request.get('/api/supplement-invoices/v1/protected/query_page', obj).then(res => {
        if(res.success) {
          this.data.content =this.data.content.concat(res.data.content)
          this.data.content.forEach(function(item) {
            let supplyNum = 0, products = []
            let a =item.toTime-new Date().getTime()
            if(a>0){
            	item.isOver=false;
            	item.OverText=parseInt((item.toTime-new Date().getTime())/(1000*60));
            }else{
            	item.isOver=true;
            }
          })
          this.page.totalPage=res.data.totalPages
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
  },
  mounted() {
    this.$nextTick(function () {
      const e=this.page;
        func.scrollListen(this,this.$refs.scrollWrap,()=>{
        	if(e.pageNo<e.totalPage){
        		this.getSupplyList()
        	}else{
        		this.showEnd=true;
        	}
        })
    })
  },
  activated () {
    if(this.$route.query.refresh && 1 == this.$route.query.refresh) {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        totalPage: 1
      }
      this.data = {}
      this.showEnd = false
      this.getSupplyList()
    }
  }
}

</script>
<style lang="less">
	
</style>
