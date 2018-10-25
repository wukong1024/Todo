var $ajax = require('../../utils/network_util.js')
const app = getApp()

Page({
  data: {
    openid: wx.getStorageSync('openid'),
    disabled: true
  },
  onShow() {
    this.confirm()
  },

  confirm: function() {
    var that = this
    $ajax._get(
      app.url + 'Dreams/Api/confirm', {
        openid: that.data.openid,
      },
      function(res) {
        console.log(res.data)

        that.setData({
          is_complete: res.data
        })

        if (res.data != '1') {
          wx.showModal({
            title: '提示',
            content: '请完善个人信息',
            
            success: function(res) {
              if (res.cancel) {
                wx.navigateBack()
              } else {
                wx.navigateTo({
                  url: '/pages/personal/personal',
                })
              }
            }
          })
        }
      })
  },

  formSubmit: function(e) {
    console.log(e)
    var that = this
    $ajax._get(
      app.url + 'Dreams/Api/feedback', {
        content: e.detail.value.content,
        openid: that.data.openid
      },
      function(res) {
        console.log(res)
      },
    )

    wx.showModal({
      title: '提交反馈成功',
      content: '我们将及时通过邮件回复你。。。',
      showCancel: false,
      success() {
        wx.navigateBack()
      }
    })
  },

  watchContent: function(event) {
    console.log(event.detail.value);
    if (event.detail.value != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },


})