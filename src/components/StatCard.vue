<template>
  <view class="stat-card" :class="[`stat-card--${type}`]" @tap="$emit('tap')">
    <view class="stat-card__content">
      <view class="stat-card__label">
        <text class="stat-card__label-text">{{ label }}</text>
      </view>
      <view class="stat-card__value-row">
        <text class="stat-card__value">{{ value }}</text>
        <view v-if="trend !== undefined" class="stat-card__trend">
          <text :class="['stat-card__trend-text', trend >= 0 ? 'is-up' : 'is-down']">
            {{ trend >= 0 ? '+' : '' }}{{ trend }}
          </text>
        </view>
      </view>
      <text v-if="subLabel" class="stat-card__sublabel">{{ subLabel }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  subLabel?: string
  trend?: number
  type?: 'primary' | 'success' | 'warning' | 'danger'
}>()

defineEmits<{
  (e: 'tap'): void
}>()
</script>

<style lang="scss" scoped>
.stat-card {
  @include card;
  padding: 0;
  position: relative;
  overflow: hidden;
  
  &--primary {
    background: linear-gradient(135deg, #1962EC 0%, #4F8AF7 100%);
    
    .stat-card__label-text {
      color: rgba(255, 255, 255, 0.85) !important;
    }
    
    .stat-card__value {
      color: #FFFFFF;
    }
    
    .stat-card__trend-text {
      color: rgba(255, 255, 255, 0.75);
    }
    
    [data-theme='dark'] & {
      background: linear-gradient(135deg, #4F8AF7 0%, #1962EC 100%);
      
      .stat-card__label-text {
        color: rgba(255, 255, 255, 0.85) !important;
      }
    }
  }
  
  &--success {
    background: linear-gradient(135deg, #1BCB8B 0%, #2ED696 100%);
    
    .stat-card__label-text {
      color: rgba(255, 255, 255, 0.85) !important;
    }
    
    .stat-card__value {
      color: #FFFFFF;
    }
    
    .stat-card__trend-text {
      color: rgba(255, 255, 255, 0.75);
    }
    
    [data-theme='dark'] & {
      background: linear-gradient(135deg, #2ED696 0%, #1BCB8B 100%);
      
      .stat-card__label-text {
        color: rgba(255, 255, 255, 0.85) !important;
      }
    }
  }
  
  &--warning {
    background: linear-gradient(135deg, #FC9131 0%, #FFA94D 100%);
    
    .stat-card__label-text {
      color: rgba(255, 255, 255, 0.85) !important;
    }
    
    .stat-card__value {
      color: #FFFFFF;
    }
    
    .stat-card__trend-text {
      color: rgba(255, 255, 255, 0.75);
    }
    
    [data-theme='dark'] & {
      background: linear-gradient(135deg, #FFA94D 0%, #FC9131 100%);
      
      .stat-card__label-text {
        color: rgba(255, 255, 255, 0.85) !important;
      }
    }
  }
  
  &--danger {
    background: linear-gradient(135deg, #F45F5F 0%, #FF7B7B 100%);
    
    .stat-card__label-text {
      color: rgba(255, 255, 255, 0.85) !important;
    }
    
    .stat-card__value {
      color: #FFFFFF;
    }
    
    .stat-card__trend-text {
      color: rgba(255, 255, 255, 0.75);
    }
    
    [data-theme='dark'] & {
      background: linear-gradient(135deg, #FF7B7B 0%, #F45F5F 100%);
      
      .stat-card__label-text {
        color: rgba(255, 255, 255, 0.85) !important;
      }
    }
  }
  
  &__content {
    padding: $spacing-md $spacing-lg;
  }
  
  &__label {
    margin-bottom: $spacing-sm;
    
    &-text {
      font-size: $font-size-body;
      font-weight: $font-weight-regular;
      line-height: $line-height;
      color: $text-secondary-light;
      
      [data-theme='dark'] & {
        color: $text-secondary-dark;
      }
    }
  }
  
  &__value-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  
  &__trend {
    @include flex-center;
    
    &-text {
      font-size: $font-size-caption;
      font-weight: $font-weight-medium;
    }
  }
  
  &__value {
    font-size: 24px;
    font-weight: $font-weight-bold;
    line-height: 1.2;
    color: $text-title-light;
    
    [data-theme='dark'] & {
      color: $text-title-dark;
    }
  }
  
  &__sublabel {
    margin-top: 4px;
    font-size: $font-size-caption;
    font-weight: $font-weight-regular;
    line-height: $line-height;
    color: $text-secondary-light;
    
    [data-theme='dark'] & {
      color: $text-secondary-dark;
    }
  }
}
</style>