// 外殼高度追蹤獨立於圖譜腳本，供正文留白與工具列定位使用。
(() => {
    const header = document.querySelector('body > .header');
    if (!header) return;
    const updateHeaderHeight = () => {
        document.documentElement.style.setProperty(
            '--site-header-height', `${header.getBoundingClientRect().height}px`
        );
    };
    updateHeaderHeight();
    if ('ResizeObserver' in window) {
        new ResizeObserver(updateHeaderHeight).observe(header);
    } else {
        window.addEventListener('resize', updateHeaderHeight);
        window.addEventListener('scroll', updateHeaderHeight, { passive: true });
    }
    if (document.fonts) document.fonts.ready.then(updateHeaderHeight);
})();
