<template>
  <view v-show="popupStore.tabBarVisible" class="custom-tab-bar" ref="tabBarRef">
    <view class="tab-bar-container">
      <view
        v-for="(item, index) in tabList"
        :key="index"
        class="tab-item"
        :class="{ active: currentIndex === index }"
        @click="switchTab(index)"
      >
        <text class="tab-item__icon">{{ item.icon }}</text>
        <text class="tab-item__text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { usePopupStore } from '@/stores'

const tabList = [
  { pagePath: '/pages/index/index', text: '首页', icon: '◉' },
  { pagePath: '/pages/works/index', text: '作品', icon: '▣' },
  { pagePath: '/pages/ai-images/index', text: 'AI生图', icon: '◆' },
  { pagePath: '/pages/profile/index', text: '我的', icon: '◎' }
]

const popupStore = usePopupStore()
const currentIndex = ref(0)
const tabBarRef = ref<HTMLElement | null>(null)

const switchTab = (index: number) => {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({
    url: tabList[index].pagePath
  })
}

const updateCurrentIndex = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    const route = '/' + currentPage.route
    const index = tabList.findIndex(item => item.pagePath === route)
    if (index !== -1 && currentIndex.value !== index) {
      currentIndex.value = index
    }
  }
}

onMounted(() => {
  updateCurrentIndex()

  // #ifdef H5
  // 将 tab bar 移动到 body 直接子级，避免被 uni-app 页面容器的滚动影响
  // uni-app H5 端 body 设置了 overflow-y: auto，导致 fixed 定位跟随页面滚动
  nextTick(() => {
    const el = document.querySelector('.custom-tab-bar') as HTMLElement | null
    if (el && el.parentElement !== document.body) {
      document.body.appendChild(el)
    }
  })
  // #endif

  const updateTimer = setInterval(() => {
    updateCurrentIndex()
  }, 100)

  return () => clearInterval(updateTimer)
})
</script>

<style lang="scss">
// 固定定位样式不能被 scoped 限制，否则在 H5 端可能失效
.custom-tab-bar {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 9999 !important;
  padding: 0 12px 12px;
  background: $bg-light;

  [data-theme='dark'] & {
    background: $bg-dark;
  }
}
</style>

<style lang="scss" scoped>
.tab-bar-container {
  display: flex;
  align-items: center;
  height: 96rpx;
  padding: 6px;
  padding-bottom: calc(6px + constant(safe-area-inset-bottom));
  padding-bottom: calc(6px + env(safe-area-inset-bottom));
  gap: 10rpx;
  background: #1962EC;
  border-radius: 10px;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 100%;
  padding: 8rpx 0;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center center;

  &.active {
    background: #FFFFFF;
    border-radius: 8px;

    .tab-item__icon {
      color: #1962EC;
    }

    .tab-item__text {
      opacity: 1;
      color: #1962EC;
    }
  }

  &:active:not(.active) {
    background: rgba(255, 255, 255, 0.15);
  }
}

.tab-item__icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
  font-weight: 300;
}

.tab-item__text {
  font-size: 24rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .active & {
    opacity: 1;
    color: #1962EC;
  }
}
</style>