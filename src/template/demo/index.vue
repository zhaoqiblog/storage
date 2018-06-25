<template>
	<div class="page-demo">
		<div class="">
			<!--:preCode="item.preCode"
				:code="item.code"
				:time="item.time"
				:name="item.name"
				:totalNum="item.totalNum"
				:unit="item.unit"
				:unitq="item.unitq"
				:textNum="item.textNum"-->
			<pre-item-pic v-for="(item,index) in datas"
    			:itemid="item.id"
				:preCode="item.stockout==2?'门店无此商品':item.warehouseCode"
				:nowNum="item.nowNum"
				:safeNum="item.safeNum"
				:code="'商品编码  '+(item.barcode)"
				:name="item.subtitle"
				:totalNum="item.num"
				:unit="item.unitq"
				:unitq="item.unit"
				:init="item.init"
				:allpick="item.allpick"
				:halfPickNum="item.halfPickNum"
				:disbale="true"
				:status="0"
				:key="index">
    	</pre-item-pic>
			<h2 class="title">goods-top-info</h2>
			<section>
				sideslip:侧滑开关<br />
				deleteFunc:删除回调方法，第一个传回参数为当前删除的index值
			</section>
			<div class="">
				<goods-top-info
					v-for="(item,index) in goodstopinfo"
					:sideslip="item.sideslip"
					:trayCode="item.trayCode"
					:skuCode="item.skuCode"
					:total="item.total"
					:deleteFunc="goodsTopInfoDelete.bind(this,index)"
					:key="item.trayCode"
					>
				</goods-top-info>
			</div>

			<h2 class="title">goods-info-item</h2>
			<section>
				v-model: [String, Number],//输入框默认值
				<br /><br />sideslip: { type: Boolean, default: false },//滑动开关
		 		<br /><br />type: { type: String, default: 'none' },//可选：'input'：有输入框时,'none'：右侧没有蓝色字体和输入框时，'text'为右侧有蓝色数字的时候;默认‘none’，
		 		bottomdate：有底部日期选择模块，bottomText：底部模块是展示，不是输入
		    <br /><br />depotCode: [String, Number],//顶部的库位号,没有则不显示
		    <br /><br />code: [String, Number],//编号位置文本,没有则不显示
		    <br /><br />time: [String],//时间位置文本,没有则不显示，当没有code的时候会靠左
		    <br /><br />name: [String],//主体文本位置
		    <br /><br />totalNum: [String, Number],//总数。底部第1个；可使用listInfo将底部一行替换
		    <br /> <br />unit: [String],//单位 底部第2个；可使用listInfo将底部一行替换
		    <br /><br />num: [String, Number],//件数；底部第3个 可使用listInfo将底部一行替换
		    <br /><br />unitq: [String, Number],//件装数 底部第4个 可使用listInfo将底部一行替换
		    <br /><br />altogether: [String, Number],//共计底部右侧
		    <br /><br />textNum: [String, Number],//蓝色的文本数字
		    <br /><br />deleteFunc: [Function],//侧滑删除的回调，第一个传回参数为当前删除的index值
		    <br /><br />change: [Function],//当输入框有变得的时候
		    <br /><br />actualVal:,//底部输入框，实际数量的默认值
		    <br /><br />changeActual:,//实际数量修改绑定的函数，必须要自己写，参数为当前修改的值和index
		    <br /><br />giftsVal:,//赠品数量默认值，修改函数必须自己写
		    <br /><br />changeGift:[Function],//赠品数量绑定函数
			</section>
			<section>
				slot：<br />
				'listInfo':替换底部class:l-list-info下的ul标签，可沿用组件内的标签结构,<br />
				'textNumDom':右边蓝色的字体。默认结构为span em /em /span
			</section>
			
			<div>
				 timeSel:[String],	//底部模块生产日期   有底部的时候，都为必填项
				 actualVal:[String, Number], //实际收货数量的绑定值
	    		giftsVal:[String, Number], //赠品数量
			</div>

			<p style="border: solid 1px red;text-align: center;" @click="consloeData">>>>>>>>>>>>>>>>我是分割线我是分割线</p>
			<pre-item-info v-for="(item,index) in datas"
				:preCode="item.preCode"
				:code="item.code"
				:time="item.time"
				:name="item.name"
				:totalNum="item.totalNum"
				:unit="item.unit"
				:unitq="item.unitq"
				:textNum="item.textNum"
				:key="index"></pre-item-info>
				<div>-----------------------------------</div>
			<goods-info-item
				v-for="(item,index) in datas"
				:sideslip="item.sideslip"
				:type="item.type"
				:depotCode="item.depotCode"
				:code="item.code"
				:time="item.time"
				:name="item.name"
				:totalNum="item.totalNum"
				:unit="item.unit"
				:num="item.num"
				:unitq="item.unitq"
				:altogether="item.altogether"
				:textNum="item.textNum"
				:timeSel="item.timeSel"
				v-model="item.count"
				:actualVal="item.actualVal"
				:giftsVal="item.giftsVal"
				:deleteFunc="goodsInfoItemDelete.bind(this,index)"
				@change="goodsInfoItemChange"
				@changeActual="changeIUnfo"
				@changeGift="changeGifts"
				@changeDate="changeDates"
				:key="index">
			</goods-info-item>
			

			<h2 class="title">goods-info-item slot的Demo</h2>
			<goods-info-item
				:type="teshude.type"
				:depotCode="teshude.depotCode"
				:code="teshude.code"
				:time="teshude.time"
				:name="teshude.name"
				:totalNum="teshude.totalNum"
				:unit="teshude.unit"
				:num="teshude.num"
				:unitq="teshude.unitq"
				:altogether="teshude.altogether"
				:textNum="teshude.textNum"
				v-model="teshude.count"
				@change="goodsInfoItemChange">

				<ul slot="listInfo">
					<li>
						<span>总数量(E)</span>
						<span class="l-list-green">随便输入</span>
					</li>
					<li>
						<span>总数量(E)</span>
						<span class="l-list-green">随便</span>
					</li>
					<li>
						<span>总数量(E)</span>
						<span class="l-list-green">333</span>
					</li>
				</ul>

				<div slot="textNumDom" class="l-list-text">
  				几<small>狗</small>
  			</div>
			</goods-info-item>


			<h2 class="title">goods-select-group goods-select-item 需要嵌套使用</h2>
			<section>
				goods-select-group；<br /><br />
				change:第一个参数为选中的数据数组,第二个参数为group所选择的数组值，<br /><br />
				v-model:绑定group所选择的数组值<br /><br />
				keyword:指定鱼model关联的字段值，与item组件的label字段名相关联，必须是string<br /><br />
				datas:源数据，供change回调筛选出选择后的过滤数据
			</section>
			<section>
				goods-info-item 配置与基本一致；<br /><br />
				label：当前item被选中时，将往group的v-model中push当前的label值<br /><br />
				slot 名{‘listInfo’}:替换底部class:l-list-info下的ul标签，可沿用组件内的标签结构
			</section>
			<section>
				当前选中的值：{{JSON.stringify(goodsSelectGroupValue)}}
			</section>
			<button @click="quanxuan">全选/反选</button>
			<goods-select-group :datas="goodsSelectGroup" keyword="id" @change="selectChange" v-model="goodsSelectGroupValue" >
				<goods-select-item
					v-for="(item,index) in goodsSelectGroup"
					:code="item.code"
					:time="item.time"
					:name="item.name"
					:totalNum="item.totalNum"
					:unit="item.unit"
					:num="item.num"
					:unitq="item.unitq"
					:label="item.id"
					:key="index">
				</goods-select-item>
			</goods-select-group>

		</div>
	</div>
</template>

<script>

export default {
	name: 'home',
	data(){
		return {
			lalala: '啦啦啦',
			emitimgs: null,
			propsimgs: null,
			checked:true,
			goodstopinfo:[{
				trayCode: 'YH6600',
				skuCode: '1234',
				total: 123,
				sideslip: true,
			},{
				trayCode: '111111',
				skuCode: '1234',
				total: 123,
				sideslip: true,
			},{
				trayCode: '222222',
				skuCode: '1234',
				total: 123,
				sideslip: true,
			},],
			goodsSelectGroupValue:[],
			goodsSelectGroup:[
				{
					id: '111',
					code:'11111111',
					time:'入库时间 2017-05-22',
					name:'垃圾堆屎黄口水打客服',
					totalNum:11,
					unit:'件',
					num:5,
					unitq:5,
					altogether:5,
					textNum:123,
				},
				{
					id: 222,
					time:'为空的时候隐藏',
					code:'222222',
					name:'垃圾堆屎黄发空间as好口水打客服垃圾堆屎黄发空间as好口水打客服',
					totalNum:22,
					unit:'件',
					num:5,
					unitq:5,
					textNum:222,
				},
				{
					id: 333,
					code:'33333333',
					name:'垃圾堆屎黄发空间as好口水打客服垃圾堆屎黄发空间as好口水打客服',
					totalNum:33,
					unit:'件',
					num:5,
					unitq:5,
					textNum:321,
				},
			],
			datas:[],
			datas1:[
				{
					id: '00',
					preCode:'2342534',
					type:'bottomdate',
					depotCode:'98213749187294387',
					sideslip: true,
					code:'11111111111',
					time:'入库时间 2017-05-22',
					name:'全部的参数全部的参数全部的参数全部的参数全部的参数全部的参数全部的参数全部的参数',
					totalNum:22,
					unit:'件',
					num:5,
					unitq:5,
					textNum:222,
					count:3,
					altogether:5,
					actualVal:8,
					giftsVal:0,
					timeSel:"2017-12-06"
				},
				{
					id: '11',
					type:'bottomText',
					sideslip: true,
					code:'11111111111',
					time:'入库时间 2017-05-22',
					name:'垃圾堆屎黄发空间as好口水打客服',
					actualVal:8,
				},
				{
					id: '22',
					type:'input',
					sideslip: true,
					time:'入库时间 2017-05-22',
					name:'垃圾堆屎黄发空间as好口水打客服',
					totalNum:101,
					unit:'件',
					num:5,
					unitq:5,
					count:3,
					altogether:5,
				},
				{
					id: '33',
					type:'text',
					sideslip: true,
					name:'库位号码 C89768-234',
					totalNum:6,
					unit:'瓶',
					num:1,
					unitq:4,
					altogether:20,
					textNum:2,
				},
				{
					id: '44',
					type:'text',
					sideslip: true,
					code:'34523453245234',
					time:'入库时间 2017-05-22',
					name:'扯犊子扯犊子扯犊子二逼二逼',
					totalNum:6,
					unit:'瓶',
					num:1,
					unitq:4,
					altogether:20,
					textNum:5,
				},
				{
					id: '44',
					type:'input',
					sideslip: true,
					code:'34523453245234',
					time:'入库时间 2017-05-22',
					name:'发生的投入及大师傅分大神',
					totalNum:6,
					unit:'瓶',
					num:1,
					unitq:4,
					altogether:20,
					count:3,
					textNum:5,
				},
				{
					id: '55',
					type:'input',
					sideslip: true,
					code:'34523453245234',
					time:'入库时间 2017-05-22',
					name:'我是两排的我是两排的我是两排的我是两排的我是两排的我是两排的我是两排的我是两排的',
					totalNum:6,
					unit:'瓶',
					num:1,
					unitq:4,
					altogether:20,
					count:3,
					textNum:5,
				},
				{
					id: '66',
					type:'text',
					sideslip: true,
					code:'34523453245234',
					name:'两行的两行的两行的两行的两行的两行的两行的两行的两行的两行的两行的两行的两行的',
					textNum:2,
				},
				{
					id: '66',
					type:'text',
					sideslip: true,
					code:'34523453245234',
					name:'一行的的一行的一行的一行的一行的',
					textNum:2,
				},
			],
			teshude:{
				id: '111111',
				type:'none',
				sideslip: true,
				depotCode:'11111111111',
				code:'11111111111',
				time:'入库时间 2017-05-22',
				name:'垃圾堆屎黄发空间as好口水打客服',
				totalNum:101,
				unit:'件',
				num:5,
				unitq:5,
				altogether:5,
				count:'1',
				textNum:200,
			},
		}
	},
	components: {
    'test': {
      template: `<div>这是一个局部的自定义组件，只能在当前Vue实例中使用</div>`,
    }
  },
  mounted(){
  	this.datas = [...this.datas1]
  },
	methods:{
		quanxuan(){
			if(this.goodsSelectGroupValue.length == this.goodsSelectGroup.length){
				this.goodsSelectGroupValue = [];
			}else{
				this.goodsSelectGroupValue = this.goodsSelectGroup.map(item=>{
					return item.id;
				})
			}
		},
		selectChange(filterDatas,value){
			console.log(filterDatas);
			console.log(value);
		},
		goodsInfoItemChange(value,index){
			console.log(value);
			console.log(index);
		},
		goodsInfoItemDelete(index){
			console.log(index);
			this.datas.splice(index,1);
		},
		goodsTopInfoDelete(index){
			this.goodstopinfo.splice(index,1);
		},
		consloeData(){
			console.log(this.datas[0])
		},
		changeIUnfo(val,index){
			console.log(val,index)
			this.datas[index].actualVal=val
		},
		changeGifts(val,index){
			this.datas[index].giftsVal=val
		},
		changeDates(val,index){
			console.log("pp")
			this.datas[index].timeSel=val;
			console.log(val)
		}
	}
}

</script>

<style lang="less">
.page-demo{
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	overflow-x: hidden;

	.title{
		font-size: 18px;
		text-align: center;
		line-height: 20px;
		padding: 15px;
		width: 100%;
		color: #ffffff;
		background: #48475A;
	}

	section{
		font-size: 14px;
    color: #43627a;
    padding: 10px;
    line-height: 18px;
	}
	button{
    margin: 0 auto;
    display: block;
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    background: #57b4f4;
    color: #ffffff;
    border-radius: 4px;
	}
}



</style>
