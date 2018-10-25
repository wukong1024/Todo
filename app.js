//加载用户注册登录文件
var common = require('utils/common.js')
App({
  url: 'https://wukong1024.xyz/hd/index.php?s=/w16/',

  onLaunch: function () {
    common.initApp(this.url, true)
  },
  globalData: {
    userInfo: ""
  }
})

module.exports = {
  App: getApp
}
