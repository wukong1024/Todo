import WxValidate from '../../utils/WxValidate'
var $ajax = require('../../utils/network_util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModelshowModalStatus: false,
    disabledValue: false,
    showMask: true,
    disabledClick: true,
    is_complete: '',
    // array: '',
    index: 0,
    openid: wx.getStorageSync('openid'),
    author: wx.getStorageSync('userInfo').nickName,
    avatar: wx.getStorageSync('userInfo').avatarUrl,
    form: {
      itemName: '',
      numbers: '',
      types: '',
      brief: '',
      ps: '',
    }

  },

  onLoad() {
    this.initValidate()
    console.log(this.WxValidate)


  },
  onShow() {
    this.confirm()
    this.getArray()
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
          is_complete: res.data,
        })

        if (res.data != '1') {
          wx.showModal({
            title: '提示',
            content: '请完善个人信息',
            success: function(res) {
              if (res.cancel) {
                wx.switchTab({
                  url: '/pages/check/check',
                })
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

  getArray: function() {
    var that = this
    $ajax._get(
      app.url + 'Dreams/Api/getArray', {},
      function(res) {
        console.log(res.data)
        that.setData({
          array: res.data
        })
      })
  },

  newWindow: function() {
    this.setData({
      showModalStatus: true,
      showMask: false
    });
  },
  powerDrawer: function() {
    this.setData({
      showModalStatus: false,
      showMask: true,
      disabledClick: false
    });
  },
  agreement: function() {
    this.setData({
      disabledValue: true
    })
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  // 错误窗口
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  formSubmit: function(e) {
    const params = e.detail.value
    console.log(params)

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    } else {
      var that = this
      var cate_id = parseInt(that.data.index) + 1
      wx.setStorageSync('cate_id', cate_id)
      $ajax._get(
        app.url + 'Dreams/Api/submit', {
          title: params.itemName,
          content: params.brief,
          need_number: params.numbers,
          cate_id: that.data.index,
          ps: params.ps,
          author: that.data.author,
          avatar: that.data.avatar,
          openid: that.data.openid,
        },
        function(res) {
          console.log(res)
        },
      )
      wx.showToast({
          title: '提交成功',
        }),
        setTimeout(function() {
          wx.switchTab({
            url: '/pages/check/check',
          })
        }, 1000)

    }
  },

  formReset:function(){
    var that=this
    that.setData({
      index: 0,
    })
  },
  // 验证
  initValidate() {
    // 验证字段的规则

    const rules = {
      itemName: {
        required: true,
      },
      numbers: {
        required: true,
        number: true,
      },
      brief: {
        required: true,
      },
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      itemName: {
        required: '请输入名称',
      },
      numbers: {
        required: '请输入人数',
        number: '请输入纯数字',
      },
      brief: {
        required: '请描述你的项目',
      },

    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  }
})