var $ajax = require('../../utils/network_util.js')
const app = getApp()
Page({
  updateDreamsList: function() {
    wx.showModal({
      title: '恭喜！发现彩蛋！！',
      content: '更新已过期梦想。。。。。',
      showCancel: false,
      success() {
        $ajax._get(
          app.url + 'Dreams/Api/updateDreamsList', {
          },
          function(res) {
            console.log(res.data)
          })
      },
    })
  }
})