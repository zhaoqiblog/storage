<template>
  <div class="shop-supply">
    <div class="vux-header vux-1px-b pre-picking-header clearfix">
    	<!--<router-link :to="{path:'supplying',query:{id:$route.query.id,back:1}}">-->
    		<span class="icons fl" @click="back"></span>
    	<!--</router-link>-->
    	<span class="txt">确认补货信息</span>
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
    			<p>补货SKU数：<span>{{confirmShopList.length}}</span></p>     			
    			<p>补货总数：<span>{{allNumber}}</span></p>     			
    			<p>补货员：<span>{{commonInfo.name}}</span></p>     			
    		</div>
    	</div>
    </div>
    
    <div class="scroll-content shopSupply">
      <div class="prolist" v-for="e,index in confirmShopList">
        <div class="proname vux-1px-b">
          <div class="code" >商品编码 {{e.goodsBarCode}}</div>
          <div class="name" >{{e.goodsName}}</div>
        </div>
        <!--<div v-for="e,index in preSupplyInfo.supplyItemDTOS" class="item-pre-supply">-->
    			<div class="pre-supply-title">
    				<span class="item-top-left">前置仓 {{e.targetPlaceCode}}</span>
    				<div class="title-right">
    					<span class="now-num vux-1px-r">现有库存 {{e.nowNum}}</span><span class="safe-num">安全库存 <span>{{e.safeNum}}</span></span>
    				</div>
    			</div>
    			<div class="supply-input vux-1px-t">
    				<span>补货至前置仓</span>
    				<span>{{e.num}}</span>
    				<!--<input type="number" v-model="e.num" />-->
    			</div>
      </div>
    </div>
    <div class="cm-footer">
      <!--<div class="btn-add" @click="scan">
        <span>扫描添加商品</span>
      </div>-->
      <div class="btn-submit">
        <button type="button" @click="confirm">确认补货信息</button>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
	
	import $request from '@/service/request.js'
	import { mapState,mapActions } from 'vuex'
	
	export default {
		components: {XHeader},
		computed: mapState({
		    commonInfo: state => state.global.commonInfo,
		    confirmShopList:state=>state.prePick.confirmShopList
		}),
		data() {
			return {
				data:[{num:0}],
				datas:[{
					
				}],
				allNumber:0,
				notSubmit:true,
				arrs:[{num:10},{num:60},{num:20},{num:50},{num:10},{num:30},{num:80},{num:60},]
			}
		},
		created(){
//			this.allNumber = 
				this.confirmShopList.forEach((e,inde)=>{
					this.allNumber += parseInt(e.num);
				})
		},
		methods:{
			back(){
				this.$router.back()
			},
			confirm(){
				let subObj ={
				  "creatTime": "", //创建日期
				  "id": "",				 //补货单id
				  "skuNum": 0,		 //sku数量
				  "supplementBillNo": "", //补货单号
				  "supplyItemRequestDTOS": [
				    {
				      "frontWarehouseCode": "string", //前置仓编码
				      "frontWarehouseId": 0,	//前置仓id
				      "goodsBarCode": "string",	//商品条码
				      "goodsCode": "string",		//商品编码
				      "goodsName": "string",		//商品名称
				      "supplyChannelRequestDTOS": [
				        {
				          "fromWarehouseCode": "string",  //库位编码
				          "fromWarehouseId": 0,		//库位id
				          "goodsWarehouseId": 0,	//商品库位表id
				          "supplyNum": 0				//补货商品数量
				        }
				      ],
				      "supplyNum": 0  //单子补货商品数量
				    }
				  ],
				  "totalNum": 0  //总补货数量
				}
				subObj.supplyItemRequestDTOS = this.confirmShopList.map((e,i)=>{
					subObj.totalNum += parseInt(e.num)
					subObj.skuNum +=1;
					return {
						"frontWarehouseCode": e.targetPlaceCode, //前置仓编码
				      "frontWarehouseId": e.targetPlaceId,	//前置仓id
				      "goodsBarCode": e.goodsBarCode,	//商品条码
				      "goodsCode": e.goodsCode,		//商品编码
				      "goodsName": e.goodsName,	
				      "supplyNum": parseInt(e.num),
				      "supplyChannelRequestDTOS":[
				      	{
				      		"fromWarehouseCode": null,  //库位编码
				          "fromWarehouseId": -1,		//库位id
				          "goodsWarehouseId": -1,	//商品库位表id
				          "supplyNum": parseInt(e.num)	
				      	}
				      ]
					}
				})
				$request.post("/api/supplement-invoices/v1/protected/to_pre_from_shop",subObj).then(res=>{
					if(res.success==true){
						//提交成功之后把列表上数据删除
						this.$store.dispatch("setConfirmShopList",[])
						this.$store.dispatch("setShopSupplyList",[])
						this.$router.push({path:"preSupSuccess",query:{
							title:'补货完成',
							text:'补货',
							info:'请将卖场商品移至前置仓',
							btn1link:'/preWorehouse/preShopDetail?id='+res.data,  //查看补货单
							btn1Text:'补货单详情',			
							btn2Text:'继续补货',
							btn2link:'/scanEntry?key=preSupply',	//继续补货
							backpath:'/'		//返回首页
						}})
					}else{
        		this.$router.push({path:'/fail',query:{text: res.message,title: '卖场给前置仓补货',info: '', path:'/'}})
						
					}
				}).catch(err=>{
        		this.$router.push({path:'/fail',query:{text: '系统繁忙，请稍后再试',title: '卖场给前置仓补货',info: '', path:'/'}})
					
				})
/*				this.$router.push({path:"preSupSuccess",query:{
							title:'补货完成',
							text:'补货',
							info:'请将卖场商品移至前置仓',
							btn1link:'/preWorehouse/preShopDetail?id='+this.$route.query.id,  //查看补货单
							btn1Text:'补货单详情',			
							btn2Text:'继续补货',
							btn2link:'/scanEntry?key=preSupply',	//继续补货
							backpath:'/'		//返回首页
						}})*/
			},
			/*
			update(num,arrNum){
				var arr = [];
				for(var i = 0;i<arrNum.length;i++){
					arr[i] = arrNum[i];
					if(num>arrNum[i].num){
						num = num - arrNum[i].num;
						arr[i].num = arrNum[i].num
					}else{
						arr[i].num = num;
						break;
					}
				}
				return arr;
			}
			*/
		}
	}
</script>
<style lang="less">
	.shopSupply{
		top: 230px;
		margin-bottom: 50px;
	}
	
</style>
