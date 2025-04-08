import gsap from 'gsap';

// 按钮点击效果
const buttonPress = (element) => {
    if (!element) return;

    // 确认gsap对象是否存在
    // console.log("GSAP in animations:", gsap);

    gsap.timeline()
        .to(element, {
            scale: 0.95,
            duration: 0.1,
            ease: "power1.in"
        })
        .to(element, {
            scale: 1,
            duration: 0.2,
            ease: "elastic.out(1, 0.5)"
        });
};

// 面板显示动画
const showPanel = (element) => {
    if (!element) return Promise.resolve();

    // 初始状态设置
    gsap.set(element, { opacity: 0, y: -20 });

    return gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
    });
};

const showPanelLeft = (element) => {
    if (!element) return Promise.resolve();

    // 初始状态设置
    gsap.set(element, { opacity: 0, x: -20 });

    return gsap.to(element, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out",
    });
};

const showPanelRight = (element) => {
    if (!element) return Promise.resolve();

    // 初始状态设置
    gsap.set(element, { opacity: 0, x: 20 });

    return gsap.to(element, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out",
    });
};

// 面板隐藏动画
const hidePanel = (element) => {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        gsap.to(element, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: resolve
        });
    });
};
const hidePanelLeft = (element) => {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        gsap.to(element, {
            opacity: 0,
            x: -20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: resolve
        });
    });
};

const hidePanelRight = (element) => {
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
        gsap.to(element, {
            opacity: 0,
            x: 20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: resolve
        });
    });
}

// 遮罩层显示动画
const showOverlay = (element) => {
    if (!element) return Promise.resolve();

    gsap.set(element, { opacity: 0 });
    gsap.to(element, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out"
    });
};

// 遮罩层隐藏动画
const hideOverlay = (element) => {
    if (!element) return Promise.resolve();

    gsap.to(element, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
    });
};

// OSU! Lazer风格的导航栏项目高亮效果
const highlightNavItem = (element) => {
    if (!element) return;

    // 先清除已有的动画
    gsap.killTweensOf(element);

    gsap.to(element, {
        backgroundColor: "rgba(255, 65, 105, 0.7)",
        boxShadow: "0 0 15px rgba(255, 65, 105, 0.7)",
        duration: 0.2,
    });
};

// 移除高亮效果
const removeHighlight = (element) => {
    if (!element) return;

    // 先清除已有的动画
    gsap.killTweensOf(element);

    gsap.to(element, {
        backgroundColor: "transparent",
        boxShadow: "none",
        duration: 0.3,
        ease: "power1.out"
    });
};

const hoverNavItem = (element) => {
    if (!element) return;

    // 先清除已有的悬停动画
    gsap.killTweensOf(element, { backgroundColor: true });

    gsap.to(element, {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        duration: 0.3,
        ease: "power1.out"
    });
};

// 鼠标离开时恢复原状
const leaveNavItem = (element, isActive) => {
    if (!element) return;

    // 如果元素已经激活，不执行动画返回原状
    if (isActive) return;

    // 先清除已有的离开动画
    gsap.killTweensOf(element, { backgroundColor: true });

    gsap.to(element, {
        backgroundColor: "transparent",
        duration: 0.3,
        ease: "power1.out"
    });
};

const leaveOverlay = (element) => {
    if (!element) return;
    // 先清除已有的离开动画
    gsap.killTweensOf(element, { backgroundColor: true });
    // 增加下阴影效果
    gsap.to(element, {
        boxShadow: "0 0px 0px rgba(0, 0, 0, 0.8)",
        duration: 0.3,
        ease: "power1.out",
    });

};
const hoverOverlay = (element) => {
    if (!element) return;

    // 先清除已有的悬停动画
    gsap.killTweensOf(element, { backgroundColor: true });

    gsap.to(element, {
        boxShadow: "0 4px 80px rgba(0, 0, 0, 0.8)",
        duration: 0.3,
        ease: "power1.out"
    });
}
export default {
    buttonPress,
    showPanel,
    hidePanel,
    showOverlay,
    hideOverlay,
    highlightNavItem,
    removeHighlight,
    showPanelLeft,
    showPanelRight,
    hoverNavItem,
    leaveNavItem,
    hidePanelLeft,
    hidePanelRight,
    hoverOverlay,
    leaveOverlay,
};