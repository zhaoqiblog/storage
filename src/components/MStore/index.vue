<template>
  <div>
    <popup-picker :popup-title="'请选择门店'" :data="storeList" v-model="currentStore" :value-text-align="'center'" @on-change="storeChange()" class="store-picker vux-1px-b" ref="picker"></popup-picker>
  </div>
</template>



<script>
import MHeader from '@/components/MHeader/index'
import { PopupPicker } from 'vux'
export default {
  components: {
    PopupPicker
  },
  name: 'home',
  data() {
    return {
      currentStore: ['永辉-重庆渝中观音桥店'],
      storeList: [[{name: '永辉-重庆渝中观音桥店', value: '0000001'}, {name: 'iPhone1', value: 'iPhone'}, {name: '华为1', value: '华为1'}]]
    }
  },
  computed: {

  },
  created() {
  },
  methods: {
    storeChange () {
    }
  }
}

</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
// 门店选择
.store-picker {
  background-color: #fff;
  &:before {
    display: none;
  }
  .weui-cell {
    padding: 8px 15px;
  }
}
// popupPicker样式复写
.vux-popup-header {
  background-color: #f4f4f4!important;
}
.vux-popup-header-left,.vux-popup-header-right {
  color: #198CFA!important;
}
</style>
