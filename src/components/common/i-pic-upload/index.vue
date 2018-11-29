<template>
  <div v-transfer-dom>
    <actionsheet v-model="show" :menus="menus1" @on-click-menu="click" show-cancel></actionsheet>
  </div>
</template>

<script>
  import { Actionsheet } from 'vux'
  import picture from './picture'
  export default {
    name: 'i-pic-upload',
    components: {
      Actionsheet
    },
    props: {
      value: Boolean,
      feedback: Function
    },
    data () {
      return {
        menus1: {
          1: '拍照',
          2: '本地上传'
        },
        show: false
      }
    },
    watch: {
      show (val) {
        this.$emit('input', val)
      },
      value: {
        handler: function (val) {
          this.show = val
        },
        immediate: true
      }
    },
    methods: {
      click (key) {
        let feedback = (imgObj) => {
          this.$emit('on-feedback', imgObj)
        }
        console.log(key)
        picture.selectPicture(key, feedback)
      }
    }
  }
</script>

<style lang="less">

</style>
