<template>
    <div class="settings-container" v-show="isVisible" @click.self="close">
        <div class="settings-card" :class="{ 'active': isVisible }">
            <header class="settings-header">
                <h2>设置</h2>
                <!-- <button class="close-button" @click="close">
                    <img src="../../assets/images/settings.svg" alt="关闭" width="24" height="24" />
                </button> -->
            </header>
            <div class="settings-content">
                <!-- 设置选项卡 - OSU! lazer 风格左对齐 -->
                <div class="settings-tabs">
                    <div v-for="tab in tabs" :key="tab.id" class="tab-item">
                        <button @click="selectMainTab(tab.id)" :class="{
                            'active': currentTab === tab.id ||
                                (tab.submenus && tab.submenus.some(sub => sub.id === currentSubTab))
                        }">
                            {{ tab.name }}
                            <span class="submenu-indicator" v-if="tab.submenus && tab.submenus.length">
                                {{ isSubmenuOpen(tab.id) ? '▼' : '▶' }}
                            </span>
                        </button>

                        <!-- 二级菜单 -->
                        <div class="submenu" v-if="tab.submenus && isSubmenuOpen(tab.id)">
                            <button v-for="submenu in tab.submenus" :key="submenu.id"
                                @click="selectSubTab(tab.id, submenu.id)"
                                :class="{ 'active': currentSubTab === submenu.id }">
                                {{ submenu.name }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 设置内容 -->
                <div class="tab-content">
                    <!-- 常规设置 -->
                    <div v-if="currentTab === 'general'" class="settings-section">
                        <h3>常规设置</h3>
                        <div class="setting-item">
                            <span>背景模糊效果</span>
                            <input type="checkbox" class="toggle-switch" />
                        </div>
                        <div class="setting-item">
                            <span>背景亮度</span>
                            <input type="range" min="0" max="100" value="60" />
                        </div>
                    </div>

                    <!-- 音频设置 -->
                    <div v-if="currentTab === 'audio'" class="settings-section">
                        <h3>音频设置</h3>
                        <div class="setting-item">
                            <span>主音量</span>
                            <input type="range" min="0" max="100" value="80" />
                        </div>
                        <div class="setting-item">
                            <span>效果音</span>
                            <input type="range" min="0" max="100" value="70" />
                        </div>
                    </div>

                    <!-- 音频输入设置 (子菜单) -->
                    <div v-if="currentSubTab === 'audio-input'" class="settings-section">
                        <h3>音频输入设置</h3>
                        <div class="setting-item">
                            <span>麦克风音量</span>
                            <input type="range" min="0" max="100" value="75" />
                        </div>
                        <div class="setting-item">
                            <span>降噪</span>
                            <input type="checkbox" class="toggle-switch" checked />
                        </div>
                    </div>

                    <!-- 音频输出设置 (子菜单) -->
                    <div v-if="currentSubTab === 'audio-output'" class="settings-section">
                        <h3>音频输出设置</h3>
                        <div class="setting-item">
                            <span>输出设备</span>
                            <select class="select-device">
                                <option>默认设备</option>
                                <option>扬声器</option>
                                <option>耳机</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <span>音效平衡</span>
                            <input type="range" min="0" max="100" value="50" />
                        </div>
                    </div>

                    <!-- 界面设置 -->
                    <div v-if="currentTab === 'interface'" class="settings-section">
                        <h3>界面设置</h3>
                        <div class="setting-item">
                            <span>界面缩放</span>
                            <input type="range" min="80" max="120" value="100" />
                        </div>
                        <div class="setting-item">
                            <span>动画效果</span>
                            <input type="checkbox" class="toggle-switch" checked />
                        </div>
                    </div>

                    <!-- 主题设置 (子菜单) -->
                    <div v-if="currentSubTab === 'interface-theme'" class="settings-section">
                        <h3>主题设置</h3>
                        <div class="setting-item">
                            <span>主题颜色</span>
                            <div class="color-options">
                                <span class="color-option pink active"></span>
                                <span class="color-option blue"></span>
                                <span class="color-option green"></span>
                                <span class="color-option purple"></span>
                            </div>
                        </div>
                        <div class="setting-item">
                            <span>暗色模式</span>
                            <input type="checkbox" class="toggle-switch" checked />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
    isVisible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};

// 设置选项卡(带子菜单)
const tabs = [
    { id: 'general', name: '常规' },
    {
        id: 'audio',
        name: '音频',
        submenus: [
            { id: 'audio-input', name: '输入设置' },
            { id: 'audio-output', name: '输出设置' }
        ]
    },
    {
        id: 'interface',
        name: '界面',
        submenus: [
            { id: 'interface-theme', name: '主题' }
        ]
    }
];

const currentTab = ref('general');
const currentSubTab = ref('');
const openSubmenus = ref([]);

// 选择主菜单
const selectMainTab = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);

    // 如果有子菜单，则切换子菜单的显示状态
    if (tab && tab.submenus && tab.submenus.length) {
        toggleSubmenu(tabId);
    } else {
        // 没有子菜单，直接切换到该选项卡
        currentTab.value = tabId;
        currentSubTab.value = '';
    }
};

// 选择子菜单
const selectSubTab = (mainTabId, subTabId) => {
    currentTab.value = ''; // 清除主选项卡的选择
    currentSubTab.value = subTabId;
};

// 切换子菜单的显示状态
const toggleSubmenu = (tabId) => {
    if (openSubmenus.value.includes(tabId)) {
        // 如果已经打开，则关闭
        openSubmenus.value = openSubmenus.value.filter(id => id !== tabId);

        // 如果当前选中的是该菜单的子菜单，则切换到主菜单
        const tab = tabs.find(t => t.id === tabId);
        if (tab && tab.submenus && tab.submenus.some(sub => sub.id === currentSubTab.value)) {
            currentSubTab.value = '';
            currentTab.value = tabId;
        }
    } else {
        // 如果未打开，则打开
        openSubmenus.value.push(tabId);
    }
};

// 判断子菜单是否打开
const isSubmenuOpen = (tabId) => {
    return openSubmenus.value.includes(tabId);
};
</script>

<style scoped>
.settings-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 120;
    transition: all 0.3s ease;
}

.settings-card {
    width: 100%;
    max-width: 100%;
    height: 80vh;
    margin-top: 50px;
    margin-right: 40%;
    background-color: rgba(35, 35, 35, 1);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    transform: translateY(20px);
    opacity: 0;
    animation: slideUp 0.3s forwards;
    border: 0, 0, 1px,  solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-self: flex-start;
}

.settings-card.active {
    opacity: 1;
    transform: translateY(0);
}

.settings-header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(20, 20, 20, 0.8);
}

.settings-header h2 {
    margin: 0;
    color: white;
    font-size: 1.4rem;
    font-weight: 500;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.close-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.close-button img {
    filter: invert(1);
}

.settings-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    color: white;
}

.settings-tabs {
    width: 210px;
    padding: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(30, 30, 30, 0.8);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.tab-item {
    width: 100%;
}

.settings-tabs button {
    display: block;
    width: 100%;
    padding: 14px 20px;
    text-align: left;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
    position: relative;
}

.settings-tabs button:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
}

.settings-tabs button.active {
    background: rgba(255, 65, 105, 0.2);
    color: white;
    border-left: 4px solid #ff4169;
}

/* 子菜单样式 */
.submenu {
    background: rgba(20, 20, 20, 0.5);
    overflow: hidden;
    animation: expandSubmenu 0.3s forwards;
}

.submenu button {
    padding-left: 35px;
    font-size: 0.95rem;
}

.submenu-indicator {
    position: absolute;
    right: 15px;
    font-size: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
}

.tab-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.settings-section {
    margin-bottom: 30px;
}

.settings-section h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.2rem;
    color: white;
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item span {
    font-size: 0.95rem;
}

input[type="range"] {
    width: 200px;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ff4169;
    cursor: pointer;
}

.toggle-switch {
    position: relative;
    width: 50px;
    height: 24px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    transition: 0.3s;
    cursor: pointer;
    outline: none;
}

.toggle-switch:checked {
    background: #ff4169;
}

.toggle-switch:before {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    top: 1px;
    left: 1px;
    background: white;
    transition: 0.3s;
}

.toggle-switch:checked:before {
    left: 27px;
}

/* 下拉选择样式 */
.select-device {
    background: rgba(40, 40, 40, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    width: 200px;
    outline: none;
}

.select-device:focus {
    border-color: #ff4169;
}

/* 主题颜色选择器 */
.color-options {
    display: flex;
    gap: 10px;
}

.color-option {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;
    border: 2px solid transparent;
}

.color-option:hover {
    transform: scale(1.1);
}

.color-option.active {
    border-color: white;
}

.color-option.pink {
    background: #ff4169;
}

.color-option.blue {
    background: #41a6ff;
}

.color-option.green {
    background: #41ff7c;
}

.color-option.purple {
    background: #a241ff;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes expandSubmenu {
    from {
        max-height: 0;
        opacity: 0;
    }

    to {
        max-height: 200px;
        opacity: 1;
    }
}
</style>