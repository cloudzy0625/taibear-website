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

// 圖譜檢視無結果提示：圖譜區無節點且搜尋／篩選作用中時顯示（不改動圖譜腳本）。
(() => {
    const hint = document.getElementById('merged-graph-hint');
    const graph = document.getElementById('graph');
    const view = document.getElementById('view-graph');
    const q = document.getElementById('q');
    if (!hint || !graph || !view || !q) return;
    const region = document.getElementById('f-region');
    const vendor = document.getElementById('f-vendor');
    const filterActive = () =>
        (q.value || '').trim() !== '' ||
        (region && region.value !== '') ||
        (vendor && vendor.value !== '');
    const update = () => {
        const noNodes = graph.querySelectorAll('g.node').length === 0;
        hint.hidden = !(!view.hidden && noNodes && filterActive());
    };
    new MutationObserver(update).observe(graph, { childList: true, subtree: true });
    new MutationObserver(update).observe(view, { attributes: true, attributeFilter: ['hidden'] });
    q.addEventListener('input', () => setTimeout(update, 250));
    if (region) region.addEventListener('change', () => setTimeout(update, 60));
    if (vendor) vendor.addEventListener('change', () => setTimeout(update, 60));
    update();
})();
