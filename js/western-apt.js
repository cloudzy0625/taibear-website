(function () {
    'use strict';

    var container = document.getElementById('western-apt-list');
    if (!container) return;

    // Restore the existing grid on the replacement container; CSS stays unchanged.
    container.className = 'western-apt-grid';

    function element(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    // Only the brief's **emphasis** and `code` notation is supported.
    // All content, including HTML-looking input, is inserted as text nodes.
    function appendText(parent, text) {
        var pattern = /\*\*([^*]+)\*\*|`([^`]+)`/g;
        var offset = 0;
        var match;
        while ((match = pattern.exec(text)) !== null) {
            parent.appendChild(document.createTextNode(text.slice(offset, match.index)));
            parent.appendChild(element(match[1] != null ? 'strong' : 'code', '', match[1] || match[2]));
            offset = pattern.lastIndex;
        }
        parent.appendChild(document.createTextNode(text.slice(offset)));
    }

    function link(url, text) {
        var parsed = new URL(url);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            throw new Error('Invalid source URL');
        }
        var node = element('a', '', text);
        node.setAttribute('href', url);
        return node;
    }

    function addField(list, label, text) {
        list.appendChild(element('dt', '', label));
        var value = element('dd');
        value.setAttribute('data-field', label);
        appendText(value, text);
        list.appendChild(value);
    }

    function renderCard(item, index) {
        var number = String(index + 1).padStart(2, '0');
        var titleId = 'western-apt-title-' + number;
        var card = element('article', 'western-apt-card');
        card.id = 'western-apt-' + number;
        card.setAttribute('data-candidate', String(index + 1));
        card.setAttribute('aria-labelledby', titleId);
        var title = element('h3', 'western-apt-card-title', item.display_name || item.name);
        title.id = titleId;
        card.appendChild(title);
        if (item.taiwan !== null) {
            card.appendChild(element('span', 'western-apt-badge', item.taiwan));
        }
        if (item.note !== null) {
            card.appendChild(element('p', item.name === 'Volt Typhoon'
                ? 'western-apt-registry-note' : 'western-apt-caution', item.note));
        }
        var summary = element('p', 'western-apt-summary', item.intro);
        summary.setAttribute('data-field', '一句話');
        card.appendChild(summary);
        var fields = element('dl', 'western-apt-fields');
        addField(fields, '別名與命名', item.aliases_text);
        addField(fields, '歸因', item.attribution);
        addField(fields, '主要目標', item.targets);
        addField(fields, '臺灣紀錄', item.taiwan_record);
        addField(fields, '與現有名錄的關係', item.registry);
        card.appendChild(fields);
        card.appendChild(element('h4', 'western-apt-sources-title', '代表來源'));
        var sources = element('ol', 'western-apt-sources');
        item.sources.forEach(function (source) {
            var row = element('li');
            var label = source.publisher + ', "' + source.title + '"' + (source.title_note || '');
            if (source.date !== null) label += ', ' + source.date;
            row.appendChild(link(source.url, label));
            (source.suffix || []).forEach(function (part) {
                row.appendChild(part.url ? link(part.url, part.text) : document.createTextNode(part.text));
            });
            sources.appendChild(row);
        });
        card.appendChild(sources);
        return card;
    }

    fetch('data/western-apt.json')
        .then(function (response) {
            if (!response.ok) throw new Error('Failed to load western APT data');
            return response.json();
        })
        .then(function (items) {
            if (!Array.isArray(items)) throw new Error('Expected an array');
            var fragment = document.createDocumentFragment();
            items.forEach(function (item, index) {
                fragment.appendChild(renderCard(item, index));
            });
            container.replaceChildren(fragment);
        })
        .catch(function () {
            container.textContent = '專區資料暫時無法載入，請稍後再試。';
        });
})();
