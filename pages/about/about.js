const app = getApp()
Page({

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  include(){
    wx.navigateTo({
      url: '/pages/include/include',
    })
  }
})