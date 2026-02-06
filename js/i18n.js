/* ============================================
   ASDP - Internationalization (i18n)
   Arabic / English bilingual support
   ============================================ */

// ===== IIFE: Runs BEFORE DOMContentLoaded =====
// Sets direction, swaps Bootstrap CSS, injects font override
(function() {
    var lang = 'ar';
    try { var s = localStorage.getItem('asdp_lang'); if (s === 'en' || s === 'ar') lang = s; } catch(e) {}

    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Swap Bootstrap CSS (RTL ↔ LTR)
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href') || '';
        if (href.indexOf('bootstrap') !== -1 && href.indexOf('.css') !== -1) {
            if (lang === 'en') {
                links[i].setAttribute('href', href.replace('bootstrap.rtl.min.css', 'bootstrap.min.css').replace('bootstrap.rtl.css', 'bootstrap.css'));
            }
            break;
        }
    }

    // Font override for English
    if (lang === 'en') {
        var style = document.createElement('style');
        style.id = 'i18n-font';
        style.textContent = "body,h1,h2,h3,h4,h5,h6,.btn,input,button,textarea,select{font-family:'Segoe UI',system-ui,-apple-system,sans-serif !important;}";
        document.head.appendChild(style);
    }

    window.__asdp_lang = lang;
})();

// ===== Translation Dictionary =====
// Format: key: [Arabic, English]
var _T = {
    // ---- Common ----
    'common.brand': ['منصة الزامل الذكية للتوصيل', 'Alzamil Smart Delivery Platform'],
    'common.brand_short': ['ASDP', 'ASDP'],
    'common.footer1': ['MBSC MiM - Integrated Management Challenge | Hackathon Prototype', 'MBSC MiM - Integrated Management Challenge | Hackathon Prototype'],
    'common.footer2': ['Alzamil Smart Delivery Platform (ASDP) v1.0 - February 2026', 'Alzamil Smart Delivery Platform (ASDP) v1.0 - February 2026'],
    'common.load_demo': ['تحميل بيانات العرض التجريبي', 'Load Demo Data'],
    'common.loading': ['جاري التحميل...', 'Loading...'],
    'common.loaded': ['تم تحميل البيانات', 'Data Loaded'],
    'common.demo_desc': ['يحمل بيانات واقعية لـ 10 طلبات و 8 مركبات و جدول توصيلات كامل', 'Loads realistic data for 10 orders, 8 vehicles, and a full delivery schedule'],
    'common.no_data': ['لا توجد بيانات تجريبية', 'No Demo Data'],
    'common.no_data_desc': ['يرجى تحميل البيانات التجريبية أولاً من الصفحة الرئيسية لعرض لوحة التحكم', 'Please load demo data first from the home page to view the dashboard'],
    'common.go_home': ['الذهاب للصفحة الرئيسية', 'Go to Home Page'],

    // ---- Navigation ----
    'nav.home': ['الرئيسية', 'Home'],
    'nav.sra': ['تقييم الموقع', 'Site Assessment'],
    'nav.dashboard': ['لوحة التحكم', 'Dashboard'],
    'nav.network': ['شبكة التوزيع', 'Network'],
    'nav.tracking': ['التتبع', 'Tracking'],
    'nav.notifications': ['الإشعارات', 'Notifications'],

    // ---- Score Labels ----
    'score.GREEN.label': ['أخضر', 'Green'],
    'score.GREEN.desc': ['الموقع جاهز للتوصيل', 'Site ready for delivery'],
    'score.YELLOW.label': ['أصفر', 'Yellow'],
    'score.YELLOW.desc': ['الوصول ممكن مع احتياطات', 'Accessible with precautions'],
    'score.RED.label': ['أحمر', 'Red'],
    'score.RED.desc': ['الشاحنة لا تستطيع الوصول', 'Truck cannot access site'],
    'score.BLACK.label': ['أسود', 'Black'],
    'score.BLACK.desc': ['الموقع غير جاهز - خطر سلامة', 'Site not ready - safety hazard'],

    // ---- Delivery Class Labels ----
    'class.A.label': ['الفئة أ', 'Class A'],
    'class.A.desc': ['توصيل خفيف', 'Light delivery'],
    'class.A.method': ['مركبة خفيفة - نهاري', 'Light vehicle - daytime'],
    'class.B.label': ['الفئة ب', 'Class B'],
    'class.B.desc': ['توصيل ليلي مباشر', 'Direct night delivery'],
    'class.B.method': ['شاحنة ثقيلة - ليلي (9م - 6ص)', 'Heavy truck - night (9PM-6AM)'],
    'class.C1.label': ['الفئة ج-1', 'Class C-1'],
    'class.C1.desc': ['شاحنة رافعة (رحلة واحدة)', 'Crane truck (single trip)'],
    'class.C1.method': ['شاحنة رافعة مخصصة - نهاري - بدون تصريح', 'Dedicated crane truck - daytime - no permit'],
    'class.C2.label': ['الفئة ج-2', 'Class C-2'],
    'class.C2.desc': ['شاحنة ثقيلة (تصريح مطلوب)', 'Heavy truck (permit required)'],
    'class.C2.method': ['شاحنة ثقيلة + تصريح | بديل: ليلي مرحلتين', 'Heavy truck + permit | Alt: night two-phase'],
    'class.D.label': ['الفئة د', 'Class D'],
    'class.D.desc': ['موقع صعب - خطة خاصة', 'Difficult site - special plan'],
    'class.D.method': ['يتطلب تنسيق خاص وزيارة ميدانية', 'Requires special coordination and field visit'],

    // ---- Status Labels ----
    'status.pending': ['قيد الانتظار', 'Pending'],
    'status.loading': ['جاري التحميل', 'Loading'],
    'status.enroute': ['في الطريق', 'En Route'],
    'status.arrived': ['وصلت الشاحنة', 'Truck Arrived'],
    'status.delivered': ['تم التوصيل', 'Delivered'],
    'status.delayed': ['متأخر', 'Delayed'],
    'status.failed': ['فشل التوصيل', 'Failed'],
    'status.blocked': ['محظور', 'Blocked'],
    'status.confirmed': ['مؤكد', 'Confirmed'],
    'status.assessed': ['تم التقييم', 'Assessed'],
    'status.lift_duty': ['مهمة رفع', 'Lift Duty'],
    'status.crane_scheduled': ['رافعة مجدولة', 'Crane Scheduled'],
    'status.crane_done': ['تم التركيب', 'Installed'],
    'status.maintenance': ['صيانة', 'Maintenance'],
    'status.available': ['متاح', 'Available'],
    'status.scheduled': ['مجدول', 'Scheduled'],

    // ---- Index Page ----
    'index.hero_title': ['منصة الزامل الذكية للتوصيل', 'Alzamil Smart Delivery Platform'],
    'index.hero_subtitle': ['ASDP - Alzamil Smart Delivery Platform', 'ASDP - Alzamil Smart Delivery Platform'],
    'index.hero_features': ['تقييم ذكي للمواقع • توصيل ليلي بدون تصاريح • شبكة Hub & Spoke • تتبع مباشر', 'Smart site assessment \u2022 Night delivery without permits \u2022 Hub & Spoke network \u2022 Live tracking'],
    'index.customer_title': ['تجربة العميل', 'Customer Experience'],
    'index.customer_desc': ['اختبر رحلة العميل من تقييم الموقع حتى استلام الخزان', 'Experience the customer journey from site assessment to tank delivery'],
    'index.customer_sra': ['تقييم جاهزية الموقع', 'Site Readiness Assessment'],
    'index.customer_tracking': ['تتبع التوصيل', 'Delivery Tracking'],
    'index.customer_whatsapp': ['محاكاة إشعارات واتساب', 'WhatsApp Notifications'],
    'index.ops_title': ['فريق العمليات', 'Operations Team'],
    'index.ops_desc': ['لوحة تحكم العمليات - جدول التوصيلات، المركبات، مؤشرات الأداء', 'Operations dashboard - deliveries, vehicles, KPIs'],
    'index.ops_dashboard': ['لوحة التحكم الرئيسية', 'Main Dashboard'],
    'index.ops_network': ['شبكة التوزيع (Hub & Spoke)', 'Distribution Network (Hub & Spoke)'],
    'index.ops_queue': ['جدول توصيلات الليلة', "Tonight's Deliveries"],
    'index.ops_fleet': ['حالة الأسطول', 'Fleet Status'],
    'index.stat_orders': ['طلبات', 'Orders'],
    'index.stat_vehicles': ['مركبات', 'Vehicles'],
    'index.stat_tonight': ['توصيلات الليلة', "Tonight's Deliveries"],
    'index.stat_assessments': ['تقييمات', 'Assessments'],

    // ---- Dashboard ----
    'dash.title': ['لوحة تحكم العمليات', 'Operations Dashboard'],
    'dash.shift_label': ['الوردية الحالية:', 'Current Shift:'],
    'dash.shift_prep': ['التحضير (6م - 9م)', 'Preparation (6PM - 9PM)'],
    'dash.user_role': ['مدير العمليات', 'Operations Manager'],
    'dash.kpi_deliveries': ['توصيلات الليلة', "Tonight's Deliveries"],
    'dash.kpi_success': ['نسبة النجاح', 'Success Rate'],
    'dash.kpi_assessments': ['تقييمات مكتملة', 'Completed Assessments'],
    'dash.kpi_savings': ['التوفير الشهري (ر.س)', 'Monthly Savings (SAR)'],
    'dash.network_title': ['شبكة التوزيع - Hub & Spoke', 'Distribution Network - Hub & Spoke'],
    'dash.network_desc': ['6 مراكز إقليمية | 18 نقطة خدمة | شبكة توزيع متكاملة', '6 Regional Hubs | 18 Service Depots | Integrated network'],
    'dash.network_heavy': ['شاحنة ثقيلة', 'Heavy Trucks'],
    'dash.network_crane': ['شاحنة رافعة', 'Crane Trucks'],
    'dash.network_light': ['مركبة خفيفة', 'Light Vehicles'],
    'dash.network_util': ['استخدام الرافعات', 'Crane Utilization'],
    'dash.timeline_title': ['جدول الورديات الليلية', 'Night Shift Schedule'],
    'dash.timeline_prep': ['تحضير', 'Prep'],
    'dash.timeline_delivery': ['توصيل', 'Delivery'],
    'dash.timeline_wrapup': ['إنهاء', 'Wrap-up'],
    'dash.queue_title': ['جدول توصيلات الليلة', "Tonight's Delivery Queue"],
    'dash.th_num': ['#', '#'],
    'dash.th_order': ['رقم الطلب', 'Order #'],
    'dash.th_customer': ['العميل', 'Customer'],
    'dash.th_district': ['الحي', 'District'],
    'dash.th_tank': ['الخزان', 'Tank'],
    'dash.th_sra': ['تقييم الموقع', 'Site Assessment'],
    'dash.th_class': ['فئة التوصيل', 'Delivery Class'],
    'dash.th_vehicle': ['المركبة', 'Vehicle'],
    'dash.th_driver': ['السائق', 'Driver'],
    'dash.th_status': ['الحالة', 'Status'],
    'dash.th_eta': ['الوصول المتوقع', 'ETA'],
    'dash.chart_score': ['توزيع تقييمات المواقع', 'Site Assessment Distribution'],
    'dash.chart_daily': ['التوصيلات اليومية (آخر 7 أيام)', 'Daily Deliveries (Last 7 Days)'],
    'dash.chart_label': ['عدد التوصيلات', 'Deliveries'],
    'dash.fleet_title': ['حالة الأسطول', 'Fleet Status'],
    'dash.crane_badge': ['رافعة', 'Crane'],
    'dash.unassigned': ['غير محدد', 'Unassigned'],
    'dash.deliveries_count': ['توصيلات', 'deliveries'],
    'dash.weekdays': [['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'], ['Sat','Sun','Mon','Tue','Wed','Thu','Fri']],
    'dash.chart_colors': [['أخضر','أصفر','أحمر','أسود'], ['Green','Yellow','Red','Black']],

    // ---- SRA Form ----
    'sra.title': ['تقييم جاهزية الموقع', 'Site Readiness Assessment'],
    'sra.welcome_title': ['تقييم جاهزية الموقع للتوصيل', 'Site Readiness Assessment for Delivery'],
    'sra.welcome_desc': ['سيقوم هذا التقييم بتحليل موقعك لتحديد أفضل طريقة توصيل', 'This assessment will analyze your site to determine the best delivery method'],
    'sra.start_btn': ['ابدأ التقييم', 'Start Assessment'],
    'sra.step_welcome': ['ترحيب', 'Welcome'],
    'sra.step_location': ['الموقع', 'Location'],
    'sra.step_questions': ['الأسئلة', 'Questions'],
    'sra.step_photos': ['الصور', 'Photos'],
    'sra.step_review': ['مراجعة', 'Review'],
    'sra.step_analysis': ['تحليل', 'Analysis'],
    'sra.step_result': ['النتيجة', 'Result'],
    'sra.q_counter': ['سؤال {n} من 9', 'Question {n} of 9'],
    'sra.next': ['التالي', 'Next'],
    'sra.prev': ['السابق', 'Previous'],
    'sra.submit': ['إرسال التقييم', 'Submit Assessment'],

    // SRA Questions
    'sra.q1': ['ما نوع المبنى؟', 'What is the building type?'],
    'sra.q1_villa': ['فيلا', 'Villa'],
    'sra.q1_apartment': ['عمارة سكنية', 'Residential Building'],
    'sra.q1_construction': ['مبنى تحت الإنشاء', 'Under Construction'],
    'sra.q1_commercial': ['تجاري / صناعي', 'Commercial / Industrial'],
    'sra.q1_farm': ['مزرعة / أرض مفتوحة', 'Farm / Open Land'],
    'sra.q2': ['أين سيتم تركيب الخزان؟', 'Where will the tank be installed?'],
    'sra.q2_ground': ['أرضي / بجانب المبنى', 'Ground level / beside building'],
    'sra.q2_rooftop': ['سطح المبنى', 'Rooftop'],
    'sra.q2_basement': ['قبو / تحت الأرض', 'Basement / underground'],
    'sra.q2_unknown': ['لا أعرف بعد', "Don't know yet"],
    'sra.q3': ['كم عدد طوابق المبنى؟', 'How many floors does the building have?'],
    'sra.q3_1': ['طابق واحد (دور أرضي)', '1 floor (ground)'],
    'sra.q3_2': ['طابقين', '2 floors'],
    'sra.q3_3': ['3 طوابق', '3 floors'],
    'sra.q3_4_5': ['4-5 طوابق', '4-5 floors'],
    'sra.q3_6plus': ['6 طوابق أو أكثر', '6+ floors'],
    'sra.q4': ['ما حالة الطريق المؤدي للموقع؟', 'What is the road condition to the site?'],
    'sra.q4_paved': ['معبد وبحالة جيدة', 'Paved and in good condition'],
    'sra.q4_partial': ['معبد جزئياً', 'Partially paved'],
    'sra.q4_unpaved': ['غير معبد (ترابي)', 'Unpaved (dirt road)'],
    'sra.q4_construction': ['تحت الإنشاء / مقطوع', 'Under construction / blocked'],
    'sra.q5': ['هل تستطيع شاحنة كبيرة الوصول للموقع؟', 'Can a large truck access the site?'],
    'sra.q5_easy': ['نعم، بسهولة', 'Yes, easily'],
    'sra.q5_tight': ['نعم، لكن الشارع ضيق', 'Yes, but the street is narrow'],
    'sra.q5_impossible': ['لا، مستحيل', 'No, impossible'],
    'sra.q5_unsure': ['غير متأكد', 'Not sure'],
    'sra.q6': ['هل يوجد مكان لوقوف الشاحنة؟', 'Is there parking space for the truck?'],
    'sra.q6_yes': ['نعم، مساحة كافية', 'Yes, enough space'],
    'sra.q6_limited': ['مساحة محدودة', 'Limited space'],
    'sra.q6_none': ['لا يوجد مكان', 'No space available'],
    'sra.q6_street': ['في الشارع فقط', 'Street only'],
    'sra.q7': ['هل توجد أسلاك كهربائية فوق موقع التركيب؟', 'Are there power lines above the installation site?'],
    'sra.q7_none': ['لا توجد أسلاك', 'No power lines'],
    'sra.q7_far': ['توجد لكن بعيدة', 'Yes, but far away'],
    'sra.q7_near': ['توجد وقريبة', 'Yes, and nearby'],
    'sra.q7_direct': ['مباشرة فوق الموقع', 'Directly above site'],
    'sra.q8': ['هل توجد عوائق في الموقع؟', 'Are there obstacles at the site?'],
    'sra.q8_none': ['لا توجد عوائق', 'No obstacles'],
    'sra.q8_materials': ['مواد بناء', 'Construction materials'],
    'sra.q8_vehicles': ['سيارات متوقفة', 'Parked vehicles'],
    'sra.q8_trees': ['أشجار / مزروعات', 'Trees / plants'],
    'sra.q8_gate': ['بوابة ضيقة', 'Narrow gate'],
    'sra.q9': ['هل يوجد طريق بديل للوصول؟', 'Is there an alternative access road?'],
    'sra.q9_yes': ['نعم', 'Yes'],
    'sra.q9_no': ['لا', 'No'],
    'sra.q9_unsure': ['لا أعرف', "Don't know"],

    // SRA Photos & Review
    'sra.photo_title': ['التقط صور الموقع', 'Take Site Photos'],
    'sra.photo_front': ['واجهة المبنى', 'Building Front'],
    'sra.photo_road': ['الطريق / المدخل', 'Road / Entrance'],
    'sra.photo_install': ['موقع التركيب', 'Installation Location'],
    'sra.photo_obstacles': ['العوائق (إن وجدت)', 'Obstacles (if any)'],
    'sra.review_title': ['مراجعة الإجابات', 'Review Answers'],
    'sra.review_info': ['معلومات الطلب', 'Order Information'],
    'sra.review_answers': ['الإجابات', 'Answers'],
    'sra.review_photos': ['الصور', 'Photos'],
    'sra.analyzing': ['جاري تحليل البيانات...', 'Analyzing data...'],
    'sra.result_score': ['درجة التقييم', 'Assessment Score'],
    'sra.result_class': ['فئة التوصيل الموصى بها', 'Recommended Delivery Class'],
    'sra.result_risks': ['المخاطر والملاحظات', 'Risks and Notes'],
    'sra.result_actions': ['الإجراءات المطلوبة', 'Required Actions'],

    // ---- Tracking ----
    'track.title': ['تتبع التوصيل', 'Delivery Tracking'],
    'track.back': ['العودة', 'Back'],
    'track.eta_minutes': ['الوصول خلال {n} دقائق', 'Arriving in {n} minutes'],
    'track.eta_one': ['الوصول خلال دقيقة واحدة', 'Arriving in 1 minute'],
    'track.eta_now': ['الوصول الآن...', 'Arriving now...'],
    'track.eta_delivered': ['تم التوصيل!', 'Delivered!'],
    'track.info_order': ['رقم الطلب', 'Order #'],
    'track.info_customer': ['العميل', 'Customer'],
    'track.info_tank': ['الخزان', 'Tank'],
    'track.info_class': ['فئة التوصيل', 'Delivery Class'],
    'track.info_from': ['المستودع', 'Warehouse'],
    'track.driver': ['السائق', 'Driver'],
    'track.call': ['اتصال', 'Call'],
    'track.step1': ['تم تأكيد الطلب', 'Order Confirmed'],
    'track.step2': ['جاري تحميل الشاحنة', 'Loading Truck'],
    'track.step3': ['الشاحنة في الطريق', 'Truck En Route'],
    'track.step4': ['الشاحنة وصلت', 'Truck Arrived'],
    'track.step5': ['جاري التفريغ', 'Unloading'],
    'track.step6': ['تم التوصيل بنجاح', 'Delivered Successfully'],
    'track.phase2_title': ['المرحلة الثانية - رفع الخزان', 'Phase 2 - Tank Lifting'],
    'track.phase2_desc': ['سيتم إرسال الرافعة في الصباح', 'Crane will be dispatched in the morning'],
    'track.phase2_status': ['مجدول غداً 8:00 صباحاً', 'Scheduled tomorrow 8:00 AM'],
    'track.celebration': ['تم التوصيل بنجاح!', 'Delivered Successfully!'],
    'track.popup_warehouse': ['مستودع الزامل', 'Alzamil Warehouse'],
    'track.popup_customer': ['موقع التوصيل', 'Delivery Location'],

    // ---- Network ----
    'net.title': ['شبكة التوزيع - Hub & Spoke', 'Distribution Network - Hub & Spoke'],
    'net.back_dashboard': ['لوحة التحكم', 'Dashboard'],
    'net.back_home': ['الرئيسية', 'Home'],
    'net.kpi_hubs': ['مراكز إقليمية (Hubs)', 'Regional Hubs'],
    'net.kpi_depots': ['نقاط خدمة (Depots)', 'Service Depots'],
    'net.kpi_heavy': ['شاحنة ثقيلة', 'Heavy Trucks'],
    'net.kpi_crane': ['شاحنة رافعة مخصصة', 'Crane Trucks'],
    'net.kpi_orders': ['طلب اليوم', "Today's Orders"],
    'net.kpi_util': ['متوسط استخدام الرافعات', 'Avg. Crane Utilization'],
    'net.panel_hubs': ['المراكز الإقليمية (Hubs)', 'Regional Hubs'],
    'net.panel_depots': ['نقاط الخدمة (Depots)', 'Service Depots'],
    'net.panel_crossdock': ['تجهيزات الليلة (Cross-Dock)', "Tonight's Cross-Dock"],
    'net.detail_back': ['العودة للقائمة', 'Back to List'],
    'net.detail_stats': ['الإحصائيات', 'Statistics'],
    'net.detail_fleet': ['الأسطول', 'Fleet'],
    'net.detail_util': ['الاستخدام والصيانة', 'Utilization & Maintenance'],
    'net.detail_crossdock': ['تجهيزات الليلة', "Tonight's Transfers"],
    'net.stat_orders_today': ['طلب اليوم', "Today's Orders"],
    'net.stat_orders_week': ['طلب هذا الأسبوع', "This Week's Orders"],
    'net.stat_vehicles': ['إجمالي المركبات', 'Total Vehicles'],
    'net.stat_products': ['إجمالي المنتجات', 'Total Products'],
    'net.fleet_heavy': ['شاحنات ثقيلة', 'Heavy Trucks'],
    'net.fleet_crane': ['شاحنات رافعة مخصصة', 'Dedicated Crane Trucks'],
    'net.fleet_light': ['مركبات خفيفة', 'Light Vehicles'],
    'net.depot_note': ['الشاحنات الثقيلة والرافعات تُرسل من المركز الإقليمي عند الحاجة', 'Heavy trucks and cranes dispatched from regional hub on demand'],
    'net.hub_label': ['مركز إقليمي', 'Regional Hub'],
    'net.depot_label': ['نقطة خدمة', 'Service Depot'],
    'net.depot_follows': ['تابعة لـ', 'Assigned to'],
    'net.stock_level': ['مخزون', 'Stock'],
    'net.fast_movers': ['منتج سريع الحركة', 'Fast-moving products'],
    'net.stock_label': ['مستوى المخزون', 'Stock Level'],
    'net.vehicle_label': ['مركبة', 'vehicle'],
    'net.order_label': ['طلب', 'order'],
    'net.crossdock_product': ['منتج', 'product'],
    'net.crossdock_enroute': ['في الطريق', 'En Route'],
    'net.crossdock_loading': ['جاري التحميل', 'Loading'],
    'net.crossdock_scheduled': ['مجدول', 'Scheduled'],
    'net.util_crane': ['استخدام الرافعات', 'Crane Utilization'],
    'net.util_maintenance': ['سعة الصيانة', 'Maintenance Capacity'],
    'net.maint_active': ['صيانة نشطة', 'Active Maintenance'],
    'net.maint_scheduled': ['مجدولة', 'Scheduled'],
    'net.maint_bays': ['حجرات', 'Bays'],
    'net.no_crossdock': ['لا توجد تجهيزات الليلة', 'No transfers tonight'],
    'net.legend_title': ['دليل الخريطة', 'Map Legend'],
    'net.legend_hub': ['مركز إقليمي (Hub)', 'Regional Hub'],
    'net.legend_depot': ['نقطة خدمة (Depot)', 'Service Depot'],
    'net.legend_spoke': ['خط توزيع (Spoke)', 'Distribution Line (Spoke)'],
    'net.crane_util_label': ['رافعات', 'cranes'],

    // ---- WhatsApp ----
    'wa.title': ['محاكاة إشعارات واتساب', 'WhatsApp Notifications Simulation'],
    'wa.header_title': ['إشعارات واتساب - ASDP', 'WhatsApp Notifications - ASDP'],
    'wa.header_desc': ['محاكاة لإشعارات العميل أثناء عملية التوصيل', 'Simulation of customer notifications during delivery'],
    'wa.business': ['الزامل للخزانات', 'Alzamil Tanks'],
    'wa.business_status': ['حساب تجاري', 'Business Account'],
    'wa.today': ['اليوم', 'Today'],
    'wa.placeholder': ['اكتب رسالة', 'Type a message'],
    'wa.restart': ['إعادة تشغيل', 'Restart'],
    'wa.stop': ['إيقاف', 'Stop'],
    'wa.resume': ['استئناف', 'Resume'],
    'wa.typing': ['يكتب...', 'typing...'],
    'wa.progress': ['التقدم', 'Progress'],

    // ---- Chat Agent ----
    'chat.name': ['المساعد الذكي - ASDP', 'Smart Assistant - ASDP'],
    'chat.status': ['متصل الآن', 'Online'],
    'chat.placeholder': ['اكتب سؤالك هنا...', 'Type your question here...'],
    'chat.welcome': ['مرحبا! انا المساعد الذكي لمنصة ASDP', 'Hello! I\'m the ASDP Smart Assistant'],
    'chat.welcome_body': ['اقدر اساعدك في:', 'I can help you with:'],
    'chat.welcome_1': ['استعلام عن الطلبات والتوصيلات', 'Order and delivery inquiries'],
    'chat.welcome_2': ['حالة الاسطول والمركبات', 'Fleet and vehicle status'],
    'chat.welcome_3': ['نتائج تقييمات المواقع (SRA)', 'Site assessment results (SRA)'],
    'chat.welcome_4': ['معلومات شبكة التوزيع', 'Distribution network info'],
    'chat.welcome_5': ['مؤشرات الاداء والاحصائيات', 'KPIs and statistics'],
    'chat.welcome_try': ['جرب تسألني اي شيء!', 'Try asking me anything!'],
    'chat.greeting': ['اهلا وسهلا! كيف اقدر اساعدك؟', 'Hello! How can I help you?'],
    'chat.identity': ['انا المساعد الذكي لمنصة الزامل الذكية للتوصيل (ASDP). مهمتي مساعدة فريق العمليات في متابعة الطلبات والاسطول وشبكة التوزيع.', "I'm the ASDP smart assistant. I help the operations team track orders, fleet, and distribution network."],
    'chat.thanks': ['العفو! اذا تحتاج اي شيء ثاني، انا هنا.', "You're welcome! I'm here if you need anything else."],
    'chat.sug_tonight': ['توصيلات الليلة', "Tonight's Deliveries"],
    'chat.sug_fleet': ['حالة الاسطول', 'Fleet Status'],
    'chat.sug_network': ['ملخص الشبكة', 'Network Summary'],
    'chat.sug_kpis': ['المؤشرات', 'KPIs'],
    'chat.sug_assessments': ['التقييمات', 'Assessments'],
    'chat.sug_orders': ['عرض كل الطلبات', 'View All Orders'],
    'chat.sug_crane': ['الرافعات', 'Crane Trucks'],
    'chat.sug_recommend': ['توصية', 'Recommendation'],
    'chat.sug_help': ['مساعدة', 'Help'],
    'chat.sug_what': ['ايش تقدر تسوي؟', 'What can you do?'],
    'chat.no_data': ['لم يتم تحميل البيانات التجريبية بعد.', 'Demo data has not been loaded yet.'],
    'chat.no_data_link': ['للصفحة الرئيسية', 'to the home page'],
    'chat.order_title': ['تفاصيل الطلب', 'Order Details'],
    'chat.order_not_found': ['لم اجد طلب برقم', 'No order found with ID'],
    'chat.order_customer': ['العميل', 'Customer'],
    'chat.order_district': ['الحي', 'District'],
    'chat.order_tank': ['الخزان', 'Tank'],
    'chat.order_install': ['التركيب', 'Installation'],
    'chat.order_status': ['الحالة', 'Status'],
    'chat.order_sra': ['تقييم SRA', 'SRA Assessment'],
    'chat.order_class': ['فئة التوصيل', 'Delivery Class'],
    'chat.order_vehicle': ['المركبة', 'Vehicle'],
    'chat.order_time': ['الموعد', 'Schedule'],
    'chat.install_rooftop': ['سطح', 'Rooftop'],
    'chat.install_ground': ['ارضي', 'Ground'],
    'chat.fleet_title': ['حالة الاسطول', 'Fleet Status'],
    'chat.fleet_by_type': ['حسب النوع:', 'By Type:'],
    'chat.fleet_by_status': ['حسب الحالة:', 'By Status:'],
    'chat.fleet_heavy': ['شاحنات ثقيلة', 'Heavy Trucks'],
    'chat.fleet_crane': ['شاحنات رافعة', 'Crane Trucks'],
    'chat.fleet_light': ['مركبات خفيفة', 'Light Vehicles'],
    'chat.fleet_available': ['متاح الآن', 'Available Now'],
    'chat.tonight_title': ['جدول توصيلات الليلة', "Tonight's Delivery Schedule"],
    'chat.assessments_title': ['ملخص تقييمات المواقع (SRA)', 'Site Assessments Summary (SRA)'],
    'chat.assessments_dist': ['توزيع التصنيفات:', 'Score Distribution:'],
    'chat.assessments_classes': ['فئات التوصيل:', 'Delivery Classes:'],
    'chat.network_title': ['شبكة التوزيع - Hub & Spoke', 'Distribution Network - Hub & Spoke'],
    'chat.network_hubs': ['مراكز اقليمية', 'Regional Hubs'],
    'chat.network_depots': ['نقطة خدمة', 'Service Depots'],
    'chat.network_total_fleet': ['اجمالي الاسطول:', 'Total Fleet:'],
    'chat.network_orders_today': ['طلبات اليوم:', "Today's Orders:"],
    'chat.kpi_title': ['مؤشرات الاداء الرئيسية', 'Key Performance Indicators'],
    'chat.kpi_avg_daily': ['متوسط التوصيلات اليومي:', 'Average Daily Deliveries:'],
    'chat.kpi_avg_success': ['متوسط نسبة النجاح:', 'Average Success Rate:'],
    'chat.kpi_reduction': ['تخفيض التوصيلات الفاشلة:', 'Failed Delivery Reduction:'],
    'chat.kpi_before_after': ['قبل: {b} | بعد: {a} (اسبوعيا)', 'Before: {b} | After: {a} (weekly)'],
    'chat.kpi_tonight': ['توصيلات الليلة:', "Tonight's Deliveries:"],
    'chat.crane_title': ['شاحنات الرافعة المخصصة', 'Dedicated Crane Trucks'],
    'chat.crane_fleet': ['الاسطول الحالي', 'Current Fleet'],
    'chat.crane_dist': ['التوزيع على المراكز:', 'Distribution Across Hubs:'],
    'chat.crane_total': ['اجمالي الشاحنات الرافعة:', 'Total Crane Trucks:'],
    'chat.crane_note': ['الشاحنات الرافعة المخصصة لا تحتاج تصريح دخول المدينة وتوصل + تركب في رحلة واحدة نهارية (فئة ج-1)', 'Dedicated crane trucks need no city entry permit and deliver + install in a single daytime trip (Class C-1)'],
    'chat.recommend_title': ['توصيات المساعد الذكي', 'Smart Recommendations'],
    'chat.recommend_blocked': ['يوجد {n} طلب محظور يحتاج معالجة خاصة (تصنيف RED/BLACK).', '{n} blocked order(s) need special handling (RED/BLACK classification).'],
    'chat.recommend_available': ['يوجد {n} مركبة متاحة يمكن تخصيصها لطلبات جديدة.', '{n} vehicle(s) available for new order assignment.'],
    'chat.recommend_util': ['استخدام الرافعات في {hub} مرتفع ({pct}%). فكر في تحويل بعض الطلبات.', 'Crane utilization at {hub} is high ({pct}%). Consider redistributing orders.'],
    'chat.recommend_stock': ['نقاط خدمة مخزونها اقل من 50%', 'Service depots with stock below 50%'],
    'chat.recommend_maintenance': ['مركبة في الصيانة', 'vehicle(s) in maintenance'],
    'chat.recommend_all_good': ['كل شيء يعمل بشكل ممتاز! لا توجد تنبيهات حالية.', 'Everything is running smoothly! No alerts.'],
    'chat.help_title': ['الاوامر المتاحة:', 'Available Commands:'],
    'chat.unknown': ['عذرا، ما فهمت السؤال. جرب تسألني عن:', "Sorry, I didn't understand. Try asking about:"],
    'chat.unknown_1': ['الطلبات والتوصيلات', 'Orders and deliveries'],
    'chat.unknown_2': ['حالة الاسطول', 'Fleet status'],
    'chat.unknown_3': ['تقييمات المواقع', 'Site assessments'],
    'chat.unknown_4': ['شبكة التوزيع', 'Distribution network'],
    'chat.unknown_5': ['مؤشرات الاداء', 'Performance KPIs'],
    'chat.unknown_help': ['او اكتب مساعدة لعرض كل الاوامر.', 'Or type "help" to see all commands.'],
    'chat.orders_summary': ['ملخص الطلبات', 'Orders Summary'],
    'chat.orders_detail_hint': ['للاستعلام عن طلب محدد، اكتب رقم الطلب مثل AZ-2026-0847', 'To check a specific order, type the order ID like AZ-2026-0847'],
    'chat.alert': ['تنبيه:', 'Alert:'],
    'chat.opportunity': ['فرصة:', 'Opportunity:'],
    'chat.warning': ['تحذير:', 'Warning:'],
    'chat.stock_warning': ['مخزون:', 'Stock:'],
    'chat.maintenance_label': ['صيانة:', 'Maintenance:'],
    'chat.utilization': ['استخدام:', 'Usage:']
};

// ===== API =====
window.ASDP = window.ASDP || {};

var _currentLang = window.__asdp_lang || 'ar';

ASDP.t = function(key, fallback) {
    var entry = _T[key];
    if (!entry) return fallback || key;
    // Support array values (e.g., weekdays)
    if (Array.isArray(entry[0])) return _currentLang === 'ar' ? entry[0] : entry[1];
    return _currentLang === 'ar' ? entry[0] : entry[1];
};

ASDP.lang = function() { return _currentLang; };
ASDP.isRTL = function() { return _currentLang === 'ar'; };

ASDP.switchLang = function(lang) {
    try { localStorage.setItem('asdp_lang', lang); } catch(e) {}
    location.reload();
};

ASDP.toggleLang = function() {
    ASDP.switchLang(_currentLang === 'ar' ? 'en' : 'ar');
};

// ===== DOM Ready: Apply translations + Create toggle =====
document.addEventListener('DOMContentLoaded', function() {
    // Apply data-i18n attributes
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute('data-i18n');
        var val = ASDP.t(key);
        if (val && val !== key) els[i].textContent = val;
    }

    // Apply data-i18n-html (innerHTML)
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var h = 0; h < htmlEls.length; h++) {
        var hkey = htmlEls[h].getAttribute('data-i18n-html');
        var hval = ASDP.t(hkey);
        if (hval && hval !== hkey) htmlEls[h].innerHTML = hval;
    }

    // Apply data-i18n-placeholder
    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var p = 0; p < phEls.length; p++) {
        var pkey = phEls[p].getAttribute('data-i18n-placeholder');
        var pval = ASDP.t(pkey);
        if (pval && pval !== pkey) phEls[p].placeholder = pval;
    }

    // Create language toggle button
    var btn = document.createElement('button');
    btn.className = 'lang-toggle-btn';
    btn.setAttribute('aria-label', 'Switch language');
    btn.onclick = function() { ASDP.toggleLang(); };
    if (_currentLang === 'ar') {
        btn.innerHTML = 'EN';
        btn.title = 'Switch to English';
    } else {
        btn.innerHTML = 'ع';
        btn.title = 'التبديل للعربية';
    }
    document.body.appendChild(btn);
});
