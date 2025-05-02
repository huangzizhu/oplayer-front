<template>
  <div class="calendar-container">
    <!-- 当前日期日历 -->
    <div class="calendar-section current-date">
      <div class="calendar-header">
        <div class="calendar-year">{{ currentYear }}</div>
        <div class="calendar-month">{{ currentMonth }}月</div>
      </div>
      <div class="calendar-day">{{ currentDay }}</div>
      <div class="calendar-label">今天</div>
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 生日天数计算 -->
    <div class="calendar-section life-days">
      <div class="calendar-header">
        <div class="calendar-year">{{ birthYear }}</div>
        <div class="calendar-month">{{ birthMonth }}月{{ birthDay }}日</div>
      </div>
      <div class="calendar-day">{{ lifeDays }}</div>
      <div class="calendar-label">已诞生</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, onMounted,watch } from 'vue';

const props = defineProps({
  birthday: {
    type: String,
    required: true
  }
});

// 当前日期数据
const currentYear = ref('');
const currentMonth = ref('');
const currentDay = ref('');

// 生日数据
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const lifeDays = ref(0);

// 计算天数差
const calculateLifeDays = () => {
  const birthDate = new Date(props.birthday);
  const today = new Date();
  const diffTime = today - birthDate;
  lifeDays.value = Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// 初始化生日数据
const initBirthData = () => {
  const birthDate = new Date(props.birthday);
  birthYear.value = birthDate.getFullYear();
  birthMonth.value = birthDate.getMonth() + 1;
  birthDay.value = birthDate.getDate();
};

// 更新当前日期
const updateCalendar = () => {
  const now = new Date();
  currentYear.value = now.getFullYear();
  currentMonth.value = now.getMonth() + 1;
  currentDay.value = now.getDate();
};
watch(() => props.birthday, (newVal, oldVal) => {
  updateCalendar();
  initBirthData();
  calculateLifeDays();
});
</script>

<style scoped>
.calendar-container {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(50, 50, 50, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  color: white;
  font-family: Arial, sans-serif;
}

.calendar-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.divider {
  width: 1px;
  height: 80%;
  color: white;
  background-color: white;
  position: absolute;
  left: 50%;
  top: 10%;
}

.calendar-header {
  text-align: center;
  margin-bottom: 10px;
}

.calendar-year {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.calendar-month {
  font-size: 16px;
  font-weight: 500;
}

.calendar-day {
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  color: var(--primary-color, #E6649F);
  margin: 5px 0;
}

.calendar-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .calendar-day {
    font-size: 28px;
  }

  .calendar-month {
    font-size: 14px;
  }

  .calendar-label {
    font-size: 11px;
  }
}
</style>