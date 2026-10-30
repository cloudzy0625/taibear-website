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

// 搜尋／篩選無結果提示：監看圖譜的計數與卡片容器，0 筆時顯示提示（不改動圖譜腳本）。
(() => {
    const hint = document.getElementById('merged-empty-hint');
    const count = document.getElementById('list-count');
    const cards = document.getElementById('cards');
    if (!hint || !count || !cards) return;
    const update = () => {
        const m = /(\d+)\s*\/\s*(\d+)/.exec(count.textContent || '');
        const zero = m ? parseInt(m[1], 10) === 0 : cards.children.length === 0;
        hint.hidden = !zero;
    };
    new MutationObserver(update).observe(count, { childList: true, characterData: true, subtree: true });
    new MutationObserver(update).observe(cards, { childList: true });
    update();
})();
