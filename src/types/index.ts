export type AppLanguage = 'ur' | 'ar' | 'en';

export type GradeType = 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbool' | 'weak';

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export type FeeStatus = 'paid' | 'unpaid' | 'exempt';

export type StudentStatus = 'active' | 'graduated' | 'leave';

export type ExamType = 'semi_annual' | 'annual';

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  nameUrdu: string;
  fatherName: string;
  fatherNameUrdu: string;
  dob: string;
  enrollmentDate: string;
  guardianPhone: string;
  guardianRelation: string;
  address: string;
  classId: string;
  teacherId: string;
  currentPara: number; // 1 - 30
  completedParas: number[]; // e.g. [1, 2, 3]
  monthlyFee: number; // PKR
  feeCategory: 'regular' | 'concession' | 'exempt';
  status: StudentStatus;
  photoUrl?: string; // Base64 or image URL
  notes?: string;
}

export interface Teacher {
  id: string;
  name: string;
  nameUrdu: string;
  designation: string;
  phone: string;
  qualification: string; // e.g. "حفظ و تجوید، درسِ نظامی"
  experienceYears: number;
  assignedClassIds: string[];
  photoUrl?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  nameUrdu: string;
  level: 'nazra' | 'hifz_ibtidai' | 'hifz_pukhta' | 'manzil' | 'tajweed';
  teacherId: string;
  timingUrdu: string;
  timingEn: string;
  roomNumber: string;
  capacity: number;
  days: string[];
}

export interface DailyLessonLog {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // HH:mm
  // 1. Sabaq (New Lesson)
  sabaqPara: number;
  sabaqSurah: string;
  sabaqAyahRange: string;
  sabaqLinesCount: number; // e.g. 16 lines or 1 ruku
  // 2. Sabqi (Recent Revision)
  sabqiPara: number;
  sabqiPagesCount: string; // e.g. "5 صفحات" / "نصف پارہ"
  // 3. Manzil (Old Revision / Daur)
  manzilPara: number;
  manzilPortion: string; // e.g. "پورا پارہ" / "پارہ 1 تا 2"
  grade: GradeType;
  remarks: string; // e.g. "تجوید عمدہ، مخارج پختہ"
  recordedByTeacherId: string;
  // Signatures
  teacherSigned: boolean;
  supervisorSigned: boolean;
  supervisorRemarks?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
}

export interface ClassDailySignoff {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  teacherSigned: boolean;
  teacherSignedAt?: string;
  supervisorSigned: boolean;
  supervisorSignedAt?: string;
  supervisorRemarks?: string;
}

export interface ExamRecord {
  id: string;
  studentId: string;
  examType: ExamType; // 'semi_annual' (ششماہی) | 'annual' (سالانہ)
  examYear: string; // e.g. "1447ھ - 2026ء"
  examDate: string;
  testedParas: string; // e.g. "پارہ 1 تا 10" / "پارہ 11 تا 20"
  // Sub-scores out of 100
  marksHifz: number; // out of 50 (حفظ و اتقان)
  marksTajweed: number; // out of 30 (تجوید و مخارج)
  marksTartil: number; // out of 20 (حسنِ صوت و ترتیل)
  totalMarks: number; // 100
  obtainedMarks: number; // sum of sub-scores
  percentage: number;
  grade: GradeType;
  // Examiner & Supervisor boxes
  examinerName: string;
  examinerRemarks: string;
  examinerSigned: boolean;
  examinerSignedAt?: string;
  supervisorSigned: boolean;
  supervisorSignedAt?: string;
  supervisorRemarks?: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  month: string; // e.g. "2026-11"
  amountPaid: number;
  monthlyFee: number;
  status: FeeStatus;
  paymentDate?: string;
  receiptNo?: string;
  paymentMethod?: 'cash' | 'online' | 'easypaisa' | 'bank';
  discountAmount?: number;
  notes?: string;
}

export interface MadrasaProfile {
  nameUrdu: string;
  nameEn: string;
  taglineUrdu: string;
  taglineEn: string;
  branch: string;
  registrationNo: string;
  nazimNameUrdu: string;
  supervisorNameUrdu: string; // قاری حامد نواز صاحب
  supervisorNameEn: string;
  supervisorDesignation: string;
  phone: string;
  city: string;
  address: string;
}
