import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePopupStore = defineStore('popup', () => {
  const filterVisible = ref(false)
  const filterItems = ref<{ label: string; value: string }[]>([])
  const filterSelected = ref<string[]>([])
  let filterCallback: ((selected: string[]) => void) | null = null
  
  const tabBarVisible = ref(true)

  function openFilter(items: { label: string; value: string }[], selected: string[], callback: (selected: string[]) => void) {
    filterItems.value = items
    filterSelected.value = [...selected]
    filterCallback = callback
    filterVisible.value = true
  }

  function closeFilter() {
    filterVisible.value = false
  }

  function confirmFilter() {
    if (filterCallback) {
      filterCallback([...filterSelected.value])
    }
    filterVisible.value = false
  }

  function toggleFilter(value: string) {
    const idx = filterSelected.value.indexOf(value)
    if (idx > -1) {
      filterSelected.value.splice(idx, 1)
    } else {
      filterSelected.value.push(value)
    }
  }

  function isFilterSelected(value: string) {
    return filterSelected.value.includes(value)
  }

  function showTabBar() {
    tabBarVisible.value = true
  }

  function hideTabBar() {
    tabBarVisible.value = false
  }

  return {
    filterVisible,
    filterItems,
    filterSelected,
    tabBarVisible,
    openFilter,
    closeFilter,
    confirmFilter,
    toggleFilter,
    isFilterSelected,
    showTabBar,
    hideTabBar
  }
})
