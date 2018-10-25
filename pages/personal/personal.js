import WxValidate from '../../utils/WxValidate'
const app = getApp()
var $ajax = require('../../utils/network_util.js')
//查找指定元素在数组中的索引值

Page({

  data: {
    array: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
    index: 3,
    form: {
      name: '',
      sex: '',
      major: '',
      grade: '',  
      phone: '',
      qq: '',
      // wechat: '',
      email: ''
    },
    openid: wx.getStorageSync('openid'),
    nickname: wx.getStorageSync('userInfo').nickName,
    country: wx.getStorageSync('userInfo').country,
    province: wx.getStorageSync('userInfo').province,
    city: wx.getStorageSync('userInfo').city,
    language: wx.getStorageSync('userInfo').language,
    avatar: wx.getStorageSync('userInfo').avatarUrl,


  },
  onLoad: function (){
    this.initValidate(),
    console.log(this.WxValidate)

  },
  onShow: function () {
    this.loadDataList()
  },

  loadDataList() {

   function getIndex(arr,value){
     for (var i=0;i<arr.length;i++){
       if(arr[i]==value){
         return i;
       }
     }
    }
    var that = this
  
    $ajax._get(
      app.url + 'Dreams/Api/personal', {
        openid: that.data.openid,
      },
      function(res) {
        console.log(res.data)
        var user = res.data
        var array = that.data.array
        var index=getIndex(array,user.grade)
        console.log(index)

        that.setData({
          "form.name": user.truename,
          "form.sex": user.sex,
          "form.major": user.major,
          index:index,
          "form.phone": user.mobile,
          "form.qq": user.qq,
          // "form.wechat": user.wechat,
          "form.email": user.email,
        })
      })
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
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
      wx.showToast({
        title: '保存成功',
      })

      var that = this
      $ajax._post(
        app.url + 'Dreams/Api/personal', {
          name: params.name,
          sex: params.sex,
          major: params.major,
          grade: params.grade,
          phone: params.phone,
          qq: params.qq,
          // wechat: params.wechat,
          email: params.email,
          grade: that.data.array[that.data.index],
          
          nickname: that.data.nickname,
          openid: that.data.openid,
          avatar: that.data.avatar,
          country: that.data.country,
          province: that.data.province,
          city: that.data.city,
          language: that.data.language,

        },
        function(res) {
          console.log(res)
        }
      )

      setTimeout(function() {
        wx.switchTab({
          url: '/pages/mine/mine',
        })
      }, 400)
    }
  },
  // 验证
  initValidate() {
    // 验证字段的规则

    const rules = {
      name: {
        required: true,
      },

      major: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      },
      qq: {
        required: true,
        number: true,
      },
      // wechat: {
      //   required: true,
      // },
      email: {
        required: true,
        email: true,
      }
    }

    // 验证字段的提示信息，若不传则调用默认的信息
    const messages = {
      name: {
        required: '请输入你的姓名',
      },
      major: {
        required: '请输入你的专业',
      },
      phone: {
        required: "请输入你的手机号",
        tel: "手机号格式有误",
      },
      qq: {
        required: "请输入你的QQ号",
        number: "QQ号格式有误",
      },
      // wechat: {
      //   required: "请输入你的微信号",
      // },
      email: {
        required: "请输入你的邮箱",
        email: "邮箱格式有误",
      }
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)
  }

})