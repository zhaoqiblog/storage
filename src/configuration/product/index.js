let config = {
  product: true,
  ssoToken: 'token',
  ssoTokenPlaceholder: '___mideatoken___',
  uidPlaceholder: '___uid___',
  isMock: false,
  mockPath: 'json/',
  userTest: {
    uid: '80006096',
    ssoToken: 'T213...',
    costNumber: "0010004605"
  },
  filterStore:['9360'],
// 掌上永辉生产
/*upmUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/upm',
baseUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/store-inventory'*/

// 掌上永辉测试
// upmUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/upm', // 测试环境
// baseUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/store-inventory', // 测试环境

// 其他环境生产和测试
	upmUrl: 'http://ycloud-api-test.yh-test.com:8080/upm', // 测试环境
	baseUrl: 'http://ycloud-api-test.yh-test.com:8080/store-inventory',
	simUrl:'http://ycloud-api-test.yh-test.com:8080/sim-upms',
	reportUrl:'http://ycloud-api-test.yh-test.com:8080/sim-report'


	/* upmUrl: 'http://ycloud-api.yonghui.cn:9999/upm', // 正式环境
	baseUrl: 'http://ycloud-api.yonghui.cn:9999/store-inventory',
	simUrl:'http://ycloud-api.yonghui.cn:9999/sim-upms',
	reportUrl:'http://ycloud-api.yonghui.cn:9999/sim-report' */
}

export default config
