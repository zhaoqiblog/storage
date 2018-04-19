<template>
	<div class="page-demo">
		<!--<mytest :func="getfilesprops" @lalala="getfilesemit"> </mytest>
		<br /><br /><br />
		<div>
			<h3>$emit方式</h3>
			<div>
				<img :key="index" v-for="(item,index) in emitimgs" :src="item" />
			</div>
		</div>
		<div>
			<h3>props方式</h3>
			<div>
				<img :key="index" v-for="(item,index) in propsimgs" :src="item" />
			</div>
		</div>-->
		<router-link :to="{name:'Demo'}"> dome页 </router-link>
		<div class="">
			<h2>goods-top-info</h2>
			<goods-top-info
				:sideslip="goodstopinfo.sideslip"
				:trayCode="goodstopinfo.trayCode"
				:skuCode="goodstopinfo.skuCode"
				:total="goodstopinfo.total"
				:deleteFunc="goodstopinfoDelete.bind(this)"
				:key="1"
				>
			</goods-top-info>
			<h2>goods-select-item 和 group 嵌套使用</h2>
			<p>配置与goods-info-item 基本一致；</p>
			<p>change第一个参数为选中的数据数组，</p>
			当前选中的值：{{JSON.stringify(testdata)}}
			<goods-select-group :datas="datas" @change="selectChange" v-model="testdata" >
				<goods-select-item
					:depotCode="datas[0].depotCode"
					:code="datas[0].code"
					:time="datas[0].time"
					:name="datas[0].name"
					:totalNum="datas[0].totalNum"
					:unit="datas[0].unit"
					:num="datas[0].num"
					:unitq="datas[0].unitq"
					:label="datas[0].id">
				</goods-select-item>
				<goods-select-item
					:depotCode="datas[1].depotCode"
					:code="datas[1].code"
					:time="datas[1].time"
					:name="datas[1].name"
					:totalNum="datas[1].totalNum"
					:unit="datas[1].unit"
					:num="datas[1].num"
					:unitq="datas[1].unitq"
					:label="datas[1].id">
				</goods-select-item>
			</goods-select-group>


			<h1>goods-info-item</h1>
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
				v-model="item.count"
				:deleteFunc="deleteTest.bind(this,index)"
				@change="goodsInfoItemChange"
				:key="index">
			</goods-info-item>
			<br /> <h2>slot:listInfo 替换商品信息</h2><br />
			<goods-info-item
				:type="datas[0].type"
				:depotCode="datas[0].depotCode"
				:code="datas[0].code"
				:time="datas[0].time"
				:name="datas[0].name"
				:totalNum="datas[0].totalNum"
				:unit="datas[0].unit"
				:num="datas[0].num"
				:unitq="datas[0].unitq"
				:textNum="datas[0].textNum"
				v-model="datas[0].count">
  			<ul slot="listInfo" class="l-list-info">
					<li>
						<span>替换111(UI)</span>
						<span class="l-list-blue">{{datas[0].unit}}</span>
					</li>
					<li>
						<span>替换111(UI)</span>
						<span class="l-list-blue">{{datas[0].unit}}</span>
					</li>
					<li>
						<span>替换22(UI)</span>
						<span class="l-list-green">{{datas[0].unit}}</span>
					</li>
				</ul>
			</goods-info-item>


			<p v-for="(item,index) in datas" :key="index" style="border-bottom: solid 1px red;white-space: normal;word-break: break-all;">{{JSON.stringify(item)}}</p>
		</div>
		<test></test>
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
			testdata:[222],
			goodstopinfo:{
				trayCode: 'YH6600',
				skuCode: '1234',
				total: 123,
				sideslip: true,//是否需要侧滑删除默认false，true时需要传入deleteFunc例子:deleteFunc="deleteTest.bind(this,index)"
			},
			datas:[
				{
					id: 111,
					type:'text',//可选：'input'：有输入框时,'none'：右侧没有蓝色字体和输入框时，'text'为右侧有蓝色数字的时候;默认‘none’
					sideslip: true,//是否需要侧滑删除默认false，true时需要传入deleteFunc例子:deleteFunc="deleteTest.bind(this,index)"
					depotCode:'11111111111',//顶部的库位号,没有则不显示
					code:'11111111111',//编号位置文本,没有则不显示
					time:'入库时间 2017-05-22',//时间位置文本,没有则不显示
					name:'垃圾堆屎黄发空间as好口水打客服',
					totalNum:101,//总数。底部第1个；可使用listInfo将底部一行替换
					unit:'件',//单位 底部第2个；可使用listInfo将底部一行替换
					num:5,//件数；底部第3个 可使用listInfo将底部一行替换
					unitq:5,//件装数 底部第4个 可使用listInfo将底部一行替换
					altogether:5,//共计底部右侧
					count:'1',//输入框默认值
					textNum:200,//蓝色的文本数字
				},
				{
					id: 222,
					type:'input',//'input','none'
					sideslip: true,
					depotCode:'',
					code:'2222222222222222',
					time:'入库时间 2017-05-22',
					name:'垃圾堆屎黄发空间as好看的丰海科技/和就流口水打客服132',
					totalNum:52,
					unit:'箱子',
					num:15,
					unitq:15,
					altogether:5,//共计
					count:'2',
					textNum:200,
				},
				{
					id: 333,
					type:'none',//'input','none'
					sideslip: true,
					depotCode:'',
					code:'3333333333333',
					time:'入库时间 2017-05-22',
					name:'垃圾堆屎黄发空间as好看的丰海科技/和就流口水打客服',
					totalNum:10,
					unit:'件',
					num:5,
					unitq:9,
					altogether:5,//共计
					count:1,
					textNum:200,
				},
				{
					type:'input',//'input','none'
					depotCode:'',
					code:'2222222222222222',
					time:'入库时间 2017-05-22',
					name:'鲁大师的房价爱思乐款到即发',
					totalNum:52,
					unit:'箱子',
					num:15,
					unitq:3,
					altogether:5,//共计
					count:3,
					textNum:200,
				},
			]
		}
	},
	components: {
    'test': {
      template: `<div>这是一个局部的自定义组件，只能在当前Vue实例中使用</div>`,
    }
  },
	methods:{
		ttt(val){
			this.checked = val;
		},
		selectChange(filterDatas,value){
			console.log(filterDatas);
			console.log(value);
		},
		goodsInfoItemChange(value,index){
			console.log(value);
			console.log(index);
		},
		goodstopinfoDelete(index){
			console.log(index);
		},
		deleteTest(index){
			console.log(index);
		},
		getfilesemit(imgs){
			console.log(imgs);
			this.emitimgs = imgs;
		},
		getfilesprops(imgs){
			this.propsimgs = imgs;
		},
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
}



</style>
