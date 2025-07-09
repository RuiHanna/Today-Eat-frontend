// pages/chat/chat.js
let socketTask = null;
const app = getApp();

Page({
  data: {
    inputText: '',
    messages: [],
    loading: false,
    scrollTop: 0,
    showWelcome: true,
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  sendMessage() {
    const message = this.data.inputText.trim();
    if (!message) return;

    this.setData({showWelcome: false});

    // 添加用户消息
    const newMessages = this.data.messages.concat({
      from: 'user',
      content: message,
    });

    // 添加空的 bot 消息用于后续追加
    newMessages.push({
      from: 'bot',
      content: '',
      node: {}
    });

    this.setData({
      messages: newMessages,
      inputText: '',
      loading: true,
    }, this.scrollToBottom);

    // 建立 WebSocket 连接
    socketTask = wx.connectSocket({
      url: 'ws://39.106.228.153:8080/api/chat/ws',
      success: () => console.log('WebSocket connected'),
      fail: (err) => {
        console.error('连接失败', err);
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        });
      }
    });

    socketTask.onOpen(() => {
      // 发送用户消息
      socketTask.send({
        data: JSON.stringify({
          message
        }),
      });
    });

    // 接收流式消息
    socketTask.onMessage((res) => {
      const lastIndex = this.data.messages.length - 1;
      const updatedContent = this.data.messages[lastIndex].content + res.data;

      const md = app.towxml(updatedContent, 'markdown');

      this.setData({
        [`messages[${lastIndex}].content`]: updatedContent,
        [`messages[${lastIndex}].nodes`]: md,
      }, this.scrollToBottom);
    });

    socketTask.onClose(() => {
      this.setData({
        loading: false
      });
    });    

    socketTask.onError((err) => {
      console.error('WebSocket error:', err);
      wx.showToast({
        title: 'AI异常',
        icon: 'none'
      });
      this.setData({
        loading: false
      });
    });
  },

  scrollToBottom() {
    this.setData({
      scrollTop: 999999, // 一个足够大的值，确保滚动到底部
    });
  },
});