// pages/user/user.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    user: {
      avatarUrl: defaultAvatarUrl,
      nickname: '',
      mealCount: 0,
      favoriteTaste: '未统计',
      commonMood: '无',
      moodFood: '暂无推荐'
    },
    loggedIn: false,
    showFavorites: false,
    showHistory: false,
    favorites: [],
    favoritesAnim: null,
    isFavoritesExpanded: false,
    history: [],
    showHistory: false,
    isHistoryExpanded: false,
    historyAnim: null,
  },

  onLoad() {
    const stored = wx.getStorageSync('userInfo')
    const userID = wx.getStorageSync('user_id')
    if (stored && userID) {
      this.setData({
        user: {
          ...this.data.user,
          avatarUrl: stored.avatarUrl || defaultAvatarUrl,
          nickname: stored.nickname || '未命名',
        },
        loggedIn: true
      })
    }
  },

  onShow() {
    const userId = wx.getStorageSync('user_id')
    if (!userId) {
      console.warn('未登录')
      return
    }

    this.setData({
      loggedIn: true
    })
    this.loadUserFavorites(userId)
    this.loadUserHistory(userId)
    // 拉取用户详细信息
    wx.request({
      url: `http://39.106.228.153:8080/api/user/info?user_id=${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          const info = res.data.data
          this.setData({
            user: {
              ...this.data.user,
              mealCount: info.meal_count,
              favoriteTaste: info.favorite_taste || '未统计',
              commonMood: info.common_mood || '无',
              moodFood: info.mood_food || '暂无推荐'
            },
          })
        } else {
          wx.showToast({
            title: '获取信息失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },

  //加载用户收藏
  loadUserFavorites(userId) {
    wx.request({
      url: `http://39.106.228.153:8080/api/user/${userId}/favorites`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            favorites: res.data.favorites
          })
        } else {
          wx.showToast({
            title: '获取收藏失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },

  //加载推荐历史
  loadUserHistory(userId) {
    wx.request({
      url: `http://39.106.228.153:8080/api/history?user_id=${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            history: res.data.history
          })
        } else {
          wx.showToast({
            title: '获取推荐历史失败',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },

  // 微信一键登录
  onLogin() {
    const that = this
    wx.getUserProfile({
      desc: '用于登录和同步用户信息',
      success(profileRes) {
        const userInfo = profileRes.userInfo
        wx.login({
          success(loginRes) {
            wx.request({
              url: 'http://39.106.228.153:8080/api/user/wxlogin',
              method: 'POST',
              data: {
                code: loginRes.code,
                nickname: userInfo.nickName,
                avatar_url: userInfo.avatarUrl
              },
              success(res) {
                if (res.data.code === 0) {
                  wx.setStorageSync('user_id', res.data.user_id)
                  wx.setStorageSync('userInfo', {
                    nickname: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl
                  })
                  that.setData({
                    user: {
                      ...that.data.user,
                      nickname: userInfo.nickName,
                      avatarUrl: userInfo.avatarUrl,
                      mealCount: userInfo.meal_count,
                      favoriteTaste: userInfo.favorite_taste || '未统计',
                      commonMood: userInfo.common_mood || '无',
                      moodFood: userInfo.mood_food || '暂无推荐'
                    },
                    loggedIn: true
                  })
                  wx.showToast({
                    title: '登录成功'
                  })
                } else {
                  wx.showToast({
                    title: '登录失败',
                    icon: 'none'
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  //我喜欢的面板
  toggleFavorites() {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-in-out'
    });

    if (this.data.isFavoritesExpanded) {
      // 收起动画
      animation.height(0).opacity(0).step();
      this.setData({
        favoritesAnim: animation.export(),
        isFavoritesExpanded: false, // 立即切换箭头
      });
      setTimeout(() => {
        this.setData({
          showFavorites: false,
        });
      }, 300);
    } else {
      // 展开
      this.setData({
        showFavorites: true,
      }, () => {
        animation.height('auto').opacity(1).step();
        this.setData({
          favoritesAnim: animation.export(),
          isFavoritesExpanded: true, // 动画开始后切换箭头
        });
      });
    }
  },

  //推荐历史面板
  toggleHistory() {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-in-out'
    });

    if (this.data.isHistoryExpanded) {
      // 收起动画
      animation.height(0).opacity(0).step();
      this.setData({
        historyAnim: animation.export(),
        isHistoryExpanded: false, // 立即切换箭头
      });
      setTimeout(() => {
        this.setData({
          showHistory: false,
        });
      }, 300);
    } else {
      // 展开动画
      this.setData({
        showHistory: true,
      }, () => {
        animation.height('auto').opacity(1).step();
        this.setData({
          historyAnim: animation.export(),
          isHistoryExpanded: true, // 动画开始后切换箭头
        });
      });
    }
  },

  // 修改昵称实时绑定
  onNicknameInput(e) {
    const nickname = e.detail.value
    this.setData({
      'user.nickname': nickname
    })
  },

  // 保存昵称
  onSaveProfile() {
    const userID = wx.getStorageSync('user_id')
    const {
      nickname
    } = this.data.user

    if (!nickname) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none'
      })
      return
    }

    wx.request({
      url: 'http://39.106.228.153:8080/api/user/update_nickname',
      method: 'POST',
      data: {
        user_id: userID,
        nickname: nickname
      },
      success: (res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '昵称已更新'
          })
          const userInfo = wx.getStorageSync('userInfo') || {}
          userInfo.nickname = nickname
          wx.setStorageSync('userInfo', userInfo)
        } else {
          wx.showToast({
            title: '更新失败',
            icon: 'none'
          })
        }
      }
    })
  },

  //保存头像
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    const userID = wx.getStorageSync('user_id')
    const that = this

    if (!userID) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    // 下载临时头像文件
    wx.downloadFile({
      url: avatarUrl,
      success(res) {
        if (res.statusCode === 200) {
          wx.uploadFile({
            url: 'http://39.106.228.153:8080/api/user/avatar',
            filePath: res.tempFilePath,
            name: 'avatar',
            formData: {
              user_id: userID
            },
            success(uploadRes) {
              const result = JSON.parse(uploadRes.data)
              if (result.code === 0) {
                const newAvatar = result.avatar_url + '?t=' + Date.now()
                // 更新前端
                that.setData({
                  'user.avatarUrl': newAvatar
                })
                // 同步缓存
                const userInfo = wx.getStorageSync('userInfo') || {}
                userInfo.avatarUrl = newAvatar
                wx.setStorageSync('userInfo', userInfo)

                wx.showToast({
                  title: '头像已更新'
                })
              } else {
                wx.showToast({
                  title: '上传失败',
                  icon: 'none'
                })
              }
            },
            fail() {
              wx.showToast({
                title: '上传出错',
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: '头像下载失败',
            icon: 'none'
          })
        }
      }
    })
  }

})