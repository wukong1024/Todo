var $ajax = require('../../utils/network_util.js')
var util = require('../../utils/util.js')
var timeago = require('../../utils/timeago.min.js')
var WxParse = require('../../wxParse/wxParse.js')
const app = getApp()

Page({
  data: {
    openid: wx.getStorageSync('openid'),
    interval: 5000,
    duration: 1000
  },
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    $ajax._get(
      app.url + 'Dreams/Api/myRelease',
      {
        openid: that.data.openid,
      },
      function (res) {
        console.log(res)
        wx.hideLoading()
        var res = res.data

        for (var i = 0; i < res.list_data.length; i++) {
          var unixTimestamp = new Date(res.list_data[i].cTime*1000)
          unixTimestamp = util.formatTime(unixTimestamp)
          res.list_data[i].cTime = unixTimestamp.split(' ')[0]
        }
        that.setData({
          dreamsList: res
        })
        }     
    )
  },

  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  }
})