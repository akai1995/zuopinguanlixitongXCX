<template>
  <view class="ai-card" @tap="$emit('tap')">
    <view class="ai-card__image-wrap">
      <image
        v-if="coverImage"
        class="ai-card__image"
        :src="coverImage"
        mode="aspectFill"
      />
      <view v-else class="ai-card__placeholder">
        <text class="ai-card__placeholder-icon">&#x1F4F7;</text>
      </view>
    </view>
    <view class="ai-card__info">
      <text class="ai-card__title">{{ title }}</text>
      <text v-if="prompt" class="ai-card__prompt">{{ prompt }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">

const props = defineProps<{
  title: string
  coverImage: string
  prompt: string
}>()

defineEmits<{
  (e: 'tap'): void
}>()
</script>

<style lang="scss" scoped>
.ai-card {
  @include card;
  padding: 0;
  overflow: hidden;
  
  &__image-wrap {
    width: 100%;
    padding-bottom: 56.25%;
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
    @include font-card-title;
    @include text-ellipsis;
    margin-bottom: 4px;
  }
  
  &__prompt {
    @include font-caption;
    @include text-ellipsis;
    margin-bottom: $spacing-sm;
    color: $text-auxiliary-light;

    [data-theme='dark'] & {
      color: $text-auxiliary-dark;
    }
  }
}
</style>