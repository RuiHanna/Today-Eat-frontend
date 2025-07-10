// pages/detail/detail.js
Page({
  data: {
    dish: null,
    userId: null,
    liked: false,
    rating: 0,
    showRating: false,
    dishId: 0,
  },

  onLoad(options) {
    const dishId = options.id;
    const userId = wx.getStorageSync('user_id');

    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    this.setData({
      userId
    });
    this.setData({
      dishId
    })
    this.loadDishDetail(dishId);
  },

  //获取菜品详情
  loadDishDetail(dishId) {
    const userId = wx.getStorageSync('user_id'); // 从本地缓存获取用户ID
    if (!userId) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: `http://39.106.228.153:8080/api/dish/detail?id=${dishId}&user_id=${userId}`, // 加上 user_id
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0 && res.data.data) {
          const dish = res.data.data;
          this.setData({
            dish: dish,
            liked: dish.liked || false,
            rating: dish.score || 0
          });
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  //点赞/取消点赞
  toggleLike() {
    const {
      dish,
      userId,
      liked
    } = this.data;
    const action = liked ? 'unlike' : 'like';
    wx.request({
      url: `http://39.106.228.153:8080/api/like/${action}`,
      method: 'POST',
      data: {
        user_id: userId,
        dish_id: dish.id
      },
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            liked: !liked
          });
          wx.showToast({
            title: liked ? '已取消点赞' : '点赞成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
  },

  //打开评分弹窗
  openRating() {
    this.setData({
      showRating: true
    });
  },

  // 关闭评分弹窗
  closeRating() {
    this.setData({
      showRating: false
    });
  },

  // 滑动评分条
  onRateChange(e) {
    const rating = e.detail.value;
    this.setData({
      rating
    });
  },

  // 提交评分
  submitRating() {
    const {
      userId,
      dish,
      rating
    } = this.data;

    wx.request({
      url: 'http://39.106.228.153:8080/api/rating',
      method: 'POST',
      data: {
        user_id: userId,
        dish_id: dish.id,
        score: rating
      },
      success: (res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '评分成功',
            icon: 'success'
          });
          this.setData({
            showRating: false
          });
          this.loadDishDetail(this.data.dishId);
        } else {
          wx.showToast({
            title: '评分失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  searchInMeituan() {
    const keyword = this.data.dish.name;
    wx.navigateToMiniProgram({
      appId: "wxde8ac0a21135c07d",
      path: `pages/index/index?query=${encodeURIComponent(keyword)}`,
      fail() {
        wx.showToast({
          title: '打开美团失败',
          icon: 'none'
        });
      }
    });
  }
});