// index.js
Page({
  data: {
    userId: 1,
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

    guessList: [{
        name: "干锅花菜",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        name: "蒜香排骨",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        name: "蒜香排骨",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        name: "蒜香排骨",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
    ],
    historyList: [{
        name: "番茄炒蛋",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        name: "牛肉面",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        name: "蒜香排骨",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
      {
        name: "蒜香排骨",
        image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
      },
    ]
  },

  onLoad() {
    const userId = wx.getStorageSync('user_id')
    if (userId) {
      this.setData({
        userId
      })
    } else {
      console.warn('尚未登录，未获取到 user_id')
    }
    this.loadRandomRecommend()
  },

  //随机推荐
  loadRandomRecommend() {
    const userId = this.data.userId || 0;

    wx.request({
      url: `http://39.106.228.153:8080/api/dish/random?user_id=${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            recommend: res.data.dish
          });
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


  onTasteChange(e) {
    this.setData({
      "filters.taste": this.data.tasteOptions[e.detail.value]
    })
  },

  onDistanceChange(e) {
    this.setData({
      "filters.distance": this.data.distanceOptions[e.detail.value]
    })
  },

  onBudgetSlide(e) {
    this.setData({
      'filters.budget': e.detail.value
    })
  },

  onWeatherChange(e) {
    this.setData({
      'filters.weather': this.data.weatherOptions[e.detail.value]
    })
  },


  onMoodChange(e) {
    this.setData({
      "filters.mood": this.data.moodOptions[e.detail.value]
    })
  },

  refreshRecommend() {
    wx.showToast({
      title: '已为你换一组推荐',
      icon: 'success'
    })
    // TODO: 请求后端新推荐
  },

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