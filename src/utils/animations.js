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

    // // 先清除已有的动画
    // gsap.killTweensOf(element);

    gsap.to(element, {
        backgroundColor: "rgba(255, 65, 105, 0.7)",
        boxShadow: "0 0 15px rgba(255, 65, 105, 0.7)",
        duration: 0.2,
    });
};

// 移除高亮效果
const removeHighlight = (element) => {
    if (!element) return;

    // // 先清除已有的动画
    // gsap.killTweensOf(element);

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
    // gsap.killTweensOf(element, { backgroundColor: true });

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
    // gsap.killTweensOf(element, { backgroundColor: true });

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
    gsap.to(element, {
        boxShadow: "0 0px 0px rgba(0, 0, 0, 0.9)",
        duration: 0.1,
        ease: "power1.out",
    });

};
const hoverOverlay = (element) => {
    if (!element) return;

    // 先清除已有的悬停动画
    gsap.killTweensOf(element, { backgroundColor: true });

    gsap.to(element, {
        boxShadow: "0 5px 80px rgba(0, 0, 0, 0.8)",
        duration: 0.4,
        ease: "power1.out"
    });
};

// 背景相关动画
// 背景淡入效果
const fadeInBackground = (element) => {
    if (!element) return;

    gsap.fromTo(element,
        { opacity: 0 },
        { opacity: 1, duration: 1, }
    );
};

// 背景切换效果
const transitionBackground = (element, callback) => {
    if (!element) return;

    gsap.to(element, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            if (callback) callback();

            gsap.to(element, {
                opacity: 1,
                duration: 0.5,
                // ease: "power2.out"
            });
        }
    });
};

// 为背景添加脉动呼吸效果
const pulseBackground = (element) => {
    if (!element) return;

    gsap.to(element, {
        scale: 1.00,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
};

// 粉饼菜单展开动画
const expandCircleMenu = (discElement, stripElement, callback) => {
    if (!discElement || !stripElement) return;

    const tl = gsap.timeline({
        onComplete: () => {
            if (callback) callback();
        }
    });

    // 条带展开
    tl.fromTo(stripElement,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.2, ease: "power2.out" }
    );

    // 粉饼缩小并移到左侧
    tl.to(discElement, {
        scale: 0.7,
        x: -window.innerWidth * 0.4,
        duration: 0.2,
        ease: "power2.out"
    }, "-=0.3");

    return tl;
};

// 粉饼菜单折叠动画
const collapseCircleMenu = (discElement, stripElement, callback) => {
    if (!discElement || !stripElement) return;

    const tl = gsap.timeline({
        onComplete: () => {
            if (callback) callback();
        }
    });

    // 粉饼回到中心
    tl.to(discElement, {
        scale: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.inOut"
    });

    // 收起条带
    tl.to(stripElement, {
        scaleX: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
    }, "-=0.3");

    return tl;
};

// 菜单卡片悬停效果
const menuCardHover = (cardElement, siblingElements, side) => {
    if (!cardElement) return;

    // 卡片扩展
    gsap.to(cardElement, {
        width: '200px',
        duration: 0.3,
        ease: "power2.out"
    });

    // 处理其他卡片
    if (siblingElements && siblingElements.length) {
        siblingElements.forEach(el => {
            gsap.to(el, {
                x: side === 'left' ? -20 : 20,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }
};

// 菜单卡片图标跳动效果
const iconBounce = (iconElement) => {
    if (!iconElement) return;

    gsap.timeline()
        .to(iconElement, {
            scale: 1.2,
            duration: 0.2,
            ease: "power1.out"
        })
        .to(iconElement, {
            scale: 1,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)"
        });
};

// 菜单项淡出动画（进入页面时）
const menuItemsFadeOut = (targetItem, otherItems, direction) => {
    if (!targetItem || !otherItems) return;

    const tl = gsap.timeline();

    // 点击的项目放大并淡出
    tl.to(targetItem, {
        scale: 1.2,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
    });

    // 其他项目按方向移出
    otherItems.forEach(item => {
        tl.to(item, {
            x: direction === 'left' ? -100 : 100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        }, "-=0.25");
    });

    return tl;
};

export default {
    //导航栏
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

    //背景
    fadeInBackground,
    transitionBackground,
    pulseBackground,

    // 粉饼菜单
    expandCircleMenu,
    collapseCircleMenu,
    menuCardHover,
    iconBounce,
    menuItemsFadeOut

};