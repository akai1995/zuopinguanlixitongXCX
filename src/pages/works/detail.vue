<template>
  <view class="detail-page-container">
    <!-- 顶部封面图 -->
    <view v-if="work.images.length > 0" class="detail-page__hero">
      <image 
        class="detail-page__hero-image" 
        :src="work.images[0]" 
        mode="aspectFill" 
        @tap="previewImage(0)"
      />
      <view class="detail-page__hero-overlay"></view>
    </view>

    <!-- 内容卡片 -->
    <view class="detail-page page-transition-wrapper" :class="{ 'page-visible': pageVisible }">
      <!-- 内容区 -->
      <view class="detail-page__content">
        <text class="detail-page__title">{{ work.title }}</text>
        
        <view class="detail-page__meta">
          <text class="detail-page__date">{{ formatDate(work.createdAt) }}</text>
        </view>
        <text class="detail-page__tag">{{ work.category }}</text>

        <view v-if="work.description" class="detail-page__desc-wrapper">
          <text class="detail-page__desc-title">作品描述</text>
          <text class="detail-page__desc">{{ work.description }}</text>
        </view>

        <view v-if="work.projectLink" class="detail-page__link" @tap="openLink">
          <text class="detail-page__link-text">查看项目链接</text>
          <text class="detail-page__link-arrow">→</text>
        </view>
      </view>

      <!-- 作品集图片列表 -->
      <view v-if="work.images.length > 1" class="detail-page__images">
        <view
          v-for="(img, idx) in work.images.slice(1)"
          :key="idx"
          class="detail-page__image-item"
          @tap="previewImage(idx + 1)"
        >
          <image class="detail-page__image" :src="img" mode="widthFix" />
        </view>
      </view>
    </view>

    <!-- 底部操作栏（独立于动画容器） -->
    <view class="detail-page__actions">
      <button class="detail-page__btn detail-page__btn--primary" @tap="openEdit">编辑</button>
      <button class="detail-page__btn detail-page__btn--danger" @tap="confirmDelete">删除</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWorksStore, usePopupStore } from '@/stores'
import { usePageTransition } from '@/mixins/pageTransition'
import { formatDate } from '@/utils'

const worksStore = useWorksStore()
const popupStore = usePopupStore()
const { pageVisible } = usePageTransition()

const currentId = ref('')

const work = computed(() => {
  return worksStore.getWorkById(currentId.value) || {
    id: '', title: '', coverImage: '', images: [], description: '',
    category: '', year: 0, projectLink: '', isPublic: true,
    createdAt: '', updatedAt: ''
  }
})

const workList = computed(() => worksStore.filteredWorks)
const currentIdx = computed(() => workList.value.findIndex(w => w.id === currentId.value))
const hasPrev = computed(() => currentIdx.value > 0)
const hasNext = computed(() => currentIdx.value < workList.value.length - 1)

const displayDate = computed(() => {
  const w = work.value
  if (!w.createdAt) return ''
  if (w.updatedAt && w.updatedAt !== w.createdAt) {
    return '更新于 ' + formatDate(w.updatedAt)
  }
  return '创建于 ' + formatDate(w.createdAt)
})

onMounted(() => {
  if (worksStore.works.length === 0) {
    worksStore.initMockData()
  }
  
  const pages = getCurrentPages()
  const current = pages[pages.length - 1] as { options?: { id?: string } }
  if (current?.options?.id) {
    currentId.value = current.options.id
  }
  
  popupStore.hideTabBar()
})

onUnmounted(() => {
  popupStore.showTabBar()
})

function previewImage(idx: number) {
  uni.previewImage({
    urls: work.value.images,
    current: idx
  })
}

function goPrev() {
  if (hasPrev.value) {
    uni.redirectTo({ url: `/pages/works/detail?id=${workList.value[currentIdx.value - 1].id}` })
  }
}

function goNext() {
  if (hasNext.value) {
    uni.redirectTo({ url: `/pages/works/detail?id=${workList.value[currentIdx.value + 1].id}` })
  }
}

function openEdit() {
  uni.navigateTo({ url: `/pages/works/upload?id=${currentId.value}` })
}

function confirmDelete() {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定删除该作品吗？',
    success: (res) => {
      if (res.confirm) {
        worksStore.deleteWork(currentId.value)
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 500)
      }
    }
  })
}

function openLink() {
  if (work.value.projectLink) {
    // #ifdef H5
    window.open(work.value.projectLink)
    // #endif
    // #ifdef MP-WEIXIN
    uni.setClipboardData({ data: work.value.projectLink })
    uni.showToast({ title: '链接已复制', icon: 'success' })
    // #endif
  }
}
</script>

<style lang="scss" scoped>
.detail-page-container {
  min-height: 100vh;
  @include bg-card;
  padding-bottom: calc(80px + #{$safe-bottom});
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.detail-page {
  margin-top: -32px;
  @include bg-card;
  border-radius: $radius-card $radius-card 0 0;
  padding-bottom: 16px;
  height: auto;
  min-height: auto;
  overflow: visible;
  
  &__hero {
    position: relative;
    width: 100%;
    height: 320px;
    overflow: hidden;
    
    &-image {
      width: 100%;
      height: 100%;
    }
    
    &-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
    }
  }
  
  &__images {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 $spacing-lg;
    margin-bottom: 0;
    padding-bottom: 0;
    margin-top: 16px;
  }
  
  &__image-item {
    width: 100%;
    height: auto;
    border-radius: 12px;
    overflow: hidden;
  }
  
  &__image {
    width: 100%;
    height: auto;
    border-radius: 12px;
  }
  
  &__cover-placeholder {
    width: 100%;
    height: 250px;
    @include bg-control;
    @include flex-center;
    
    &-icon {
      font-size: 48px;
      opacity: 0.3;
    }
  }
  
  &__content {
    padding: $spacing-lg;
    padding-bottom: 0;
  }
  
  &__title {
    @include font-title;
    display: block;
    margin-bottom: 8px;
    font-weight: $font-weight-bold;
    line-height: 1.4;
  }
  
  &__meta {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: 8px;
  }
  
  &__tag {
    font-size: $font-size-caption;
    font-weight: 400;
    padding: 4px 12px;
    border-radius: 6px;
    background-color: rgba(25, 98, 236, 0.15);
    color: $color-primary;
    display: inline-block;
    margin-bottom: 8px;
  }
  
  &__date {
    @include font-caption;
  }
  
  &__desc-wrapper {
    margin-top: 16px;
    @include bg-control;
    padding: 12px;
    border-radius: 12px;
  }
  
  &__desc-title {
    font-size: 16px;
    font-weight: 500;
    @include text-primary;
    display: block;
    margin-bottom: 8px;
  }
  
  &__desc {
    @include font-body;
    display: block;
    margin-bottom: $spacing-md;
    line-height: 1.8;
  }
  
  &__link {
    @include flex-between;
    padding: $spacing-md;
    @include bg-control;
    border-radius: 12px;
    margin-top: 16px;
    margin-bottom: $spacing-md;
    
    &-text {
      @include font-body;
      color: $color-primary;
    }
    
    &-arrow {
      color: $color-primary;
      font-size: 16px;
    }
  }
  
  &__actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: $spacing-sm;
    padding: $spacing-md;
    @include bg-card;
    box-shadow: $shadow-nav;
    padding-bottom: calc(#{$spacing-md} + #{$safe-bottom});
    z-index: 100;
    
    [data-theme='dark'] & {
      box-shadow: $shadow-nav-dark;
    }
  }
  
  &__btn {
    flex: 1;
    height: 36px;
    border-radius: $radius-btn-sm;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &--primary {
      background-color: $color-primary;
      color: #FFFFFF;
      border: none;
    }
    
    &--outline {
      background-color: transparent;
      @include border;
      @include text-secondary;
    }
    
    &--danger {
      background-color: $color-danger;
      color: #FFFFFF;
      border: none;
    }
  }
}
</style>