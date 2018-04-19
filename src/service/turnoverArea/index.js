let configHttp = {
  trayInfo: '/api/goods-warehouse/v1/protected/queryPalletGoods',  //get,扫描托盘编码获取托盘的部分信息 optype为0时: 托盘补货到卖场
  palletToWarehouse:"GET /api/goods-warehouse/v1/protected/palletToWarehouse"
}

export default configHttp
