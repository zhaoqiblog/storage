<template>
  <div class="shop">
    <keep-alive  :include="['shopReturnList', 'backorder', 'supply']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  components: {

  },
  name: 'shop',
  data() {
    return {
    }
  },
  computed: {

  },
  created() {
  },
  methods: {
  }
}

</script>
<style lang="less" scoped>
</style>
