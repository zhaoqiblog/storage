const scanEntry = () => import('../../template/common/scanEntry.vue') // 扫描入口
const receiving = () => import('../../template/receivingPort/')
const sampling = () => import('../../template/receivingPort/sampling.vue') // 商品抽检
const trayReceiving = () => import('../../template/receivingPort/trayReceiving.vue') // 托盘收货
const demo = () => import('../../template/demo/') // 组件demo

export default [
	{
	  path: '/receiving',
	  name: 'receiving',
		component: receiving,
	  children: [{
		  path: 'sampling',
		  name: 'sampling',
		  component: sampling
		},
		{
		  path: 'trayReceiving',
		  name: 'trayReceiving',
		  component: trayReceiving
		}]
	},
	{
	  path: '/scanEntry',
	  name: 'scanEntry',
	  component: scanEntry,
	  keepAlive: true
	},
	{
	  path: '/demo',
	  name: 'demo',
	  component: demo
	}
]
