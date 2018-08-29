<template>
  <div class="pre-picking">
    <x-header class="vux-1px-b" :left-options="{preventGoBack:true}" @on-click-back="back">
    	合单拣货
    	<a slot="right"><router-link to='searchOrder'>搜索</router-link></a>
    </x-header>
    <tab v-model="index" active-color="#3DA5FE">
	      <tab-item v-for="(i,ins) in ['待拣货 刷新','拣货中','历史订单']" :key="ins" @on-item-click="clickItem">{{i}}</tab-item>
	      <span v-if="page.totalElements" style="position: absolute;top: 15%;background: red; border-radius: 50%;padding: 0 5px;color:#FFFFFF;left: 26%;">{{page.totalElements}}</span>
	    </tab>
    <div class="scroll-content pre-pick-list pre-concat-list" ref="scrollWrap">
    	 
        <div v-if="index==0">
          	<div class="container-list" >
          		<pre-list-concats v-for="e,index in data.noPick" :key='index'
          			:id="e.id"
          			:classInfo="e.classInfo"
          			:isOver="e.isOver"
          			:outerOrderType="e.outerOrderType"
          			:creatTime="e.creatTime"
          			:OverText="e.OverText"
          			:skuNum="e.skuNum"
          			:orderSequenceNo="e.orderSequenceNo"
          			:deliverType="e.deliverType"
          			:slotType="e.slotType"
          			:receiveOrder="receiveOrder"
          			></pre-list-concats>
			    </div>
			    <m-empty v-if="data.noPick && data.noPick.length == 0"></m-empty>
			    <div v-if="page.isEnd" class="theEnd">已经到底啦</div>
        </div>
        <div v-if="index==1">
          	<div class="container-list" >
			        <Group class="list-pre-item" v-for="e,index in data.picking" :key="index">
			       		<div class="item-top vux-1px-b">
			       			<span class="good-code">
					   				<span class="order-name">{{e.orderSequenceNo}}</span>
					   				<span class="order-form">{{e.deliverType=='0'?'自提':'配送'}}</span>
					   				<span class="order-form-immedirte" v-if="e.deliverType!=='0'&&e.slotType!=='expectTime'">{{e.slotType=='expectTime'?'':'极速达'}}</span>
					   			</span>
			       			<!--<span class="good-code">{{e.id}}</span>-->
			       			<span class="good-time-type">
			       				<span class="order-type">{{new Date(e.creatTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
			       			</span>
			       		</div>
			       		<div class="pre-list-item-content">
			       			<div>
			       				<dl>
			       					<dt v-if="e.isOver" class="overTime">已超时 {{e.OverText}} 分钟</dt>
			       					<dt v-if="!e.isOver">
			       						剩余 
			       						<span>{{e.OverText}}</span> 分钟
			       					</dt>
			       					<dd>
			       						商品SKU&nbsp;{{e.skuNum}},
			       						<span class="category-num" v-if="e.classInfo">生鲜{{e.classInfo.freshFoodNum}}个,</span>
					   						<span class="category-num" v-if="e.classInfo">加工品{{e.classInfo.processedFoodNum}}个,</span>
					   						<span class="category-num" v-if="e.classInfo">冻品{{e.classInfo.frozenFoodNum}}个</span>
			       					</dd>
			       				</dl>
			       			</div>
			       			<label :for="'radios'+index" class="radisLabel" style="width: 100%;height: 100%;position: absolute;top: 0;left: 0;">
			       			<div class="button-to-pick">			       				
			       					<input type="checkbox" name="radios" 
			       						:id="'radios'+index" v-model="selectLists" 
			       						:value="e.id"  @change="changeSeleList('picking')" style="position: absolute;top: 80px;right: 20px;"/>
			       			</div>
			       			</label>
			       		</div>
			        </Group>
			    </div>
			    <div v-if="page1.isEnd" class="theEnd">已经到底啦</div>
			    <m-empty v-if="data.picking && data.picking.length == 0"></m-empty>
        </div>
        <div v-if="index==2">
          	<div class="container-list" >
			        <Group class="list-pre-item" v-for="e,index in data.history" :key="index">
				       		<router-link :to="{path:'conHistoryDetail',query:{id:e.id}}">
					       		<div class="item-top vux-1px-b">
					       			<span class="good-code">{{e.operatorName}}  拣货  <span v-if="e.mergeId" class="merge-color">合单号{{e.mergeId}}</span></span>
					       			<span class="good-time-type">
					       				<span class="order-type">{{new Date(e.finishTime).format('yyyy-MM-dd hh:mm:ss')}}&nbsp; > </span>
					       			</span>
					       		</div>
				       		</router-link>
				       		<div class="pre-list-item-content concat">
				       			<div>
				       				<dl>
				       					<dt>{{e.orderSequenceNo}} <span style="">&nbsp;{{e.id}}</span></dt>
				       					<dd>
				       						<span class="order-form">{{e.deliverType=='0'?'自提':'配送'}}</span>
				       						<span class="order-form-immedirte" v-if="e.deliverType!=='0'&&e.slotType!=='expectTime'">{{e.slotType=='expectTime'?'':'极速达'}}</span>
				       					</dd>
				       				</dl>
				       			</div>
				       			<div class="button-to-pick">
				       				<button  class="" @click="printOrder(e.id)" style="padding: 10px 20px;">打印 X{{e.printCount}}</button>
				       			</div>
				       		</div>
			       		
			        </Group>
			    </div>
			    <div v-if="page2.isEnd" class="theEnd">已经到底啦</div>
			    <m-empty v-if="data.history && data.history.length == 0"></m-empty>
        </div>
    </div>
     <div class="pre-footer" v-if="index==1">
      <div class="btn-add btn-tips">
       		<input type="checkbox" name="selectDefault" id="selectDefault" v-model="selectDefault" @change="changeDefault()"/>
       		<label for="selectDefault">&nbsp;&nbsp;默认8单，可多选</label>      		
      </div>
      <div class="btn-submit concat-pre">
        <button type="button" :disabled="selectLists.length==0" @click="startPick">开始拣货</button>
      </div>
    </div>
    <popup-picker 
    	v-if="showSelectBlue" 
    	:show-cell="false" class="showposdiffer"  
    	:data="commonInfo.blueList" 
    	:show="showSelectBlue" 
    	v-model="slectBlue" 
    	@on-change="changeBlue" 
    	show-name 
    	@on-hide="showSelectBlue=false">
    </popup-picker>
  </div>
</template>
<script>
	import MEmpty from '@/components/MEmpty/index'
import MpopInput from '@/components/MpopInput/index'
import { XHeader,Group,Tab, TabItem,Cell,Swiper, SwiperItem,PopupPicker } from 'vux'
import { mapState } from 'vuex';
import factory from '@/factory.js'
import $request from '@/service/request.js'
import func from '../../../func.js'
export default {
  components: {
    XHeader,Cell,Tab, TabItem,Group,Swiper, SwiperItem,
    MEmpty,MpopInput,PopupPicker
  },
	name: 'concat-pick-list',
  computed: mapState({
    commonInfo: state => state.global.commonInfo
  }),
  data() {
    return {
    	index:0,
      // 分页 page:未拣货，page1：拣货中
      page: {
        pageNo: 0,
        pageSize: 20,
        totalPage: 1,
        isEnd:false,
        totalElements:0,
      },
      page1:{
      	pageNo: 0,
        pageSize: 20,
        totalPage: 1,
        isEnd:false,
        totalElements:0,
      },
      page2:{  //历史拣货分页
      	pageNo: 0,
        pageSize: 20,
        totalPage: 1,
        isEnd:false,
      },
      data: {
      	'noPick':[],
      	'picking':[],
      	'history':[],
      },
      showEnd: false, // 最后一页
      timer:null,
      selectDefault:'',//默认拣货数据
      selectLists:[], //选择的列表
      status:'nopick',
      isConnectDevice:false,  //打印机是否连接成功
      slectBlue:[], //选中的蓝牙设备号
      showSelectBlue:false, //选择蓝牙弹框显示与否
      printId:'',
    }
  },
    mounted() {
    this.$nextTick(function () {
	    func.scrollListen(this,this.$refs.scrollWrap,()=>{
	    	if(this.index==0){
	    		let e=this.page;
	    			if(e.pageNo<e.totalPage){
		    		this.getSupplyList(0)
		    	}else{
		    		this.page.isEnd=true;
		    	}
	    	}else if(this.index==1){
	    		let e=this.page1;
	    			if(e.pageNo<e.totalPage){
		    		this.getSupplyList(2)
		    	}else{
		    		this.page1.isEnd=true;
		    	}
	    	}else{  //拣货历史
	    		let e=this.page2;
	    		if(e.pageNo<e.totalPage){
		    		this.getSupplyList(1)
		    	}else{
		    		this.page2.isEnd=true;
		    	}
	    	}
	    })
	    this.timer = setInterval(()=>{
			this.page.pageNo=1;
			this.$refs.scrollWrap.scrollTop=0
    	this.getSupplyList(0,this.page.pageNo)  
    },15000)
    })
  },
  created() {
    this.getSupplyList(0);
  },
  destroyed(){
  	clearInterval(this.timer)
  },
  methods: {
  	/**
	 * 修改蓝牙连接设备
	 */
	changeBlue(){
		localStorage.setItem("bluedata",this.slectBlue[0]);
		sessionStorage.setItem("bluedata",this.slectBlue[0]);
//		连接打印机
		if(window.cordova){
			var param1 = { btAddress:sessionStorage.getItem("bluedata") };//这里传入用户点击的目标蓝牙设备地址
			factory.connectBlue(param1).then(res=>{
				this.isConnectDevice=true;
				this.printOrder(this.printId)
			},(err)=>{
				alert("连接打印机失败："+err+'\n'+"请回到首页设置模块修改打印设备")}
			)
		}
	},
  /**
   * 
	 * 打印小票
	 */
	printOrder(id){
		//开启蓝牙
  		const _this =this;
  		this.printId=id;
		//获取蓝牙连接列表，判断是否之前连接过蓝牙
//		if(localStorage.getItem("bluedata")&&this.isConnectDevice){
//		if(sessionStorage.getItem("bluedata")){  //session中有蓝牙连接记录，说明当前蓝牙蓝牙已经在连接中，不用重复连接
			//获取打印小票信息
			$request.post("/api/online-order/v1/protected/batchquery/pickdetail",[id]).then((res)=>{
				if(res.success==true){
					func.printInfo(res.data[0],this,()=>{   //打印，成功的回调函数，记录打印次数并显示在界面上
						func.printAdd(res.data[0],this,(count)=>{
							let arrobj = Object.keys(count.data[0])
							this.data.history.forEach((r)=>{
								if(r.id==res.data[0].id){
									r.printCount = count.data[0][arrobj]
								}
							})
						})
					})
				}else{
					this.$vux.toast.show({
	            type: 'text',
	            text: res.message||'获取该订单数据失败，请联系管理员',
          })
				}
			})
	/*	}else{
			//蓝牙未连接，提示选择连接哪个蓝牙,获取已配对的蓝牙设备列表
				factory.getBlueList().then((res)=>{
					let arrays = res.map((e)=>{
						return {name:e.split("=>")[0],value:e.split("=>")[1]}
					})
					this.$store.commit("updateCommonInfo", {
			    	blueList:[arrays],
			    });
			    this.showSelectBlue=true;
				},(err)=>{
						alert(err);
				})
		}*/
	},
  	/**
  	 * 默认四个订单拣货的点击事件
  	 */
  	changeDefault(){
  		this.selectLists=[]
  		if(this.selectDefault){
	  		if(this.index==1){ //拣货中
	  			this.data.picking.forEach((a,index)=>{
	  				if(index<8){
		  				this.selectLists.push(a.id)
		  			}
	  			})
	  		}  			
  		}else{
  			this.selectLists=[]
  		}
  	},
  	/*
  	 * 手动选择单据事件
  	 */
  	changeSeleList(val){
  		if(this.selectLists.length!==8){
  			this.selectDefault=false;
  		}else{
  			this.selectDefault=true;  			
  		}
  	},
  	/*
  	 * 接单
  	 */
  	receiveOrder(id){
  		$request.get("/api/online-order/v1/protected/startpick/"+id).then(res=>{
	  			if(res.success==true){
	  				//接单成功：刷新界面
	  				this.$vux.toast.show({
	            type: 'text',
	            text: '接单成功'
	          })
	  				this.getSupplyList(0,1)
	  			}else{
	  				//接单操作失败
	  				this.$vux.toast.show({
	            type: 'text',
	            text: res.message
	          })
	  				this.getSupplyList(0,1)
	  			}
	  		})
  	},
  	back(){
  		clearInterval(this.timer)
  		this.$router.push("/");
  	},
  	clickItem(index){
  		this.selectLists=[];
  		this.selectDefault=false;
  		if(index==0){  //待拣货
  			this.data.noPick=[];
  			this.getSupplyList(0,1)
  			this.status='nopick'
  		}else if(index==1){  //拣货中
  			this.data.picking=[];
  			this.getSupplyList(2,1);
  			this.status='picking'
  		}else{  //拣货历史
  			this.data.history=[];
  			
  			this.getSupplyList(1,1);
  		}
  	},
  	startPick(){
  		clearInterval(this.timer)
			this.$router.push({path:'concatPicking',query:{'id':this.selectLists.join("|")}})
  	},
  	/*
  	 *去拣货  status,
  	 */
  	goToPick(id,toTime,creatTime){
  		clearInterval(this.timer)
//		this.$router.push({path:'picking',query:{'id':id,toTime:toTime,creatTime:creatTime}})
  		let ids ='';
  		this.data.noPick.forEach((e,index)=>{
  			if(index<4){
  				if(index==3){
  					ids += e.id
  				}else{
  					ids += e.id+'|'
  				}
  			}
  		})
		this.$router.push({path:'concatPicking',query:{'id':ids,toTime:toTime,creatTime:creatTime}})
  	},
  	/**
  	 * 查看改该货单详情
  	 */
  	ToPickLook(id){
  		
  	},
    /**
     * 获取前置仓拣货列表
     * @param[status] : 0：待拣货; 1:拣货完成; 2:开始拣货 0：待拣货时不用传工号，其他传工号
     * 这里只需要传连两个：0：2
     * @params（pageNo： 如果pageNo 传入且值为1：说明重新加载，这时，双方都是从第一页开始加载，否则是按照页码填加新的
     */
    getSupplyList (status,pageNo) {
    	let pageNow;
    	if(!pageNo){  //pageno不存在，累加，不是i重新加载
    		if(status==0){
    			this.page.pageNo++;
    			pageNow = this.page.pageNo
    		}else if(status==2){  //拣货中
    			this.page1.pageNo++;
    			pageNow = this.page1.pageNo
    		}else{	//已完成
    			this.page2.pageNo++;
    			pageNow = this.page2.pageNo
    		}
    		
    	}else{//pageNo存在 : 重新加载，从第一页开始，此时传入的页码是第一页
    		pageNow = pageNo;
    		if(status==0){
    			this.page.pageNo=pageNo;
    		}else if(status==2){
    			this.page1.pageNo=pageNo;
    		}else{
    			this.page2.pageNo=pageNo;
    		}
    	}
    	let obj;
    	if(status==0){
    		obj={
    			shopId:localStorage.getItem("currentStore") ? localStorage.getItem("currentStore") : this.commonInfo.costNumber,
    			status:status,page:pageNow,size: this.page.pageSize,
//  			isTimeOut:1,
    		}
    	}else{
    		obj={
    			operatorNo:this.commonInfo.userNo,
    			shopId:localStorage.getItem("currentStore") ? localStorage.getItem("currentStore") : this.commonInfo.costNumber,
    			status:status,
    			page: pageNow,
    			size: this.page1.pageSize,
    		}
    	}
      $request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
        if(res.success) {
        	if(status==0){  //未拣货
	          if(pageNow==1){
	         		this.data.noPick=[];
	         	}
	          res.data.content.map((item,ins)=>{
			            let supplyNum = 0, products = []
			            item.classInfo=JSON.parse(item.classInfo)
			            let a = parseInt(item.toTime-new Date().getTime())	
			            item.OverText=Math.abs(parseInt(a/(1000*60)));
			            if(a>0){
			            	item.isOver=false;
			            }else{
			            	item.isOver=true;
			            }
	          })
	         this.data.noPick =this.data.noPick.concat(res.data.content)
        		this.page.totalPage=res.data.totalPages
        		this.page.totalElements=res.data.totalElements
        	}else if(status==2){ //拣货中
	          res.data.content.forEach(function(item) {
	            let supplyNum = 0, products = []
	            item.classInfo=JSON.parse(item.classInfo)
	            let a =item.toTime-new Date().getTime()
	            item.OverText=Math.abs(parseInt((item.toTime-new Date().getTime())/(1000*60)));
	            if(a>0){
	            	item.isOver=false;
	            }else{
	            	item.isOver=true;
	            }
	          })
	          this.data.picking =this.data.picking.concat(res.data.content)
        		this.page1.totalPage=res.data.totalPages
        	}else{  //历史
        		 this.data.history =this.data.history.concat(res.data.content)
        		this.page2.totalPage=res.data.totalPages
        	}
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
        }
      })
    },
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
      this.getSupplyList(0)
    }
  }
}

</script>
<style lang="less">
	.pre-concat-list{
		padding-bottom: 48px;
	}
	.pre-picking .pre-pick-list .list-pre-item .pre-list-item-content .button-to-pick button{
		&.print-btn{
			color: #999999;
			background: #FFFFFF; border: 1px solid #D0D0D0;
		}
		&.toDetail{
			border: 1px solid #D0D0D0;
			font-size: 15px;
			color: #333333;
			background: #FFFFFF;
		}
	}
	.pre-picking .pre-pick-list .list-pre-item .pre-list-item-content{
		&.concat{
			dt{
				span{
					font-size: 13px;
					color: #999999;
				}
			}
		}
		.radisLabel{
			input[type='checkbox']{width: 0;right: 80px;}
			input[type='checkbox']:before{
			  content: '';
			  display: inline-block;
			  width: 22px;
			  height: 22px;
			  /*margin-right: 6px;*/
			  border-radius: 100%;
			  vertical-align: middle;
			  border: 1px solid #D0D0D0;
			  background: #FFFFFF;
			  position: absolute;
    		right: 10px;
    		top: -20px;
			}
			input[type='checkbox']:checked:before{
				background:url("../../../assets/pre/iconOk.png") center center no-repeat;
				background-size: cover;
				border: none;width: 24px;height: 24px;
				
			}
		}
	}
</style>
