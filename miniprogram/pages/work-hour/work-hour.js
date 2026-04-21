// pages/work-hour/work-hour.js
Page({
  data: {
    projectId: '',
    projectName: '',
    projectProgress: 30,
    workDate: '',
    workHours: 8,
    workContent: '',
    deviceList: [
      { id: 1, name: '笔记本', icon: '💻', selected: true },
      { id: 2, name: '台式机', icon: '🖥️', selected: false },
      { id: 3, name: '服务器', icon: '🔧', selected: false },
      { id: 4, name: '测试设备', icon: '🔬', selected: false }
    ],
    canSubmit: false
  },

  onLoad(options) {
    // 获取当前日期
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
    
    this.setData({
      projectId: options.projectId || '',
      projectName: options.projectName || '选择项目',
      workDate: dateStr
    })
    
    this.checkCanSubmit()
  },

  // 日期选择
  bindDateChange(e) {
    this.setData({
      workDate: e.detail.value
    })
  },

  // 选择工时
  selectHours(e) {
    const hours = parseFloat(e.currentTarget.dataset.hours)
    this.setData({
      workHours: hours
    })
  },

  // 滑块变化
  sliderChange(e) {
    this.setData({
      workHours: e.detail.value
    })
  },

  // 输入工作内容
  inputContent(e) {
    this.setData({
      workContent: e.detail.value
    })
    this.checkCanSubmit()
  },

  // 切换设备选择
  toggleDevice(e) {
    const id = e.currentTarget.dataset.id
    const deviceList = this.data.deviceList.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    this.setData({
      deviceList: deviceList
    })
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const canSubmit = this.data.workContent.trim().length > 0 && this.data.projectId
    this.setData({
      canSubmit: canSubmit
    })
  },

  // 切换项目
  changeProject() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 提交工时
  submitWorkHour() {
    if (!this.data.canSubmit) {
      wx.showToast({
        title: '请填写工作内容',
        icon: 'none'
      })
      return
    }

    const selectedDevices = this.data.deviceList
      .filter(item => item.selected)
      .map(item => item.name)
      .join(', ')

    const workHourData = {
      id: Date.now(),
      projectId: this.data.projectId,
      projectName: this.data.projectName,
      date: this.data.workDate,
      hours: this.data.workHours,
      content: this.data.workContent,
      devices: selectedDevices,
      createTime: new Date().toISOString()
    }

    // 保存到本地存储
    const workHours = wx.getStorageSync('workHours') || []
    workHours.push(workHourData)
    wx.setStorageSync('workHours', workHours)

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })
  }
})
