var app = getApp()
var $ajax = require('../utils/network_util.js')

function comment(that) {
  var dreamsDateil = that.data.dreamsDateil
  dreamsDateil.commentplaceholder = "我来说两句..."
  that.setData({
    dreamsDateil: dreamsDateil
  })

  that.backFn = backFn
  that.submitComment = submitComment
  that.collectComment = collectComment
  that.inputComment = inputComment
  that.likeFn = likeFn
  that.replyComment = replyComment
  that.delComment = delComment

}

function backFn() {
  wx.navigateBack()
}

function inputComment(e) {
  var that = this
  that.setData({
    "dreamsDateil.inputComment": e.detail.value
  })
}

function submitComment(e) {
  var that = this,
    dreamsDateil = this.data.dreamsDateil,
    content = this.data.dreamsDateil.inputComment || '',
    to_cid = this.data.to_cid || ''
  wx.showLoading({
    title: '加载中',
  })
  console.log(that.data.is_complete)
  if (that.data.is_complete == "1") {
    $ajax._post(
      app.url + 'Dreams/Api/addComment', {
        dreams_id: dreamsDateil.id,
        content: content,
        to_cid: to_cid,
        PHPSESSID: wx.getStorageSync('PHPSESSID'),
        openid: wx.getStorageSync('openid'),
      },
      function(res) {
        wx.hideLoading()
        if (res.status == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })

          var to_nickname = that.data.to_nickname

          res.data.cTime = "刚刚"
          res.data.content = content
          res.data.to_nickname = to_nickname
          res.data.to_cid = to_cid
          res.data.like_count = 0
          res.data.is_mine = 1

          dreamsDateil.comment_lists.unshift(res.data)
          console.log(dreamsDateil.comment_lists)
          that.setData({
            "dreamsDateil.comment_lists": dreamsDateil.comment_lists,
            "dreamsDateil.inputComment": '',
            "dreamsDateil.commentplaceholder": '我来说两句...',
            to_nickname: '',
            to_cid: ''
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
  } else {
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: '请完善个人信息',
      success: function (res) {
        if (res.cancel) {

        } else {
          wx.navigateTo({
            url: '/pages/personal/personal',
          })
        }
      } 
    })

  }

}

function replyComment(e) {
  var that = this,
    index = e.target.dataset.index,
    inputComment = this.data.dreamsDateil.inputComment,
    comment_lists = this.data.dreamsDateil.comment_lists,
    userInfo = wx.getStorageSync('userInfo')

  that.setData({
    "dreamsDateil.commentplaceholder": "回复" + comment_lists[index].nickname,
    to_cid: comment_lists[index].id,
    to_nickname: comment_lists[index].nickname
  })

}

function delComment(e) {
  var that = this,
    index = e.target.dataset.index,
    dreamsDateil = this.data.dreamsDateil,
    comment_lists = dreamsDateil.comment_lists,
    cid = comment_lists[index].id

  wx.showModal({
    title: '提示',
    content: '确认删除评论？',
    success: function(res) {
      if (res.confirm) {
        wx.showLoading({
          title: '加载中',
        })
        $ajax._get(
          app.url + 'Dreams/Api/delComment', {
            dreams_id: dreamsDateil.id,
            cid: cid,
            PHPSESSID: wx.getStorageSync('PHPSESSID')
          },
          function(res) {
            wx.hideLoading()
            if (res.status == 1) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })

              comment_lists.splice(index, 1)
              that.setData({
                "dreamsDateil.comment_lists": comment_lists
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
      }
    }
  })
}

function collectComment(e) {
  var that = this,
    dreamsDateil = this.data.dreamsDateil
  wx.showLoading({
    title: '加载中',
  })
  if (that.data.is_complete == "1") {
  $ajax._get(
    app.url + 'Dreams/Api/setDreamsAct', { 
      dreams_id: dreamsDateil.id,
      type: 'collect',
      PHPSESSID: wx.getStorageSync('PHPSESSID'),
      openid:that.data.openid
    },
    function(res) {
      wx.hideLoading()
      if (res.status == 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
        var has_collect = dreamsDateil.has_collect

        has_collect == 1 ? has_collect = 0 : has_collect = 1
        //更新梦想成员列表
        $ajax._get(
          app.url + 'Dreams/Api/updateJoin', {
            cc:has_collect,
            openid: that.data.openid,
            dream_id:that.data.dream_id
          },
          function (res) {
            console.log(res)
          })
        // 更新人数
        that.inquiry()
        dreamsDateil.has_collect = has_collect
        that.setData({
          dreamsDateil: dreamsDateil,
          has_collect: has_collect
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
  } else {
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: '请完善个人信息',
      success: function (res) {
        if (res.cancel) {

        } else {
          wx.navigateTo({
            url: '/pages/personal/personal',
          })
        }
      } 
    })

  }

}

function likeFn(e) {
  var that = this,
    index = e.target.dataset.index,
    comment_lists = this.data.dreamsDateil.comment_lists,
    dreamsDateil = this.data.dreamsDateil,
    cid = comment_lists[index].id
  wx.showLoading({
    title: '加载中',
  })
  $ajax._get(
    app.url + 'Dreams/Api/setLike', {
      cid: cid,
      PHPSESSID: wx.getStorageSync('PHPSESSID'),
      openid:that.data.openid
    },
    function(res) {
      wx.hideLoading()
      if (res.status == 1) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
        var has_like = comment_lists[index].has_like
        var like_count = parseInt(comment_lists[index].like_count)
        if (has_like == 1) {

          has_like = 0
          dreamsDateil.comment_lists[index].like_count = like_count - 1
        } else {


          has_like = 1
          dreamsDateil.comment_lists[index].like_count = like_count + 1
        }

        dreamsDateil.comment_lists[index].has_like = has_like

        that.setData({
          dreamsDateil: dreamsDateil
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
}
module.exports = {
  comment: comment
}