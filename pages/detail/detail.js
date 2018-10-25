const app = getApp()
var $ajax = require('../../utils/network_util.js')
var util = require('../../utils/util.js')
var timeago = require('../../utils/timeago.min.js')
var comment = require('../../comment/comment.js')
var WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dream_id: '',
    is_overdue: '',
    is_author: '',
    openid: wx.getStorageSync('openid'),
    is_complete: '',
    need_number: '',
    join_number: '',
    listData: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      dream_id: options.id,
      is_overdue: options.is_overdue,
      // 'dreamsDateil.is_overdue': options.is_overdue
    })
    wx.showLoading({
      title: '加载中',
    })
    console.log(options)

    $ajax._get(
      app.url + 'Dreams/Api/getDreamsDetail', {
        dreams_id: options.id,
        PHPSESSID: wx.getStorageSync('PHPSESSID'),
        openid:that.data.openid
      },
      function(res) {
        console.log(res.data)
        wx.hideLoading()
        var res = res.data
        var unixTimestamp = new Date(res.cTime * 1000)
        res.cTime = util.formatTime(unixTimestamp).split(' ')[0]

        for (var i = 0; i < res.comment_lists.length; i++) {
          var changeTime = res.comment_lists[i].cTime
          changeTime = timeago().format(changeTime, 'zh_CN')
          res.comment_lists[i].cTime = changeTime
        }
        that.setData({
          dreamsDateil: res,
          id: options.id,
        })

        // 富文本解析
        var article = res.content
        WxParse.wxParse('article', 'html', article, that, 15);
        var article = res.ps
        WxParse.wxParse('ps', 'html', article, that, 15);
        // 富文本解析结束
        //评论插件
        comment.comment(that)
      }
    )

    // 获取人数
    this.inquiry()
    this.isAuthor()
    this.getUserList()
    // 确认用户信息完整
    this.confirm()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取人数
    this.inquiry()
    this.isAuthor()
    this.getUserList()
    // 确认用户信息完整
    this.confirm()
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    // 获取人数
    this.inquiry()
    this.isAuthor()
    this.getUserList()
    // 确认用户信息完整
    this.confirm()
    wx.stopPullDownRefresh()
  },

  inquiry: function() {
    var that = this
    $ajax._get(
      app.url + 'Dreams/Api/inquiry', {
        id: that.data.dream_id,
      },
      function(res) {
        console.log(res.data)
        var is_overflow = (parseInt(res.data.collect_count)<=parseInt(res.data.need_number))?'0':'1'
        console.log(is_overflow)
        that.setData({
          need_number: res.data.need_number,
          join_number: res.data.collect_count,
          is_overflow:is_overflow
        })
      })
  },
  isAuthor: function() {
    var that = this
    $ajax._get(
      app.url + 'Dreams/Api/isAuthor', {
        openid: that.data.openid,
        dream_id: that.data.dream_id
      },
      function(res) {
        console.log(res)
        that.setData({
          is_author: res.data,
          'dreamsDateil.is_author': res.data,
          'dreamsDateil.is_overdue':that.data.is_overdue,
          'dreamsDateil.is_overflow': that.data.is_overflow

        })
      })
  },
  getUserList: function() {
    var that = this
    $ajax._get(
      app.url + 'Dreams/Api/getUserList', {
        dream_id: that.data.dream_id
      },
      function(res) {
        console.log(res)
        that.setData({
          listData: res.data
        })
      })

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
      })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this,
      id = this.data.id,
      last_id = this.data.dreamsDateil.comment_lastid,
      comment_lists = this.data.dreamsDateil.comment_lists

    wx.showLoading({
      title: '加载中',
    })

    $ajax._get(
      app.url + 'Dreams/Api/getMoreComment', {
        dreams_id: id,
        PHPSESSID: wx.getStorageSync('PHPSESSID'),
        last_id: last_id,
        openid:that.data.openid
      },
      function(res) {
        console.log(res)
        wx.hideLoading()
        var res = res.data

        for (var i = 0; i < res.comment_lists.length; i++) {
          var changeTime = res.comment_lists[i].cTime
          changeTime = timeago().format(changeTime, 'zh_CN')
          res.comment_lists[i].cTime = changeTime
          comment_lists.push(res.comment_lists[i])
        }
        that.setData({
          "dreamsDateil.comment_lastid": res.comment_lastid,
          "dreamsDateil.comment_lists": comment_lists
        })

      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this,
      dreamsDateil = this.data.dreamsDateil

    return {
      success: function(res) {
        // 转发成功

        $ajax._get(
          app.url + 'Dreams/Api/setDreamsAct', {
            dreams_id: dreamsDateil.id,
            type: 'share',
            PHPSESSID: wx.getStorageSync('PHPSESSID')
          },
          function(res) {

            if (res.status == 1) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000
              })
            }

          }
        )
      },
      fail: function(res) {
        // 转发失败
        console.log(res)

      }
    }
  },
  // 结束招募
  endJoin: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '结束招募，可以在历史梦想中查看',
      success: function (res) {
        if (res.cancel) {
  
        } else {
          $ajax._get(
            app.url + 'Dreams/Api/endJoin', {
              id: that.data.dream_id,
            },
            function (res) {
              console.log(res.data)
            })
          wx.navigateBack()
        }
      }
    })
  },


})