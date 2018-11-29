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
//// 生产
/*upmUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/upm',
baseUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/store-inventory'*/

// upmUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/upm', // 测试环境
// baseUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/store-inventory', // 测试环境

	/*upmUrl: 'http://ycloud-api-test.yh-test.com:8080/upm', // 测试环境
	baseUrl: 'http://ycloud-api-test.yh-test.com:8080/store-inventory', // 测试环境
	simUrl:'http://ycloud-api-test.yh-test.com:8080/sim-upms'*/
	
	
	upmUrl: 'http://ycloud-api.yonghui.cn:9999/upm', // 正式环境
	baseUrl: 'http://ycloud-api.yonghui.cn:9999/store-inventory', // 正式环境
	simUrl:'http://ycloud-api.yonghui.cn:9999/sim-upms'
}

export default config
