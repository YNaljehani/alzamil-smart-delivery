/* ============================================
   ASDP - Shared JavaScript Utilities
   localStorage wrapper, formatters, constants
   ============================================ */

window.ASDP = window.ASDP || {};

// ---- LocalStorage Wrapper ----
ASDP.storage = {
    prefix: 'asdp_',

    save: function(key, data) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Storage save failed:', e);
            return false;
        }
    },

    load: function(key) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Storage load failed:', e);
            return null;
        }
    },

    remove: function(key) {
        localStorage.removeItem(this.prefix + key);
    },

    clear: function() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    },

    has: function(key) {
        return localStorage.getItem(this.prefix + key) !== null;
    }
};

// ---- Formatters (locale-aware) ----
ASDP.format = {
    _locale: function() { return (ASDP.lang && ASDP.lang() === 'en') ? 'en-US' : 'ar-SA'; },

    date: function(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleDateString(this._locale(), {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    },

    arabicDate: function(date) { return this.date(date); },

    time: function(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleTimeString(this._locale(), {
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    },

    arabicTime: function(date) { return this.time(date); },

    dateTime: function(date) {
        return this.date(date) + ' - ' + this.time(date);
    },

    arabicDateTime: function(date) { return this.dateTime(date); },

    currency: function(amount) {
        var suffix = (ASDP.lang && ASDP.lang() === 'en') ? ' SAR' : ' ر.س';
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M' + suffix;
        }
        return amount.toLocaleString(this._locale()) + suffix;
    },

    percentage: function(value) {
        return Math.round(value) + '%';
    }
};

// ---- ID Generator ----
ASDP.generateOrderId = function() {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return 'AZ-2026-' + num;
};

// ---- Text Constants (i18n-aware) ----
// Uses ASDP.t() from i18n.js - evaluated once at load time (page reloads on language switch)
var _t = (typeof ASDP.t === 'function') ? ASDP.t : function(k, fb) { return fb || k; };

ASDP.text = {
    scores: {
        GREEN: { label: _t('score.GREEN.label', 'أخضر'), desc: _t('score.GREEN.desc', 'الموقع جاهز للتوصيل'), icon: '✅' },
        YELLOW: { label: _t('score.YELLOW.label', 'أصفر'), desc: _t('score.YELLOW.desc', 'الوصول ممكن مع احتياطات'), icon: '⚠️' },
        RED: { label: _t('score.RED.label', 'أحمر'), desc: _t('score.RED.desc', 'الشاحنة لا تستطيع الوصول'), icon: '🚫' },
        BLACK: { label: _t('score.BLACK.label', 'أسود'), desc: _t('score.BLACK.desc', 'الموقع غير جاهز - خطر سلامة'), icon: '⛔' }
    },

    classes: {
        'A': { label: _t('class.A.label', 'الفئة أ'), desc: _t('class.A.desc', 'توصيل خفيف'), method: _t('class.A.method', 'مركبة خفيفة - نهاري') },
        'B': { label: _t('class.B.label', 'الفئة ب'), desc: _t('class.B.desc', 'توصيل ليلي مباشر'), method: _t('class.B.method', 'شاحنة ثقيلة - ليلي (9م - 6ص)') },
        'C-1': { label: _t('class.C1.label', 'الفئة ج-1'), desc: _t('class.C1.desc', 'شاحنة رافعة (رحلة واحدة)'), method: _t('class.C1.method', 'شاحنة رافعة مخصصة - نهاري - بدون تصريح') },
        'C-2': { label: _t('class.C2.label', 'الفئة ج-2'), desc: _t('class.C2.desc', 'شاحنة ثقيلة (تصريح مطلوب)'), method: _t('class.C2.method', 'شاحنة ثقيلة + تصريح | بديل: ليلي مرحلتين') },
        'D': { label: _t('class.D.label', 'الفئة د'), desc: _t('class.D.desc', 'موقع صعب - خطة خاصة'), method: _t('class.D.method', 'يتطلب تنسيق خاص وزيارة ميدانية') }
    },

    statuses: {
        pending: _t('status.pending', 'قيد الانتظار'),
        loading: _t('status.loading', 'جاري التحميل'),
        enroute: _t('status.enroute', 'في الطريق'),
        lift_duty: _t('status.lift_duty', 'مهمة رفع'),
        arrived: _t('status.arrived', 'وصلت الشاحنة'),
        delivered: _t('status.delivered', 'تم التوصيل'),
        delayed: _t('status.delayed', 'متأخر'),
        failed: _t('status.failed', 'فشل التوصيل'),
        crane_scheduled: _t('status.crane_scheduled', 'رافعة مجدولة'),
        crane_done: _t('status.crane_done', 'تم التركيب')
    },

    buildingTypes: {
        villa: _t('sra.q1_villa', 'فيلا'),
        apartment: _t('sra.q1_apartment', 'عمارة سكنية'),
        construction: _t('sra.q1_construction', 'مبنى تحت الإنشاء'),
        commercial: _t('sra.q1_commercial', 'تجاري / صناعي'),
        farm: _t('sra.q1_farm', 'مزرعة / أرض مفتوحة')
    },

    installLocations: {
        ground: _t('sra.q2_ground', 'أرضي / بجانب المبنى'),
        rooftop: _t('sra.q2_rooftop', 'سطح المبنى'),
        basement: _t('sra.q2_basement', 'قبو / تحت الأرض'),
        unknown: _t('sra.q2_unknown', 'لا أعرف بعد')
    }
};

// ---- Navigation Helper ----
ASDP.getBasePath = function() {
    const path = window.location.pathname;
    const lastSlash = path.lastIndexOf('/');
    return path.substring(0, lastSlash + 1);
};

// ---- Animated Counter ----
ASDP.animateCounter = function(element, target, duration, suffix) {
    duration = duration || 1500;
    suffix = suffix || '';
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(function() {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        if (Number.isInteger(target)) {
            element.textContent = Math.floor(start).toLocaleString(ASDP.format._locale()) + suffix;
        } else {
            element.textContent = start.toFixed(1) + suffix;
        }
    }, 16);
};

// ---- Demo Data Check ----
ASDP.isDemoLoaded = function() {
    return ASDP.storage.has('orders') && ASDP.storage.has('fleet');
};

// ---- Initialize on every page ----
document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.asdp-navbar .nav-links a').forEach(function(link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
