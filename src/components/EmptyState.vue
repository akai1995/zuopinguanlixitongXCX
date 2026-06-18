<template>
  <view class="empty-state">
    <text class="empty-state__icon">{{ icon }}</text>
    <text class="empty-state__text">{{ text }}</text>
    <text v-if="subText" class="empty-state__subtext">{{ subText }}</text>
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  text?: string
  subText?: string
}>(), {
  icon: '📭',
  text: '暂无内容',
  subText: ''
})
</script>

<style lang="scss" scoped>
.empty-state {
  @include flex-center;
  flex-direction: column;
  padding: 48px 0;
  
  &__icon {
    font-size: 48px;
    margin-bottom: $spacing-md;
    opacity: 0.3;
  }
  
  &__text {
    @include font-caption;
    margin-bottom: 4px;
  }
  
  &__subtext {
    @include font-mini;
  }
}
</style>