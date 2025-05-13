<template>
  <div class="search-container">
    <div
        class="search-icon"
        :class="{ hidden: isActive || query }"
        @click="activateSearch"
    >
      <svg-icon type="mdi" :path="mdiMagnify"></svg-icon>
    </div>
    <div
        class="search-box"
        :class="{ active: isActive || query, expanded: isActive || query }"
    >
      <input
          ref="searchInput"
          v-model="query"
          type="text"
          maxlength="50"
          placeholder="搜索..."
          @focus="isActive = true"
          @blur="handleBlur"
          @keyup.enter="performSearch"
          @keydown="handleKeyDown"
      />
      <div class="character-animation-container">
        <transition-group name="fall">
          <span
              v-for="(char, index) in animatedChars"
              :key="char.id"
              class="falling-char"
              :style="char.style"
              :id="index"
          >
            {{ char.value }}
          </span>
        </transition-group>
      </div>
    </div>

    <div
        v-if="showSuggestions && suggestions.length > 0"
        class="suggestions-box"
    >
      <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="suggestion-item"
          :class="{ highlighted: index === highlightedIndex }"
          @mousedown="selectSuggestion(suggestion)"
          @mouseenter="highlightedIndex = index"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import {nextTick, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {debounce} from 'lodash-es'
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMagnify } from '@mdi/js';

const router = useRouter()
const searchInput = ref(null)

const query = ref('')
const isActive = ref(false)
const suggestions = ref([])
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const animatedChars = ref([])
let charId = 0

const activateSearch = () => {
  isActive.value = true
  nextTick(() => {
    searchInput.value.focus()
  })
}

const fetchSuggestions = async (searchTerm) => {
  if (!searchTerm) {
    suggestions.value = []
    return
  }

  await new Promise(resolve => setTimeout(resolve, 50))

  const mockResults = [
    `${searchTerm}结果1`,
    `${searchTerm}结果2`,
    `${searchTerm}测试3`,
    `相关${searchTerm}4`,
    `其他${searchTerm}5`
  ].filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))

  suggestions.value = mockResults.slice(0, 10)
}

const debouncedSearch = debounce(fetchSuggestions, 300)

watch(query, (newVal, oldVal) => {
  showSuggestions.value = true
  debouncedSearch(newVal)

  if (newVal.length > oldVal.length) {
    // 添加字符
    const addedChars = newVal.slice(oldVal.length)
    const position = oldVal.length
    animateCharacter(addedChars, position)
  } else if (newVal.length < oldVal.length) {
    // 删除字符
    const removedPosition = newVal.length
    animateCharacter(oldVal[removedPosition], removedPosition)
  }
})
function getWidth(text) {
  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.position = 'absolute'
  span.style.whiteSpace = 'nowrap'
  // 获取输入框的当前字体样式
  const inputStyle = window.getComputedStyle(searchInput.value)
  span.style.font = `${inputStyle.fontWeight} ${inputStyle.fontSize} ${inputStyle.fontFamily}`
  span.textContent = text
  document.body.appendChild(span)
  const width = span.offsetWidth
  document.body.removeChild(span)
  return width
}
const animateCharacter = (char, position) => {
  // 计算当前字符的累计宽度
  let totalWidth = 0;
  for (let i = 0; i < position; i++) {
    const prevChar = query.value[i];
    totalWidth += getWidth(prevChar);
  }
  const newChar = {
    id: charId++,
    value: char,
    style: {
      left: `${totalWidth + 22}px`,
      opacity: 0,
    }
  }
  animatedChars.value.push(newChar)

  // 确保DOM更新后触发动画
  nextTick(() => {
    const element = document.querySelector(`.falling-char[key="${newChar.id}"]`)
    if (element) {
      element.style.animation = 'fall 1s ease-out forwards'
    }
  })

  setTimeout(() => {
    animatedChars.value = animatedChars.value.filter(c => c.id !== newChar.id);
  }, 700);
}

const performSearch = () => {
  if (query.value.trim()) {
    router.push({ path: '/search', query: { q: query.value } })
    showSuggestions.value = false
  }
}

const selectSuggestion = (suggestion) => {
  query.value = suggestion
  performSearch()
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
    isActive.value = false; // 折叠搜索框
    query.value = ''; // 清空输入框
    highlightedIndex.value = -1;
  }, 100);
};

const handleKeyDown = (e) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, suggestions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
  } else if (e.key === 'Enter' && highlightedIndex.value >= 0) {
    e.preventDefault()
    selectSuggestion(suggestions.value[highlightedIndex.value])
  }
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  margin: 5px auto;
  display: flex;
  align-items: center;
}

.search-icon {
  width: 50px;
  height: 50px;
  background: #7a5ae0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  right: 0;
  z-index: 2;
}

.search-icon.hidden {
  opacity: 0;
  pointer-events: none;
}

.search-icon svg {
  transition: transform 0.3s ease;
}

.search-icon:hover svg {
  transform: scale(1.1);
}

.search-box {
  position: relative;
  width: 40px;
  height: 50px;
  border-radius: 50px;
  background: transparent;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  overflow: hidden;
  z-index: 105;
}

.search-box.expanded {
  width: 100%;
}

.search-box.active {
  background: #24222A;
  border: 1px solid #7a5ae0;
}

.search-box input {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-box.expanded input {
  opacity: 1;
  padding: 0 50px 0 20px;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.character-animation-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.falling-char {
  position: absolute;
  top: 10px;
  color: #7a5ae0;
  font-size: 16px;
  will-change: transform, opacity;
}

/* 动画定义 */
.fall-enter-active {
  animation: fall 0.8s ease-out forwards;
}
.fall-leave-active {
  opacity: 0;
}

@keyframes fall {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(60px) scale(0.5);
    opacity: 0;
  }
}

.suggestions-box {
  position: absolute;
  top: 25px;
  padding-top: 25px;
  width: 100%;
  background: #24222A;
  border: 1px solid #7a5ae0;
  border-top: none;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  transition: height 0.1s ease;
  z-index: 100;
  height: auto; /* 根据内容自动调整高度 */
}

.suggestion-item {
  height: 45px;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  border-radius: 20px;
  margin: 5px;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(122, 90, 224, 0.3);
}

.suggestion-item.highlighted {
  background: rgba(122, 90, 224, 0.5);
}
</style>