<template>
  <view class="image-uploader">
    <view class="image-uploader__title">
      <text class="image-uploader__title-text">{{ title }}</text>
      <text v-if="required" class="image-uploader__required">*</text>
    </view>

    <view class="image-uploader__grid">
      <!-- 已上传图片展示 -->
      <view
        v-for="(img, idx) in images"
        :key="idx"
        class="image-uploader__item"
      >
        <image class="image-uploader__image" :src="img" mode="aspectFill" @tap="preview(idx)" />
        <view class="image-uploader__delete" @tap.stop="removeImage(idx)">
          <text>&#x2715;</text>
        </view>
      </view>

      <!-- 添加按钮 -->
      <view
        v-if="images.length < maxCount"
        class="image-uploader__add"
        @tap="chooseImage"
      >
        <text class="image-uploader__add-icon">+</text>
        <text class="image-uploader__add-text">{{ images.length }}/{{ maxCount }}</text>
      </view>
    </view>

    <text v-if="tips" class="image-uploader__tips">{{ tips }}</text>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  modelValue: string[]
  maxCount?: number
  required?: boolean
  tips?: string
}>(), {
  maxCount: 9,
  required: true,
  tips: '点击添加图片，长按可调整顺序'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

function chooseImage() {
  const count = props.maxCount - props.modelValue.length
  uni.chooseImage({
    count,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      emit('update:modelValue', [...props.modelValue, ...res.tempFilePaths])
    }
  })
}

function removeImage(idx: number) {
  const next = [...props.modelValue]
  next.splice(idx, 1)
  emit('update:modelValue', next)
}

function preview(idx: number) {
  uni.previewImage({
    urls: props.modelValue,
    current: idx
  })
}

const images = props.modelValue
</script>

<style lang="scss" scoped>
.image-uploader {
  margin-bottom: $spacing-md;
  
  &__title {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-sm;
    
    &-text {
      font-size: 16px;
      font-weight: 500;
      color: $text-primary-light;

      [data-theme='dark'] & {
        color: $text-primary-dark;
      }
    }
    
    &__required {
      font-size: 16px !important;
      font-weight: 500 !important;
      color: #ff4d4f !important;
      margin-left: 4px;

      span {
        font-size: 16px !important;
        font-weight: 500 !important;
        color: #ff4d4f !important;
      }
    }
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-sm;
  }
  
  &__item {
    aspect-ratio: 1;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    
    &:active {
      opacity: 0.8;
    }
  }
  
  &__image {
    width: 100%;
    height: 100%;
  }
  
  &__delete {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    @include flex-center;
    background-color: $color-danger;
    color: #FFFFFF;
    border-radius: 50%;
    font-size: 12px;
  }
  
  &__add {
    aspect-ratio: 1;
    @include flex-center;
    flex-direction: column;
    @include bg-control;
    border: 1px dashed $border-light;
    border-radius: 8px;
    transition: all $transition-fast;
    
    [data-theme='dark'] & {
      border-color: $border-dark;
    }
    
    &-icon {
      font-size: 32px;
      line-height: 1;
      @include text-auxiliary;
    }
    
    &-text {
      font-size: 12px;
      @include text-weak;
      margin-top: 4px;
    }
    
    &:active {
      opacity: 0.6;
    }
  }
  
  &__tips {
    font-size: 12px;
    margin-top: 4px;
    color: $text-auxiliary-light;
    
    [data-theme='dark'] & {
      color: $text-auxiliary-dark;
    }
  }
}
</style>
