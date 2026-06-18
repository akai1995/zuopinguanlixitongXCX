<template>
  <view class="detail-page-container">
    <!-- 顶部封面图 -->
    <view v-if="image.images.length > 0" class="detail-page__hero">
      <image 
        class="detail-page__hero-image" 
        :src="image.images[0]" 
        mode="aspectFill" 
        @tap="previewImage(0)"
      />
      <view class="detail-page__hero-overlay"></view>
    </view>

    <!-- 内容卡片 -->
    <view class="detail-page page-transition-wrapper" :class="{ 'page-visible': pageVisible }">
      <!-- 内容区 -->
      <view class="detail-page__content">
        <text class="detail-page__title">{{ image.title }}</text>
        
        <view class="detail-page__meta">
          <text class="detail-page__date">{{ formatDate(image.createdAt) }}</text>
        </view>
        <view class="detail-page__tags">
          <text class="detail-page__tag detail-page__tag--tool">{{ image.aiTool }}</text>
          <text v-if="image.category" class="detail-page__tag">{{ image.category }}</text>
        </view>

        <!-- Prompt 区域 -->
        <view class="detail-page__desc-wrapper">
          <text class="detail-page__desc-title">生成提示词</text>
          <view class="detail-page__code-block">
            <text class="detail-page__code-text">{{ image.prompt }}</text>
          </view>
          <text class="detail-page__copy-btn" @tap="copyPrompt">复制提示词</text>
        </view>

        <view v-if="image.negativePrompt" class="detail-page__desc-wrapper">
          <text class="detail-page__desc-title">负面提示词</text>
          <view class="detail-page__code-block">
            <text class="detail-page__code-text">{{ image.negativePrompt }}</text>
          </view>
          <text class="detail-page__copy-btn" @tap="copyNegativePrompt">复制提示词</text>
        </view>

        <view v-if="image.parameters" class="detail-page__desc-wrapper">
          <text class="detail-page__desc-title">生成参数</text>
          <view class="detail-page__code-block">
            <text class="detail-page__code-text">{{ image.parameters }}</text>
          </view>
        </view>
      </view>

      <!-- 图片列表 -->
      <view v-if="image.images.length > 1" class="detail-page__images">
        <view
          v-for="(img, idx) in image.images.slice(1)"
          :key="idx"
          class="detail-page__image-item"
          @tap="previewImage(idx + 1)"
        >
          <image class="detail-page__image" :src="img" mode="widthFix" />
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="detail-page__actions">
      <button class="detail-page__btn detail-page__btn--primary" @tap="openEdit">编辑</button>
      <button class="detail-page__btn detail-page__btn--danger" @tap="confirmDelete">删除</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAiImagesStore, usePopupStore } from '@/stores'
import { usePageTransition } from '@/mixins/pageTransition'
import { formatDate } from '@/utils'

const aiImagesStore = useAiImagesStore()
const popupStore = usePopupStore()
const { pageVisible } = usePageTransition()

const currentId = ref('')

const image = computed(() => {
  return aiImagesStore.getAiImageById(currentId.value) || {
    id: '', title: '', coverImage: '', images: [], aiTool: '',
    prompt: '', negativePrompt: '', parameters: '', category: '',
    isPublic: true, createdAt: '', updatedAt: ''
  }
})

onMounted(() => {
  if (aiImagesStore.aiImages.length === 0) {
    aiImagesStore.initMockData()
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
  uni.previewImage({ urls: image.value.images, current: idx })
}

function copyPrompt() {
  uni.setClipboardData({ data: image.value.prompt })
  uni.showToast({ title: '提示词已复制', icon: 'success' })
}

function copyNegativePrompt() {
  uni.setClipboardData({ data: image.value.negativePrompt })
  uni.showToast({ title: '负面提示词已复制', icon: 'success' })
}

function openEdit() {
  uni.navigateTo({ url: `/pages/ai-images/upload?id=${currentId.value}` })
}

function confirmDelete() {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定删除吗？',
    success: (res) => {
      if (res.confirm) {
        aiImagesStore.deleteAiImage(currentId.value)
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 500)
      }
    }
  })
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
  
  &__tags {
    display: flex;
    gap: $spacing-sm;
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
    
    &--tool {
      background-color: rgba(27, 203, 139, 0.15);
      color: $color-success;
      
      [data-theme='dark'] & {
        background-color: rgba(27, 203, 139, 0.2);
        color: #5DE8BA;
      }
    }
  }
  
  &__date {
    @include font-caption;
  }
  
  &__desc-wrapper {
    margin-top: 16px;
    @include bg-control;
    padding: 12px;
    border-radius: 12px;
    position: relative;
  }
  
  &__desc-title {
    font-size: 16px;
    font-weight: 500;
    @include text-primary;
    display: block;
    margin-bottom: 8px;
  }
  
  &__code-block {
    margin-bottom: 8px;
  }
  
  &__code-text {
    @include font-body;
    display: block;
    line-height: 1.8;
    word-break: break-all;
    white-space: pre-wrap;
  }
  
  &__copy-btn {
    font-size: $font-size-caption;
    color: $color-primary;
    font-weight: $font-weight-medium;
    display: block;
    text-align: right;
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

.form {
  &__field {
    margin-bottom: $spacing-md;
    
    &--row {
      @include flex-between;
    }
  }
  
  &__label {
    @include font-body;
    display: block;
    margin-bottom: $spacing-sm;
  }
  
  &__required {
    color: $color-danger;
  }
  
  &__input {
    @include input;
    width: 100%;
  }
  
  &__textarea {
    width: 100%;
    height: 80px;
    @include bg-card;
    @include border;
    border-radius: $radius-input;
    padding: $spacing-sm;
    font-size: $font-size-body;
    @include text-primary;
  }
  
  &__picker {
    @include input;
    @include flex-center;
    width: 100%;
    justify-content: flex-start;
    @include text-secondary;
  }
  
  &__category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
  
  &__category-tag {
    @include tag-outline($color-primary);
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-caption;
    border-radius: 20px;
    
    &.active {
      background-color: $color-primary;
      color: #FFFFFF;
    }
  }
}
</style>