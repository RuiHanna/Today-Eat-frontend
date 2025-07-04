// pages/rank.js
Page({
    data: {
        rankList: [],
    },
    onLoad() {
        const that = this
        wx.request({
            url: 'http://39.106.228.153:8080/api/dishes',
            method: 'GET',
            success(res) {
                if (res.data.code === 0) {
                    // 把后端字段映射为前端需要的字段
                    const list = res.data.data.map(item => ({
                        name: item.name,
                        desc: item.description,
                        image: item.image_url,
                        score: item.score
                    }))
                    that.setData({
                        rankList: list.slice(0,10)
                    })
                } else {
                    wx.showToast({
                        title: '获取菜品失败',
                        icon: 'none'
                    })
                }
            },
            fail() {
                wx.showToast({
                    title: '请求接口失败',
                    icon: 'none'
                })
            }
        })
    }
})