<template>
  <div id="test" class="test">
    <m-header >组件概览 <a slot="right">暂存</a></m-header>
    <h4>表单组件</h4>
    <group label-width="4.5em" label-margin-right="2em" label-align="right">
      <!-- <cell title="人事范围" value="value" is-link></cell> -->
      <datetime title="合同起始日期:" v-model="time1" value-text-align="left" placeholder="点击选择"></datetime>
      <x-input title="职务:" type="text" placeholder="点击选择" v-model="value4"></x-input>
      <popup-picker title="请选择" placeholder="请选择" :data="list" v-model="value6" value-text-align="left"></popup-picker>
     <!--  <x-textarea placeholder="请填写详细信息" :show-counter="false" :rows="3">
        
      </x-textarea> -->
      <x-number title="证明份数" align="left" v-model="numberValue" button-style="round" :min="0" :max="5"></x-number>
    </group>
    <h4>按钮组件</h4>
    <m-button>提交</m-button>
    <h4>弹幕</h4>
    <m-button @click.native="showToast()">Toast显示</m-button>
    <h4>弹框</h4>
    <m-button @click.native="showAlert()">Alert显示</m-button>
    <h4>Confirm</h4>
    <m-button @click.native="showConfirm()">Confirm显示</m-button>
  </div>
</template>

<script>
  import MHeader from '@/components/MHeader/index'
  import MButton from '@/components/MButton/index'
  import { GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'

  export default {
    components: {
      MHeader,
      MButton,
      Group,
      GroupTitle,
      Cell,
      XInput,
      Selector,
      PopupPicker,
      XAddress,
      Datetime,
      XNumber,
      XTextarea,
      XSwitch
    },
    name: 'detail',
    data () {
      return {
        newsId: 100,
        addressData: ChinaAddressData,
        addressValue: ['广东省', '深圳市', '南山区'],
        value1: '张三',
        value2: '工艺技术',
        value3: '',
        value7: '',
        value8: '',
        value4: '',
        time1: '',
        value5: ['A'],
        value6: [],
        list: [['A', 'B', 'C']],
        numberValue: 0
      }
    },
    computed: {
     
    },
    methods: {
      showToast(){
        // 显示文字
        this.$vux.toast.text('此为弹幕展示！', 'middle')
      },
      showAlert(){
        // 显示
        this.$vux.alert.show({
          title: '提示',
          content: '此为弹框展示！',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      },
      showConfirm(){
        this.$vux.confirm.show({
          title: '提示',
          content: '此为弹框展示！',
          // 组件除show外的属性
          onCancel () {
          },
          onConfirm () {}
          })
      },
    },
    mounted () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  h4{
    text-align: left;
    font-weight: normal;
    font-size: 16px;
    padding: 0px;
    margin: 5px 0px;
    padding-left: 15px;
  }
</style>
