<template>
  <view class="profile-page page-transition-wrapper" :class="{ 'page-visible': pageVisible }">
    <!-- 个人信息卡片 -->
    <view class="profile-card">
      <view class="profile-card__bg-circle-1"></view>
      <view class="profile-card__bg-circle-2"></view>
      <view class="profile-card__bg-circle-3"></view>
      <view class="profile-card__inner">
        <view class="profile-card__avatar">
          <image 
            v-if="userInfo.avatar" 
            class="profile-card__avatar-image" 
            :src="userInfo.avatar" 
            mode="aspectFill" 
          />
          <text v-else class="profile-card__avatar-text">{{ userInfo.nickname.charAt(0) }}</text>
        </view>
        <view class="profile-card__info">
          <text class="profile-card__name">{{ userInfo.nickname }}</text>
          <text class="profile-card__phone">{{ userInfo.phone }}</text>
        </view>
      </view>
    </view>

    <!-- 统计数据 -->
    <text class="section-header__title">我的数据</text>
    <view class="stat-grid">
      <StatCard label="作品总数" :value="stats.totalWorks" />
      <StatCard label="AI生图总数" :value="stats.totalAiImages" />
      <StatCard label="近30天新增" :value="stats.recent30DaysNew" />
    </view>

    <!-- 设置 -->
    <text class="section-header__title">设置</text>
    <view class="settings-list">
      <view class="settings-item" @tap="toggleTheme">
        <view class="settings-item__left">
          <text class="settings-item__icon">{{ isDark ? '🌙' : '☀️' }}</text>
          <text class="settings-item__text">主题模式</text>
        </view>
        <view class="settings-item__right">
          <text class="settings-item__value">{{ isDark ? '暗色模式' : '亮色模式' }}</text>
          <text class="settings-item__arrow">›</text>
        </view>
      </view>

      <view class="settings-item" @tap="onAbout">
        <view class="settings-item__left">
          <text class="settings-item__icon">ℹ️</text>
          <text class="settings-item__text">关于</text>
        </view>
        <view class="settings-item__right">
          <text class="settings-item__value">v1.0.0</text>
          <text class="settings-item__arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 自定义TabBar -->
    <CustomTabBar />
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useThemeStore, useUserStore, useWorksStore, useAiImagesStore } from '@/stores'
import { usePageTransition } from '@/mixins/pageTransition'
import CustomTabBar from '@/custom-tab-bar/index.vue'
import StatCard from '@/components/StatCard.vue'

const themeStore = useThemeStore()
const userStore = useUserStore()
const worksStore = useWorksStore()
const aiImagesStore = useAiImagesStore()
const { pageVisible } = usePageTransition()

const userInfo = computed(() => userStore.userInfo)
const isDark = computed(() => themeStore.isDark)
const stats = computed(() => userStore.stats)

function toggleTheme() {
  themeStore.toggleTheme()
}

function onAbout() {
  uni.showModal({
    title: '作品管理系统',
    content: '版本 1.0.0\n基于 UniApp + Vue3 + TypeScript\n帮助设计师高效管理作品与AI生图',
    showCancel: false
  })
}

onMounted(() => {
  if (worksStore.works.length === 0) worksStore.initMockData()
  if (aiImagesStore.aiImages.length === 0) aiImagesStore.initMockData()
})
</script>

<style lang="scss" scoped>
.profile-page {
  height: auto;
  min-height: 100vh;
  padding: $spacing-md $spacing-md 0;
}

// ----- 个人信息卡片 -----
.profile-card {
  @include flex-center;
  flex-direction: column;
  padding: $spacing-lg * 1.5;
  margin-bottom: 20px;
  border-radius: $radius-card;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(25, 98, 236, 0.9) 0%, rgba(79, 138, 247, 0.85) 50%, rgba(123, 166, 245, 0.8) 100%);
  
  &__bg-circle-1,
  &__bg-circle-2,
  &__bg-circle-3 {
    position: absolute;
    border-radius: 50%;
    filter: blur(50px);
    -webkit-filter: blur(50px);
    opacity: 0.8;
  }
  
  &__bg-circle-1 {
    width: 350px;
    height: 350px;
    background: linear-gradient(135deg, #1962EC 0%, #2563EB 50%, #3B82F6 100%);
    top: -150px;
    right: -100px;
    animation: float1 12s ease-in-out infinite;
  }
  
  &__bg-circle-2 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%);
    bottom: -120px;
    left: -80px;
    opacity: 0.75;
    animation: float2 10s ease-in-out infinite;
  }
  
  &__bg-circle-3 {
    width: 250px;
    height: 250px;
    background: linear-gradient(135deg, #2563EB 0%, #4F8AF7 50%, #7BA6F5 100%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.6;
    animation: pulse 6s ease-in-out infinite;
  }
  
  &__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  &__avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    @include flex-center;
    margin-bottom: $spacing-md;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 3px solid rgba(255, 255, 255, 0.4);
    overflow: hidden;
  }
  
  &__avatar-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  
  &__avatar-text {
    color: #FFFFFF;
    font-size: 28px;
    font-weight: $font-weight-bold;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  &__info {
    @include flex-center;
    flex-direction: column;
    gap: 4px;
  }
  
  &__name {
    @include font-title;
    color: #FFFFFF !important;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    font-weight: $font-weight-bold;
  }
  
  &__phone {
    @include font-caption;
    color: rgba(255, 255, 255, 0.95) !important;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
}

.stat-grid {
  margin-top: 12px;
  margin-bottom: 20px;
}

@keyframes float1 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-20px, -10px) scale(1.1);
  }
}

@keyframes float2 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(15px, 20px) scale(0.9);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

// ----- 设置列表 -----
.settings-list {
  @include card;
  margin-top: 12px;
  margin-bottom: 20px;
  padding: 0;
  overflow: hidden;
}

.settings-item {
  @include flex-between;
  padding: $spacing-md $spacing-lg;
  
  &:not(:last-child) {
    @include border-bottom;
  }
  
  &:active {
    opacity: 0.6;
  }
  
  &__left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
  
  &__icon {
    font-size: 20px;
  }
  
  &__text {
    @include font-body;
  }
  
  &__right {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }
  
  &__value {
    @include font-caption;
  }
  
  &__arrow {
    font-size: 20px;
    @include text-weak;
  }
}
</style>