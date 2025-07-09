// index.js
Page({
  data: {
    recommend: {
      name: "麻辣香锅",
      image: "https://bkimg.cdn.bcebos.com/pic/2fdda3cc7cd98d1001e9d8eda167af0e7bec55e73aec?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
      reason: "今天气温较低，来点辣的暖暖身子！",
      priceMin: 25,
      priceMax: 45
    },
    filters: {
      taste: "辣🌶️",
      distance: "500m内🚶‍♀️",
      budget: 30,
      mood: "开心😁",
      weather: "晴☀️"
    },
    tasteOptions: ["辣🌶️", "甜🍨", "咸🥗", "酸🍋‍🟩", "苦🥒"],
    distanceOptions: ["500m内🚶‍♀️","1km🚲", "2km内🛴", "3km🚄", "不限✈️"],
    moodOptions: ["开心😁", "压力大😫", "心情低落😣", "想奖励自己🤭"],
    weatherOptions: ["晴☀️", "多云☁️", "阴🌥️", "小雨🌧️", "雷阵雨⛈️","雪☃️","雾🌫️","打雷🌩️","台风🌀","流星🌠","大风🌬️","龙卷风🌪️","炎热🔥"],

    guessList: [
      { name: "干锅花菜", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
      { name: "蒜香排骨", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
      { name: "蒜香排骨", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
      { name: "蒜香排骨", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
    ],
    historyList: [
      { name: "番茄炒蛋", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
      { name: "牛肉面", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
      { name: "蒜香排骨", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
      { name: "蒜香排骨", image: "https://ts4.tc.mm.bing.net/th/id/OIP-C.veNIhCS4msWOkn2eZUKT6AHaF7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
    ]
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
        wx.showToast({ title: '打开美团失败', icon: 'none' })
      }
    })
  }
})
