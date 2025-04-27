<template>
  <!-- 信息展示区 -->
  <div class="info-container">
    <!-- 第一行 - 独立的两部分 -->
    <div class="info-row first-row">
      <!-- 每日一言 - 独立卡片 -->
      <div class="quote-card">
        <h3 class="card-title">每日一言</h3>
        <p class="quote-content">{{ dailyQuote || '生活就像音乐，有高潮也有低谷，但都是美妙的旋律。' }}</p>
      </div>

      <!-- 天气信息 - 独立卡片 -->
      <div class="weather-card">
        <h3 class="card-title">天气信息</h3>
        <div class="weather-content">
          <div class="weather-item">
            <span class="weather-label">地区</span>
            <span class="weather-value">{{ weatherData.city }}</span>
          </div>
          <div class="weather-item">
            <span class="weather-label">天气</span>
            <span class="weather-value">{{ weatherData.weather }}</span>
          </div>
          <div class="weather-item">
            <span class="weather-label">温度</span>
            <span class="weather-value">{{ weatherData.temperature }}℃</span>
          </div>
          <div class="weather-item">
            <span class="weather-label">风力</span>
            <span class="weather-value">{{ weatherData.wind_direction }}风{{ weatherData.wind_power }}级</span>
          </div>
        </div>
      </div>
    </div>
    <div class="new-row">
      <div class="clock-container">
        <UserClock></UserClock>
      </div>
      <div class="mini-calendar-container">
        <MiniCalender :birthday="birthDate"></MiniCalender>
      </div>
    </div>

    <!-- 第二行 - 统计数据 -->
    <div class="stats-row">
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-value">{{uid}}</div>
          <div class="stat-label">UID</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{playCount}}</div>
          <div class="stat-label">播放</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{duration}}</div>
          <div class="stat-label">时长</div>
        </div>
      </div>
    </div>

    <!-- 第三行 - 用户详细信息 -->
    <div class="detail-row">
      <div class="detail-grid">
        <div class="grid-item">
          <div class="detail-label">手机号码</div>
          <div class="detail-value">{{ phone }}</div>
        </div>
        <div class="grid-item">
          <div class="detail-label">性别</div>
          <div class="detail-value">
            <span v-if="gender === 1">男</span>
            <span v-else-if="gender ===2">女</span>
            <span v-else>未填写</span>
          </div>
        </div>
        <div class="grid-item">
          <div class="detail-label">出生日期</div>
          <div class="detail-value">
            <span v-if="birthDate">{{ formatDate(birthDate) }}</span>
            <span v-else>未填写</span>
          </div>
        </div>
        <div class="grid-item">
          <div class="detail-label">注册时间</div>
          <div class="detail-value">{{ formatDate(regTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from 'vue';
import UserClock from "@/components/view/user/profile/UserClock.vue"
import MiniCalender from "@/components/view/user/profile/MiniCalender.vue";
import {getIp, getRegion, getSays, getWeather} from "@/utils/api/OtherApi";
import {ElMessage} from "element-plus";

const props = defineProps({
  birthDate: {
    type: String,
    required: true
  },
  regTime: {
    type: String,
    required: true
  },
  gender: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  uid: {
    type: Number,
    required: true
  },
  playCount: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
});
// 每日一言
const dailyQuote = ref('');

// 天气数据
const weatherData = ref({
  province: '北京',
  city: '北京市',
  temperature: '24',
  weather: '多云',
  wind_direction: '东北',
  wind_power: '≤3',
  humidity: '50%',
  reportTime: new Date().toISOString()
});

// 格式化日期t
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 获取天气数据
const fetchWeather = async () => {
  try {
    let city;
    const ipResponse = await getIp();
    console.log(ipResponse);
    if(ipResponse.status !== 200) city = "北京";
    else city = ipResponse.data.data.city;
    const weatherResponse = await getWeather(city);
    console.log(weatherResponse.data);
    weatherData.value.city = weatherResponse.data.city;
    weatherData.value.temperature = weatherResponse.data.temperature;
    weatherData.value.wind_direction = weatherResponse.data.wind_direction;
    weatherData.value.wind_power = weatherResponse.data.wind_power;
    weatherData.value.weather = weatherResponse.data.weather;
  } catch (error) {
    console.error('获取天气数据失败:', error);
  }
};

// 获取每日一言
const fetchDailyQuote = async () => {
  try {
    const response = await getSays();
    dailyQuote.value = response.data;
  } catch (error) {
    console.error('获取每日一言失败:', error);
  }
};

onMounted(() => {
  // 获取天气数据
  fetchWeather();
  // 获取每日一言
  fetchDailyQuote();
});
</script>

<style scoped>
/* 信息展示区样式 */
.info-container {
  width: 100%;
  margin: auto auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 第一行样式 - 两个独立卡片 */
.first-row {
  display: flex;
  gap: 20px;
}

.quote-card, .weather-card{
  flex: 1;
  background: rgba(50, 50, 50, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}


.card-title {
  color: var(--primary-color);
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
}

.quote-content {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* 天气卡片样式 */
.weather-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.weather-item {
  display: flex;
  flex-direction: column;
}

.weather-label {
  color: var(--text-secondary);
  font-size: 12px;
  margin-bottom: 4px;
}

.weather-value {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.new-row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.mini-calendar-container{
  width: 35%;
}
.clock-container{
  width: 60%;
  background: rgba(50, 50, 50, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
/* 第二行样式 - 统计信息 */
.stats-row {
  background: rgba(50, 50, 50, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.stats-section {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 5px;
}

/* 第三行样式 - 详细信息网格 */
.detail-row {
  background: rgba(50, 50, 50, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
}

.grid-item {
  background: rgba(70, 70, 70, 0.3);
  border-radius: 8px;
  padding: 12px;
}

.detail-label {
  color: var(--text-secondary);
  font-size: 12px;
  margin-bottom: 5px;
}

.detail-value {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .first-row {
    flex-direction: column;
  }

  .weather-content {
    grid-template-columns: 1fr;
  }

  .stats-section {
    flex-direction: column;
    gap: 15px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>