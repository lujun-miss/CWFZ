// pages/records/records.js
Page({
  data: {
    projectStats: [
      { id: 1, name: '项目A-核心算法开发', hours: 80, percentage: 45 },
      { id: 2, name: '项目B-前端界面开发', hours: 56, percentage: 32 },
      { id: 3, name: '项目C-测试验证', hours: 40, percentage: 23 }
    ],
    checkRecords: [
      { date: '2026-04-20', day: '20', weekDay: '周一', checkIn: '08:28', checkOut: '18:30', status: 'normal', statusText: '正常' },
      { date: '2026-04-19', day: '19', weekDay: '周日', checkIn: '', checkOut: '', status: 'normal', statusText: '休息' },
      { date: '2026-04-18', day: '18', weekDay: '周六', checkIn: '09:15', checkOut: '17:30', status: 'late', statusText: '迟到' },
      { date: '2026-04-17', day: '17', weekDay: '周五', checkIn: '08:25', checkOut: '18:35', status: 'normal', statusText: '正常' },
      { date: '2026-04-16', day: '16', weekDay: '周四', checkIn: '08:30', checkOut: '18:00', status: 'early', statusText: '早退' }
    ],
    workHourDetails: [
      { id: 1, projectName: '项目A-核心算法开发', hours: 8, date: '2026-04-20', content: '算法优化和性能测试' },
      { id: 2, projectName: '项目B-前端界面开发', hours: 6, date: '2026-04-18', content: '界面组件开发和调试' },
      { id: 3, projectName: '项目A-核心算法开发', hours: 4, date: '2026-04-18', content: '需求分析和方案设计' },
      { id: 4, projectName: '项目C-测试验证', hours: 8, date: '2026-04-17', content: '功能测试和Bug修复' }
    ]
  },

  onLoad() {
    this.loadStatistics()
  },

  onShow() {
    this.loadStatistics()
  },

  // 加载统计数据
  loadStatistics() {
    // 从本地存储加载打卡记录
    const checkLogs = wx.getStorageSync('checkLogs') || []
    const workHours = wx.getStorageSync('workHours') || []
    
    // 处理打卡记录
    const records = this.processCheckLogs(checkLogs)
    
    // 处理工时统计
    const stats = this.processWorkHours(workHours)
    
    this.setData({
      checkRecords: records,
      projectStats: stats
    })
  },

  // 处理打卡日志
  processCheckLogs(logs) {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const records = []
    
    // 获取最近7天的日期
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dateStr = date.toISOString().split('T')[0]
      const day = date.getDate().toString().padStart(2, '0')
      const weekDay = weekDays[date.getDay()]
      
      // 查找当天的打卡记录
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp).toDateString()
        return logDate === date.toDateString()
      })
      
      const checkInLog = dayLogs.find(log => log.type === 'checkIn')
      const checkOutLog = dayLogs.find(log => log.type === 'checkOut')
      
      let status = 'normal'
      let statusText = '正常'
      
      if (date.getDay() === 0 || date.getDay() === 6) {
        status = 'normal'
        statusText = '休息'
      } else if (!checkInLog && !checkOutLog) {
        status = 'missed'
        statusText = '缺卡'
      } else if (checkInLog && checkInLog.time > '09:00') {
        status = 'late'
        statusText = '迟到'
      } else if (checkOutLog && checkOutLog.time < '18:00') {
        status = 'early'
        statusText = '早退'
      }
      
      records.push({
        date: dateStr,
        day: day,
        weekDay: weekDay,
        checkIn: checkInLog ? checkInLog.time : '',
        checkOut: checkOutLog ? checkOutLog.time : '',
        status: status,
        statusText: statusText
      })
    }
    
    return records
  },

  // 处理工时统计
  processWorkHours(workHours) {
    // 按项目分组统计
    const projectMap = new Map()
    
    workHours.forEach(item => {
      if (projectMap.has(item.projectId)) {
        const project = projectMap.get(item.projectId)
        project.hours += item.hours
      } else {
        projectMap.set(item.projectId, {
          id: item.projectId,
          name: item.projectName,
          hours: item.hours
        })
      }
    })
    
    const stats = Array.from(projectMap.values())
    const totalHours = stats.reduce((sum, item) => sum + item.hours, 0)
    
    // 计算百分比
    stats.forEach(item => {
      item.percentage = totalHours > 0 ? Math.round((item.hours / totalHours) * 100) : 0
    })
    
    // 按工时降序排序
    stats.sort((a, b) => b.hours - a.hours)
    
    return stats
  },

  // 查看更多记录
  viewAllRecords() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadStatistics()
    wx.stopPullDownRefresh()
  }
})
