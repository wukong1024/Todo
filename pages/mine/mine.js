// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  onShareAppMessage: function () {

  },
  personal: function () {
    wx.navigateTo({
      url: '/pages/personal/personal',
    })
  },
  myRelease: function () {
    wx.navigateTo({
      url: '/pages/myRelease/myRelease',
    })
  },
  myAdd: function () {
    wx.navigateTo({
      url: "/pages/myAdd/myAdd",

    })
  },
  feedback: function () {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
    },
  about: function () {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }
})