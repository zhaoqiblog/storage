<template>
  <div class="m-header">
    <div class="m-header-left" @click="onClickBack()">
      <a class="m-header-back">返回</a>
      <div class="left-arrow">
      </div>
    </div>
    <div class="m-header-title">
      <slot>
      </slot>
    </div>
    <div class="m-header-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
import factory from '@/factory.js'

export default {
  name: 'm-header',
  props: {
    exit: Boolean
  },
  beforeMount() {

  },
  computed: {

  },
  methods: {
    onClickBack() {
      let path = this.$route.path
      if (path === '/') {
				localStorage.setItem("currentStore",'')
        factory.exit()
      } else {
        this.$router.back()
      }
    }
  },
  data() {
    return {

    }
  }
}

</script>
<style lang="less">
@import "../../css/style.less";

.m-header {
  position: absolute;
  left: 0;
  top: 0px;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
  background: #ffffff;
  color: @c-black;
  &:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid @bd-color;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .m-header-title {
    margin: 0 88px;
    height: 45px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 45px;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
  }
  .m-header-left {
    position: absolute;
    left: 18px;
    height: 45px;
    line-height: 45px;
    display: block;
    font-size: 16px;
    color: @main-color;
    &:active {
      color: #afd5fa;
      .left-arrow:before {
        border-color: #afd5fa;
      }
    }
    .m-header-back {
      padding-left: 14px;
      float: left;
      margin-right: 8px;
    }
    .left-arrow {
      position: absolute;
      width: 30px;
      height: 45px;
      line-height: 45px;
      left: -5px;
      &:before {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        border: 1px solid @main-color;
        border-width: 2px 0 0 2px;
        -webkit-transform: rotate(315deg);
        transform: rotate(315deg);
        top: 15px;
        left: 7px;
      }
    }
  }
  .m-header-right {
    position: absolute;
    top: 14px;
    right: 15px;
    display: block;
    font-size: 14px;
    line-height: 21px;
    color: @main-color;
    font-size: 16px;
    a {
      display: block;
      img {
        display: block;
        width: 20px;
      }
    }
  }
}

</style>
