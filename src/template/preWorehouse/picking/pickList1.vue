<template>
  <div class="shop-supply">
    <x-header class="vux-1px-b">
    	前置仓拣货
    	<a slot="right"><router-link to="historyPickList">我的拣货单</router-link></a>
    </x-header>
    <div class="scroll-content pre-content" ref="scrollWrap">
    	<!--<div class="cm-store vux-1px-b"><span>{{commonInfo.costName}}</span></div>-->
    	<!--<MpopInput :isShow="showPop"></MpopInput>-->
    	 <div class="container-list">
	       <Group class="list-pre-item" v-for="e,index in data.content" :key="index">
	       		<cell :title="'拣货单号：'+e.id" :value="new Date(e.creatTime).format('yyyy-MM-dd hh:mm:ss')" class="vux-1px-b cell-pre"></cell>
	       		<div class="pre-list-item-content">
	       			<div>
	       				<dl>
	       					<dt v-if="e.isOver" class="overTime">已超时</dt>
	       					<dt v-if="!e.isOver">
	       						剩余 
	       						<span>{{e.OverText}}</span> 分钟
	       					</dt>
	       					<dd>共{{e.skuNum}}件商品 <span>{{e.ordersequenceno}}</span></dd>
	       				</dl>
	       			</div>
	       			<div class="button-to-pick">
	       					<button @click="goToPick(e.id,e.status)">去拣货</button>
	       			</div>
	       		</div>
	       </Group>
	    </div>
      <m-empty v-if="data.content && data.content.length == 0" :refresh="getSupplyList"></m-empty>
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
name: 'pick-list',
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
        pageSize: 15,
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
  	 *去拣货 
  	 */
  	goToPick(id,status){
  		const datas = this.data.content.filter(e=>{
  			return e.id==id
  		})[0]
  		this.$router.push({path:'picking',query:{'id':id,toTime:datas.toTime,creatTime:datas.creatTime}})
  		/*
  		if(status==0){
	  		$request.get("/api/online-order/v1/protected/startpick/"+id).then(res=>{
	  			if(res.success==true){
	  				this.$router.push({path:'picking',query:{'id':id,creatTime:datas.creatTime,toTime:datas.toTime}})
	  			}
	  		})
	  	}else{
	  		this.$router.push({path:'picking',query:{'id':id,creatTime:datas.creatTime,toTime:datas.toTime}})
	  	}
	  	*/
  	},
  	/**
  	 * 查看改该货单详情
  	 */
  	ToPickLook(id){
  		
  	},
    /**
     * 获取前置仓拣货列表
     * @return {[type]} [description]
     */
    getSupplyList () {
    	this.page.pageNo++;
    	const obj={shopId:this.commonInfo.costNumber,status:0,page: this.page.pageNo,size: this.page.pageSize}
      $request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
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
    
    /**
     * 监听滚动事件触发下拉加载
     */
    scrollListen () {
    	console.log("pp")
      const _this = this
      let anchor = this.$refs.scrollWrap
      anchor.addEventListener('scroll', function() {
        var scrollTop = document.body.scrollTop;
        let top=anchor.scrollTop,
            sh=anchor.scrollHeight,
            ch=anchor.clientHeight;
        if(sh==top+ch) {
          // 触发加载数据
          if(_this.page.pageNo < _this.page.totalPage) {
          	console.log("加载第二页")
            _this.getSupplyList()
          } else {
            _this.showEnd = true
          }
        }
      })
    }
  },
  mounted() {
    this.$nextTick(function () {
      const e=this.page;
        func.scrollListen(this,this.$refs.scrollWrap,()=>{
        	console.log(this.page.pageNo)
        	if(e.pageNo<e.totalPage){
        		console.log("加载下一页")
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
	.container-list{
		margin-top: 10px;
	}
.shop-supply {
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
	/*.weui-cells .weui-cell{
		padding: 10px 0px;
	}*/
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
					display: flex;justify-content: space-between;align-items: flex-end;
					dt{
						font-size: 18px;font-weight: 600;color: #333333;line-height: 2;
						&.overTime{color: #FF5800;}
						span{color: #3DA5FE;}
					}
					dd{font-size: 12px;color: #999999;
						>span{
							color: #6fc710;
						}
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
