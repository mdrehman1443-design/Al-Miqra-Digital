import { AppLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  appNameEn: string;
  madrasaName: string;
  madrasaNameEn: string;
  tagline: string;
  dashboard: string;
  lessons: string;
  attendance: string;
  exams: string;
  students: string;
  classes: string;
  fees: string;
  settings: string;
  logLesson: string;
  activeStudents: string;
  todayLessons: string;
  attendanceRate: string;
  collectedFees: string;
  pendingDues: string;
  present: string;
  absent: string;
  leave: string;
  sabaq: string;
  sabqi: string;
  manzil: string;
  grade: string;
  supervisor: string;
  teacher: string;
  examiner: string;
  semiAnnual: string;
  annual: string;
  totalMarks: string;
  obtainedMarks: string;
  addStudent: string;
  editStudent: string;
  deleteConfirm: string;
  uploadPhoto: string;
  changePhoto: string;
  removePhoto: string;
  liveClock: string;
  save: string;
  cancel: string;
  print: string;
  shareWhatsApp: string;
  admissionNo: string;
  fatherName: string;
  monthlyFee: string;
  currentPara: string;
  completedParas: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  ur: {
    appName: 'المقرا ڈیجیٹل',
    appNameEn: 'Al-Miqra Digital',
    madrasaName: 'مدرسہ تعلیم القرآن سورگ',
    madrasaNameEn: 'Madrasah Taleem-ul-Quran Surag',
    tagline: 'مدارس حفظ و ناظرہ قرآن کریم و علوم اسلامیہ',
    dashboard: 'مرکزی ڈیش بورڈ',
    lessons: 'یومیہ اسباق',
    attendance: 'حاضری و توثیق',
    exams: 'امتحانات (ششماہی و سالانہ)',
    students: 'طلباء ریکارڈ',
    classes: 'کلاسز و اساتذہ',
    fees: 'فیس رجسٹر',
    settings: 'ترتیبات و بیک اپ',
    logLesson: 'نیا سبق درج کریں',
    activeStudents: 'کل زیرِ تعلیم طلباء',
    todayLessons: 'آج کے سنے گئے اسباق',
    attendanceRate: 'حاضری کا تناسب',
    collectedFees: 'وصول شدہ فیس',
    pendingDues: 'بقایا واجبات',
    present: 'حاضر',
    absent: 'غیر حاضر',
    leave: 'با رخصت',
    sabaq: 'سبق (نیا سبق)',
    sabqi: 'سبقی (حالیہ اعادہ)',
    manzil: 'منزل (دورِ قدیم)',
    grade: 'معیار / گریڈ',
    supervisor: 'نگرانِ شعبہ حفظ',
    teacher: 'استادِ متعلقہ',
    examiner: 'ممتحن صاحب',
    semiAnnual: 'ششماہی امتحان',
    annual: 'سالانہ امتحان',
    totalMarks: 'کل نمبرات',
    obtainedMarks: 'حاصل کردہ نمبرات',
    addStudent: 'نیا طالب علم داخل کریں',
    editStudent: 'طالب علم کے کوائف میں ترمیم',
    deleteConfirm: 'کیا آپ واقعی اس ریکارڈ کو حذف کرنا چاہتے ہیں؟',
    uploadPhoto: 'تصویر اپلوڈ کریں',
    changePhoto: 'تصویر تبدیل کریں',
    removePhoto: 'تصویر ہٹائیں',
    liveClock: 'لائیو ڈیجیٹل گھڑی و تقویم',
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    print: 'پرنٹ کریں',
    shareWhatsApp: 'واٹس ایپ بھیجیں',
    admissionNo: 'داخلہ نمبر',
    fatherName: 'ولدیت',
    monthlyFee: 'ماہانہ فیس',
    currentPara: 'زیرِ تعلیم پارہ',
    completedParas: 'حفظ شدہ پارے',
  },
  ar: {
    appName: 'المقرا ديجيتال',
    appNameEn: 'Al-Miqra Digital',
    madrasaName: 'مدرسة تعليم القرآن سورغ',
    madrasaNameEn: 'Madrasah Taleem-ul-Quran Surag',
    tagline: 'نظام إدارة حلقات تحفيظ وتجويد القرآن الكريم والعلوم الشرعية',
    dashboard: 'لوحة التحكم المركزية',
    lessons: 'السماع اليومي للدروس',
    attendance: 'الحضور والتوقيعات',
    exams: 'الامتحانات (النصف سنوية والسنوية)',
    students: 'سجلات الطلاب',
    classes: 'الحلقات والمعلمون',
    fees: 'سجل الاشتراكات والرسوم',
    settings: 'الإعدادات والنسخ الاحتياطي',
    logLesson: 'تسجيل تسميع جديد',
    activeStudents: 'إجمالي الطلاب النشطين',
    todayLessons: 'الدروس المستمعة اليوم',
    attendanceRate: 'نسبة الحضور اليومية',
    collectedFees: 'المبالغ المحصلة',
    pendingDues: 'المبالغ المتبقية',
    present: 'حاضر',
    absent: 'غائب',
    leave: 'إجازة / عذر',
    sabaq: 'السبق (الحفظ الجديد)',
    sabqi: 'السبقي (المراجعة القريبة)',
    manzil: 'المنزل (المراجعة الكبرى / الدور)',
    grade: 'التقدير والدرجة',
    supervisor: 'مشرف قسم التحفيظ',
    teacher: 'المعلم المسؤول',
    examiner: 'فضيلة الشيخ الممتحن',
    semiAnnual: 'الامتحان النصف سنوي',
    annual: 'الامتحان السنوي',
    totalMarks: 'الدرجة الكلية',
    obtainedMarks: 'الدرجة المحصلة',
    addStudent: 'تسجيل طالب جديد',
    editStudent: 'تعديل بيانات الطالب',
    deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا السجل؟',
    uploadPhoto: 'رفع صورة شخصية',
    changePhoto: 'تغيير الصورة',
    removePhoto: 'حذف الصورة',
    liveClock: 'الساعة الرقمية والتقويم المباشر',
    save: 'حفظ التعديلات',
    cancel: 'إلغاء',
    print: 'طباعة التقرير',
    shareWhatsApp: 'إرسال عبر واتساب',
    admissionNo: 'رقم القيد والتسجيل',
    fatherName: 'اسم ولي الأمر',
    monthlyFee: 'الرسوم الشهرية',
    currentPara: 'الجزء الجاري حفظه',
    completedParas: 'الأجزاء المتقنة',
  },
  en: {
    appName: 'Al-Miqra Digital',
    appNameEn: 'المقرا ڈیجیٹل',
    madrasaName: 'Madrasah Taleem-ul-Quran Surag',
    madrasaNameEn: 'مدرسہ تعلیم القرآن سورگ',
    tagline: 'Hifz & Nazra Quran Memorization Management System',
    dashboard: 'Dashboard',
    lessons: 'Daily Lessons',
    attendance: 'Attendance & Signs',
    exams: 'Examinations (Semi/Annual)',
    students: 'Student Records',
    classes: 'Classes & Staff',
    fees: 'Fee Ledger',
    settings: 'Settings & Backup',
    logLesson: 'Log Daily Lesson',
    activeStudents: 'Active Students',
    todayLessons: 'Today Heard Lessons',
    attendanceRate: 'Attendance Rate',
    collectedFees: 'Collected Fees',
    pendingDues: 'Outstanding Balance',
    present: 'Present',
    absent: 'Absent',
    leave: 'On Leave',
    sabaq: 'Sabq (New Lesson)',
    sabqi: 'Sabqi (Recent Revision)',
    manzil: 'Manzil (Grand Revision)',
    grade: 'Grade / Rating',
    supervisor: 'Hifz Supervisor',
    teacher: 'Class Teacher',
    examiner: 'Examiner',
    semiAnnual: 'Semi-Annual Exam',
    annual: 'Annual Exam',
    totalMarks: 'Total Marks',
    obtainedMarks: 'Obtained Marks',
    addStudent: 'Add New Student',
    editStudent: 'Edit Student Details',
    deleteConfirm: 'Are you sure you want to permanently delete this record?',
    uploadPhoto: 'Upload Profile Photo',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove Photo',
    liveClock: 'Real-Time Clock & Calendar',
    save: 'Save Changes',
    cancel: 'Cancel',
    print: 'Print Document',
    shareWhatsApp: 'Share on WhatsApp',
    admissionNo: 'Admission / Roll #',
    fatherName: "Father's Name",
    monthlyFee: 'Monthly Fee',
    currentPara: 'Current Para',
    completedParas: 'Completed Paras',
  },
};
