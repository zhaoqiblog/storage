<template>
  <div class="shop-supply">
    <x-header class="vux-1px-b" :left-options="{preventGoBack:true}" @on-click-back="back">
    	前置仓补货单
    	<a slot="right">
    		<router-link to="historySupplyList">我的补货单</router-link>
    		<!--补货历史-->
    	</a>
    </x-header>
    <div class="scroll-content pre-content" ref="scrollWrap">
    	<!--<div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>-->
    	<!--<MpopInput :isShow="showPop"></MpopInput>-->
    	 <div class="container-list">
	       <Group class="list-pre-item" v-for="e,index in data.content" :key="index" @click.native="goTosupplying(e.id)">
	       		<cell :title="e.status=='0'?'待补货':'已完成'" :value="new Date(e.supplementDate).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre"></cell>
	       		<div class="pre-list-item-content">
	       			<div>
	       				<dl>
	       					<dt>
	       						{{e.supplementBillNo}}
	       					</dt>
	       					<dd class="list-contents">
	       						<span>
	       							SKU总数 {{e.skuNum}}  | 通道号 
	       							<span class="channel">{{e.supplementBillNo.slice(-2)}}</span>
	       						</span>
	       						<button @click="goTosupplying(e.id)">{{e.status=='0'?"去补货":"查看详情"}}</button>
	       					</dd>
	       				</dl>
	       			</div>
	       			<!--<div class="button-to-pick">
	       					<button @click="goTosupplying(e.id)">{{e.status=='0'?"去补货":"查看详情"}}</button>
	       			</div>-->
	       		</div>
	       </Group>
	    </div>
      <m-empty v-if="(data.content && data.content.length == 0)" :refresh="getSupplyList"></m-empty>
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
name: 'supply-list',
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
        pageSize: 10,
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
    this.getSupplyList()
  },
  methods: {
  	/*
  	 *去补货
  	 */
  	goTosupplying(id){
  		this.$router.push({path:'supplying',query:{'id':id}})
  	},
    /**
     * 获取前置补货单列表
     * 
     */
    getSupplyList () {
    	this.page.pageNo++;
    	const obj={status:0,supplementType:4,page: this.page.pageNo,size: this.page.pageSize}
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
    back(){
		this.$router.push("/")
  }
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
  },
  
}

</script>
<style lang="less">
	.container-list{
		margin-top: 10px;
	}
.shop-supply {
	input{box-shadow: none;}
	.list-info-cell .l-list-ct .l-list-content .l-list-info ul li:nth-child(2){
		padding-left: 8px;
	}
	.list-info-cell .l-list-ct .l-list-content .l-list-info{
		padding-bottom: 10px;
	}
	.list-info-cell .l-list-ct .l-list-content .l-list-name.l-list-nametext{
		font-size: 16px;color: #333333;
		font-weight: 800;
		line-height: 2;
	}
	.weui-cells .weui-cell{
		padding: 10px 0px;
	}
	.scroll-content{
		&.pre-content{
			.list-info-cell{
				/*margin-top: 10px;*/
				width: 94%;
				margin:10px auto 0;
				background: #FFFFFF;
				box-shadow: 0 0 6px 0 #9090903b;
				border-radius: 3px;
				
			}
			.weui-cells{
				margin-top: 10px;
			}
			.weui-cells .weui-cell .vux-cell-primary .vux-label{
				color: #303030 !important;
				font-size: 13px;
			}
			.weui-cells .weui-cell .weui-cell__ft{
				color: #999999;font-size: 12px;
			}
			.list-pre-item{
				width: 95%;
				margin:0 auto;
				border-radius: 3px;
				.cell-pre{
					margin: 0 2.7%;
				}
				.pre-list-item-content{
					padding: 7px 0 15px 0;
					margin: 0 2.7%;
					/*display: flex;justify-content: space-between;align-items: flex-end;*/
					dt{
						font-size: 18px;font-weight: 600;color: #333333;line-height: 2;
						&.overTime{color: #FF5800;}
						span{color: #3DA5FE;}
					}
					dd{
						font-size: 12px;color: #999999;
						&.list-contents{
							display: flex;
							justify-content: space-between;align-items: flex-end;
						}
						.channel{
							color: #000000;font-weight: 700;
						}
						button{border-radius: 2px;background: #3DA5FE;border: none;font-size: 15px;padding: 3px 10px;color: #FFFFFF;}
					}
					.button-to-pick{
						button{border-radius: 2px;background: #3DA5FE;border: none;font-size: 15px;padding: 5px 10px;color: #FFFFFF;}
					}
				}
			}
		}
	}
  .theEnd {
    font-size: 14px;
    line-height: 1;
    margin: 16px 0;
    color: #bbb;
    text-align: center;
  }
}
</style>
