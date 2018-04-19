<template>
  <div >
    <keep-alive :include="['replenishmentList']">
    <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
import factory from '@/factory'
import service from '@/service'
export default {
  components: {
   
  },
  name: 'backIndex',
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
        alert('success:' + JSON.stringify(res))
      })
    }
  }
}

</script>
<style lang="less" scoped>
</style>
