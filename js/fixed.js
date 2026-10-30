// 補上現站選單的無障礙狀態與 Escape 關閉行為。
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;
    const sync = () => {
        const open = links.classList.contains('active');
        toggle.querySelectorAll('span').forEach(span => span.classList.toggle('active', open));
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
    };
    new MutationObserver(sync).observe(links, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && links.classList.contains('active')) {
            links.classList.remove('active');
            toggle.querySelectorAll('span').forEach(span => span.classList.remove('active'));
            toggle.focus();
        }
    });
    sync();
});
