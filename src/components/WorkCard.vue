<template>
  <view class="work-card" @tap="$emit('tap')">
    <view class="work-card__image-wrap">
      <image
        v-if="coverImage"
        class="work-card__image"
        :src="coverImage"
        mode="aspectFill"
      />
      <view v-else class="work-card__placeholder">
        <text class="work-card__placeholder-icon">&#x1F3A8;</text>
      </view>
    </view>
    <view class="work-card__info">
      <text class="work-card__title">{{ title }}</text>
      <text v-if="description" class="work-card__desc">{{ description }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  coverImage: string
  description?: string
  category: string
  date: string
}>()

defineEmits<{
  (e: 'tap'): void
}>()
</script>

<style lang="scss" scoped>
.work-card {
  @include card;
  padding: 0;
  overflow: hidden;
  
  &__image-wrap {
    width: 100%;
    padding-bottom: 56.25%; // 16:9
    position: relative;
    overflow: hidden;
  }
  
  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  &__placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include flex-center;
    @include bg-control;
    
    &-icon {
      font-size: 36px;
      opacity: 0.4;
    }
  }
  
  &__info {
    padding: $spacing-sm $spacing-md $spacing-md;
  }
  
  &__title {
    font-size: $font-size-body;
    font-weight: $font-weight-medium;
    @include text-primary;
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  
  &__desc {
    @include font-caption;
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
  }
}
</style>