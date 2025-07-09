// index.js
Page({
  data: {
    userId: null,
    recommend: null,
    filters: {
      taste: "辣🌶️",
      distance: "500m内🚶‍♀️",
      budget: 30,
      mood: "开心😁",
      weather: "晴☀️"
    },
    tasteOptions: ["辣🌶️", "甜🍨", "咸🥗", "酸🍋‍🟩", "苦🥒"],
    distanceOptions: ["500m内🚶‍♀️", "1km🚲", "2km内🛴", "3km🚄", "不限✈️"],
    moodOptions: ["开心😁", "压力大😫", "心情低落😣", "想奖励自己🤭"],
    weatherOptions: ["晴☀️", "多云☁️", "阴🌥️", "小雨🌧️", "雷阵雨⛈️", "雪☃️", "雾🌫️", "打雷🌩️", "台风🌀", "流星🌠", "大风🌬️", "龙卷风🌪️", "炎热🔥"],

    guessList: [],
    historyList: []
  },

  onLoad() {
    const userId = wx.getStorageSync('user_id')
    console.log(userId)
    if (userId) {
      this.setData({
        userId
      })
    } else {
      console.warn('尚未登录，未获取到 user_id')
    }
    this.loadRandomRecommend()
    this.loadHistoryList()
  },

  // 上报推荐记录
  reportRecommendHistory(userId, dishId) {
    if (!userId || !dishId) return;

    wx.request({
      url: 'http://39.106.228.153:8080/api/history/add',
      method: 'POST',
      data: {
        user_id: userId,
        dish_id: dishId
      }
    });
  },

  //随机推荐
  loadRandomRecommend() {
    const userId = this.data.userId || 0;

    wx.request({
      url: `http://39.106.228.153:8080/api/dish/random?user_id=${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0 && res.data.dishes && res.data.dishes.length > 0) {
          const dishes = res.data.dishes;
          const mainDish = dishes[0];
          this.setData({
            recommend: mainDish,
            guessList: dishes.slice(1, 5)
          });

          // 上报推荐记录给后端
          if (userId && mainDish.id) {
            this.reportRecommendHistory(userId, mainDish.id);
          }
        } else {
          wx.showToast({
            title: '推荐加载失败',
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

  //近期吃过
  loadHistoryList() {
    const userId = this.data.userId || 0
    if (!userId) return

    wx.request({
      url: `http://39.106.228.153:8080/api/history?user_id=${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          history = res.data.history.slice(0, 4);
          this.setData({
            historyList: history.map(item => ({
              name: item.name,
              image: item.image_url
            }))
          })
        }
      },
      fail: () => {
        console.warn("获取历史推荐失败")
      }
    })
  },

  //喜欢按钮
  toggleLike() {
    const {
      recommend,
      userId
    } = this.data;
    if (!userId || !recommend.id) {
      wx.showToast({
        title: '用户未登录',
        icon: 'none'
      });
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/user/user',
        });
      }, 800);
      return;
    }

    const action = recommend.liked ? 'unlike' : 'like';

    wx.request({
      url: `http://39.106.228.153:8080/api/like/${action}`,
      method: 'POST',
      data: {
        user_id: userId,
        dish_id: recommend.id,
      },
      success: (res) => {
        if (res.data.code === 0) {
          // 切换 liked 状态
          this.setData({
            'recommend.liked': !recommend.liked
          });
        } else {
          wx.showToast({
            title: res.data.message || '操作失败',
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

  //口味选择
  onTasteChange(e) {
    this.setData({
      "filters.taste": this.data.tasteOptions[e.detail.value]
    })
  },

  //距离选择
  onDistanceChange(e) {
    this.setData({
      "filters.distance": this.data.distanceOptions[e.detail.value]
    })
  },

  //预算选择
  onBudgetSlide(e) {
    this.setData({
      'filters.budget': e.detail.value
    })
  },

  //天气选择
  onWeatherChange(e) {
    this.setData({
      'filters.weather': this.data.weatherOptions[e.detail.value]
    })
  },

  //心情选择
  onMoodChange(e) {
    this.setData({
      "filters.mood": this.data.moodOptions[e.detail.value]
    })
  },

  //定制推荐
  refreshRecommend() {
    const { userId, filters } = this.data;
  
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/user/user' });
      }, 800);
      return;
    }
  
    // 显示加载提示
    wx.showLoading({
      title: '正在生成推荐...',
      mask: true
    });
  
    wx.request({
      url: 'http://39.106.228.153:8080/api/dish/custom',
      method: 'POST',
      data: {
        user_id: userId,
        taste: filters.taste,
        distance: filters.distance,
        budget: filters.budget,
        mood: filters.mood,
        weather: filters.weather
      },
      success: (res) => {
        wx.hideLoading(); // 无论成功与否，先隐藏加载提示
  
        if (res.data.code === 0 && res.data.dish) {
          this.setData({
            recommend: res.data.dish
          });
  
          // 上报推荐历史
          this.reportRecommendHistory(userId, res.data.dish.id);
  
        } else {
          wx.showToast({ title: res.data.message || '暂无推荐', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  //美团跳转
  searchInMeituan() {
    const keyword = this.data.recommend.name
    wx.navigateToMiniProgram({
      appId: "wxde8ac0a21135c07d", // 美团小程序
      path: `pages/index/index?query=${encodeURIComponent(keyword)}`,
      fail() {
        wx.showToast({
          title: '打开美团失败',
          icon: 'none'
        })
      }
    })
  }
})