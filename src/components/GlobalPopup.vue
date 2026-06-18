<template>
  <view v-if="visible" class="global-popup-mask" @tap="handleClose">
    <view class="global-popup" @tap.stop>
      <view class="global-popup__header">
        <text class="global-popup__title">{{ title }}</text>
        <view class="global-popup__close" @tap="handleClose">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </view>
      </view>
      <scroll-view scroll-y class="global-popup__content">
        <slot></slot>
      </scroll-view>
      <view class="global-popup__footer">
        <view class="global-popup__btn global-popup__btn--cancel" @tap="handleClose">
          <text>取消</text>
        </view>
        <view class="global-popup__btn global-popup__btn--confirm" @tap="handleConfirm">
          <text>确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

function handleClose() {
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.global-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 99999;
  pointer-events: auto;
}

.global-popup {
  width: 100%;
  max-width: 414px;
  background-color: $bg-card-light;
  border-radius: $radius-card $radius-card 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  [data-theme='dark'] & {
    background-color: $bg-card-dark;
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    border-bottom: 1px solid $border-light;
    flex-shrink: 0;
    
    [data-theme='dark'] & {
      border-bottom-color: $border-dark;
    }
  }
  
  &__title {
    font-size: $font-size-body;
    font-weight: $font-weight-medium;
    @include text-primary;
  }
  
  &__close {
    @include text-auxiliary;
    padding: $spacing-xs;
  }
  
  &__content {
    flex: 1;
    padding: $spacing-sm $spacing-lg;
  }
  
  &__footer {
    display: flex;
    gap: $spacing-sm;
    padding: $spacing-lg;
    border-top: 1px solid $border-light;
    flex-shrink: 0;
    
    [data-theme='dark'] & {
      border-top-color: $border-dark;
    }
  }
  
  &__btn {
    flex: 1;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-input;
    font-size: $font-size-body;
    font-weight: $font-weight-medium;
    
    &--cancel {
      @include bg-control;
      @include text-secondary;
    }
    
    &--confirm {
      background-color: $color-primary;
      color: #FFFFFF;
    }
  }
}
</style>
