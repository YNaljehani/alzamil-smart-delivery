/* ============================================
   ASDP - AI Chat Agent
   Smart assistant with Arabic intent matching
   Reads platform data from localStorage/mockData
   ============================================ */
(function () {
    'use strict';

    // i18n helper - short alias for ASDP.t()
    var _t = function(k, fb) { return (typeof ASDP !== 'undefined' && ASDP.t) ? ASDP.t(k, fb) : (fb || k); };

    var isOpen = false;
    var welcomed = false;
    var els = {};

    // ========== DOM CREATION ==========
    function createDOM() {
        // FAB
        var fab = document.createElement('button');
        fab.className = 'chat-fab';
        fab.setAttribute('aria-label', _t('chat.name'));
        fab.innerHTML =
            '<span class="fab-icon-open"><i class="bi bi-robot"></i></span>' +
            '<span class="fab-icon-close"><i class="bi bi-x-lg"></i></span>' +
            '<span class="chat-fab-dot"></span>';
        fab.onclick = toggle;
        document.body.appendChild(fab);
        els.fab = fab;

        // Window
        var win = document.createElement('div');
        win.className = 'chat-window';
        win.innerHTML =
            '<div class="chat-window-header">' +
                '<div class="chat-avatar"><i class="bi bi-robot"></i></div>' +
                '<div class="chat-header-info">' +
                    '<div class="chat-name">' + _t('chat.name') + '</div>' +
                    '<div class="chat-status"><span class="online-dot"></span> ' + _t('chat.status') + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="chat-messages" id="chatMessages"></div>' +
            '<div class="chat-typing" id="chatTyping">' +
                '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>' +
            '</div>' +
            '<div class="chat-suggestions" id="chatSuggestions"></div>' +
            '<div class="chat-input-area">' +
                '<input type="text" class="chat-input" id="chatInput" placeholder="' + _t('chat.placeholder') + '" autocomplete="off">' +
                '<button class="chat-send-btn" id="chatSendBtn"><i class="bi bi-send-fill"></i></button>' +
            '</div>';
        document.body.appendChild(win);
        els.win = win;
        els.messages = win.querySelector('#chatMessages');
        els.typing = win.querySelector('#chatTyping');
        els.suggestions = win.querySelector('#chatSuggestions');
        els.input = win.querySelector('#chatInput');

        // Events
        win.querySelector('#chatSendBtn').onclick = function () { send(els.input.value); };
        els.input.onkeydown = function (e) { if (e.key === 'Enter') send(els.input.value); };
    }

    // ========== TOGGLE ==========
    function toggle() {
        isOpen = !isOpen;
        els.fab.classList.toggle('open', isOpen);
        els.win.classList.toggle('open', isOpen);
        if (isOpen) {
            if (!welcomed) { showWelcome(); welcomed = true; }
            setTimeout(function () { els.input.focus(); }, 350);
        }
    }

    // ========== SEND ==========
    function send(text) {
        text = (text || '').trim();
        if (!text) return;
        els.input.value = '';
        addMsg(text, 'user');
        clearSuggestions();
        showTyping();

        var delay = 500 + Math.floor(Math.random() * 500);
        setTimeout(function () {
            hideTyping();
            var res = processInput(text);
            addMsg(res.html, 'agent');
            if (res.suggestions) showSuggestions(res.suggestions);
        }, delay);
    }

    // ========== MESSAGES ==========
    function addMsg(html, sender) {
        var div = document.createElement('div');
        div.className = 'chat-msg ' + sender;
        div.innerHTML = html;
        els.messages.appendChild(div);
        scrollBottom();
    }

    function scrollBottom() {
        setTimeout(function () { els.messages.scrollTop = els.messages.scrollHeight; }, 50);
    }

    function showTyping() { els.typing.classList.add('show'); scrollBottom(); }
    function hideTyping() { els.typing.classList.remove('show'); }

    // ========== SUGGESTIONS ==========
    function showSuggestions(list) {
        els.suggestions.innerHTML = '';
        list.forEach(function (label) {
            var btn = document.createElement('button');
            btn.className = 'chat-sug-btn';
            btn.textContent = label;
            btn.onclick = function () { send(label); };
            els.suggestions.appendChild(btn);
        });
    }
    function clearSuggestions() { els.suggestions.innerHTML = ''; }

    // ========== WELCOME ==========
    function showWelcome() {
        var html =
            '<b>' + _t('chat.welcome') + '</b><br><br>' +
            _t('chat.welcome_body') + '<br>' +
            '&#8226; ' + _t('chat.welcome_1') + '<br>' +
            '&#8226; ' + _t('chat.welcome_2') + '<br>' +
            '&#8226; ' + _t('chat.welcome_3') + '<br>' +
            '&#8226; ' + _t('chat.welcome_4') + '<br>' +
            '&#8226; ' + _t('chat.welcome_5') + '<br><br>' +
            '<span style="color:#6c757d; font-size:0.8rem;">' + _t('chat.welcome_try') + '</span>';
        addMsg(html, 'agent');
        showSuggestions([_t('chat.sug_tonight'), _t('chat.sug_fleet'), _t('chat.sug_network'), _t('chat.sug_kpis')]);
    }

    // ========== DATA ACCESS ==========
    function getData(key) {
        if (typeof ASDP !== 'undefined' && ASDP.storage) {
            var d = ASDP.storage.load(key);
            if (d) return d;
        }
        if (typeof ASDP !== 'undefined' && ASDP.mockData) {
            return ASDP.mockData[key] || null;
        }
        return null;
    }
    function getOrders() { return getData('orders') || []; }
    function getFleet() { return getData('fleet') || []; }
    function getAssessments() { return getData('assessments') || []; }
    function getQueue() { return getData('tonight_queue') || []; }
    function getKPI() { return getData('kpi_history') || {}; }
    function getHubs() { return (ASDP && ASDP.mockData) ? (ASDP.mockData.hubs || []) : []; }
    function getDepots() { return (ASDP && ASDP.mockData) ? (ASDP.mockData.depots || []) : []; }

    function noData() {
        return '<span style="color:#e74c3c;">' + _t('chat.no_data') + '</span><br>' +
               '<b><a href="index.html" style="color:#1a5276;">' + _t('chat.no_data_link') + '</a></b>';
    }

    // ========== INTENT MATCHING ==========
    function matchesAny(text, keywords) {
        for (var i = 0; i < keywords.length; i++) {
            if (text.indexOf(keywords[i]) !== -1) return true;
        }
        return false;
    }

    function processInput(text) {
        var t = text.trim();
        var tl = t.toLowerCase();

        // Order ID pattern
        var orderMatch = t.match(/AZ-?\d{4}-?\d{3,4}/i);
        if (orderMatch) return handleOrderById(orderMatch[0].toUpperCase().replace(/AZ(\d)/, 'AZ-$1'));

        // Intents
        if (matchesAny(tl, ['مرحب', 'هلا', 'السلام', 'اهلا', 'أهلا', 'hello', 'hi ', 'هاي'])) return handleGreeting();
        if (matchesAny(tl, ['من انت', 'من أنت', 'تعريف', 'who are'])) return handleIdentity();
        if (matchesAny(tl, ['شكر', 'thanks', 'مشكور'])) return handleThanks();
        if (matchesAny(tl, ['توصيل', 'الليلة', 'الليله', 'جدول', 'tonight', 'delivery', 'queue'])) return handleTonight();
        if (matchesAny(tl, ['اسطول', 'أسطول', 'شاحن', 'مركب', 'سائق', 'fleet', 'truck', 'vehicle', 'driver'])) return handleFleet();
        if (matchesAny(tl, ['تقييم', 'sra', 'جاهزي', 'assessment', 'score', 'تصنيف'])) return handleAssessments();
        if (matchesAny(tl, ['شبك', 'مركز', 'نقطة خدم', 'hub', 'depot', 'network', 'توزيع'])) return handleNetwork();
        if (matchesAny(tl, ['مؤشر', 'احصائ', 'إحصائ', 'اداء', 'أداء', 'kpi', 'stats', 'performance'])) return handleKPIs();
        if (matchesAny(tl, ['رافع', 'crane', 'كرين'])) return handleCrane();
        if (matchesAny(tl, ['طلب', 'order', 'عميل'])) return handleOrders(t);
        if (matchesAny(tl, ['توصي', 'اقتراح', 'نصيح', 'recommend', 'افضل', 'أفضل'])) return handleRecommendation();
        if (matchesAny(tl, ['مساعد', 'help', 'ماذا', 'ايش', 'وش تقدر', 'اوامر'])) return handleHelp();

        return handleUnknown();
    }

    // ========== HANDLERS ==========

    function handleGreeting() {
        return {
            html: _t('chat.greeting'),
            suggestions: [_t('chat.sug_tonight'), _t('chat.sug_fleet'), _t('chat.sug_network'), _t('chat.sug_kpis')]
        };
    }

    function handleIdentity() {
        return {
            html: _t('chat.identity'),
            suggestions: [_t('chat.sug_what'), _t('chat.sug_network')]
        };
    }

    function handleThanks() {
        return {
            html: _t('chat.thanks'),
            suggestions: [_t('chat.sug_tonight'), _t('chat.sug_fleet')]
        };
    }

    function handleHelp() {
        return {
            html: '<b>' + _t('chat.help_title') + '</b><br><br>' +
                  '&#8226; <b>' + _t('chat.sug_tonight') + '</b><br>' +
                  '&#8226; <b>' + _t('chat.sug_fleet') + '</b><br>' +
                  '&#8226; <b>AZ-2026-0847</b><br>' +
                  '&#8226; <b>' + _t('chat.sug_assessments') + '</b><br>' +
                  '&#8226; <b>' + _t('chat.sug_network') + '</b><br>' +
                  '&#8226; <b>' + _t('chat.sug_kpis') + '</b><br>' +
                  '&#8226; <b>' + _t('chat.sug_crane') + '</b><br>' +
                  '&#8226; <b>' + _t('chat.sug_recommend') + '</b>',
            suggestions: [_t('chat.sug_tonight'), _t('chat.sug_fleet'), _t('chat.sug_assessments'), _t('chat.sug_network')]
        };
    }

    // ---- Order by ID ----
    function handleOrderById(id) {
        var orders = getOrders();
        var assessments = getAssessments();
        var queue = getQueue();
        var fleet = getFleet();

        if (!orders.length) return { html: noData(), suggestions: [] };

        // Normalize ID format
        id = id.replace(/AZ(\d)/, 'AZ-$1');
        var order = null;
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].id === id) { order = orders[i]; break; }
        }

        if (!order) {
            return {
                html: _t('chat.order_not_found') + ' <b>' + id + '</b>.',
                suggestions: [_t('chat.sug_orders')]
            };
        }

        // Find assessment
        var assess = null;
        for (var a = 0; a < assessments.length; a++) {
            if (assessments[a].orderId === id) { assess = assessments[a]; break; }
        }

        // Find queue entry
        var qEntry = null;
        for (var q = 0; q < queue.length; q++) {
            if (queue[q].orderId === id) { qEntry = queue[q]; break; }
        }

        // Find vehicle
        var vehicle = null;
        if (qEntry && qEntry.vehicleId) {
            for (var v = 0; v < fleet.length; v++) {
                if (fleet[v].id === qEntry.vehicleId) { vehicle = fleet[v]; break; }
            }
        }

        var scoreBadge = '';
        var classBadge = '';
        if (assess) {
            var scoreColor = assess.classification === 'GREEN' ? 'green' : assess.classification === 'YELLOW' ? 'yellow' : assess.classification === 'RED' ? 'red' : 'black';
            scoreBadge = '<span class="msg-badge ' + scoreColor + '">' + assess.score + ' - ' + assess.classification + '</span>';
            var classColor = assess.deliveryClass === 'A' ? 'green' : assess.deliveryClass === 'B' ? 'blue' : assess.deliveryClass === 'C-1' ? 'teal' : assess.deliveryClass === 'C-2' ? 'yellow' : 'red';
            classBadge = '<span class="msg-badge ' + classColor + '">' + assess.deliveryClass + '</span>';
        }

        var statusLabels = {
            confirmed: _t('status.confirmed', 'مؤكد'), assessed: _t('status.assessed', 'تم التقييم'), loading: _t('status.loading', 'جاري التحميل'),
            enroute: _t('status.enroute', 'في الطريق'), delivered: _t('status.delivered', 'تم التوصيل'), pending: _t('status.pending', 'قيد الانتظار'), blocked: _t('status.blocked', 'محظور')
        };

        var html = '<b>' + _t('chat.order_title') + ' ' + id + '</b>' +
            '<table class="msg-mini-table">' +
            '<tr><td>' + _t('chat.order_customer') + '</td><td><b>' + order.customer + '</b></td></tr>' +
            '<tr><td>' + _t('chat.order_district') + '</td><td>' + order.district + ' - ' + order.city + '</td></tr>' +
            '<tr><td>' + _t('chat.order_tank') + '</td><td>' + order.tank + '</td></tr>' +
            '<tr><td>' + _t('chat.order_install') + '</td><td>' + (order.installation === 'rooftop' ? _t('chat.install_rooftop') : _t('chat.install_ground')) + '</td></tr>' +
            '<tr><td>' + _t('chat.order_status') + '</td><td>' + (statusLabels[order.status] || order.status) + '</td></tr>' +
            (assess ? '<tr><td>' + _t('chat.order_sra') + '</td><td>' + scoreBadge + '</td></tr>' : '') +
            (assess ? '<tr><td>' + _t('chat.order_class') + '</td><td>' + classBadge + '</td></tr>' : '') +
            (vehicle ? '<tr><td>' + _t('chat.order_vehicle') + '</td><td>' + vehicle.id + ' - ' + vehicle.driver + '</td></tr>' : '') +
            (qEntry ? '<tr><td>' + _t('chat.order_time') + '</td><td>' + (qEntry.scheduledTime || '-') + '</td></tr>' : '') +
            '</table>';

        return { html: html, suggestions: [_t('chat.sug_fleet'), _t('chat.sug_tonight'), _t('chat.sug_orders')] };
    }

    // ---- General Orders ----
    function handleOrders(text) {
        var orders = getOrders();
        if (!orders.length) return { html: noData(), suggestions: [] };

        // Check if searching by customer name
        var words = text.split(/\s+/);
        for (var w = 0; w < words.length; w++) {
            if (words[w].length > 2 && words[w] !== 'طلب' && words[w] !== 'عميل' && words[w] !== 'طلبات') {
                for (var o = 0; o < orders.length; o++) {
                    if (orders[o].customer.indexOf(words[w]) !== -1) {
                        return handleOrderById(orders[o].id);
                    }
                }
            }
        }

        // Summary
        var statusCount = {};
        orders.forEach(function (o) {
            statusCount[o.status] = (statusCount[o.status] || 0) + 1;
        });

        var statusLabels = {
            confirmed: _t('status.confirmed', 'مؤكد'), assessed: _t('status.assessed', 'تم التقييم'), loading: _t('status.loading', 'جاري التحميل'),
            enroute: _t('status.enroute', 'في الطريق'), delivered: _t('status.delivered', 'تم التوصيل')
        };

        var html = '<b>' + _t('chat.orders_summary') + ' (' + orders.length + ')</b><br><br>';
        for (var s in statusCount) {
            html += '&#8226; ' + (statusLabels[s] || s) + ': <b>' + statusCount[s] + '</b><br>';
        }

        html += '<br><span style="color:#6c757d; font-size:0.78rem;">' + _t('chat.orders_detail_hint') + '</span>';

        var ids = orders.slice(0, 3).map(function (o) { return o.id; });
        return { html: html, suggestions: ids.concat([_t('chat.sug_tonight')]) };
    }

    // ---- Fleet Status ----
    function handleFleet() {
        var fleet = getFleet();
        if (!fleet.length) return { html: noData(), suggestions: [] };

        var typeCount = { heavy: 0, crane_truck: 0, light: 0 };
        var statusCount = { available: 0, enroute: 0, loading: 0, maintenance: 0, lift_duty: 0, scheduled: 0 };
        var available = [];

        fleet.forEach(function (v) {
            typeCount[v.type] = (typeCount[v.type] || 0) + 1;
            statusCount[v.status] = (statusCount[v.status] || 0) + 1;
            if (v.status === 'available') available.push(v);
        });

        var html = '<b>' + _t('chat.fleet_title') + ' (' + fleet.length + ')</b><br><br>';
        html += '<b>' + _t('chat.fleet_by_type') + '</b><br>';
        html += '&#8226; ' + _t('chat.fleet_heavy') + ': <b>' + (typeCount.heavy || 0) + '</b><br>';
        html += '&#8226; ' + _t('chat.fleet_crane') + ': <b>' + (typeCount.crane_truck || 0) + '</b><br>';
        html += '&#8226; ' + _t('chat.fleet_light') + ': <b>' + (typeCount.light || 0) + '</b><br><br>';

        html += '<b>' + _t('chat.fleet_by_status') + '</b><br>';
        var sLabels = { available: _t('status.available', 'متاح'), enroute: _t('status.enroute', 'في الطريق'), loading: _t('status.loading', 'جاري التحميل'), maintenance: _t('status.maintenance', 'صيانة'), lift_duty: _t('status.lift_duty', 'مهمة رفع'), scheduled: _t('status.scheduled', 'مجدول') };
        for (var s in statusCount) {
            if (statusCount[s] > 0) {
                html += '&#8226; ' + (sLabels[s] || s) + ': <b>' + statusCount[s] + '</b><br>';
            }
        }

        if (available.length > 0) {
            html += '<br><span class="msg-badge green">' + _t('chat.fleet_available') + ': ' + available.length + '</span><br>';
            available.forEach(function (v) {
                html += '<span style="font-size:0.78rem; color:#6c757d;">&#8226; ' + v.id + ' - ' + v.name + ' (' + v.driver + ')</span><br>';
            });
        }

        return { html: html, suggestions: [_t('chat.sug_tonight'), _t('chat.sug_crane'), _t('chat.sug_recommend')] };
    }

    // ---- Tonight's Deliveries ----
    function handleTonight() {
        var queue = getQueue();
        var orders = getOrders();
        if (!queue.length) return { html: noData(), suggestions: [] };

        var ordersMap = {};
        orders.forEach(function (o) { ordersMap[o.id] = o; });

        var statusCount = { loading: 0, enroute: 0, pending: 0, delivered: 0, blocked: 0 };
        queue.forEach(function (q) { statusCount[q.status] = (statusCount[q.status] || 0) + 1; });

        var sLabels = { loading: _t('status.loading', 'جاري التحميل'), enroute: _t('status.enroute', 'في الطريق'), pending: _t('status.pending', 'قيد الانتظار'), delivered: _t('status.delivered', 'تم التوصيل'), blocked: _t('status.blocked', 'محظور') };

        var html = '<b>' + _t('chat.tonight_title') + ' (' + queue.length + ')</b><br><br>';
        for (var s in statusCount) {
            if (statusCount[s] > 0) {
                var color = s === 'delivered' ? 'green' : s === 'enroute' ? 'blue' : s === 'blocked' ? 'red' : s === 'loading' ? 'yellow' : 'blue';
                html += '<span class="msg-badge ' + color + '">' + (sLabels[s] || s) + ': ' + statusCount[s] + '</span> ';
            }
        }

        html += '<br><br>';
        queue.forEach(function (q) {
            var o = ordersMap[q.orderId] || {};
            var icon = q.status === 'delivered' ? '&#10003;' : q.status === 'enroute' ? '&#8594;' : q.status === 'blocked' ? '&#10007;' : '&#9679;';
            html += '<span style="font-size:0.8rem;">' + icon + ' <b>' + (q.scheduledTime || '--:--') + '</b> ' +
                    (o.customer || q.orderId) + ' - ' + (o.district || '') + '</span><br>';
        });

        return { html: html, suggestions: [_t('chat.sug_fleet'), _t('chat.sug_orders'), _t('chat.sug_assessments')] };
    }

    // ---- Assessments ----
    function handleAssessments() {
        var assessments = getAssessments();
        var kpi = getKPI();
        if (!assessments.length) return { html: noData(), suggestions: [] };

        var dist = kpi.scoreDistribution || null;
        var classCount = {};
        assessments.forEach(function (a) {
            classCount[a.deliveryClass] = (classCount[a.deliveryClass] || 0) + 1;
        });

        var html = '<b>' + _t('chat.assessments_title') + '</b><br><br>';

        if (dist) {
            html += '<b>' + _t('chat.assessments_dist') + '</b><br>';
            html += '<span class="msg-badge green">' + _t('score.GREEN.label') + ': ' + dist.GREEN + '%</span> ';
            html += '<span class="msg-badge yellow">' + _t('score.YELLOW.label') + ': ' + dist.YELLOW + '%</span> ';
            html += '<span class="msg-badge red">' + _t('score.RED.label') + ': ' + dist.RED + '%</span> ';
            html += '<span class="msg-badge black">' + _t('score.BLACK.label') + ': ' + dist.BLACK + '%</span><br><br>';
        }

        html += '<b>' + _t('chat.assessments_classes') + '</b><br>';
        var classLabels = { 'A': _t('class.A.label'), 'B': _t('class.B.label'), 'C-1': _t('class.C1.label'), 'C-2': _t('class.C2.label'), 'D': _t('class.D.label') };
        for (var c in classCount) {
            var cc = c === 'A' ? 'green' : c === 'B' ? 'blue' : c === 'C-1' ? 'teal' : c === 'C-2' ? 'yellow' : 'red';
            html += '<span class="msg-badge ' + cc + '">' + (classLabels[c] || c) + ': ' + classCount[c] + '</span> ';
        }

        return { html: html, suggestions: [_t('chat.sug_orders'), _t('chat.sug_tonight'), _t('chat.sug_kpis')] };
    }

    // ---- Network ----
    function handleNetwork() {
        var hubs = getHubs();
        var depots = getDepots();

        if (!hubs.length) {
            return { html: _t('chat.no_data'), suggestions: [_t('chat.sug_kpis')] };
        }

        var totalHeavy = 0, totalCrane = 0, totalLight = 0, totalOrders = 0;
        hubs.forEach(function (h) {
            totalHeavy += h.fleet.heavy;
            totalCrane += h.fleet.craneTruck;
            totalLight += h.fleet.light;
            totalOrders += h.ordersToday;
        });

        var html = '<b>' + _t('chat.network_title') + '</b><br><br>';
        html += '<span class="msg-badge teal">' + hubs.length + ' ' + _t('chat.network_hubs') + '</span> ';
        html += '<span class="msg-badge yellow">' + depots.length + ' ' + _t('chat.network_depots') + '</span><br><br>';

        hubs.forEach(function (h) {
            var total = h.fleet.heavy + h.fleet.craneTruck + h.fleet.light;
            html += '&#8226; <b>' + h.name.replace('المركز الإقليمي - ', '') + '</b>: ' +
                    total + ' | ' + h.ordersToday + '<br>';
        });

        html += '<br><b>' + _t('chat.network_total_fleet') + '</b><br>';
        html += '&#8226; ' + _t('chat.fleet_heavy') + ': <b>' + totalHeavy + '</b><br>';
        html += '&#8226; ' + _t('chat.fleet_crane') + ': <b>' + totalCrane + '</b><br>';
        html += '&#8226; ' + _t('chat.fleet_light') + ': <b>' + totalLight + '</b><br>';
        html += '&#8226; ' + _t('chat.network_orders_today') + ' <b>' + totalOrders + '</b>';

        return { html: html, suggestions: [_t('chat.sug_fleet'), _t('chat.sug_kpis'), _t('chat.sug_crane')] };
    }

    // ---- KPIs ----
    function handleKPIs() {
        var kpi = getKPI();
        var queue = getQueue();

        var html = '<b>' + _t('chat.kpi_title') + '</b><br><br>';

        if (kpi.deliveries) {
            var totalDel = kpi.deliveries.reduce(function (a, b) { return a + b; }, 0);
            var avgDel = Math.round(totalDel / kpi.deliveries.length);
            html += '&#8226; ' + _t('chat.kpi_avg_daily') + ' <b>' + avgDel + '</b><br>';
        }

        if (kpi.successRate) {
            var avgSuccess = Math.round(kpi.successRate.reduce(function (a, b) { return a + b; }, 0) / kpi.successRate.length);
            html += '&#8226; ' + _t('chat.kpi_avg_success') + ' <span class="msg-badge green"><b>' + avgSuccess + '%</b></span><br>';
        }

        if (kpi.failedBefore && kpi.failedAfter) {
            var totalBefore = kpi.failedBefore.reduce(function (a, b) { return a + b; }, 0);
            var totalAfter = kpi.failedAfter.reduce(function (a, b) { return a + b; }, 0);
            var reduction = totalBefore > 0 ? Math.round(((totalBefore - totalAfter) / totalBefore) * 100) : 0;
            html += '&#8226; ' + _t('chat.kpi_reduction') + ' <span class="msg-badge green"><b>' + reduction + '%</b></span><br>';
            var beforeAfter = _t('chat.kpi_before_after').replace('{b}', totalBefore).replace('{a}', totalAfter);
            html += '  <span style="font-size:0.75rem; color:#6c757d;">' + beforeAfter + '</span><br>';
        }

        if (kpi.scoreDistribution) {
            var d = kpi.scoreDistribution;
            html += '<br><b>' + _t('chat.assessments_dist') + '</b><br>';
            html += '<span class="msg-badge green">' + d.GREEN + '%</span> ';
            html += '<span class="msg-badge yellow">' + d.YELLOW + '%</span> ';
            html += '<span class="msg-badge red">' + d.RED + '%</span> ';
            html += '<span class="msg-badge black">' + d.BLACK + '%</span>';
        }

        if (queue.length > 0) {
            html += '<br><br>&#8226; ' + _t('chat.kpi_tonight') + ' <b>' + queue.length + '</b>';
        }

        return { html: html, suggestions: [_t('chat.sug_tonight'), _t('chat.sug_assessments'), _t('chat.sug_network')] };
    }

    // ---- Crane Trucks ----
    function handleCrane() {
        var fleet = getFleet();
        var hubs = getHubs();

        var craneTrucks = fleet.filter(function (v) { return v.type === 'crane_truck'; });
        var html = '<b>' + _t('chat.crane_title') + '</b><br><br>';

        if (craneTrucks.length > 0) {
            html += '<b>' + _t('chat.crane_fleet') + ' (' + craneTrucks.length + '):</b><br>';
            craneTrucks.forEach(function (ct) {
                var sLabels = { available: _t('status.available', 'متاح'), enroute: _t('status.enroute', 'في الطريق'), loading: _t('status.loading', 'جاري التحميل'), maintenance: _t('status.maintenance', 'صيانة') };
                var sColor = ct.status === 'available' ? 'green' : ct.status === 'enroute' ? 'blue' : 'yellow';
                html += '&#8226; <b>' + ct.id + '</b> (' + ct.craneClass + ') - ' + ct.floors +
                        ' <span class="msg-badge ' + sColor + '">' + (sLabels[ct.status] || ct.status) + '</span><br>';
            });
        }

        if (hubs.length > 0) {
            html += '<br><b>' + _t('chat.crane_dist') + '</b><br>';
            var totalCranes = 0;
            hubs.forEach(function (h) {
                if (h.fleet.craneTruck > 0) {
                    var hubName = (h.nameEn && ASDP.lang() === 'en') ? h.nameEn : h.name.replace('المركز الإقليمي - ', '');
                    html += '&#8226; ' + hubName + ': <b>' + h.fleet.craneTruck + '</b>';
                    if (h.craneUtilization > 0) html += ' (' + _t('chat.utilization') + ' ' + h.craneUtilization + '%)';
                    html += '<br>';
                    totalCranes += h.fleet.craneTruck;
                }
            });
            html += '<br><b>' + _t('chat.crane_total') + ' ' + totalCranes + '</b>';
        }

        html += '<br><br><span style="font-size:0.78rem; color:#6c757d;">' + _t('chat.crane_note') + '</span>';

        return { html: html, suggestions: [_t('chat.sug_fleet'), _t('chat.sug_assessments'), _t('chat.sug_network')] };
    }

    // ---- Smart Recommendation ----
    function handleRecommendation() {
        var orders = getOrders();
        var fleet = getFleet();
        var assessments = getAssessments();
        var queue = getQueue();

        if (!orders.length) return { html: noData(), suggestions: [] };

        var html = '<b>' + _t('chat.recommend_title') + '</b><br><br>';
        var tips = [];

        // Check for unassigned orders
        var assignedIds = {};
        queue.forEach(function (q) { if (q.vehicleId) assignedIds[q.orderId] = true; });
        var blockedOrders = queue.filter(function (q) { return q.status === 'blocked'; });
        var availableVehicles = fleet.filter(function (v) { return v.status === 'available'; });

        if (blockedOrders.length > 0) {
            tips.push('<span class="msg-badge red">' + _t('chat.alert') + '</span> ' + _t('chat.recommend_blocked').replace('{n}', blockedOrders.length));
        }

        if (availableVehicles.length > 0) {
            tips.push('<span class="msg-badge green">' + _t('chat.opportunity') + '</span> ' + _t('chat.recommend_available').replace('{n}', availableVehicles.length));
        }

        // Check crane utilization
        var hubs = getHubs();
        hubs.forEach(function (h) {
            if (h.craneUtilization > 85) {
                var hubName = (h.nameEn && ASDP.lang() === 'en') ? h.nameEn : h.name.replace('المركز الإقليمي - ', '');
                tips.push('<span class="msg-badge yellow">' + _t('chat.warning') + '</span> ' + _t('chat.recommend_util').replace('{hub}', hubName).replace('{pct}', h.craneUtilization));
            }
        });

        // Check low stock depots
        var depots = getDepots();
        var lowStock = depots.filter(function (d) { return d.stockLevel < 50; });
        if (lowStock.length > 0) {
            var sep = ASDP.lang() === 'en' ? ', ' : '، ';
            tips.push('<span class="msg-badge yellow">' + _t('chat.stock_warning') + '</span> ' + lowStock.length + ' ' + _t('chat.recommend_stock') + ' (' +
                lowStock.map(function (d) { return d.nameEn && ASDP.lang() === 'en' ? d.nameEn : d.name.replace('نقطة خدمة - ', ''); }).join(sep) + ').');
        }

        // Check maintenance
        var maintenanceV = fleet.filter(function (v) { return v.status === 'maintenance'; });
        if (maintenanceV.length > 0) {
            tips.push('<span class="msg-badge blue">' + _t('chat.maintenance_label') + '</span> ' + maintenanceV.length + ' ' + _t('chat.recommend_maintenance') + ' (' +
                maintenanceV.map(function (v) { return v.id; }).join(ASDP.lang() === 'en' ? ', ' : '، ') + ').');
        }

        if (tips.length === 0) {
            tips.push(_t('chat.recommend_all_good'));
        }

        tips.forEach(function (tip) { html += tip + '<br><br>'; });

        return { html: html, suggestions: [_t('chat.sug_fleet'), _t('chat.sug_tonight'), _t('chat.sug_network')] };
    }

    // ---- Unknown ----
    function handleUnknown() {
        return {
            html: _t('chat.unknown') + '<br><br>' +
                  '&#8226; ' + _t('chat.unknown_1') + '<br>' +
                  '&#8226; ' + _t('chat.unknown_2') + '<br>' +
                  '&#8226; ' + _t('chat.unknown_3') + '<br>' +
                  '&#8226; ' + _t('chat.unknown_4') + '<br>' +
                  '&#8226; ' + _t('chat.unknown_5') + '<br><br>' +
                  _t('chat.unknown_help'),
            suggestions: [_t('chat.sug_help'), _t('chat.sug_tonight'), _t('chat.sug_fleet'), _t('chat.sug_network')]
        };
    }

    // ========== INIT ==========
    document.addEventListener('DOMContentLoaded', createDOM);

})();
