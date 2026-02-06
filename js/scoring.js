/* ============================================
   ASDP - SRA Scoring Algorithm
   Based on Solution Document Appendix A
   ============================================ */

window.ASDP = window.ASDP || {};

ASDP.scoring = {

    /**
     * Calculate SRA Score from questionnaire answers
     * @param {Object} answers - The questionnaire answers
     * @param {string} answers.building_type - villa|apartment|construction|commercial|farm
     * @param {string} answers.installation - ground|rooftop|basement|unknown
     * @param {string} answers.road_paved - yes|partially|no|under_construction
     * @param {string} answers.truck_access - yes|tight|no|not_sure
     * @param {string} answers.parking_space - yes|limited|no|not_sure
     * @param {string} answers.power_lines - none|nearby|directly_above|not_sure
     * @param {Array} answers.obstacles - array of: none|construction_materials|parked_vehicles|narrow_gate|trees|other
     * @param {string} answers.alternative_road - yes|no|not_sure
     * @param {number} tankSize - Tank capacity in liters
     * @returns {Object} Score result
     */
    calculate: function(answers, tankSize) {
        var score = 100;
        var deductions = [];
        var risks = [];
        var actions = [];

        // ---- Road Assessment (max -40 points) ----
        if (answers.road_paved === 'no' || answers.road_paved === 'under_construction') {
            score -= 30;
            deductions.push({ category: 'طريق', points: -30, reason: 'الطريق غير معبد أو تحت الإنشاء' });
            risks.push('الطريق غير معبد - قد تعلق الشاحنة الثقيلة');
            actions.push('يجب تعبيد أو تمهيد الطريق قبل التوصيل');
        } else if (answers.road_paved === 'partially') {
            score -= 15;
            deductions.push({ category: 'طريق', points: -15, reason: 'الطريق معبد جزئياً' });
            risks.push('الطريق معبد جزئياً - قد يواجه السائق صعوبة');
        }

        if (answers.truck_access === 'no') {
            score -= 40;
            deductions.push({ category: 'وصول', points: -40, reason: 'الشاحنة لا تستطيع الوصول' });
            risks.push('لا يمكن لشاحنة ثقيلة الوصول إلى الموقع');
            actions.push('يجب توفير طريق بديل بعرض 3 أمتار على الأقل');
        } else if (answers.truck_access === 'tight') {
            score -= 15;
            deductions.push({ category: 'وصول', points: -15, reason: 'الطريق ضيق' });
            risks.push('الطريق ضيق - يحتاج سائق ذو خبرة');
        } else if (answers.truck_access === 'not_sure') {
            score -= 20;
            deductions.push({ category: 'وصول', points: -20, reason: 'إمكانية الوصول غير مؤكدة' });
            risks.push('إمكانية وصول الشاحنة غير مؤكدة');
            actions.push('سيتم إرسال فريق لمعاينة الموقع قبل التوصيل');
        }

        // ---- Site Assessment (max -30 points) ----
        if (answers.parking_space === 'no') {
            score -= 25;
            deductions.push({ category: 'موقف', points: -25, reason: 'لا توجد مساحة وقوف' });
            risks.push('لا توجد مساحة لوقوف الشاحنة والعمل بالرافعة');
            actions.push('يجب توفير مساحة وقوف للشاحنة بالقرب من المبنى');
        } else if (answers.parking_space === 'limited') {
            score -= 10;
            deductions.push({ category: 'موقف', points: -10, reason: 'مساحة وقوف محدودة' });
            risks.push('مساحة الوقوف محدودة');
        }

        if (answers.obstacles && answers.obstacles.length > 0) {
            if (answers.obstacles.indexOf('none') === -1) {
                if (answers.obstacles.indexOf('construction_materials') !== -1 ||
                    answers.obstacles.indexOf('parked_vehicles') !== -1) {
                    score -= 15;
                    deductions.push({ category: 'عوائق', points: -15, reason: 'مواد بناء أو مركبات تعيق الوصول' });
                    risks.push('عوائق في الطريق تحتاج إزالة');
                    actions.push('يرجى إزالة أي مواد بناء أو مركبات متوقفة من الطريق');
                }
                if (answers.obstacles.indexOf('narrow_gate') !== -1) {
                    score -= 10;
                    deductions.push({ category: 'عوائق', points: -10, reason: 'بوابة أو مدخل ضيق' });
                    risks.push('المدخل ضيق - قد لا يمر الخزان');
                    actions.push('يرجى التأكد من عرض البوابة (يحتاج 2.5 متر على الأقل)');
                }
                if (answers.obstacles.indexOf('trees') !== -1) {
                    score -= 5;
                    risks.push('أشجار قد تعيق ذراع الرافعة');
                }
            }
        }

        // ---- Safety Assessment (max -30 points) ----
        if (answers.power_lines === 'directly_above' && answers.installation === 'rooftop') {
            score -= 30;
            deductions.push({ category: 'سلامة', points: -30, reason: 'أسلاك كهرباء فوق منطقة التركيب مباشرة' });
            risks.push('خطر سلامة حرج: أسلاك كهرباء فوق منطقة عمل الرافعة');
            actions.push('يجب التنسيق مع شركة الكهرباء لفصل الأسلاك أو تغيير موقع التركيب');
        } else if (answers.power_lines === 'nearby' && answers.installation === 'rooftop') {
            score -= 15;
            deductions.push({ category: 'سلامة', points: -15, reason: 'أسلاك كهرباء قريبة من منطقة التركيب' });
            risks.push('أسلاك كهرباء قريبة - يحتاج احتياطات سلامة إضافية');
        } else if (answers.power_lines === 'not_sure' && answers.installation === 'rooftop') {
            score -= 10;
            risks.push('حالة الأسلاك الكهربائية غير مؤكدة');
            actions.push('سيتم فحص الأسلاك الكهربائية عند الوصول');
        }

        // ---- Building Height Assessment (for rooftop installations) ----
        if (answers.installation === 'rooftop' && answers.building_floors) {
            if (answers.building_floors === '6+') {
                score -= 25;
                deductions.push({ category: 'ارتفاع', points: -25, reason: 'مبنى أعلى من 6 طوابق - قد يتجاوز مدى الرافعة' });
                risks.push('ارتفاع المبنى (6+ طوابق) قد يتجاوز مدى رافعة الشاحنة');
                actions.push('يجب التحقق من ارتفاع المبنى الفعلي - قد نحتاج رافعة متخصصة');
            } else if (answers.building_floors === '4-5') {
                score -= 10;
                deductions.push({ category: 'ارتفاع', points: -10, reason: 'مبنى 4-5 طوابق - يحتاج تأكيد مدى الرافعة' });
                risks.push('ارتفاع متوسط (4-5 طوابق) - يجب التأكد من مدى الرافعة');
            }
        }

        if (answers.alternative_road === 'no') {
            score -= 5;
            deductions.push({ category: 'بديل', points: -5, reason: 'لا يوجد طريق بديل' });
            risks.push('لا يوجد طريق بديل في حال انسداد الطريق الرئيسي');
        }

        // ---- Clamp Score ----
        score = Math.max(0, Math.min(100, score));

        // ---- Classification ----
        var classification;
        if (score >= 75) classification = 'GREEN';
        else if (score >= 50) classification = 'YELLOW';
        else if (score >= 25) classification = 'RED';
        else classification = 'BLACK';

        // ---- Override Rules ----
        if (answers.power_lines === 'directly_above' && answers.installation === 'rooftop') {
            classification = 'BLACK';
        }
        if (answers.truck_access === 'no' && (answers.road_paved === 'no' || answers.road_paved === 'under_construction')) {
            if (classification === 'GREEN' || classification === 'YELLOW') {
                classification = 'RED';
            }
        }

        // ---- Delivery Class ----
        var deliveryClass = this.determineDeliveryClass(classification, tankSize, answers.installation);

        // ---- Recommended Vehicle ----
        var vehicle = this.recommendVehicle(deliveryClass, tankSize, answers.installation);

        // ---- Build Report ----
        var report = {
            score: score,
            classification: classification,
            deliveryClass: deliveryClass,
            vehicle: vehicle,
            deductions: deductions,
            risks: risks,
            customerActions: actions,
            needsCrane: answers.installation === 'rooftop',
            needsPermit: false, // Night delivery = no permit
            estimatedDeliveryDays: this.estimateDeliveryDays(classification, deliveryClass),
            assessmentDate: new Date().toISOString()
        };

        return report;
    },

    /**
     * Check if tank fits on the dedicated crane truck (medium-duty)
     * Crane truck can carry 1 tank up to approximately 4,000L
     */
    tankFitsOnCraneTruck: function(tankSize) {
        return tankSize <= 4000;
    },

    /**
     * Determine delivery class based on score, tank size, and installation
     * Classes: A, B, C-1 (crane truck), C-2 (heavy truck + permit), D
     */
    determineDeliveryClass: function(classification, tankSize, installation) {
        // BLACK/RED sites
        if (classification === 'BLACK' || classification === 'RED') {
            return 'D';
        }

        // Small tanks on light vehicles
        if (tankSize <= 1500 && installation !== 'rooftop') {
            return 'A';
        }

        // Rooftop installation (2+ floors)
        if (installation === 'rooftop') {
            if (this.tankFitsOnCraneTruck(tankSize)) {
                // C-1: Crane truck - single daytime trip, no permit
                return 'C-1';
            } else {
                // C-2: Heavy truck - needs permit (large dimensions)
                return 'C-2';
            }
        }

        // Large tanks, ground install, GREEN/YELLOW → Night Direct
        return 'B';
    },

    /**
     * Recommend vehicle type
     */
    recommendVehicle: function(deliveryClass, tankSize, installation) {
        switch (deliveryClass) {
            case 'A':
                return {
                    type: 'مركبة خفيفة (بيك أب)',
                    typeEn: 'Light Pickup',
                    icon: '🚙',
                    shift: 'نهاري',
                    permitNeeded: false,
                    craneNeeded: false
                };
            case 'B':
                return {
                    type: 'شاحنة ثقيلة',
                    typeEn: 'Heavy Truck',
                    icon: '🚛',
                    shift: 'ليلي (9 مساءً - 6 صباحاً)',
                    permitNeeded: false,
                    craneNeeded: false
                };
            case 'C-1':
                return {
                    type: 'شاحنة رافعة مخصصة (رحلة واحدة)',
                    typeEn: 'Dedicated Crane Truck (Single Trip)',
                    icon: '🏗️',
                    shift: 'نهاري (7 صباحاً - 5 مساءً)',
                    permitNeeded: false,
                    craneNeeded: true,
                    singleTrip: true,
                    description: 'شاحنة متوسطة مع رافعة - تحمل الخزان وترفعه للسطح في رحلة واحدة بدون تصريح'
                };
            case 'C-2':
                return {
                    type: 'شاحنة ثقيلة مع رافعة (تصريح مطلوب)',
                    typeEn: 'Heavy Truck with Crane (Permit Required)',
                    icon: '🚛🏗️',
                    shift: 'نهاري (بتصريح) أو ليلي (مرحلتين كبديل)',
                    permitNeeded: true,
                    craneNeeded: true,
                    fallback: 'توصيل ليلي مرحلتين: إنزال ليلاً + رفع صباحاً',
                    description: 'الخزان كبير - يحتاج شاحنة ثقيلة وتصريح دخول المدينة'
                };
            case 'D':
                return {
                    type: 'خطة خاصة مطلوبة',
                    typeEn: 'Special Plan Required',
                    icon: '⚠️',
                    shift: 'حسب التقييم',
                    permitNeeded: false,
                    craneNeeded: installation === 'rooftop'
                };
        }
    },

    /**
     * Estimate delivery days
     */
    estimateDeliveryDays: function(classification, deliveryClass) {
        switch (classification) {
            case 'GREEN':
                if (deliveryClass === 'C-1') return '1-2';
                if (deliveryClass === 'C-2') return '3-5';
                return '1-2';
            case 'YELLOW':
                if (deliveryClass === 'C-1') return '2-3';
                if (deliveryClass === 'C-2') return '4-7';
                return '2-3';
            case 'RED': return '5-7';
            case 'BLACK': return 'غير محدد';
        }
    },

    /**
     * Get score color for CSS
     */
    getScoreColor: function(classification) {
        switch (classification) {
            case 'GREEN': return '#2ecc71';
            case 'YELLOW': return '#f39c12';
            case 'RED': return '#e74c3c';
            case 'BLACK': return '#2c3e50';
        }
    },

    /**
     * Get score CSS class
     */
    getScoreClass: function(classification) {
        return classification.toLowerCase();
    }
};
