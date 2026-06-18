<template>
  <view v-if="visible" class="modal-root">
    <view class="modal-mask" @tap="onMaskTap" />
    <view :class="['modal-container', `modal-container--${size}`]">
      <!-- 标题栏 -->
      <view v-if="title" class="modal-header">
        <text class="modal-header__title">{{ title }}</text>
        <text v-if="showClose" class="modal-header__close" @tap="onClose">&#x2715;</text>
      </view>

      <!-- 内容区 -->
      <scroll-view scroll-y class="modal-body" :show-scrollbar="false">
        <slot />
      </scroll-view>

      <!-- 底部按钮区 -->
      <view v-if="$slots.footer || showFooter" class="modal-footer">
        <slot name="footer">
          <button class="modal-footer__btn modal-footer__btn--cancel" @tap="onCancel">
            {{ cancelText }}
          </button>
          <button class="modal-footer__btn modal-footer__btn--confirm" @tap="onConfirm">
            {{ confirmText }}
          </button>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title?: string
  size?: 'medium' | 'large'
  showClose?: boolean
  showFooter?: boolean
  cancelText?: string
  confirmText?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onMaskTap() {
  emit('close')
}

function onClose() {
  emit('close')
}

function onCancel() {
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.modal-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  @include flex-center;
  animation: modalFadeIn $transition-modal;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 300px;
  max-height: 80vh;
  @include card;
  border-radius: $radius-card;
  display: flex;
  flex-direction: column;
  animation: modalScaleIn $transition-modal;
  
  &--large {
    width: 340px;
  }
}

.modal-header {
  @include flex-between;
  padding: 0 0 $spacing-md;
  @include border-bottom;
  
  &__title {
    @include font-card-title;
  }
  
  &__close {
    @include flex-center;
    width: 28px;
    height: 28px;
    border-radius: $radius-round;
    @include bg-control;
    font-size: $font-size-body;
    @include text-weak;
  }
}

.modal-body {
  flex: 1;
  padding: $spacing-md 0;
  overflow-y: auto;
}

.modal-footer {
  @include flex-center;
  gap: $spacing-md;
  padding-top: $spacing-md;
  @include border-top;
  
  &__btn {
    flex: 1;
    height: 40px;
    border-radius: $radius-btn;
    font-size: $font-size-body;
    font-weight: $font-weight-medium;
    
    &--cancel {
      background-color: transparent;
      @include border;
      @include text-secondary;
    }
    
    &--confirm {
      background-color: $color-primary;
      color: #FFFFFF;
      border: none;
    }
  }
}

.modal-footer {
  border-top: 1px solid $border-light;
  [data-theme='dark'] & {
    border-top-color: $border-dark;
  }
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalScaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>