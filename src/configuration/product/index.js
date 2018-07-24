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
//upmUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/upm',
//baseUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/store-inventory'
   upmUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/upm', // 测试环境
     baseUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/store-inventory', // 测试环境
}

export default config
