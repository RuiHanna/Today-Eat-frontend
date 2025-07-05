// pages/user/user.js
Page({
  data: {
    user: {
      avatarUrl: '/img/default-avatar.png',
      nickname: '未登录用户',
      mealCount: 42,
      favoriteTaste: '辣',
      commonMood: '压力大',
      moodFood: '麻辣香锅'
    },
    showFavorites: false,
    showHistory: false,
    favorites: [
      { name: '酸菜鱼' },
      { name: '香辣虾' },
      { name: '红烧牛肉' }
    ],
    history: [
      { name: '宫保鸡丁' },
      { name: '回锅肉' },
      { name: '干锅肥肠' }
    ]
  },

  toggleFavorites() {
    this.setData({ showFavorites: !this.data.showFavorites })
  },

  toggleHistory() {
    this.setData({ showHistory: !this.data.showHistory })
  }
})
