// pages/chat/chat.js
const app = getApp();

Page({
    data: {
        messages: [],
        inputText: '',
        loading: false,
        scrollTop: 0
    },

    onInput(e) {
        this.setData({
            inputText: e.detail.value
        })
    },

    sendMessage() {
        const userInput = this.data.inputText.trim()
        if (!userInput) return

        const newMessages = this.data.messages.concat({
            from: 'user',
            content: userInput
        })

        const that = this;

        this.setData({
            messages: newMessages,
            inputText: "",
            loading: true,
        })

        // 调用后端接口
        wx.request({
            url: 'http://39.106.228.153:8080/api/chat',
            method: 'POST',
            data: {
                message: userInput
            },
            success(res) {
                if (res.data.code === 0) {
                    const replyMarkdown = res.data.reply
                    const replyNodes = app.towxml(replyMarkdown, 'markdown')

                    that.setData({
                        messages: that.data.messages.concat({
                            from: 'bot',
                            content: replyNodes
                        }),
                        loading: false,
                        scrollTop: 999999,
                    })
                } else {
                    that.setData({
                        loading: false
                    })
                    wx.showToast({
                        title: '获取回复失败',
                        icon: 'none'
                    })
                }
            },

            fail: () => {
                this.setData({
                    loading: false
                })
                wx.showToast({
                    title: '接口请求失败',
                    icon: 'none'
                })
            }
        })
    },
})