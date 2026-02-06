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

// ---- Formatters ----
ASDP.format = {
    arabicDate: function(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    arabicTime: function(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },

    arabicDateTime: function(date) {
        return this.arabicDate(date) + ' - ' + this.arabicTime(date);
    },

    currency: function(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M ر.س';
        }
        return amount.toLocaleString('ar-SA') + ' ر.س';
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

// ---- Arabic Text Constants ----
ASDP.text = {
    // Score labels
    scores: {
        GREEN: { label: 'أخضر', desc: 'الموقع جاهز للتوصيل', icon: '✅' },
        YELLOW: { label: 'أصفر', desc: 'الوصول ممكن مع احتياطات', icon: '⚠️' },
        RED: { label: 'أحمر', desc: 'الشاحنة لا تستطيع الوصول', icon: '🚫' },
        BLACK: { label: 'أسود', desc: 'الموقع غير جاهز - خطر سلامة', icon: '⛔' }
    },

    // Delivery classes
    classes: {
        'A': { label: 'الفئة أ', desc: 'توصيل خفيف', method: 'مركبة خفيفة - نهاري' },
        'B': { label: 'الفئة ب', desc: 'توصيل ليلي مباشر', method: 'شاحنة ثقيلة - ليلي (9م - 6ص)' },
        'C-1': { label: 'الفئة ج-1', desc: 'شاحنة رافعة (رحلة واحدة)', method: 'شاحنة رافعة مخصصة - نهاري - بدون تصريح' },
        'C-2': { label: 'الفئة ج-2', desc: 'شاحنة ثقيلة (تصريح مطلوب)', method: 'شاحنة ثقيلة + تصريح | بديل: ليلي مرحلتين' },
        'D': { label: 'الفئة د', desc: 'موقع صعب', method: 'خطة خاصة مطلوبة' }
    },

    // Statuses
    statuses: {
        pending: 'قيد الانتظار',
        loading: 'جاري التحميل',
        enroute: 'في الطريق',
        lift_duty: 'مهمة رفع',
        arrived: 'وصلت الشاحنة',
        delivered: 'تم التوصيل',
        delayed: 'متأخر',
        failed: 'فشل التوصيل',
        crane_scheduled: 'رافعة مجدولة',
        crane_done: 'تم التركيب'
    },

    // Building types
    buildingTypes: {
        villa: 'فيلا',
        apartment: 'عمارة سكنية',
        construction: 'مبنى تحت الإنشاء',
        commercial: 'تجاري / صناعي',
        farm: 'مزرعة / أرض مفتوحة'
    },

    // Installation locations
    installLocations: {
        ground: 'أرضي / بجانب المبنى',
        rooftop: 'سطح المبنى',
        basement: 'قبو / تحت الأرض',
        unknown: 'لا أعرف بعد'
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
            element.textContent = Math.floor(start).toLocaleString('ar-SA') + suffix;
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
