/* ============================================
   ASDP - AI Chat Agent
   Smart assistant with Arabic intent matching
   Reads platform data from localStorage/mockData
   ============================================ */
(function () {
    'use strict';

    var isOpen = false;
    var welcomed = false;
    var els = {};

    // ========== DOM CREATION ==========
    function createDOM() {
        // FAB
        var fab = document.createElement('button');
        fab.className = 'chat-fab';
        fab.setAttribute('aria-label', 'المساعد الذكي');
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
                    '<div class="chat-name">المساعد الذكي - ASDP</div>' +
                    '<div class="chat-status"><span class="online-dot"></span> متصل الآن</div>' +
                '</div>' +
            '</div>' +
            '<div class="chat-messages" id="chatMessages"></div>' +
            '<div class="chat-typing" id="chatTyping">' +
                '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>' +
            '</div>' +
            '<div class="chat-suggestions" id="chatSuggestions"></div>' +
            '<div class="chat-input-area">' +
                '<input type="text" class="chat-input" id="chatInput" placeholder="اكتب سؤالك هنا..." autocomplete="off">' +
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
            '<b>مرحبا! انا المساعد الذكي لمنصة ASDP</b><br><br>' +
            'اقدر اساعدك في:<br>' +
            '&#8226; استعلام عن الطلبات والتوصيلات<br>' +
            '&#8226; حالة الاسطول والمركبات<br>' +
            '&#8226; نتائج تقييمات المواقع (SRA)<br>' +
            '&#8226; معلومات شبكة التوزيع<br>' +
            '&#8226; مؤشرات الاداء والاحصائيات<br><br>' +
            '<span style="color:#6c757d; font-size:0.8rem;">جرب تسألني اي شيء!</span>';
        addMsg(html, 'agent');
        showSuggestions(['توصيلات الليلة', 'حالة الاسطول', 'ملخص الشبكة', 'المؤشرات']);
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
        return '<span style="color:#e74c3c;">لم يتم تحميل البيانات التجريبية بعد.</span><br>' +
               'اذهب <b><a href="index.html" style="color:#1a5276;">للصفحة الرئيسية</a></b> واضغط "تحميل بيانات العرض التجريبي".';
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
            html: 'اهلا وسهلا! كيف اقدر اساعدك؟',
            suggestions: ['توصيلات الليلة', 'حالة الاسطول', 'ملخص الشبكة', 'المؤشرات']
        };
    }

    function handleIdentity() {
        return {
            html: 'انا <b>المساعد الذكي</b> لمنصة الزامل الذكية للتوصيل (ASDP).<br><br>' +
                  'مهمتي مساعدة فريق العمليات في متابعة الطلبات والاسطول وشبكة التوزيع بشكل لحظي.',
            suggestions: ['ايش تقدر تسوي؟', 'ملخص الشبكة']
        };
    }

    function handleThanks() {
        return {
            html: 'العفو! اذا تحتاج اي شيء ثاني، انا هنا.',
            suggestions: ['توصيلات الليلة', 'حالة الاسطول']
        };
    }

    function handleHelp() {
        return {
            html: '<b>الاوامر المتاحة:</b><br><br>' +
                  '&#8226; <b>توصيلات الليلة</b> - جدول التوصيلات<br>' +
                  '&#8226; <b>حالة الاسطول</b> - المركبات المتاحة<br>' +
                  '&#8226; <b>AZ-2026-0847</b> - استعلام برقم الطلب<br>' +
                  '&#8226; <b>التقييمات</b> - نتائج SRA<br>' +
                  '&#8226; <b>ملخص الشبكة</b> - المراكز ونقاط الخدمة<br>' +
                  '&#8226; <b>المؤشرات</b> - مؤشرات الاداء<br>' +
                  '&#8226; <b>الرافعات</b> - شاحنات الرافعة المخصصة<br>' +
                  '&#8226; <b>توصية</b> - اقتراحات ذكية',
            suggestions: ['توصيلات الليلة', 'حالة الاسطول', 'التقييمات', 'ملخص الشبكة']
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
                html: 'لم اجد طلب برقم <b>' + id + '</b>.<br>تأكد من الرقم وحاول مرة ثانية.',
                suggestions: ['عرض كل الطلبات']
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
            confirmed: 'مؤكد', assessed: 'تم التقييم', loading: 'جاري التحميل',
            enroute: 'في الطريق', delivered: 'تم التوصيل', pending: 'قيد الانتظار', blocked: 'محظور'
        };

        var html = '<b>تفاصيل الطلب ' + id + '</b>' +
            '<table class="msg-mini-table">' +
            '<tr><td>العميل</td><td><b>' + order.customer + '</b></td></tr>' +
            '<tr><td>الحي</td><td>' + order.district + ' - ' + order.city + '</td></tr>' +
            '<tr><td>الخزان</td><td>' + order.tank + '</td></tr>' +
            '<tr><td>التركيب</td><td>' + (order.installation === 'rooftop' ? 'سطح' : 'ارضي') + '</td></tr>' +
            '<tr><td>الحالة</td><td>' + (statusLabels[order.status] || order.status) + '</td></tr>' +
            (assess ? '<tr><td>تقييم SRA</td><td>' + scoreBadge + '</td></tr>' : '') +
            (assess ? '<tr><td>فئة التوصيل</td><td>' + classBadge + '</td></tr>' : '') +
            (vehicle ? '<tr><td>المركبة</td><td>' + vehicle.id + ' - ' + vehicle.driver + '</td></tr>' : '') +
            (qEntry ? '<tr><td>الموعد</td><td>' + (qEntry.scheduledTime || '-') + '</td></tr>' : '') +
            '</table>';

        return { html: html, suggestions: ['حالة الاسطول', 'توصيلات الليلة', 'عرض كل الطلبات'] };
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
            confirmed: 'مؤكد', assessed: 'تم التقييم', loading: 'جاري التحميل',
            enroute: 'في الطريق', delivered: 'تم التوصيل'
        };

        var html = '<b>ملخص الطلبات (' + orders.length + ' طلب)</b><br><br>';
        for (var s in statusCount) {
            html += '&#8226; ' + (statusLabels[s] || s) + ': <b>' + statusCount[s] + '</b><br>';
        }

        html += '<br><span style="color:#6c757d; font-size:0.78rem;">للاستعلام عن طلب محدد، اكتب رقم الطلب مثل AZ-2026-0847</span>';

        var ids = orders.slice(0, 3).map(function (o) { return o.id; });
        return { html: html, suggestions: ids.concat(['توصيلات الليلة']) };
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

        var html = '<b>حالة الاسطول (' + fleet.length + ' مركبة)</b><br><br>';
        html += '<b>حسب النوع:</b><br>';
        html += '&#8226; شاحنات ثقيلة: <b>' + (typeCount.heavy || 0) + '</b><br>';
        html += '&#8226; شاحنات رافعة: <b>' + (typeCount.crane_truck || 0) + '</b><br>';
        html += '&#8226; مركبات خفيفة: <b>' + (typeCount.light || 0) + '</b><br><br>';

        html += '<b>حسب الحالة:</b><br>';
        var sLabels = { available: 'متاح', enroute: 'في الطريق', loading: 'جاري التحميل', maintenance: 'صيانة', lift_duty: 'مهمة رفع', scheduled: 'مجدول' };
        for (var s in statusCount) {
            if (statusCount[s] > 0) {
                html += '&#8226; ' + (sLabels[s] || s) + ': <b>' + statusCount[s] + '</b><br>';
            }
        }

        if (available.length > 0) {
            html += '<br><span class="msg-badge green">متاح الآن: ' + available.length + ' مركبة</span><br>';
            available.forEach(function (v) {
                html += '<span style="font-size:0.78rem; color:#6c757d;">&#8226; ' + v.id + ' - ' + v.name + ' (' + v.driver + ')</span><br>';
            });
        }

        return { html: html, suggestions: ['توصيلات الليلة', 'الرافعات', 'توصية'] };
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

        var sLabels = { loading: 'جاري التحميل', enroute: 'في الطريق', pending: 'قيد الانتظار', delivered: 'تم التوصيل', blocked: 'محظور' };

        var html = '<b>جدول توصيلات الليلة (' + queue.length + ' توصيلة)</b><br><br>';
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

        return { html: html, suggestions: ['حالة الاسطول', 'عرض كل الطلبات', 'التقييمات'] };
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

        var html = '<b>ملخص تقييمات المواقع (SRA)</b><br><br>';

        if (dist) {
            html += '<b>توزيع التصنيفات:</b><br>';
            html += '<span class="msg-badge green">اخضر: ' + dist.GREEN + '%</span> ';
            html += '<span class="msg-badge yellow">اصفر: ' + dist.YELLOW + '%</span> ';
            html += '<span class="msg-badge red">احمر: ' + dist.RED + '%</span> ';
            html += '<span class="msg-badge black">اسود: ' + dist.BLACK + '%</span><br><br>';
        }

        html += '<b>فئات التوصيل:</b><br>';
        var classLabels = { 'A': 'فئة A (خفيف)', 'B': 'فئة B (ليلي)', 'C-1': 'فئة ج-1 (رافعة)', 'C-2': 'فئة ج-2 (تصريح)', 'D': 'فئة D (مشكلة)' };
        for (var c in classCount) {
            var cc = c === 'A' ? 'green' : c === 'B' ? 'blue' : c === 'C-1' ? 'teal' : c === 'C-2' ? 'yellow' : 'red';
            html += '<span class="msg-badge ' + cc + '">' + (classLabels[c] || c) + ': ' + classCount[c] + '</span> ';
        }

        return { html: html, suggestions: ['عرض كل الطلبات', 'توصيلات الليلة', 'المؤشرات'] };
    }

    // ---- Network ----
    function handleNetwork() {
        var hubs = getHubs();
        var depots = getDepots();

        if (!hubs.length) {
            return { html: 'بيانات الشبكة غير متوفرة حاليا.', suggestions: ['المؤشرات'] };
        }

        var totalHeavy = 0, totalCrane = 0, totalLight = 0, totalOrders = 0;
        hubs.forEach(function (h) {
            totalHeavy += h.fleet.heavy;
            totalCrane += h.fleet.craneTruck;
            totalLight += h.fleet.light;
            totalOrders += h.ordersToday;
        });

        var html = '<b>شبكة التوزيع - Hub & Spoke</b><br><br>';
        html += '<span class="msg-badge teal">' + hubs.length + ' مراكز اقليمية</span> ';
        html += '<span class="msg-badge yellow">' + depots.length + ' نقطة خدمة</span><br><br>';

        html += '<b>المراكز الاقليمية:</b><br>';
        hubs.forEach(function (h) {
            var total = h.fleet.heavy + h.fleet.craneTruck + h.fleet.light;
            html += '&#8226; <b>' + h.name.replace('المركز الإقليمي - ', '') + '</b>: ' +
                    total + ' مركبة | ' + h.ordersToday + ' طلب<br>';
        });

        html += '<br><b>اجمالي الاسطول:</b><br>';
        html += '&#8226; شاحنات ثقيلة: <b>' + totalHeavy + '</b><br>';
        html += '&#8226; شاحنات رافعة: <b>' + totalCrane + '</b><br>';
        html += '&#8226; مركبات خفيفة (مراكز): <b>' + totalLight + '</b><br>';
        html += '&#8226; طلبات اليوم: <b>' + totalOrders + '</b>';

        return { html: html, suggestions: ['حالة الاسطول', 'المؤشرات', 'الرافعات'] };
    }

    // ---- KPIs ----
    function handleKPIs() {
        var kpi = getKPI();
        var queue = getQueue();

        var html = '<b>مؤشرات الاداء الرئيسية</b><br><br>';

        if (kpi.deliveries) {
            var totalDel = kpi.deliveries.reduce(function (a, b) { return a + b; }, 0);
            var avgDel = Math.round(totalDel / kpi.deliveries.length);
            html += '&#8226; متوسط التوصيلات اليومي: <b>' + avgDel + '</b><br>';
        }

        if (kpi.successRate) {
            var avgSuccess = Math.round(kpi.successRate.reduce(function (a, b) { return a + b; }, 0) / kpi.successRate.length);
            html += '&#8226; متوسط نسبة النجاح: <span class="msg-badge green"><b>' + avgSuccess + '%</b></span><br>';
        }

        if (kpi.failedBefore && kpi.failedAfter) {
            var totalBefore = kpi.failedBefore.reduce(function (a, b) { return a + b; }, 0);
            var totalAfter = kpi.failedAfter.reduce(function (a, b) { return a + b; }, 0);
            var reduction = totalBefore > 0 ? Math.round(((totalBefore - totalAfter) / totalBefore) * 100) : 0;
            html += '&#8226; تخفيض التوصيلات الفاشلة: <span class="msg-badge green"><b>' + reduction + '%</b></span><br>';
            html += '  <span style="font-size:0.75rem; color:#6c757d;">قبل: ' + totalBefore + ' | بعد: ' + totalAfter + ' (اسبوعيا)</span><br>';
        }

        if (kpi.scoreDistribution) {
            var d = kpi.scoreDistribution;
            html += '<br><b>توزيع تقييمات المواقع:</b><br>';
            html += '<span class="msg-badge green">' + d.GREEN + '%</span> ';
            html += '<span class="msg-badge yellow">' + d.YELLOW + '%</span> ';
            html += '<span class="msg-badge red">' + d.RED + '%</span> ';
            html += '<span class="msg-badge black">' + d.BLACK + '%</span>';
        }

        if (queue.length > 0) {
            html += '<br><br>&#8226; توصيلات الليلة: <b>' + queue.length + '</b>';
        }

        return { html: html, suggestions: ['توصيلات الليلة', 'التقييمات', 'ملخص الشبكة'] };
    }

    // ---- Crane Trucks ----
    function handleCrane() {
        var fleet = getFleet();
        var hubs = getHubs();

        var craneTrucks = fleet.filter(function (v) { return v.type === 'crane_truck'; });
        var html = '<b>شاحنات الرافعة المخصصة</b><br><br>';

        if (craneTrucks.length > 0) {
            html += '<b>الاسطول الحالي (' + craneTrucks.length + ' شاحنة):</b><br>';
            craneTrucks.forEach(function (ct) {
                var sLabels = { available: 'متاح', enroute: 'في الطريق', loading: 'جاري التحميل', maintenance: 'صيانة' };
                var sColor = ct.status === 'available' ? 'green' : ct.status === 'enroute' ? 'blue' : 'yellow';
                html += '&#8226; <b>' + ct.id + '</b> (' + ct.craneClass + ') - ' + ct.floors +
                        ' <span class="msg-badge ' + sColor + '">' + (sLabels[ct.status] || ct.status) + '</span><br>';
            });
        }

        if (hubs.length > 0) {
            html += '<br><b>التوزيع على المراكز:</b><br>';
            var totalCranes = 0;
            hubs.forEach(function (h) {
                if (h.fleet.craneTruck > 0) {
                    html += '&#8226; ' + h.name.replace('المركز الإقليمي - ', '') + ': <b>' + h.fleet.craneTruck + '</b>';
                    if (h.craneUtilization > 0) html += ' (استخدام: ' + h.craneUtilization + '%)';
                    html += '<br>';
                    totalCranes += h.fleet.craneTruck;
                }
            });
            html += '<br><b>اجمالي الشاحنات الرافعة: ' + totalCranes + '</b>';
        }

        html += '<br><br><span style="font-size:0.78rem; color:#6c757d;">الشاحنات الرافعة المخصصة لا تحتاج تصريح دخول المدينة وتوصل + تركب في رحلة واحدة نهارية (فئة ج-1)</span>';

        return { html: html, suggestions: ['حالة الاسطول', 'التقييمات', 'ملخص الشبكة'] };
    }

    // ---- Smart Recommendation ----
    function handleRecommendation() {
        var orders = getOrders();
        var fleet = getFleet();
        var assessments = getAssessments();
        var queue = getQueue();

        if (!orders.length) return { html: noData(), suggestions: [] };

        var html = '<b>توصيات المساعد الذكي</b><br><br>';
        var tips = [];

        // Check for unassigned orders
        var assignedIds = {};
        queue.forEach(function (q) { if (q.vehicleId) assignedIds[q.orderId] = true; });
        var blockedOrders = queue.filter(function (q) { return q.status === 'blocked'; });
        var availableVehicles = fleet.filter(function (v) { return v.status === 'available'; });

        if (blockedOrders.length > 0) {
            tips.push('<span class="msg-badge red">تنبيه:</span> يوجد <b>' + blockedOrders.length + '</b> طلب محظور يحتاج معالجة خاصة (تصنيف RED/BLACK).');
        }

        if (availableVehicles.length > 0) {
            tips.push('<span class="msg-badge green">فرصة:</span> يوجد <b>' + availableVehicles.length + '</b> مركبة متاحة يمكن تخصيصها لطلبات جديدة.');
        }

        // Check crane utilization
        var hubs = getHubs();
        hubs.forEach(function (h) {
            if (h.craneUtilization > 85) {
                tips.push('<span class="msg-badge yellow">تحذير:</span> استخدام الرافعات في <b>' + h.name.replace('المركز الإقليمي - ', '') + '</b> مرتفع (' + h.craneUtilization + '%). فكر في تحويل بعض الطلبات.');
            }
        });

        // Check low stock depots
        var depots = getDepots();
        var lowStock = depots.filter(function (d) { return d.stockLevel < 50; });
        if (lowStock.length > 0) {
            tips.push('<span class="msg-badge yellow">مخزون:</span> ' + lowStock.length + ' نقاط خدمة مخزونها اقل من 50% (' +
                lowStock.map(function (d) { return d.name.replace('نقطة خدمة - ', ''); }).join('، ') + ').');
        }

        // Check maintenance
        var maintenanceV = fleet.filter(function (v) { return v.status === 'maintenance'; });
        if (maintenanceV.length > 0) {
            tips.push('<span class="msg-badge blue">صيانة:</span> ' + maintenanceV.length + ' مركبة في الصيانة (' +
                maintenanceV.map(function (v) { return v.id; }).join('، ') + ').');
        }

        if (tips.length === 0) {
            tips.push('كل شيء يعمل بشكل ممتاز! لا توجد تنبيهات حالية.');
        }

        tips.forEach(function (tip) { html += tip + '<br><br>'; });

        return { html: html, suggestions: ['حالة الاسطول', 'توصيلات الليلة', 'ملخص الشبكة'] };
    }

    // ---- Unknown ----
    function handleUnknown() {
        return {
            html: 'عذرا، ما فهمت السؤال. جرب تسألني عن:<br><br>' +
                  '&#8226; الطلبات والتوصيلات<br>' +
                  '&#8226; حالة الاسطول<br>' +
                  '&#8226; تقييمات المواقع<br>' +
                  '&#8226; شبكة التوزيع<br>' +
                  '&#8226; مؤشرات الاداء<br><br>' +
                  'او اكتب <b>مساعدة</b> لعرض كل الاوامر.',
            suggestions: ['مساعدة', 'توصيلات الليلة', 'حالة الاسطول', 'ملخص الشبكة']
        };
    }

    // ========== INIT ==========
    document.addEventListener('DOMContentLoaded', createDOM);

})();
