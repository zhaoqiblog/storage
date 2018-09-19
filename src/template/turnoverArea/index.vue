<template>
  <div>
    <!--<m-header>扫描</m-header>-->
    <!--<keep-alive>-->
    	<router-view></router-view>
    <!--</keep-alive>-->
  </div>
</template>
<script>
import MHeader from '@/components/MHeader/index'
import factory from '@/factory'
export default {
  components: {
    MHeader
  },
  name: 'index',
  data() {
    return {
    }
  },
  computed: {

  },
  created() {
  },
  methods: {
    scan () {
      factory.scan().then(function(res) {
      })
    }
  }
}

</script>
<style lang="less" scoped>
</style>
