<template>
  <div class="shop-supply set-printer">
    <x-header class="vux-1px-b" :left-options="{preventGoBack:true}" @on-click-back="back">设置打印机</x-header>
  	<div class="print-content">
  		<p class="print-tip">提示：保持蓝牙开启状态，才能匹配打印机</p>
  		<group class="group">
  			<!--<button class="switchs vux-1px-b" @click="changeBooth">打开蓝牙</button>-->
	  		<cell
	  			:title="currentDevice.value ? '当前连接设备':'上次连接设备'" 
	  			:value="currentDevice.value ? currentDevice.name:lastConDevice.name"></cell>
	  		
	  		<!--<cell title="当前连接设备" :value="currentDevice.name"></cell>-->
	  		<popup-picker 
	  		title="更换打印机"
	  		class="showpoSelect vux-1px-t"  
	    	:data="boothList"  
	    	v-model="slectBlue" 
	    	@on-change="changeBlue" 
	    	show-name 
	    	placeholder="选择蓝牙设备"
	    	@on-hide="showSelectBlue=false">
	    </popup-picker>
  		</group>
  	</div>
  </div>
</template>

<script>
	import { XHeader,XSwitch,Group,Cell,PopupPicker,Alert} from 'vux'
	import $request from '@/service/request.js'
	import factory from '@/factory.js'	
	import { mapState } from 'vuex';
	
	export default {
		components: {
			XHeader,XSwitch,Group,Cell,PopupPicker,Alert
		},
		name: 'set-printer',
	    computed: mapState({
	    	commonInfo: state => state.global.commonInfo,
	    }),
		data() {
			return {
				currentDevice:{},//当前连接的打印设备
				openBlueTooth:true,
				boothList:[],
				connectDevice:{},
				lastConDevice:{},//之前连接过的设备
				showSelectBlue:false,
				slectBlue:[], //选中的蓝牙设备号
				isOpenBolth:false,
				isAndroid:true
			}
		},
		beforeCreated(){},
		created(){
			this.getBoothList()
		},
		methods:{
			changeBlue(){
				this.boothList[0].forEach((e)=>{
					if(e.value&&e.value==this.slectBlue[0]){
						//选择完毕连接打印机
						let param1 = e.value;//这里传入用户点击的目标蓝牙设备地址
						//连接打印机
						this.$vux.loading.show({
							text:'连接中'
						})
						factory.connectBlue(param1).then(res=>{
							if(res=='连接成功'||res=='true'){
								this.$vux.loading.hide()
								this.$vux.toast.show({
	                  type: 'text',
	                  text: '连接成功',
	                })
								localStorage.setItem("bluedata",e.value);
								sessionStorage.setItem("bluedata",e.value);
								this.currentDevice = e;
							}else{
								 this.$vux.toast.show({
	                  type: 'text',
	                  text: res ? res:'蓝牙设备连接失败',
	                })
							}
						},(err)=>{
							alert("error:打印机 "+err)
							this.currentDevice ={}
						})
					}
				})
			},		
			//打开蓝牙点击事件
			changeBooth(){
					this.getBoothList()
			},
			openBlooth(callback){
				factory.openBluetooth().then(res=>{
					if(res=='蓝牙打开成功'||res=='true'){
							alert("蓝牙打开成功，去获取蓝牙设备列表")
							callback()
					}
				},err=>{
					alert(err)
				})
			},
			getBoothList(){
				let deviceId = localStorage.getItem("bluedata");
				let currentId =sessionStorage.getItem("bluedata");
				let _this=this;
				if(window.cordova){
					factory.getBlueList().then((res)=>{
						if(res=='0'){
							this.$vux.alert.show({
							  title: '提示',
							  content: '蓝牙未打开，请打开蓝牙之后再操作',
							  onHide:()=>{
							  	this.$router.back()
	              	return;
							  }
							})
						}
						this.boothList=[];
						let list = res.map((e)=>{
							return {name:e.name,value:e.address}
						})
						if(list.length>0){
							this.boothList.push(list)
						}else{
							this.boothList.push([{name:'无设备可用，请先匹配设备',value:null}])
						}
						//上次
						if(this.boothList[0].some((e)=>{return e.value==deviceId})){
							this.lastConDevice = this.boothList[0].filter((n)=>{
								return n.value == deviceId
							})[0]
						}else{
							this.lastConDevice={name:'未连接过',value:null}
						}
						//当前
						if(this.boothList[0].some((e)=>{return e.value==currentId})){
							this.currentDevice = this.boothList[0].filter((n)=>{
								return n.value == currentId
							})[0]
						}else{
							this.currentDevice={name:'未连接过',value:null}
						}
					},(err)=>{
						alert("获取蓝牙列表失败！"+err);
						this.boothList.push([{name:err,value:null}])
					})
				}else{
					this.boothList.push([
						{name:'设备1',value:'1'},
						{name:'设备2',value:'2'},
						{name:'设备3',value:'3'},
						{name:'设备4',value:'4'}
					])
//					this.boothList.push([{name:'无设备可用，请先匹配设备',value:null}])
					if(this.boothList[0].some((e)=>{return e.value==deviceId})){
						this.lastConDevice = this.boothList[0].filter((n)=>{
							return n.value == deviceId
						})[0]
					}else{
						this.lastConDevice={name:'未连接过',value:null}
					}
					if(this.boothList[0].some((e)=>{return e.value==currentId})){
						this.currentDevice = this.boothList[0].filter((n)=>{
							return n.value == currentId
						})[0]
					}else{
						this.currentDevice={name:'未连接过',value:null}
					}
				}
			},
			changeVal(){
			},
			back(){
				this.$router.back()
			},
	 
		},
	}
</script>
<style lang="less" scoped>

.shop-supply .weui-cells .weui-cell{
	
}
&.switchs{
		width: 100%;
		height: 40px;
		background: rgb(61, 165, 254);
		border: none;
		color: white;
	}
	.print-content{
		font-size: 17px;
		.print-tip{
			background: #FFFAD2;
			font-size: 13px;
			color: #1C1C1C;
			line-height: 40px;
			padding-left: 16px;
		}
		.open-printer{
			/*margin-top: 10px;padding-left: 6%;*/
			background: #FFFFFF;font-size: 17px;
		}
		.selectd-printer{
			font-size: 17px;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding-left: 12px;
			height: 45px;
			img{width: 18px;height: 18px;margin-right: 6px;}
		}
		.list-t{
			margin:25px 0 0 16px;color: #999999;font-size: 13px;
		}
		.printer-list{
			li{
				height: 45px;background: #FFFFFF;padding-left: 36px;line-height: 45px;
			}
		}
		.switchs{
			/*padding: 13px 16px;*/
		}
	}
	.weui-cell:before{
		border: none;
	}
	
</style>
<style lang="less">
	.vux-x-dialog .weui-dialog .weui-dialog__bd{
		>div{
			line-height: 40px;
		}
}
	.shop-supply {
		.print-content{
			.group{
				.weui-cells .weui-cell .vux-cell-primary .vux-label{
					color: #000000 !important;
				}
				.weui-cells .weui-cell .weui-cell__ft{
					color: #999999;
				}
				.weui-cell{
					padding: 13px 16px;
				}
				.weui-cell__ft{
					
				}
			}
		}
	.print-content .weui-cell_access .weui-cell__ft:after{
		border: 1px solid #8c8c8c;
	}
	}
	.shop-supply .showpoSelect{
		.weui-cell_access .weui-cell__ft:after{
			border: 1px solid #8c8c8c;
		}
	}
</style>

