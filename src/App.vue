<template>
  <div id="app">
     <!--<transition :name="'pop-' + (direction === 'forward' ? 'in' : 'out')">--> 
      <keep-alive include="home" v-if="alive">
        <router-view class="router-view">
        </router-view>
      </keep-alive>
      <router-view class="router-view" v-else>
      </router-view>
     <!--</transition>--> 
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import factory from './factory'
import $request from '@/service/request.js'
import func from '@/func.js'
import $conf from 'configuration'
export default {
  data() {
    return {
      alive: null
    }
  },
  computed: {
    ...mapGetters({
      loading: 'getLoading',
      direction: 'getDirection'
    }),
   ...mapState({
			commonInfo:state=>state.global.commonInfo,
			storeInfo:state=>state.global.storeInfo,
		})
  },
  watch:{
  	$route(to,from){
  	}
  },
  created() {
		/**
  	 * 解决android输入框键盘弹起时挡住界面的问题
  	 */
  	window.addEventListener('resize', () => { 
		 if (document.activeElement.tagName == 'INPUT') {  
		  //延迟出现是因为有些 Android 手机键盘出现的比较慢   
		  window.setTimeout(() => {
		   document.activeElement.scrollIntoViewIfNeeded();  
		 }, 100); 
		} });
  },
  mounted() {
    let routes = this.$router.options.routes,
      arr = []
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].keepAlive) {
        arr.push(routes[i].name)
      }
    }
    arr.length > 0 ? this.alive = arr.join(',') :
      this.$root.goBack = () => {
        let path = this.$route.path
        if (path === '/') {
					localStorage.setItem("currentStore",'')
          factory.exit()
        } else {
          this.$router.back()
        }
      }
  },
  methods: {
  }
}

</script>
<style lang="less">
@import '~vux/src/styles/reset.less';
@import "css/style.less";
@import '~vux/src/styles/1px.less';
@import './components/MGoodsInfo/index.less';
@import '~element-ui/lib/theme-chalk/index.css';    // 默认主题
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
}
input{
	-webkit-user-select:auto;
}
.router-view {
  width: 100%;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  backface-visibility: hidden;
}

.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  will-change: transform;
  height: 100%;
  position: absolute;
  left: 0;
}

.pop-out-enter-active {
  animation-name: popInLeft;
}

.pop-out-leave-active {
  animation-name: popOutRight;
}

.pop-in-enter-active {
  animation-name: popInRight;
  /*transition: all 4s ease-in;*/
}

.pop-in-leave-active {
  animation-name: popOutLeft;
}

@keyframes popInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes popOutLeft {
  from {
    opacity: 1;
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes popInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes popOutRight {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}

</style>
