let config = {
  product: false,
  ssoToken: 'token',
  ssoTokenPlaceholder: '___mideatoken___',
  uidPlaceholder: '___uid___',
  isMock: false,
  mockPath: 'json/',
  userTest: {
          uid: '80467269',
//        uid: '80739054',
//      uid: '80733765',
//  uid: '80006096',
    ssoToken: 'T213...',
    departmenName: "永辉集团_第二集群",
    extra: "13010151-50602471-50767568",
    cn: "王永玲",
    employeenumber: "80141400",
    address: "",
    positionName: "L-合伙人全职员工",
    fullDeptName: "永辉集团_第二集群",
    telephonenumber: "13143586281",
    gender: "男",
    mail: "",
    type: 1, // 1全职员工2合伙人3综合岗位
    costNumber: "0094281202",
    costName: "西安市阳光天地店-休闲食品课"
  },
  //测试
upmUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/upm', // 测试环境
baseUrl: 'https://hr.yh-test.com/mas-api/restful/inventory/store-inventory', // 测试环境
  // baseUrl: 'http://192.168.20.16:8084'
  //// 生产
//upmUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/upm',
//baseUrl: 'https://zsyh.yonghui.cn/mas-api/restful/inventory/store-inventory'
}

export default config
