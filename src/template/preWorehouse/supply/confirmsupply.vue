<template>
  <div class="shop-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<router-link :to="{path:'supplying',query:{id:$route.query.id,back:1}}"><span class="icons fl" ></span></router-link>
    	<span class="txt">前置仓补货单</span>
    </div>
    <div class="pre-content-title pre-detail-title">
    	<div class="picking-title">
    		<div class="counting-time">
    		</div>
    		<div class="pick-code pick-info-wrap confirm-t-wrap">
    			<div class="confirm-t vux-1px-b">
    				<dl>
    					<dt>确认补货</dt>
    					<dd>请核对商品补货信息</dd>
    				</dl>
    				<img src="../../../assets/pre/icon1.png"/>
    			</div>
    			<p>补货单号：<span>{{preSupplyConfirm.supplementBillNo}}</span></p>
    			<p>创建日期：<span>{{new Date(preSupplyConfirm.creatTime).format("yyyy-MM-dd hh:mm:ss")}}</span></p> 
    			<p>补货SKU总数：<span>{{preSupplyConfirm.supplyItemDTOS.length}}</span></p>     			
    			<p>补货员：<span>{{commonInfo.name}}</span></p>     			
    		</div>
    	</div>
    </div>
    <div class="scroll-content pre-supply-list confirm-list" ref="scrollWrap">
    		<div v-if="preSupplyConfirm&&preSupplyConfirm.supplyItemDTOS" v-for="e,index in preSupplyConfirm.supplyItemDTOS" class="item-pre-supply">
    			<p class="pre-supply-code">商品编码：{{e.goodsBarCode}}</p>
    			<p class="pre-supply-name vux-1px-b">{{e.goodsName}}</p>
    			<div class="pre-supply-title ">
    				<span class="item-top-left">前置仓 {{e.frontWarehouseCode}}</span>
    				<div class="title-right">
    					<span class="now-num vux-1px-r">现有库存 {{e.frontWarehouseNum}}</span><span class="safe-num">安全库存 {{e.safeNum}}</span>
    				</div>
    			</div>
    			
    			<div class="supply-input vux-1px-t" >
    				<span>补货至前置仓</span>
    				<span>{{e.supplyNum}}</span>
    				<!--<input type="number" v-model="e.supplyNum"/>-->
    			</div>
    			<div class="tips" v-if="e.leftOver<0">输入数量不能超过总数量！</div>
    			<div class="supply-input vux-1px-t" v-for="n,indexn in e.supplyChannelDTOList" v-if="n.fromWarehouseId!=-1">
    				<span>{{'库位 '+n.fromWarehouseCode+' 数量 '+n.fromWarehouseNum}}</span>
    				<input type="number" v-model="n.reaNum" @input="changeValue(e)" pattern="[0-9]*"/>
    				<!--<span>{{n.reaNum}}</span>-->
    				<!--<x-input title="" placeholder="I'm placeholder" @on-change="changeValue(e)" v-model="n.reaNum"></x-input>-->
    			</div>
    			<div class="supply-other vux-1px-t" v-if="e.leftOver>0">
    				<span>卖场  补货至前置仓</span>
    				<span>{{e.leftOver}}</span>
    			</div>
    		</div>
    </div>
     <div class="cm-footer">
     	
      <div class="btn-submit">  <!--:disabled=""-->
        <button :disabled="disab" type="button" @click="submitSupply">确认补货信息</button>
      </div>
    </div>
  </div>
</template>

<script>
	import $request from '@/service/request.js'
import { mapState } from 'vuex';
import {XInput} from 'vux';
	
	export default {
		components: {XInput},
		computed: mapState({
		    commonInfo: state => state.global.commonInfo,
		    preSupplyConfirm:state=>state.prePick.preSupplyConfirm,
		    
		}),
		data() {
			return {
				data:{},
				disab:true,
			}
		},
		created(){
			this.preSupplyConfirm.supplyItemDTOS.forEach((e,index)=>{
				e.leftOver=0;
				e.supplyNum=Number(e.supplyNum)
				if(e.supplyChannelDTOList[0].fromWarehouseId==-1){
					e.leftOver = e.supplyNum
					e.supplyChannelDTOList[0].reaNum=0
				}else{
					e.supplyChannelDTOList.forEach((a,ac)=>{
						a.reaNum='';
						e.leftOver=0
					})
				}
			})
			let shopnum=0;
			this.preSupplyConfirm.supplyItemDTOS.forEach(e=>{
				e.supplyChannelDTOList.forEach(a=>{
					if(a.fromWarehouseId==-1){
						shopnum++;
					}
				})
				if(shopnum==this.preSupplyConfirm.supplyItemDTOS.length){
					this.disab=false;
				}
			})
		},
		
		methods:{
			changeValue(e){
				e.leftOver = 0;  //仓库补货剩余的数量，剩下的全是卖场补
				e.wareValuenum=0; //库位补货一共补货的数量
				let sum =parseInt(e.supplyNum);//一共需要补的数量
				e.supplyChannelDTOList.forEach((n,index)=>{
					sum =sum - n.reaNum //库位补的数量
				})
				e.leftOver=sum;
				if(e.leftOver<0){
					this.disab=true;
				}else{
					this.disab=false;
				}
				e.wareValuenum=e.supplyNum-e.leftOver
				this.$store.commit("setPreSupplyConfirm",Object.assign({}, this.preSupplyConfirm))
			},
			/**
			 * 返回
			 */
			back(){
				this.$router.back()
				
			},
			/*
			 * 提交捕获信息
			 */
			submitSupply(){
				let obj ={
				  "creatTime": this.preSupplyConfirm.creatTime,
				  "id": this.preSupplyConfirm.id,
				  "skuNum": this.preSupplyConfirm.skuNum,
				  "supplementBillNo": this.preSupplyConfirm.supplementBillNo,
				  "supplyItemRequestDTOS": [
				    {
				      "frontWarehouseCode": "string",
				      "frontWarehouseId": 0,
				      "goodsBarCode": "string",
				      "goodsCode": "string",
				      "goodsName": "string",
				      "supplyChannelRequestDTOS": [
				        {
				          "fromWarehouseCode": "string",
				          "fromWarehouseId": 0,
				          "goodsWarehouseId": 0,
				          "supplyNum": 0
				        }
				      ],
				      "supplyNum": 0
				    }
				  ],
				  "totalNum": 0
				}
				let list1=[];
				this.preSupplyConfirm.supplyItemDTOS.forEach((e,index)=>{
					obj.totalNum+=e.supplyNum;
					
					if(e.supplyNum!==0){
						let onlist ={
								frontWarehouseCode:e.frontWarehouseCode,
								frontWarehouseId:e.frontWarehouseId,
								goodsBarCode:e.goodsBarCode,
								goodsCode:e.goodsCode,
								goodsName:e.goodsName,
								supplyChannelRequestDTOS:[],
								supplyNum:e.supplyNum,
						}
						e.supplyChannelDTOList.map((n,ind)=>{
							if(n.fromWarehouseId!=-1&&n.reaNum>0){
								onlist.supplyChannelRequestDTOS.push({
									fromWarehouseCode:n.fromWarehouseCode,
									fromWarehouseId:n.fromWarehouseId,
									goodsWarehouseId:n.goodsWarehouseId,
									supplyNum:parseInt(n.reaNum)
								})
							}
	
						})
						if(e.leftOver>0){
								onlist.supplyChannelRequestDTOS.push({
										fromWarehouseCode:null,
										fromWarehouseId:-1,
										goodsWarehouseId:-1,
										supplyNum:e.leftOver
								})
						}					
//						return onlist
							list1.push(onlist)
					}
				})
				
				obj.supplyItemRequestDTOS=list1
				$request.post("/api/supplement-invoices/v1/protected/confirm_front_supply",obj).then(res=>{
					if(res.success==true){
						this.$router.push({path:"preSupSuccess",query:{
							title:'补货完成',
							text:'补货',
							info:'可以开始搬运货物',
							btn1link:'/preWorehouse/supHistoryDetail?id='+this.$route.query.id,
							btn1Text:'补货单详情',
							btn2Text:'补货历史',
							btn2link:'/preWorehouse/historySupplyList',
							backpath:'/'
						}})
					}else{
        		this.$router.push({path:'/fail',query:{text: res.message,title: '前置仓补货',info: '', path:'/'}})
					}
				}).catch(err=>{
        		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '前置仓补货',info: '', path:'/'}})
				})
			},
		}
	}
</script>

<style lang="less">
	.pre-supply-list{
		.item-pre-supply{
			.supply-other{
				line-height: 50px;font-size: 13px;color: #999999;
				display: flex;
				justify-content: space-between;
				align-items: center;
				>span:nth-child(2){font-size: 16px;}
			}
		}
	}
	.confirm-t{		
		margin: 10px 15px;
		padding-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		dl{padding-left: 15px;}
		dt{font-size: 18px;color: #303030;font-weight: 600;}
		dd{font-size: 13px;color: #999999;}
		img{width: 90px;}
	}
	.pre-content-title.pre-detail-title .picking-title .pick-code.confirm-t-wrap{
		height: auto;
		padding: 0 0 15px 0;
		p.codes{margin-top: 5px;}
	}
	.supply-input{
		.weui-cell{padding: 0;}
		
	}
	.item-pre-supply{
		.tips{
			font-size: 10px;
			color: red;
			text-align: right;
		}
	}
	.confirm-list{top: 250px;}
</style>