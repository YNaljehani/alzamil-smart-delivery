/* ============================================
   ASDP - Mock Data
   Realistic Arabic sample data for all views
   ============================================ */

window.ASDP = window.ASDP || {};

ASDP.mockData = {

    load: function() {
        // Orders
        ASDP.storage.save('orders', this.orders);
        // Fleet
        ASDP.storage.save('fleet', this.fleet);
        // Assessments
        ASDP.storage.save('assessments', this.assessments);
        // Tonight's queue
        ASDP.storage.save('tonight_queue', this.tonightQueue);
        // KPI history
        ASDP.storage.save('kpi_history', this.kpiHistory);
        // Route coordinates
        ASDP.storage.save('route_coords', this.routeCoords);
        // Demo loaded flag
        ASDP.storage.save('demo_loaded', true);

        console.log('ASDP Demo Data loaded successfully');
    },

    // ---- Orders ----
    orders: [
        { id: 'AZ-2026-0847', customer: 'عبدالله الشمري', phone: '0551234567', city: 'الرياض', district: 'حي النرجس', tank: 'خزان عمودي 10,000 لتر', tankSize: 10000, tankModel: 'BV1000', installation: 'rooftop', status: 'confirmed', date: '2026-02-05' },
        { id: 'AZ-2026-0848', customer: 'محمد القحطاني', phone: '0559876543', city: 'الرياض', district: 'حي الياسمين', tank: 'خزان أفقي 5,000 لتر', tankSize: 5000, tankModel: 'BH500', installation: 'ground', status: 'assessed', date: '2026-02-05' },
        { id: 'AZ-2026-0849', customer: 'سعد العتيبي', phone: '0553456789', city: 'الرياض', district: 'حي العارض', tank: 'خزان عمودي 6,000 لتر', tankSize: 6000, tankModel: 'AV600', installation: 'rooftop', status: 'assessed', date: '2026-02-05' },
        { id: 'AZ-2026-0850', customer: 'فهد الدوسري', phone: '0557654321', city: 'الرياض', district: 'حي الملقا', tank: 'خزان أفقي 2,000 لتر', tankSize: 2000, tankModel: 'BH200', installation: 'ground', status: 'loading', date: '2026-02-05' },
        { id: 'AZ-2026-0851', customer: 'خالد السبيعي', phone: '0558765432', city: 'الرياض', district: 'حي الرمال', tank: 'خزان عمودي 20,000 لتر', tankSize: 20000, tankModel: 'BV2000', installation: 'rooftop', status: 'enroute', date: '2026-02-05' },
        { id: 'AZ-2026-0852', customer: 'أحمد الحربي', phone: '0552345678', city: 'جدة', district: 'حي الصفا', tank: 'خزان أفقي 10,000 لتر', tankSize: 10000, tankModel: 'AH1000', installation: 'ground', status: 'confirmed', date: '2026-02-05' },
        { id: 'AZ-2026-0853', customer: 'عمر المطيري', phone: '0554567890', city: 'الرياض', district: 'حي القيروان', tank: 'خزان أفقي 1,000 لتر', tankSize: 1000, tankModel: 'BH101', installation: 'ground', status: 'delivered', date: '2026-02-04' },
        { id: 'AZ-2026-0854', customer: 'يوسف الزهراني', phone: '0556789012', city: 'الدمام', district: 'حي الفيصلية', tank: 'خزان عمودي 3,000 لتر', tankSize: 3000, tankModel: 'BV300', installation: 'rooftop', status: 'assessed', date: '2026-02-05' },
        { id: 'AZ-2026-0855', customer: 'ناصر العنزي', phone: '0550123456', city: 'الرياض', district: 'حي طويق', tank: 'خزان أفقي 4,000 لتر', tankSize: 4000, tankModel: 'BH400', installation: 'ground', status: 'confirmed', date: '2026-02-05' },
        { id: 'AZ-2026-0856', customer: 'بندر الغامدي', phone: '0559012345', city: 'الرياض', district: 'حي الصحافة', tank: 'خزان عمودي 16,000 لتر', tankSize: 16000, tankModel: 'BV1600', installation: 'rooftop', status: 'loading', date: '2026-02-05' }
    ],

    // ---- Fleet ----
    // All heavy trucks have mounted cranes (Alzamil standard)
    // Light vehicles for small tanks only (≤1,500L)
    fleet: [
        { id: 'HV-001', type: 'heavy', name: 'شاحنة ثقيلة مع رافعة', plate: 'أ ب ج 1234', driver: 'أحمد المحمدي', driverId: 'D001', status: 'available', location: { lat: 24.7500, lng: 46.7000 }, crane: true, capacity: '4 خزانات' },
        { id: 'HV-002', type: 'heavy', name: 'شاحنة ثقيلة مع رافعة', plate: 'د هـ و 5678', driver: 'سالم الخالدي', driverId: 'D002', status: 'enroute', location: { lat: 24.7800, lng: 46.7300 }, crane: true, capacity: '4 خزانات' },
        { id: 'HV-003', type: 'heavy', name: 'شاحنة ثقيلة مع رافعة', plate: 'ز ح ط 9012', driver: 'ياسر القرني', driverId: 'D003', status: 'loading', location: { lat: 24.7500, lng: 46.7000 }, crane: true, capacity: '3 خزانات' },
        { id: 'HV-004', type: 'heavy', name: 'شاحنة ثقيلة مع رافعة', plate: 'ي ك ل 3456', driver: 'فيصل السلمي', driverId: 'D004', status: 'maintenance', location: { lat: 24.7500, lng: 46.7000 }, crane: true, capacity: '4 خزانات' },
        { id: 'HV-005', type: 'heavy', name: 'شاحنة ثقيلة مع رافعة', plate: 'ق ر ش 5678', driver: 'حسن البيشي', driverId: 'D005', status: 'available', location: { lat: 24.7400, lng: 46.6900 }, crane: true, capacity: '4 خزانات' },
        { id: 'HV-006', type: 'heavy', name: 'شاحنة ثقيلة مع رافعة', plate: 'ت ث خ 9012', driver: 'ماجد الأحمدي', driverId: 'D006', status: 'lift_duty', location: { lat: 24.8100, lng: 46.6500 }, crane: true, capacity: '4 خزانات' },
        { id: 'CT-001', type: 'crane_truck', name: 'شاحنة رافعة مخصصة (صغيرة)', plate: 'هـ ج د 4567', driver: 'راشد الحارثي', driverId: 'D009', status: 'available', location: { lat: 24.7550, lng: 46.7050 }, crane: true, craneReach: '10m', craneClass: 'CT-S', capacity: '1 خزان (حتى 3,000 لتر)', floors: '2-3 طوابق' },
        { id: 'CT-002', type: 'crane_truck', name: 'شاحنة رافعة مخصصة (متوسطة)', plate: 'و ز ح 8901', driver: 'عادل الرشيدي', driverId: 'D010', status: 'enroute', location: { lat: 24.7900, lng: 46.6600 }, crane: true, craneReach: '16m', craneClass: 'CT-M', capacity: '1 خزان (حتى 3,000 لتر)', floors: '4-5 طوابق' },
        { id: 'LV-001', type: 'light', name: 'بيك أب هايلكس', plate: 'م ن س 7890', driver: 'علي الشهري', driverId: 'D007', status: 'available', location: { lat: 24.7600, lng: 46.7100 }, crane: false, capacity: '2 خزان صغير' },
        { id: 'LV-002', type: 'light', name: 'بيك أب ديماكس', plate: 'ع ف ص 1234', driver: 'تركي المالكي', driverId: 'D008', status: 'enroute', location: { lat: 24.8000, lng: 46.6800 }, crane: false, capacity: '2 خزان صغير' }
    ],

    // ---- Assessments ----
    // Delivery Classes: A=light, B=night heavy, C-1=crane truck (no permit), C-2=heavy+permit (large tank rooftop), D=problem
    assessments: [
        { orderId: 'AZ-2026-0847', score: 88, classification: 'GREEN', deliveryClass: 'C-2', date: '2026-02-05T14:30:00' },  // 10,000L rooftop → too large for crane truck → C-2
        { orderId: 'AZ-2026-0848', score: 92, classification: 'GREEN', deliveryClass: 'B', date: '2026-02-05T13:15:00' },    // 5,000L ground → night heavy
        { orderId: 'AZ-2026-0849', score: 65, classification: 'YELLOW', deliveryClass: 'C-2', date: '2026-02-05T12:00:00' }, // 6,000L rooftop → too large → C-2
        { orderId: 'AZ-2026-0850', score: 95, classification: 'GREEN', deliveryClass: 'B', date: '2026-02-05T11:30:00' },    // 2,000L ground → night heavy
        { orderId: 'AZ-2026-0851', score: 78, classification: 'GREEN', deliveryClass: 'C-2', date: '2026-02-05T10:45:00' },  // 20,000L rooftop → too large → C-2
        { orderId: 'AZ-2026-0852', score: 42, classification: 'RED', deliveryClass: 'D', date: '2026-02-05T15:00:00' },      // RED site
        { orderId: 'AZ-2026-0853', score: 97, classification: 'GREEN', deliveryClass: 'A', date: '2026-02-04T09:00:00' },    // 1,000L ground → light vehicle
        { orderId: 'AZ-2026-0854', score: 55, classification: 'YELLOW', deliveryClass: 'C-1', date: '2026-02-05T14:00:00' }, // 3,000L rooftop → fits crane truck → C-1!
        { orderId: 'AZ-2026-0855', score: 85, classification: 'GREEN', deliveryClass: 'B', date: '2026-02-05T13:45:00' },    // 4,000L ground → night heavy
        { orderId: 'AZ-2026-0856', score: 18, classification: 'BLACK', deliveryClass: 'D', date: '2026-02-05T15:30:00' }     // BLACK site
    ],

    // ---- Today/Tonight's Delivery Queue ----
    // C-1 orders use crane trucks during daytime, B/C-2 orders use heavy trucks at night
    tonightQueue: [
        { orderId: 'AZ-2026-0854', vehicleId: 'CT-001', phase: 1, scheduledTime: '09:00', estimatedArrival: '09:40', status: 'enroute', sequence: 1, note: 'C-1: شاحنة رافعة - رحلة واحدة نهارية' },
        { orderId: 'AZ-2026-0847', vehicleId: 'HV-001', phase: 1, scheduledTime: '21:00', estimatedArrival: '21:45', status: 'loading', sequence: 1 },
        { orderId: 'AZ-2026-0848', vehicleId: 'HV-001', phase: 1, scheduledTime: '22:00', estimatedArrival: '22:30', status: 'pending', sequence: 2 },
        { orderId: 'AZ-2026-0850', vehicleId: 'HV-002', phase: 1, scheduledTime: '21:15', estimatedArrival: '21:50', status: 'enroute', sequence: 1 },
        { orderId: 'AZ-2026-0851', vehicleId: 'HV-002', phase: 1, scheduledTime: '22:30', estimatedArrival: '23:15', status: 'pending', sequence: 2 },
        { orderId: 'AZ-2026-0849', vehicleId: 'HV-003', phase: 1, scheduledTime: '21:30', estimatedArrival: '22:10', status: 'loading', sequence: 1 },
        { orderId: 'AZ-2026-0855', vehicleId: 'HV-003', phase: 1, scheduledTime: '23:00', estimatedArrival: '23:30', status: 'pending', sequence: 2 },
        { orderId: 'AZ-2026-0853', vehicleId: 'LV-001', phase: 1, scheduledTime: '08:00', estimatedArrival: '08:30', status: 'delivered', sequence: 1 },
        { orderId: 'AZ-2026-0856', vehicleId: null, phase: 0, scheduledTime: null, estimatedArrival: null, status: 'blocked', sequence: 0 }
    ],

    // ---- KPI History (last 7 days) ----
    kpiHistory: {
        dates: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        deliveries: [12, 15, 11, 18, 14, 16, 8],
        successRate: [91, 94, 88, 96, 93, 95, 92],
        assessments: [8, 12, 9, 15, 11, 13, 6],
        failedBefore: [4, 5, 3, 6, 4, 5, 2],
        failedAfter: [1, 0, 1, 0, 1, 0, 0],
        scoreDistribution: { GREEN: 62, YELLOW: 23, RED: 12, BLACK: 3 }
    },

    // ---- Route Coordinates (Riyadh: Warehouse → Customer in Al-Narjis) ----
    routeCoords: {
        warehouse: { lat: 24.7136, lng: 46.6753 },
        customer: { lat: 24.8400, lng: 46.6200 },
        waypoints: [
            [24.7136, 46.6753], [24.7180, 46.6740], [24.7220, 46.6730],
            [24.7270, 46.6720], [24.7320, 46.6710], [24.7370, 46.6690],
            [24.7420, 46.6670], [24.7470, 46.6650], [24.7520, 46.6630],
            [24.7570, 46.6610], [24.7610, 46.6590], [24.7650, 46.6570],
            [24.7700, 46.6550], [24.7740, 46.6530], [24.7780, 46.6510],
            [24.7820, 46.6490], [24.7860, 46.6460], [24.7900, 46.6430],
            [24.7940, 46.6400], [24.7970, 46.6370], [24.8000, 46.6350],
            [24.8040, 46.6330], [24.8080, 46.6310], [24.8110, 46.6290],
            [24.8140, 46.6270], [24.8170, 46.6260], [24.8200, 46.6250],
            [24.8230, 46.6240], [24.8260, 46.6230], [24.8290, 46.6220],
            [24.8320, 46.6215], [24.8350, 46.6210], [24.8370, 46.6205],
            [24.8400, 46.6200]
        ]
    },

    // ---- Hub-and-Spoke Network ----
    hubs: [
        {
            id: 'HUB-C', name: 'المركز الإقليمي - الرياض', nameEn: 'Central Hub - Riyadh',
            region: 'الوسطى', tier: 'hub',
            lat: 24.7136, lng: 46.6753,
            fleet: { heavy: 28, craneTruck: 3, light: 12 },
            craneUtilization: 82,
            inventory: { totalSKUs: 145, fastMovers: 45, slowMovers: 100 },
            maintenance: { active: 3, scheduled: 5, baysTotal: 8 },
            ordersToday: 38, ordersThisWeek: 215,
            depots: ['DEP-KHJ', 'DEP-QAS'],
            crossdockTonight: [
                { to: 'DEP-KHJ', items: 12, status: 'scheduled', time: '22:00' },
                { to: 'DEP-QAS', items: 8, status: 'scheduled', time: '23:30' }
            ]
        },
        {
            id: 'HUB-W', name: 'المركز الإقليمي - جدة', nameEn: 'Western Hub - Jeddah',
            region: 'الغربية', tier: 'hub',
            lat: 21.4858, lng: 39.1925,
            fleet: { heavy: 22, craneTruck: 2, light: 10 },
            craneUtilization: 75,
            inventory: { totalSKUs: 130, fastMovers: 40, slowMovers: 90 },
            maintenance: { active: 2, scheduled: 4, baysTotal: 6 },
            ordersToday: 29, ordersThisWeek: 178,
            depots: ['DEP-MAK', 'DEP-MED', 'DEP-TAF'],
            crossdockTonight: [
                { to: 'DEP-MAK', items: 15, status: 'loading', time: '21:00' },
                { to: 'DEP-MED', items: 6, status: 'scheduled', time: '23:00' },
                { to: 'DEP-TAF', items: 4, status: 'scheduled', time: '00:30' }
            ]
        },
        {
            id: 'HUB-E', name: 'المركز الإقليمي - الدمام', nameEn: 'Eastern Hub - Dammam',
            region: 'الشرقية', tier: 'hub',
            lat: 26.4207, lng: 50.0888,
            fleet: { heavy: 24, craneTruck: 2, light: 8 },
            craneUtilization: 88,
            inventory: { totalSKUs: 135, fastMovers: 42, slowMovers: 93 },
            maintenance: { active: 1, scheduled: 3, baysTotal: 6 },
            ordersToday: 32, ordersThisWeek: 195,
            depots: ['DEP-JUB', 'DEP-HOF'],
            crossdockTonight: [
                { to: 'DEP-JUB', items: 18, status: 'enroute', time: '21:30' },
                { to: 'DEP-HOF', items: 7, status: 'scheduled', time: '23:00' }
            ]
        },
        {
            id: 'HUB-S', name: 'المركز الإقليمي - أبها', nameEn: 'Southern Hub - Abha',
            region: 'الجنوبية', tier: 'hub',
            lat: 18.2164, lng: 42.5053,
            fleet: { heavy: 16, craneTruck: 1, light: 6 },
            craneUtilization: 65,
            inventory: { totalSKUs: 95, fastMovers: 30, slowMovers: 65 },
            maintenance: { active: 1, scheduled: 2, baysTotal: 4 },
            ordersToday: 14, ordersThisWeek: 89,
            depots: ['DEP-KMS', 'DEP-JZN', 'DEP-NJR'],
            crossdockTonight: [
                { to: 'DEP-KMS', items: 5, status: 'scheduled', time: '22:00' },
                { to: 'DEP-JZN', items: 3, status: 'scheduled', time: '01:00' }
            ]
        }
    ],

    depots: [
        { id: 'DEP-KHJ', name: 'نقطة خدمة - الخرج', nameEn: 'Depot - Al-Kharj', hubId: 'HUB-C', lat: 24.1556, lng: 47.3122, fleet: { light: 4 }, fastMovers: 18, ordersToday: 6, stockLevel: 78 },
        { id: 'DEP-QAS', name: 'نقطة خدمة - بريدة', nameEn: 'Depot - Buraydah', hubId: 'HUB-C', lat: 26.3292, lng: 43.9750, fleet: { light: 3 }, fastMovers: 15, ordersToday: 4, stockLevel: 65 },
        { id: 'DEP-MAK', name: 'نقطة خدمة - مكة', nameEn: 'Depot - Makkah', hubId: 'HUB-W', lat: 21.3891, lng: 39.8579, fleet: { light: 5 }, fastMovers: 22, ordersToday: 8, stockLevel: 82 },
        { id: 'DEP-MED', name: 'نقطة خدمة - المدينة', nameEn: 'Depot - Madinah', hubId: 'HUB-W', lat: 24.4539, lng: 39.6142, fleet: { light: 3 }, fastMovers: 14, ordersToday: 5, stockLevel: 71 },
        { id: 'DEP-TAF', name: 'نقطة خدمة - الطائف', nameEn: 'Depot - Taif', hubId: 'HUB-W', lat: 21.2703, lng: 40.4159, fleet: { light: 2 }, fastMovers: 10, ordersToday: 3, stockLevel: 58 },
        { id: 'DEP-JUB', name: 'نقطة خدمة - الجبيل', nameEn: 'Depot - Jubail', hubId: 'HUB-E', lat: 27.0046, lng: 49.6225, fleet: { light: 4 }, fastMovers: 20, ordersToday: 9, stockLevel: 85 },
        { id: 'DEP-HOF', name: 'نقطة خدمة - الأحساء', nameEn: 'Depot - Al-Hofuf', hubId: 'HUB-E', lat: 25.3648, lng: 49.5869, fleet: { light: 3 }, fastMovers: 12, ordersToday: 4, stockLevel: 73 },
        { id: 'DEP-KMS', name: 'نقطة خدمة - خميس مشيط', nameEn: 'Depot - Khamis Mushait', hubId: 'HUB-S', lat: 18.3066, lng: 42.7347, fleet: { light: 3 }, fastMovers: 12, ordersToday: 5, stockLevel: 69 },
        { id: 'DEP-JZN', name: 'نقطة خدمة - جازان', nameEn: 'Depot - Jazan', hubId: 'HUB-S', lat: 16.8894, lng: 42.5611, fleet: { light: 2 }, fastMovers: 8, ordersToday: 2, stockLevel: 55 },
        { id: 'DEP-NJR', name: 'نقطة خدمة - نجران', nameEn: 'Depot - Najran', hubId: 'HUB-S', lat: 17.4933, lng: 44.1277, fleet: { light: 2 }, fastMovers: 8, ordersToday: 2, stockLevel: 48 }
    ]
};
