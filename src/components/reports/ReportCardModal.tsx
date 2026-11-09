import React from 'react';
import {
  Student,
  Teacher,
  ClassRoom,
  DailyLessonLog,
  AttendanceRecord,
  FeePayment,
  MadrasaProfile,
  ExamRecord,
  AppLanguage,
} from '../../types';
import { GRADE_DETAILS } from '../../utils/quranData';
import { formatWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp';
import { Printer, Share2, Award, BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReportCardModalProps {
  student: Student;
  madrasa: MadrasaProfile;
  teachers: Teacher[];
  classes: ClassRoom[];
  lessons: DailyLessonLog[];
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  exams?: ExamRecord[];
  lang: AppLanguage;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  madrasa,
  teachers,
  classes,
  lessons,
  attendance,
  fees,
  exams = [],
  lang,
  onClose,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';
  const cls = classes.find((c) => c.id === student.classId);
  const teacher = teachers.find((t) => t.id === student.teacherId);

  // Student's lessons
  const studentLessons = lessons.filter((l) => l.studentId === student.id);
  const latestLesson = studentLessons[0];

  // Student's exams (Semi-annual & Annual)
  const studentExams = exams.filter((e) => e.studentId === student.id);
  const latestExam = studentExams[0];

  // Attendance calculation
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const presentDays = studentAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate =
    studentAttendance.length > 0
      ? Math.round((presentDays / studentAttendance.length) * 100)
      : 100;

  // Fee status
  const studentFee = fees.find((f) => f.studentId === student.id);
  const feeStatus =
    student.feeCategory === 'exempt'
      ? isUrdu ? 'معاف / وظیفہ' : 'Exempt'
      : studentFee?.status === 'paid'
      ? isUrdu ? 'مکمل ادا شدہ' : 'Paid'
      : isUrdu ? 'بقایا واجبات' : 'Pending';

  const completedCount = student.completedParas?.length || 0;
  const hifzPercent = Math.round((completedCount / 30) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = formatWhatsAppMessage(
      student,
      madrasa,
      teacher,
      latestLesson,
      studentAttendance[0],
      studentFee,
      lang
    );
    openWhatsApp(student.guardianPhone, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-900 my-8 print-card relative">
        {/* Decorative corner borders */}
        <div className="absolute top-2 left-2 text-emerald-800 text-xs select-none">✦</div>
        <div className="absolute top-2 right-2 text-emerald-800 text-xs select-none">✦</div>
        <div className="absolute bottom-2 left-2 text-emerald-800 text-xs select-none">✦</div>
        <div className="absolute bottom-2 right-2 text-emerald-800 text-xs select-none">✦</div>

        {/* Certificate Header */}
        <div className="text-center pb-4 border-b-2 border-emerald-900/80">
          <div className="text-sm font-bold text-emerald-900 tracking-widest font-sans-modern">
            ﷽
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-nastaliq text-emerald-950 mt-1">
            {madrasa.nameUrdu}
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {madrasa.branch} · {madrasa.city} · فون: {madrasa.phone}
          </p>

          <div className="inline-block mt-2.5 px-6 py-1 bg-emerald-900 text-white rounded-full text-xs font-bold font-nastaliq tracking-wide shadow-xs">
            {isUrdu
              ? 'جامع کارکردگی و امتحانی رزلٹ کارڈ (شعبہ حفظ و ناظرہ)'
              : 'Comprehensive Progress & Examination Report Card'}
          </div>
        </div>

        {/* Student Details Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-700 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-nastaliq text-xl font-bold shrink-0 shadow-xs">
                {student.nameUrdu.slice(0, 1)}
              </div>
            )}
            <div>
              <div className="text-slate-400 text-[11px]">{isUrdu ? 'طالب علم:' : 'Student Name:'}</div>
              <div className="font-bold text-slate-900 font-nastaliq text-base">
                {student.nameUrdu}
              </div>
              <div className="text-slate-600 text-xs font-nastaliq">
                ولد {student.fatherNameUrdu}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">{isUrdu ? 'داخلہ نمبر:' : 'Admission #:'}</span>
              <span className="font-mono font-bold text-emerald-900">
                {student.admissionNo}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">{isUrdu ? 'شعبہ / کلاس:' : 'Class:'}</span>
              <span className="font-semibold text-slate-800">
                {cls?.nameUrdu || 'حفظ القرآن'}
              </span>
            </div>
          </div>
        </div>

        {/* 30 Juz Progress Bar */}
        <div className="py-3 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'حفظِ قرآن کریم کی مجموعی مقدار:' : 'Overall Quran Memorized:'}</span>
            </span>
            <span className="font-mono font-bold text-emerald-900 text-xs">
              {completedCount} / 30 {isUrdu ? 'پارے مکمل' : 'Juz Done'} ({hifzPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
            <div
              className="bg-emerald-700 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${hifzPercent}%` }}
            />
          </div>
        </div>

        {/* Traditional Lesson Performance Breakdown */}
        <div className="py-3 border-b border-slate-200 space-y-2">
          <h3 className="text-xs font-bold text-emerald-900">
            {isUrdu ? 'یومیہ اسباق کی صورتحال (سبق، سبقی، منزل):' : 'Daily Lessons Status:'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <div className="font-bold text-emerald-950 mb-0.5">
                {isUrdu ? '1. سبق (نیا سبق)' : '1. Sabaq (New)'}
              </div>
              <div className="text-slate-700 font-medium text-[11px]">
                {latestLesson ? `پارہ ${latestLesson.sabaqPara} (${latestLesson.sabaqSurah})` : 'روزانہ 16 سطریں'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                معیار: <span className="font-bold text-emerald-800">{latestLesson?.grade ? GRADE_DETAILS[latestLesson.grade]?.labelUrdu : 'ممتاز'}</span>
              </div>
            </div>

            <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-200">
              <div className="font-bold text-teal-950 mb-0.5">
                {isUrdu ? '2. سبقی (حالیہ اعادہ)' : '2. Sabqi (Recent)'}
              </div>
              <div className="text-slate-700 font-medium text-[11px]">
                {latestLesson ? `${latestLesson.sabqiPagesCount} (پارہ ${latestLesson.sabqiPara})` : '4 تا 5 صفحات'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                کیفیت: <span className="font-bold text-teal-800">پختہ و درست</span>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200">
              <div className="font-bold text-blue-950 mb-0.5">
                {isUrdu ? '3. منزل (دورِ قدیم)' : '3. Manzil (Old Juz)'}
              </div>
              <div className="text-slate-700 font-medium text-[11px]">
                {latestLesson ? `پارہ ${latestLesson.manzilPara} (${latestLesson.manzilPortion})` : '1 مکمل پارہ'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                دور: <span className="font-bold text-blue-800">جاری و مستحضر</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXAMINATIONS BOX (SEMI-ANNUAL & ANNUAL EXAMS) */}
        <div className="py-3 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{isUrdu ? 'باکس برائے ششماہی و سالانہ امتحانات (Examination Marks):' : 'Semi-Annual & Annual Examination Box:'}</span>
            </h3>
            {latestExam && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {latestExam.examType === 'semi_annual' ? (isUrdu ? 'ششماہی امتحان' : 'Semi-Annual') : (isUrdu ? 'سالانہ امتحان' : 'Annual')}
              </span>
            )}
          </div>

          {latestExam ? (
            <div className="bg-amber-50/40 rounded-xl border-2 border-amber-300 p-3 text-xs space-y-2">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-slate-500 block">{isUrdu ? 'حفظ (50)' : 'Hifz (50)'}</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">{latestExam.marksHifz}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-slate-500 block">{isUrdu ? 'تجوید (30)' : 'Tajweed (30)'}</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">{latestExam.marksTajweed}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-slate-500 block">{isUrdu ? 'ترتیل (20)' : 'Tartil (20)'}</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">{latestExam.marksTartil}</span>
                </div>
                <div className="bg-emerald-800 text-white p-2 rounded-lg font-bold">
                  <span className="text-[10px] text-emerald-200 block">{isUrdu ? 'کل حاصل کردہ' : 'Total'}</span>
                  <span className="font-mono text-sm">{latestExam.obtainedMarks} / 100</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pt-1 border-t border-amber-200">
                <div>
                  <span className="text-slate-500">{isUrdu ? 'ممتحن صاحب:' : 'Examiner:'}</span>{' '}
                  <span className="font-semibold text-slate-900">{latestExam.examinerName}</span>
                </div>
                <div>
                  <span className="text-slate-500">{isUrdu ? 'امتحانی مقدار:' : 'Tested Paras:'}</span>{' '}
                  <span className="font-bold text-emerald-900">{latestExam.testedParas}</span>
                </div>
                <div className="text-emerald-800 font-bold">
                  {isUrdu ? 'گریڈ:' : 'Grade:'} {GRADE_DETAILS[latestExam.grade]?.labelUrdu || latestExam.grade}
                </div>
              </div>

              <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-amber-200 leading-relaxed font-nastaliq">
                <strong>{isUrdu ? 'ریمارکس ممتحن:' : 'Examiner Remarks:'}</strong> "{latestExam.examinerRemarks}"
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              {isUrdu
                ? 'اس طالب علم کا ششماہی یا سالانہ امتحان عنقریب منعقد ہوگا۔'
                : 'Examination scheduled upcoming.'}
            </div>
          )}
        </div>

        {/* Attendance & Fee row */}
        <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-200 text-xs text-center">
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block text-[11px]">{isUrdu ? 'حاضری فیصد:' : 'Attendance:'}</span>
            <span className="font-mono font-bold text-emerald-800 text-sm mt-0.5 block">
              {attendanceRate}%
            </span>
          </div>

          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 block text-[11px]">{isUrdu ? 'فیس کی صورتحال:' : 'Fee Status:'}</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">
              {feeStatus}
            </span>
          </div>
        </div>

        {/* DEDICATED SIGNATURE BOXES: TEACHER, SUPERVISOR (QARI HAMID NAWAZ), AND EXAMINER */}
        <div className="pt-6 grid grid-cols-3 gap-3 text-xs text-slate-600 text-center">
          {/* Class Teacher Box */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">
                {isUrdu ? 'باکس برائے دستخط استادِ متعلقہ' : 'Teacher Signature'}
              </span>
              <div className="font-bold font-nastaliq text-slate-900 text-sm">
                {teacher?.nameUrdu || 'قاری محمد ابراہیم'}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-300 text-[10px] text-emerald-800 font-semibold">
              {isUrdu ? 'دستخط و توثیق شدہ ✔️' : 'Verified & Signed'}
            </div>
          </div>

          {/* Examiner Box */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">
                {isUrdu ? 'باکس برائے دستخط ممتحن' : 'Examiner Signature'}
              </span>
              <div className="font-bold font-nastaliq text-slate-900 text-xs truncate">
                {latestExam?.examinerName ? latestExam.examinerName.slice(0, 20) : 'قاری عبد الباسط قاسمی'}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-300 text-[10px] text-emerald-800 font-semibold">
              {isUrdu ? 'دستخط ممتحن مع تاریخ' : 'Examiner Signed'}
            </div>
          </div>

          {/* Supervisor Box: Qari Hamid Nawaz Sahib */}
          <div className="p-2.5 bg-emerald-50 rounded-xl border-2 border-emerald-700 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-emerald-800 font-bold block mb-1">
                {isUrdu ? 'باکس برائے نگران شعبہ حفظ' : 'Supervisor Box'}
              </span>
              <div className="font-bold font-nastaliq text-emerald-950 text-sm">
                {madrasa.supervisorNameUrdu}
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-emerald-300 text-[10px] text-emerald-900 font-bold">
              {isUrdu ? 'مہر و دستخط نگرانِ اعلیٰ ✔️' : 'Supervisor Stamp'}
            </div>
          </div>
        </div>

        {/* Buttons (No-print) */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-4 h-4" />
              <span>{isUrdu ? 'والد کو واٹس ایپ بھیجیں' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? 'سرٹیفکیٹ پرنٹ کریں' : 'Print Certificate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
