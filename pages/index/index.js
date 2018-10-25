//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    clickFb:true,
    clickWd:true,
    clickCk:true,
    clickLs:true
  },
  //事件处理函数
  onLoad: function (res) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
  
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    console.log(e.detail.userInfo)
    wx.setStorageSync("userInfo", e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync("userInfo", e.detail.userInfo)
  },
  changeFb:function(){
    var clickFb = this.data.clickFb;
    this.setData({
      clickFb:false
    })
    setTimeout(function(){
      wx.switchTab({
        url: '/pages/release/release',
      })
    },50)
  },
  changeWd: function () {
    var clickWd = this.data.clickWd;
    this.setData({
      clickWd: false
    })
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/mine/mine',
      })
    }, 50)
  },
  changeCk:function(){
    var clickCk=this.data.clickCk;
    this.setData({
      clickCk:false
    })
    setTimeout(function(){
      wx.switchTab({
        url: '/pages/check/check',
      })
    },50)
  },
  changeLs: function () {
    var clickLs = this.data.clickLs;
    this.setData({
      clickLs: false
    })
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/history/history',
      })
    }, 50)
  }
})
