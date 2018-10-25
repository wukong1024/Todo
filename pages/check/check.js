const app = getApp()
var $ajax = require('../../utils/network_util.js')
var touchDotX = 0; //触摸时的横坐标原点  
var touchDotY = 0; //触摸时的纵坐标原点  
var touchPost = ''
Page({
  data: {
    // cate_id: 0,
    navScrollLeft: 0,
    // touchIndex: 0,
    key: '',
  },
  onLoad: function(res) {  
    this.setData({
      cate_id: wx.getStorageSync("cate_id"),
      touchIndex: wx.getStorageSync("cate_id")
    })
    this.loadNav()
    this.loadList()
  },
  onShow:function(){
    if(this.data.cate_id>0){
      this.loadList()
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {  
    this.loadList()
    wx.stopPullDownRefresh()
  },
 

  loadNav() {
    var that = this
    var openid = wx.getStorageSync('openid')
    // console.log(openid)
    wx.showLoading({
      title: '加载中',
    })

    $ajax._get(
      app.url + 'Dreams/Api/getDreamsCates',
      {
      },
      function (res) {
        console.log(res)
        wx.hideLoading()
        res.data.unshift({
          id: 0,
          title: '推荐'
        })
        that.setData({
          dreamsNav: res.data
        })

      }
    )
  },

  // 获取列表公共函数
  loadList(page = 1) {
    var that = this,
      cate_id = this.data.cate_id,
      key = this.data.key

    wx.showLoading({
      title: '加载中',
    })

    $ajax._get(
      app.url + 'Dreams/Api/getDreamsLists', {
        PHPSESSID: wx.getStorageSync('PHPSESSID'),
        cate_id: cate_id,
        key: key,
        page: page,
        is_overdue:0
      },
      function(res) {
        console.log(res)
        console.log(res.data)
        var res = res.data
        wx.hideLoading()

        if (page > 1) {
          var list_data = that.data.dreamsList.list_data
          console.log(list_data)

          for (var i = 0; i < res.list_data.length; i++) {
            list_data.push(res.list_data[i])
          }
   
          that.setData({
            "dreamsList.list_data": list_data,
            "dreamsList.page": res.page
          })

        } else {

          that.setData({
            dreamsList: res
          })

        }

      }
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    var page = this.data.dreamsList.page
    if (page > 1) {
      this.loadList(page)
    }
  },

  // 切换功能实现
  navTab(e) {
    var cate_id = e.target.dataset.id,
      touchIndex = e.target.dataset.index
      console.log(cate_id)
    this.setData({
      cate_id: cate_id,
      touchIndex: touchIndex,
      navScrollLeft: 100 * touchIndex,
      key: ''
    })
    this.loadList()
  },

  // 实现搜索功能
  searchInput(e) {
    this.setData({
      key: e.detail.value
    })
  },
  searchSubmit() {
    this.loadList()
  },


  // 触摸开始事件  
  touchStart: function(e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点  
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点  
  },

  // 触摸移动事件  
  touchMove: function (e) {
    var touchMoveX = e.touches[0].pageX
    var touchMoveY = e.touches[0].pageY
    // console.log("touchMoveX:" + touchMoveX + " touchDotX:" + touchDotX + " diff:" + (touchMoveX - touchDotX));
    var y = Math.abs(touchMoveY - touchDotY)
    var x = Math.abs(touchMoveX - touchDotX)
    // console.log(x, y)
    // console.log(x > y)
    // 向左滑动    
    if (touchMoveX - touchDotX < -50 && x > y) {
      touchPost = 'left'
    }
    // 向右滑动  
    if (touchMoveX - touchDotX > 50 && x > y) {
      touchPost = 'right'
    }
  },
  // 触摸结束事件  
  touchEnd: function (e) {
    var dreamsNav = this.data.dreamsNav,
      touchIndex = this.data.touchIndex

    if (touchPost == 'left' && touchIndex < dreamsNav.length - 1) {
      touchIndex++
      console.log('向左滑动');
      console.log(touchIndex)
      this.setData({
        cate_id: dreamsNav[touchIndex].id,
        touchIndex: touchIndex,
        navScrollLeft: 100 * touchIndex
      })
      this.loadList()

    } else if (touchPost == 'right' && touchIndex != 0) {
      touchIndex--
      console.log('向右滑动');
      console.log(touchIndex)
      this.setData({
        cate_id: dreamsNav[touchIndex].id,
        touchIndex: touchIndex,
        navScrollLeft: 100 * touchIndex
      })
      this.loadList()
    }
    touchPost = ''
  },  
})