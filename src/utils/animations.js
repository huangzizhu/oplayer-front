import gsap from 'gsap'

export const animations = {
    fadeIn: (element, duration = 1, delay = 0) => {
        return gsap.to(element, {
            opacity: 1,
            duration,
            delay,
            ease: 'power2.inOut'
        });
    },

    fadeOut: (element, duration = 1, delay = 0) => {
        return gsap.to(element, {
            opacity: 0,
            duration,
            delay,
            ease: 'power2.inOut'
        });
    },

    slideIn: (element, direction = 'left', distance = 100, duration = 1, delay = 0) => {
        const from = {};
        if (direction === 'left') from.x = -distance;
        if (direction === 'right') from.x = distance;
        if (direction === 'top') from.y = -distance;
        if (direction === 'bottom') from.y = distance;

        return gsap.fromTo(element,
            { ...from, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration, delay, ease: 'power2.out' }
        );
    }
};

export default animations;