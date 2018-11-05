<template>
  <div class="pre-picking" style="overflow-x: auto;">
  	<!--<div style="overflow-x: hidden;">-->
	    <x-header class="vux-1px-b" :left-options="{preventGoBack:true}" @on-click-back="back" >
	    	合单拣货
	    	<a slot="right"><router-link to='searchOrder'>搜索</router-link></a>
	    </x-header>
    <!--</div>-->
    <!--<div style="width: 450px;overflow-x: scroll;">-->
    	<tab v-model="index" active-color="#3DA5FE">
	      <tab-item v-for="(i,ins) in ['待拣货 刷新','已超时','拣货中','未装袋','历史订单']" :key="ins" @on-item-click="clickItem">{{i}}</tab-item>
	      <span class="tipnum" v-if="numMap&&numMap.newNum" style="left: 19%;">{{numMap.newNum}}</span>
	      <span class="tipnum" v-if="numMap&&numMap.timeoutNum" style="left: 34%;">{{numMap.timeoutNum}}</span>
	      <span class="tipnum" v-if="numMap&&numMap.pikingNum" style="left: 54%;">{{numMap.pikingNum}}</span>
	      <span class="tipnum" v-if="numMap&&numMap.unpackageNum" style="left: 75%;">{{numMap.unpackageNum}}</span>
	    </tab>
	  <!--</div>-->
    <div class="scroll-content pre-pick-list pre-concat-list" ref="scrollWrap">
    	<p class="tempConcat-tips" @click="goToTempList" v-if="isTmpNumber">您有一个订单已暂存,点击此处继续拣货，完成即可继续合单</p>
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
          		<pre-list-concats v-for="e,index in data.overTime" :key='index'
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
			    <m-empty v-if="data.overTime && data.overTime.length == 0"></m-empty>
			    <div v-if="pageOver.isEnd" class="theEnd">已经到底啦</div>
        </div>
        <div v-if="index==2">
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
			       				<!--:disabled="isTmpNumber"-->
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
        <div v-if="index==3">
          	<div class="container-list" >
			        <Group class="list-pre-item" v-for="e,index in data.isUnpackage" :key="index">
				       		<router-link :to="{path:'conHistoryDetail',query:{id:e.id}}">
					       		<div class="item-top vux-1px-b">
					       			<span class="good-code">
					       				<!--{{e.operatorName}}  拣货-->  
					       				<span>合单号 {{e.mergeId}}</span>
					       				<!--<span v-if="e.mergeId" class="merge-color">合单号{{e.mergeId}}</span>-->
					       			</span>
					       		</div>
				       		</router-link>
				       		<div class="pre-list-item-content concat">
				       			<div>
				       				<dl>
				       					<dt v-if="e.isOver" class="overTime">已超时 {{e.OverText}} 分钟</dt>
			       					<dt v-if="!e.isOver">
			       						剩余 
			       						<span>{{e.OverText}}</span> 分钟
			       					</dt>
			       					<!--:class="{'isShowAll':isShowall}"-->
				       					<dd class="unPageText">
			       						<span class="category-num" v-for="key,ind in e.mergeOrderSequenceNo">{{key}} <span v-if="ind<e.mergeOrderSequenceNo.length-1">,</span></span>
				       					</dd>
				       				</dl>
				       			</div>
				       			<div class="button-to-pick">
				       				<button  class="" @click="toPackage(e.mergeOrderId)" style="padding: 10px 20px;">确认装袋</button>
				       			</div>
				       		</div>
			       		
			        </Group>
			    </div>
			    <div v-if="pageUnpackage.isEnd" class="theEnd">已经到底啦</div>
			    <m-empty v-if="data.isUnpackage && data.isUnpackage.length == 0"></m-empty>
        </div>
        <div v-if="index==4">
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
     <div class="pre-footer" v-if="index==2">
      <div class="btn-add btn-tips">
      	<!--:disabled="isTmpNumber"-->
       		<input type="checkbox" name="selectDefault" id="selectDefault" v-model="selectDefault" @change="changeDefault()" />
       		<label for="selectDefault">&nbsp;&nbsp;默认8单，可多选</label>      		
      </div>
      <div class="btn-submit concat-pre">
        <button type="button" :disabled="selectLists.length==0" @click="startPick">开始拣货</button>
      </div>
    </div>
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
      // 分页 page:未拣货，page1：拣货中，pageOver：已超时
      page: {
        pageNo: 0,
        pageSize: 20,
        totalPage: 1,
        isEnd:false,
        totalElements:0,
      },
      page1:{  //拣货中分页
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
        totalElements:0,
      },
      pageOver:{  //已超时分页
      	pageNo: 0,
        pageSize: 20,
        totalPage: 1,
        isEnd:false,
        totalElements:0,
      },
      pageUnpackage:{  //未装袋分页
      	pageNo: 0,
        pageSize: 8,
        totalPage: 1,
        isEnd:false,
        totalElements:0,
      },
      data: {
      	'noPick':[],
      	'picking':[],
      	'history':[],
      	'overTime':[], //已超时列表
      	'isUnpackage':[], //未装袋列表
      },
      timer:null,
      selectDefault:'',//默认拣货数据
      selectLists:[], //选择的列表
      isTmpNumber:false, //是否存在暂存
      numMap:null,   //各个列表数量汇总
//    isShowall:false,  //是否展开
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
	    	}
	    	else if(this.index==1){
	    		let e =this.pageOver;
	    		if(e.pageNo<e.totalPage){
	    			this.getOverList();
	    		}else{
	    			this.pageOver.isEnd=true;
	    		}
//	    		this.getOverList();
	    	}
	    	else if(this.index==2){
	    		let e=this.page1;
	    			if(e.pageNo<e.totalPage){
		    		this.getSupplyList(2)
		    	}else{
		    		this.page1.isEnd=true;
		    	}
	    	}else if(this.index==3){ //未装袋
	    		let e =this.pageUnpackage;
	    		if(e.pageNo<e.totalPage){
	    			this.getOverList(1);
	    		}else{
	    			this.pageUnpackage.isEnd=true;
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
	    	if(this.index==0){
					this.page.pageNo=1;
					this.$refs.scrollWrap.scrollTop=0
		    	this.getSupplyList(0,this.page.pageNo)  
	    	}else if(this.index==1){
	    		this.pageOver.pageNo=0;
	    		this.$refs.scrollWrap.scrollTop=0
		    	this.getOverList()
	    	}
	    },15000)
	    
    })
    
  },
  created() {
//	console.log(localStorage.getItem("currentStore"))
    this.getSupplyList(0);
  },
  destroyed(){
  	clearInterval(this.timer)
  },
  methods: {
  	/** 获取超时订单列表和未装袋列表*/
  	getOverList(isUnpackage){  //isUnpage：未装袋列表，不传：不是未装袋，只要是未装袋列表都要传
  		let obj={
    			shopId:localStorage.getItem("currentStore") ? localStorage.getItem("currentStore") : this.commonInfo.costNumber,
    			status:0,page:this.pageOver.pageNo,size: this.pageOver.pageSize,
    		}
  		if(isUnpackage){  //未装袋时：
  			this.pageUnpackage.pageNo++;
  			obj.status=3;
  			obj.isUnpackage=1;
  			obj.page=this.pageUnpackage.pageNo;
  			obj.size = this.pageUnpackage.pageSize
  		}else{ //已超时
  			this.pageOver.pageNo++;
  			obj.isTimeOut=1;
  			obj.page = this.pageOver.pageNo
  		}
  		$request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
  		 	if(res.success==true){
  		 		this.numMap={...res.data.numMap}
  		 		this.data.isUnpackage = (isUnpackage&&this.pageUnpackage==1) ? [] : this.data.isUnpackage
  		 		this.data.overTime = (this.pageOver.pageNo==1&&!isUnpackage) ? [] : this.data.overTime
	       	if(isUnpackage){
	       		res.data.content.map((item,indexs)=>{
	       			let a = parseInt(new Date(item.toTime).getTime()-new Date().getTime())
	            item.OverText=Math.abs(parseInt(a/(1000*60)));
	            if(a>0){
	            	item.isOver=false;
	            }else{
	            	item.isOver=true;
	            }
	            item.mergeOrderSequenceNo=item.mergeOrderSequenceNo.split(",")
	       		})
	       		this.data.isUnpackage = this.data.isUnpackage.concat(res.data.content);
	       		this.pageUnpackage.totalPage = res.data.totalPages
	       	}else{
	          res.data.content.map((item,ins)=>{
	            let supplyNum = 0, products = []
	            item.classInfo=JSON.parse(item.classInfo)
	            item.isHttps=false;
	            let a = parseInt(item.toTime-new Date().getTime())
	            item.OverText=Math.abs(parseInt(a/(1000*60)));
	            if(a>0){
	            	item.isOver=false;
	            }else{
	            	item.isOver=true;
	            }
	          })
	         this.data.overTime =this.data.overTime.concat(res.data.content)
	    		this.pageOver.totalPage=res.data.totalPages
//	    		this.pageOver.totalElements=res.data.totalElements
  		 		}
	      }
  		})
  	},
  /**
   * 
	 * 打印小票
	 */
	printOrder(id){
		//开启蓝牙
  		const _this =this;
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
	},
  	/**
  	 * 默认四个订单拣货的点击事件
  	 */
  	changeDefault(){
  		this.selectLists=[]
  		if(this.selectDefault){
	  		if(this.index==2){ //拣货中
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
  	receiveOrder(id,callback=null){
  		$request.get("/api/online-order/v1/protected/startpick/"+id).then(res=>{
	  			if(res.success==true){
	  				//接单成功：刷新界面
	  				this.$vux.toast.show({
	            type: 'text',
	            text: '接单成功'
	         })	  	
	         callback()
	  				this.$refs.scrollWrap.scrollTop=0
	  				if(this.index==1){
	  					this.pageOver.pageNo=0;
	  					this.getOverList()
	  				}else{
	  					this.getSupplyList(0,1)
	  				}
	  			}else{
	  				//接单操作失败
	  				this.$vux.toast.show({
	            type: 'text',
	            text: res.message
	          })
	  				callback()
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
  		}else if(index==1){  //已超时
  			this.data.overTime=[]
  			this.pageOver.pageNo=0;
  			this.getOverList();
  		}else if(index==2){  //拣货中
  			this.data.picking=[];
  			this.getSupplyList(2,1);
  		}else if(index==3){
  			this.data.isUnpackage=[];
  			this.pageUnpackage.pageNo=0;
  			this.getOverList(1)
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
    			isTimeOut:0,
    		}
    	}else{
    		obj={
    			operatorNo:localStorage.getItem("userNo"),
    			shopId:localStorage.getItem("currentStore") ? localStorage.getItem("currentStore") : this.commonInfo.costNumber,
    			status:status,
    			page: pageNow,
    			size: this.page1.pageSize,
    		}
    	}
      $request.get('/api/online-order/v1/protected/findpage', obj).then(res => {
        if(res.success) {
        	this.numMap={...res.data.numMap}
//		 		console.log(this.numMap)
        	if(res.data.mergetemp=='yes'){
        			this.isTmpNumber = true
        		}
        	if(status==0){  //未拣货
	          if(pageNow==1){
	         		this.data.noPick=[];
	         	}
	          res.data.content.map((item,ins)=>{
			            let supplyNum = 0, products = []
			            item.classInfo=JSON.parse(item.classInfo)
			            item.isHttps=false;
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
    goToTempList(){
    	this.$router.push({name:'tempPicking'})
    },  
    toPackage(id){
    	let ids = id.split(",")
    	$request.post("/api/online-order/v1/protected/whether/complete",ids).then((res)=>{
    		if(res.success==true){
    			this.$router.push({name:"concatSuccessDetail",query:{id:res.data.join("|")}})
    		}else{
    			this.$vux.toast.show({
            type: 'text',
            text: res.message
          })
    		}
    	})
//  	this.$router.push({name:"concatSuccessDetail",query:{id:id.split(",").join("|")}})
    }
  },

  activated () {
    if(this.$route.query.refresh && 1 == this.$route.query.refresh) {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        totalPage: 1
      }
      this.data = {}
      this.getSupplyList(0)
    }
  }
}

</script>
<style lang="less">
	.tipnum{
		position: absolute;font-size:12px;top: 15%;
		/*background: red;*/
		/*background: red;*/
		 border-radius: 50%;padding: 0 5px;
		color:red;
		font-weight: 600;
		/*color:#FFFFFF;*/
	}
	.pre-concat-list{
		padding-bottom: 48px;
		.tempConcat-tips{
			background: #FFFAD2;
			font-size: 10px;
			color: #1C1C1C;
			line-height: 35px;
			padding-left: 16px;
		}
	}
	.pre-picking{
		.vux-tab .vux-tab-item{font-size: 13px;}
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
	.unPageText{
		max-width: 235px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
</style>
