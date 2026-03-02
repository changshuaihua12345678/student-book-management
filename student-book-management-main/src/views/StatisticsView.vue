<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>图书分类统计</span>
            </template>
            <div ref="categoryChartRef" class="chart"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>借阅状态统计</span>
            </template>
            <div ref="statusChartRef" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="24">
          <el-card class="chart-card">
            <template #header>
              <span>借阅趋势</span>
            </template>
            <div ref="trendChartRef" class="chart chart-large"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBookStore, useBorrowStore } from '../stores'
import * as echarts from 'echarts'

const bookStore = useBookStore()
const borrowStore = useBorrowStore()

const categoryChartRef = ref(null)
const statusChartRef = ref(null)
const trendChartRef = ref(null)

const categoryData = computed(() => {
  const categories = {}
  bookStore.books.forEach(book => {
    if (categories[book.category]) {
      categories[book.category]++
    } else {
      categories[book.category] = 1
    }
  })
  return {
    labels: Object.keys(categories),
    values: Object.values(categories)
  }
})

const statusData = computed(() => {
  const totalBooks = bookStore.books.length
  const borrowedBooks = borrowStore.activeBorrows.length
  const availableBooks = totalBooks - borrowedBooks
  return {
    labels: ['可借', '已借'],
    values: [availableBooks, borrowedBooks]
  }
})

const trendData = computed(() => {
  // 模拟近7天的借阅数据
  const dates = []
  const values = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
    // 生成随机借阅数据
    values.push(Math.floor(Math.random() * 5) + 1)
  }
  
  return {
    dates,
    values
  }
})

const initCategoryChart = () => {
  if (!categoryChartRef.value) return
  
  const chart = echarts.init(categoryChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '图书分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: categoryData.value.labels.map((label, index) => ({
          value: categoryData.value.values[index],
          name: label
        }))
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const initStatusChart = () => {
  if (!statusChartRef.value) return
  
  const chart = echarts.init(statusChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '借阅状态',
        type: 'pie',
        radius: '60%',
        data: statusData.value.labels.map((label, index) => ({
          value: statusData.value.values[index],
          name: label
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  const chart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.value.dates
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        name: '借阅数量',
        type: 'line',
        stack: 'Total',
        data: trendData.value.values,
        areaStyle: {
          opacity: 0.3
        },
        smooth: true
      }
    ]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  initCategoryChart()
  initStatusChart()
  initTrendChart()
})
</script>

<style scoped>

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-card {
  height: 400px;
}

.chart {
  width: 100%;
  height: 350px;
}

.chart-large {
  height: 400px;
}
</style>