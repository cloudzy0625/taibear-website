(() => {
    'use strict';

    const container = document.getElementById('news-list');
    if (!container) return;

    const groups = [
        { region: 'taiwan', title: '臺灣資安' },
        { region: 'world', title: '國際資安' },
        { region: 'china', title: '中國相關' }
    ];
    const fields = ['date', 'region', 'title', 'summary', 'source_name', 'source_url', 'source_type'];
    const sourceTypes = ['官方', '媒體', '社群（X）'];

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function validRecord(record) {
        if (!record || !fields.every(field => typeof record[field] === 'string' && record[field].trim())) return false;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date)) return false;
        const date = new Date(`${record.date}T00:00:00Z`);
        if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== record.date) return false;
        if (!groups.some(group => group.region === record.region) || !sourceTypes.includes(record.source_type)) return false;
        try {
            return ['https:', 'http:'].includes(new URL(record.source_url).protocol);
        } catch {
            return false;
        }
    }

    function render(records) {
        const fragment = document.createDocumentFragment();
        groups.forEach(group => {
            const items = records.filter(record => record.region === group.region)
                .sort((a, b) => b.date.localeCompare(a.date));
            if (!items.length) return;

            const section = element('section', 'news-region');
            const heading = element('h2', '', group.title);
            heading.id = `news-region-${group.region}`;
            section.setAttribute('aria-labelledby', heading.id);
            const list = element('ul', 'news-list');

            items.forEach(record => {
                const item = element('li');
                const card = element('article', 'glass-panel news-card');
                const meta = element('p', 'item-meta');
                const time = element('time', '', record.date);
                time.dateTime = record.date;
                meta.append(time);
                const title = element('h3', '', record.title);
                const summary = element('p', 'item-summary', record.summary);
                const source = element('p', 'source-label');
                source.textContent = '原始來源：';
                const link = element('a', 'card-link', `${record.source_name}（${record.source_type}）`);
                link.href = record.source_url;
                source.append(link);
                card.append(meta, title, summary, source);
                item.append(card);
                list.append(item);
            });
            section.append(heading, list);
            fragment.append(section);
        });
        if (!records.length) fragment.append(element('p', 'news-status', '目前尚無新聞資料。'));
        container.replaceChildren(fragment);
    }

    async function loadNews() {
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-busy', 'true');
        container.append(element('p', 'news-status', '新聞資料載入中……'));
        try {
            const response = await fetch('data/news.json');
            if (!response.ok) throw new Error('Unable to fetch news');
            const records = await response.json();
            if (!Array.isArray(records) || !records.every(validRecord)) throw new Error('Invalid news data');
            render(records);
        } catch {
            container.replaceChildren(element('p', 'news-status', '新聞資料暫時無法載入，請稍後再試。'));
        } finally {
            container.setAttribute('aria-busy', 'false');
        }
    }

    loadNews();
})();
