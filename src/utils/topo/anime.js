import anime from 'animejs';

//显隐、旋转、闪烁、滑动特效,display:block、none
export function animate(targets, display, rotate, scale, translates, duration, autoplay, loop) {
    let animate = anime({
        targets: targets,
        display: display,
        rotate: rotate,
        scale: scale,
        keyframes: translates,
        duration: duration, // 动作执行时间
        autoplay: autoplay, // 是否自动开启动作
        easing: 'linear',
        loop: loop, // 动作是否开启循环
    });
    return animate;
}

//获取当前特效的实例
export function getAnimate() {
    return anime;
}
