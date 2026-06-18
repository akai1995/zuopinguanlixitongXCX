<template>
  <view class="home-page page-transition-wrapper" :class="{ 'page-visible': pageVisible }">
    <!-- 头部 -->
    <view class="home-page__header">
      <view class="home-page__welcome">
        <text class="home-page__greeting">你好，{{ userInfo.nickname }}</text>
        <text class="home-page__date">{{ currentDate }}</text>
      </view>
      <image class="home-page__avatar" :src="userInfo.avatar || defaultAvatar" mode="aspectFill" />
    </view>

    <!-- 统计卡片 -->
    <text class="section-header__title">数据概览</text>
    <view class="stat-grid">
      <StatCard label="作品总数" :value="worksCount" type="primary" />
      <StatCard label="AI生图总数" :value="aiImagesCount" type="success" />
      <StatCard label="近30天新增" :value="recent30DaysNew" type="warning" :trend="12" />
      <StatCard label="最常用分类" :value="topCategory" type="danger" />
    </view>

    <!-- 月度趋势图 -->
    <view class="section-header">
      <text class="section-header__title">月度新增趋势</text>
    </view>
    <view class="home-page__chart">
      <view class="chart-title">
        <view class="chart-legend">
          <view class="chart-legend__item">
            <view class="chart-legend__dot chart-legend__dot--works" />
            <text class="chart-legend__text">作品</text>
          </view>
          <view class="chart-legend__item">
            <view class="chart-legend__dot chart-legend__dot--ai" />
            <text class="chart-legend__text">AI生图</text>
          </view>
        </view>
      </view>

      <!-- 点击数据展示 -->
      <view v-if="selectedMonthData" class="chart-tooltip">
        <view class="chart-tooltip__month">{{ selectedMonthData.month }}</view>
        <view class="chart-tooltip__data">
          <view class="chart-tooltip__item">
            <view class="chart-tooltip__dot chart-tooltip__dot--works" />
            <text class="chart-tooltip__label">作品</text>
            <text class="chart-tooltip__value">{{ selectedMonthData.works }} 个</text>
          </view>
          <view class="chart-tooltip__item">
            <view class="chart-tooltip__dot chart-tooltip__dot--ai" />
            <text class="chart-tooltip__label">AI生图</text>
            <text class="chart-tooltip__value">{{ selectedMonthData.aiImages }} 个</text>
          </view>
        </view>
      </view>

      <view class="chart-area">
        <view class="chart-y-axis">
          <text v-for="label in yLabels" :key="label" class="chart-y-label">{{ label }}</text>
        </view>
        <view class="chart-y-line" />
        <view class="chart-bars">
          <view 
            v-for="(item, idx) in monthlyTrend" 
            :key="idx" 
            class="chart-bar-group"
            :class="{ 'chart-bar-group--selected': selectedIndex === idx }"
            @tap="onBarClick(item, idx)"
          >
            <view class="chart-bar-col">
              <view
                class="chart-bar chart-bar--works"
                :style="{ height: getBarHeight(item.works) + '%' }"
              />
              <view
                class="chart-bar chart-bar--ai"
                :style="{ height: getBarHeight(item.aiImages) + '%' }"
              />
            </view>
            <text class="chart-bar-label">{{ item.month }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 动态信息流 -->
    <view class="section-header">
      <text class="section-header__title">最近动态</text>
    </view>
    <view class="home-page__activities">
      <view v-for="item in activities" :key="item.id" class="activity-item">
        <view :class="['activity-item__dot', `activity-item__dot--${item.type}`]" />
        <view class="activity-item__content">
          <text class="activity-item__title">{{ item.title }}</text>
          <text class="activity-item__desc">{{ item.description }}</text>
          <text class="activity-item__time">{{ item.time }}</text>
        </view>
      </view>
    </view>

    <!-- 自定义TabBar -->
    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWorksStore, useAiImagesStore, useUserStore } from '@/stores'
import { usePageTransition } from '@/mixins/pageTransition'
import CustomTabBar from '@/custom-tab-bar/index.vue'
import StatCard from '@/components/StatCard.vue'

const worksStore = useWorksStore()
const aiImagesStore = useAiImagesStore()
const userStore = useUserStore()
const { pageVisible } = usePageTransition()

const userInfo = userStore.userInfo
const defaultAvatar = 'https://picsum.photos/200'

onMounted(() => {
  if (worksStore.works.length === 0) {
    worksStore.initMockData()
  }
  if (aiImagesStore.aiImages.length === 0) {
    aiImagesStore.initMockData()
  }
})

const currentDate = computed(() => {
  const now = new Date()
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${days[now.getDay()]}`
})

const worksCount = computed(() => worksStore.totalCount)
const aiImagesCount = computed(() => aiImagesStore.totalCount)
const recent30DaysNew = computed(() => worksStore.recent30DaysNew + aiImagesStore.recent30DaysNew)
const topCategory = computed(() => worksStore.topCategory)

// 月度趋势数据
const monthlyTrend = [
  { month: '1月', works: 3, aiImages: 2 },
  { month: '2月', works: 5, aiImages: 3 },
  { month: '3月', works: 4, aiImages: 1 },
  { month: '4月', works: 2, aiImages: 4 },
  { month: '5月', works: 6, aiImages: 5 },
  { month: '6月', works: 8, aiImages: 3 },
]

const yLabels = ['0', '2', '4', '6', '8', '10']
const maxVal = 10

function getBarHeight(val: number): number {
  return (val / maxVal) * 100
}

// 点击交互
const selectedIndex = ref<number | null>(null)
const selectedMonthData = ref<{ month: string; works: number; aiImages: number } | null>(null)

function onBarClick(item: typeof monthlyTrend[0], idx: number) {
  if (selectedIndex.value === idx) {
    // 再次点击取消选中
    selectedIndex.value = null
    selectedMonthData.value = null
  } else {
    selectedIndex.value = idx
    selectedMonthData.value = item
  }
}

// 动态数据
const activities = [
  { id: '1', type: 'work_add' as const, title: '新增作品', description: '电商APP界面设计', time: '2小时前' },
  { id: '2', type: 'ai_image_add' as const, title: 'AI生图', description: '赛博朋克城市夜景', time: '5小时前' },
  { id: '3', type: 'work_edit' as const, title: '编辑作品', description: '更新了品牌视觉识别系统', time: '昨天' },
  { id: '4', type: 'ai_image_add' as const, title: 'AI生图', description: '梦幻森林精灵', time: '昨天' },
  { id: '5', type: 'work_add' as const, title: '新增作品', description: '用户研究方法论实践', time: '2天前' },
]
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  padding: $spacing-md $spacing-md 24px;
  
  &__header {
    @include flex-between;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }
  
  &__welcome {
    flex: 1;
  }
  
  &__greeting {
    @include font-title;
    display: block;
  }
  
  &__date {
    @include font-caption;
    margin-top: 4px;
  }
  
  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: $radius-round;
    overflow: hidden;
  }
  
  &__chart {
    @include card;
    margin-bottom: 16px;
    margin-top: 12px;
  }
  
  &__activities {
    @include card;
    margin-bottom: 16px;
    margin-top: 12px;
    padding-top: 4px;
    padding-bottom: 4px;
  }
}

.section-header {
  height: 24px;
  
  &__title {
    font-size: $font-size-card-title;
    font-weight: $font-weight-medium;
    line-height: $line-height;
    color: $text-primary-light;
    
    [data-theme='dark'] & {
      color: rgba(255, 255, 255, 0.85) !important;
    }
  }
}

.stat-grid {
  margin-top: 12px;
}

// ----- 图表样式 -----
.chart-title {
  margin-bottom: 12px;
}

.chart-tooltip {
  background: linear-gradient(135deg, rgba(25, 98, 236, 0.95) 0%, rgba(79, 138, 247, 0.95) 100%);
  border-radius: $radius-card;
  padding: $spacing-md;
  margin-bottom: $spacing-sm;
  box-shadow: 0 4px 16px rgba(25, 98, 236, 0.3);
  
  &__month {
    @include font-title;
    color: #FFFFFF;
    font-weight: $font-weight-bold;
    display: block;
    margin-bottom: $spacing-xs;
  }
  
  &__data {
    display: flex;
    gap: $spacing-lg;
  }
  
  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }
  
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    
    &--works {
      background-color: #FFFFFF;
    }
    
    &--ai {
      background-color: #34D399;
    }
  }
  
  &__label {
    @include font-caption;
    color: rgba(255, 255, 255, 0.85);
  }
  
  &__value {
    @include font-body;
    color: #FFFFFF;
    font-weight: $font-weight-medium;
  }
}

[data-theme='dark'] .chart-tooltip {
  &__month,
  &__label,
  &__value {
    color: rgba(255, 255, 255, 0.85) !important;
  }
}

.chart-legend {
  display: flex;
  gap: $spacing-lg;
  
  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }
  
  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    
    &--works {
      background-color: $color-primary;
    }
    
    &--ai {
      background-color: $color-success;
    }
  }
  
  &__text {
    font-size: $font-size-caption;
    font-weight: $font-weight-regular;
    line-height: $line-height;
    @include text-secondary;
  }
}

.chart-area {
  display: flex;
  gap: $spacing-sm;
  position: relative;
}

.chart-y-axis {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding-bottom: 20px;
}

.chart-y-label {
  font-size: $font-size-mini;
  font-weight: $font-weight-regular;
  line-height: $line-height;
  text-align: right;
  width: 18px;
  @include text-secondary;
}

.chart-bars {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 4px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 20px;
    right: 0;
    height: 1px;
    background-color: $border-light;
    [data-theme='dark'] & { background-color: $border-dark; }
  }
}

.chart-y-line {
  position: absolute;
  left: 26px;
  top: 0;
  bottom: 20px;
  width: 1px;
  background-color: $border-light;
  [data-theme='dark'] & { background-color: $border-dark; }
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 160px;
  padding: 0 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

.chart-bar-group--selected {
  .chart-bar {
    box-shadow: 0 0 12px rgba(25, 98, 236, 0.5);
  }
  
  .chart-bar--works {
    background: linear-gradient(180deg, #3B82F6 0%, #1962EC 100%);
  }
  
  .chart-bar--ai {
    background: linear-gradient(180deg, #6EE7B7 0%, #10B981 100%);
  }
  
  .chart-bar-label {
    color: $color-primary;
    font-weight: $font-weight-medium;
  }
}

.chart-bar-col {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  flex: 1;
  width: 100%;
  justify-content: center;
}

.chart-bar {
  flex: 1;
  max-width: 24px;
  min-width: 4px;
  border-radius: 4px 4px 0 0;
  min-height: 2px;
  transition: height $transition-page;
  
  &--works {
    background: $color-primary;
  }
  
  &--ai {
    background: $color-success;
  }
  
  &-label {
    font-size: $font-size-mini;
    font-weight: $font-weight-regular;
    line-height: $line-height;
    margin-top: 4px;
    @include text-secondary;
  }
}

// ----- 动态 -----
.activity-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md 0;
  
  &:not(:last-child) {
    @include border-bottom;
  }
  
  &__dot {
    width: 8px;
    height: 8px;
    border-radius: $radius-round;
    margin-top: 6px;
    flex-shrink: 0;
    
    &--work_add,
    &--work_edit {
      background-color: $color-primary;
    }
    
    &--ai_image_add,
    &--ai_image_edit {
      background-color: $color-success;
    }
  }
  
  &__content {
    flex: 1;
  }
  
  &__title {
    @include font-body;
    display: block;
    font-weight: 500;
    @include text-primary;
  }
  
  &__desc {
    font-size: $font-size-body;
    font-weight: $font-weight-regular;
    line-height: $line-height;
    display: block;
    margin-top: 2px;
    @include text-secondary;
  }
  
  &__time {
    font-size: $font-size-caption;
    font-weight: $font-weight-regular;
    line-height: $line-height;
    display: block;
    margin-top: 4px;
    @include text-secondary;
  }
}
</style>