import React, { useMemo } from 'react';
import {
  Student,
  Teacher,
  ClassRoom,
  DailyLessonLog,
  AttendanceRecord,
  FeePayment,
  MadrasaProfile,
  ExamRecord,
  ClassDailySignoff,
  AppLanguage,
} from '../../types';
import { GRADE_DETAILS } from '../../utils/quranData';
import { formatWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp';
import { SupervisorBox } from '../supervisor/SupervisorBox';
import { LiveClockWidget } from './LiveClockWidget';
import { TRANSLATIONS } from '../../utils/translations';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Share2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Award,
  ShieldCheck,
  Building2,
  MapPin,
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  lessons: DailyLessonLog[];
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  exams: ExamRecord[];
  signoffs: ClassDailySignoff[];
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onNavigate: (tab: string) => void;
  onSelectStudent: (student: Student) => void;
  onOpenNewLesson: () => void;
  onSignAllAttendanceToday?: () => void;
  onSignAllLessonsToday?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  teachers,
  classes,
  lessons,
  attendance,
  fees,
  exams,
  signoffs,
  madrasa,
  lang,
  onNavigate,
  onSelectStudent,
  onOpenNewLesson,
  onSignAllAttendanceToday,
  onSignAllLessonsToday,
}) => {
  const isUrdu = lang === 'ur';
  const isArabic = lang === 'ar';
  const t = TRANSLATIONS[lang];
  const todayStr = new Date().toISOString().slice(0, 10);

  // Today's lessons
  const todayLessons = useMemo(() => {
    return lessons.filter((l) => l.date === todayStr);
  }, [lessons, todayStr]);

  const todayVerifiedLessonsCount = useMemo(() => {
    return todayLessons.filter((l) => l.supervisorSigned).length;
  }, [todayLessons]);

  // Today's attendance
  const todayAttendance = useMemo(() => {
    return attendance.filter((a) => a.date === todayStr);
  }, [attendance, todayStr]);

  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'absent').length;
  const leaveCount = todayAttendance.filter((a) => a.status === 'leave').length;
  const attendanceRate =
    todayAttendance.length > 0
      ? Math.round((presentCount / todayAttendance.length) * 100)
      : 100;

  // Signoffs
  const todayVerifiedSignoffsCount = useMemo(() => {
    return signoffs.filter((s) => s.date === todayStr && s.supervisorSigned).length;
  }, [signoffs, todayStr]);

  // Performance metrics
  const mumtazCount = todayLessons.filter((l) => l.grade === 'mumtaz').length;
  const jayyidCount = todayLessons.filter(
    (l) => l.grade === 'jayyid' || l.grade === 'jayyid_jiddan'
  ).length;
  const weakCount = todayLessons.filter(
    (l) => l.grade === 'weak' || l.grade === 'maqbool'
  ).length;

  // Fee calculation
  const totalExpectedFee = useMemo(() => {
    return students.reduce((acc, s) => acc + (s.monthlyFee || 0), 0);
  }, [students]);

  const totalCollectedFee = useMemo(() => {
    return fees.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
  }, [fees]);

  const pendingFee = Math.max(0, totalExpectedFee - totalCollectedFee);
  const feeCollectionRate =
    totalExpectedFee > 0 ? Math.round((totalCollectedFee / totalExpectedFee) * 100) : 0;

  // Near completion / Khatm-e-Quran students (completed >= 25 paras)
  const nearCompletionStudents = useMemo(() => {
    return students.filter(
      (s) => (s.completedParas?.length || 0) >= 25 && s.status === 'active'
    );
  }, [students]);

  // Quran progress buckets for chart
  const progressBuckets = useMemo(() => {
    const buckets = {
      nazra: 0,
      juz1to10: 0,
      juz11to20: 0,
      juz21to29: 0,
      khatm: 0,
    };
    students.forEach((s) => {
      const completed = s.completedParas?.length || 0;
      if (completed === 0) buckets.nazra++;
      else if (completed <= 10) buckets.juz1to10++;
      else if (completed <= 20) buckets.juz11to20++;
      else if (completed < 30) buckets.juz21to29++;
      else buckets.khatm++;
    });
    return buckets;
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Real-time Clock & Calendar Widget (Live digital clock updating every second) */}
      <LiveClockWidget lang={lang} />

      {/* Madrasa Official Bilingual Branding Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
        {/* Subtle decorative Islamic arch geometric background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Bilingual Blocks (Clearly Separated) */}
          <div className="space-y-4 max-w-3xl">
            {/* Header Meta Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1447 ھجری / 2026ء</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/90 text-emerald-200 text-xs border border-emerald-700/60">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>سورگ، پاکستان · Surag, Pakistan</span>
              </span>
            </div>

            {/* Block 1: Urdu / Arabic Official Name */}
            <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-700/40 backdrop-blur-xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>الاسم الرسمي (اردو / عربی)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-nastaliq text-amber-100 tracking-wide drop-shadow-sm leading-tight">
                مدرسہ تعلیم القرآن سورگ
              </h1>
              <p className="text-xs text-emerald-200/90 mt-1 font-nastaliq">
                مدارس و جامعات حفظ و ناظرہ قرآن کریم و علومِ اسلامیہ
              </p>
            </div>

            {/* Block 2: English Official Name */}
            <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-700/40 backdrop-blur-xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>OFFICIAL NAME (ENGLISH)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider font-sans">
                MADRASAH TALEEM-UL-QURAN SURAG
              </h2>
              <p className="text-xs text-emerald-200/90 mt-1 font-sans">
                Hifz & Nazra Quran Memorization Management System · Branch Surag
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-stretch sm:self-auto lg:w-56">
            <button
              onClick={onOpenNewLesson}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>{t.logLesson}</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800/90 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl border border-emerald-600/60 transition-all hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{t.attendance}</span>
            </button>
            <button
              onClick={() => onNavigate('exams')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-900/90 hover:bg-emerald-800/90 text-amber-200 text-xs font-semibold rounded-xl border border-amber-500/40 transition-all hover:scale-[1.01]"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t.exams}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED SUPERVISOR BOX (Qari Hamid Nawaz Sahib) */}
      <SupervisorBox
        madrasa={madrasa}
        todayLessonsCount={todayLessons.length}
        todayVerifiedLessonsCount={todayVerifiedLessonsCount}
        pendingAttendanceCount={classes.length - todayVerifiedSignoffsCount}
        verifiedAttendanceCount={todayVerifiedSignoffsCount}
        lang={lang}
        onSignAllAttendanceToday={onSignAllAttendanceToday}
        onSignAllLessonsToday={onSignAllLessonsToday}
      />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Active Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{isUrdu ? 'کل طلباء' : 'Students'}</span>
            <Users className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {students.filter((s) => s.status === 'active').length}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {students.length} {isUrdu ? 'داخل شدہ' : 'total'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {classes.length} {isUrdu ? 'کلاسز / شعبہ جات' : 'classes'}
          </div>
        </div>

        {/* Today's Sabaq Completion */}
        <div
          onClick={() => onNavigate('lessons')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{isUrdu ? 'آج کے سنے گئے اسباق' : 'Today Lessons'}</span>
            <BookOpen className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {todayLessons.length}
            </span>
            <span className="text-xs text-slate-500">
              / {students.filter((s) => s.status === 'active').length}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            {todayVerifiedLessonsCount} {isUrdu ? 'نگران سے تصدیق شدہ' : 'supervisor verified'}
          </div>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{isUrdu ? 'آج کی حاضری' : 'Attendance'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-700">
              {presentCount} {isUrdu ? 'حاضر' : 'present'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {todayVerifiedSignoffsCount} / {classes.length} {isUrdu ? 'کلاسز دستخط شدہ' : 'signed'}
          </div>
        </div>

        {/* Examinations Card */}
        <div
          onClick={() => onNavigate('exams')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{isUrdu ? 'امتحانات (ششماہی و سالانہ)' : 'Examinations'}</span>
            <Award className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {exams.length}
            </span>
            <span className="text-xs text-amber-700 font-medium">
              {exams.filter((e) => e.grade === 'mumtaz').length} {isUrdu ? 'ممتاز پوزیشن' : 'Mumtaz'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {isUrdu ? 'مع دستخط ممتحن و نگران' : 'Examiner & Supervisor signed'}
          </div>
        </div>

        {/* Monthly Fees Overview */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{isUrdu ? 'ماہانہ فیس وصولی' : 'Fee Collection'}</span>
            <DollarSign className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
              Rs. {totalCollectedFee.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              {feeCollectionRate}% {isUrdu ? 'وصول' : 'collected'}
            </span>
            <span className="text-rose-600 font-medium">
              Rs. {pendingFee.toLocaleString()} {isUrdu ? 'بقایا' : 'due'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Lesson Quality & Grading */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isUrdu ? 'یومیہ اسباق و معیار (گریڈنگ)' : 'Daily Lesson Quality (Grading)'}
              </h2>
              <p className="text-xs text-slate-500">
                {isUrdu
                  ? 'سبق، سبقی اور منزل کی مجموعی کارکردگی'
                  : 'Overall Sabaq & Manzil performance'}
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
              {todayLessons.length} {isUrdu ? 'سماعت' : 'heard'}
            </span>
          </div>

          <div className="space-y-3 mt-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  {isUrdu ? 'ممتاز (Excellent - 5/5)' : 'Mumtaz (Excellent)'}
                </span>
                <span className="font-mono tabular-nums text-slate-700">
                  {mumtazCount} ({todayLessons.length ? Math.round((mumtazCount / todayLessons.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${todayLessons.length ? (mumtazCount / todayLessons.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-teal-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                  {isUrdu ? 'جید / جید جداً (Good / Very Good)' : 'Jayyid (Good)'}
                </span>
                <span className="font-mono tabular-nums text-slate-700">
                  {jayyidCount} ({todayLessons.length ? Math.round((jayyidCount / todayLessons.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${todayLessons.length ? (jayyidCount / todayLessons.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-rose-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  {isUrdu ? 'کمزور / اعادہ درکار (Weak / Repeat)' : 'Weak / Re-hearing'}
                </span>
                <span className="font-mono tabular-nums text-slate-700">
                  {weakCount} ({todayLessons.length ? Math.round((weakCount / todayLessons.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${todayLessons.length ? (weakCount / todayLessons.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>نگرانِ شعبہ حفظ: <strong>{madrasa.supervisorNameUrdu}</strong></span>
            <button
              onClick={() => onNavigate('lessons')}
              className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1"
            >
              <span>{isUrdu ? 'تمام اسباق دیکھیں' : 'View all logs'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quran Memorization Stage Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isUrdu ? 'حفظ قرآن کی پیش رفت کا جائزہ' : 'Quran Memorization Progress'}
              </h2>
              <p className="text-xs text-slate-500">
                {isUrdu ? '30 پاروں میں طلباء کی تقسیم' : 'Distribution across 30 Paras'}
              </p>
            </div>
            <GraduationCap className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-2.5 mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                {isUrdu ? 'ناظرہ و ابتدائی قائدہ' : 'Nazra & Qaida'}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {progressBuckets.nazra} {isUrdu ? 'طلباء' : 'students'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-slate-400 h-2 rounded-full"
                style={{ width: `${(progressBuckets.nazra / students.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                {isUrdu ? 'ابتدائی حفظ (پارہ 1 تا 10)' : 'Juz 1 to 10 (Beginner)'}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {progressBuckets.juz1to10} {isUrdu ? 'طلباء' : 'students'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${(progressBuckets.juz1to10 / students.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                {isUrdu ? 'درجہ وسطیٰ (پارہ 11 تا 20)' : 'Juz 11 to 20 (Intermediate)'}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {progressBuckets.juz11to20} {isUrdu ? 'طلباء' : 'students'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full"
                style={{ width: `${(progressBuckets.juz11to20 / students.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                {isUrdu ? 'درجہ اخیرہ (پارہ 21 تا 29)' : 'Juz 21 to 29 (Advanced)'}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {progressBuckets.juz21to29} {isUrdu ? 'طلباء' : 'students'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-700 h-2 rounded-full"
                style={{ width: `${(progressBuckets.juz21to29 / students.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-800 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isUrdu ? 'قریب الختم / امیدوار دستار بندی' : 'Near Khatm'}
              </span>
              <span className="font-mono font-bold text-amber-700">
                {nearCompletionStudents.length} {isUrdu ? 'امیدوار' : 'candidates'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: `${(nearCompletionStudents.length / students.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            {isUrdu
              ? 'تکمیلِ حفظ کے فائنل امتحان کی تیاری از قاری حامد نواز صاحب جاری ہے۔'
              : 'Final Khatm examinations supervised by Qari Hamid Nawaz.'}
          </div>
        </div>

        {/* Fee Collection Status Tracker */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {isUrdu ? 'ماہانہ فیس کی وصولی کا گراف' : 'Monthly Fee Status'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isUrdu ? 'رواں ماہ کی وصولی اور واجبات' : 'Current month dues and collections'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {feeCollectionRate}%
              </span>
            </div>

            <div className="my-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-600">{isUrdu ? 'کل قابلِ وصول فیس:' : 'Total Expected:'}</span>
                <span className="font-mono font-bold text-slate-900">
                  Rs. {totalExpectedFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-emerald-700 font-medium">
                  {isUrdu ? 'اب تک وصول شدہ:' : 'Collected:'}
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  Rs. {totalCollectedFee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-600 font-medium">
                  {isUrdu ? 'بقایا واجبات:' : 'Pending Dues:'}
                </span>
                <span className="font-mono font-bold text-rose-700">
                  Rs. {pendingFee.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mt-3 flex">
                <div
                  className="bg-emerald-600 h-3 transition-all duration-500"
                  style={{ width: `${feeCollectionRate}%` }}
                />
                <div
                  className="bg-rose-400 h-3 transition-all duration-500"
                  style={{ width: `${100 - feeCollectionRate}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>{isUrdu ? 'معاف / زکوٰۃ وظیفہ:' : 'Exempt / Zakat:'}</span>
              <span className="font-medium text-slate-700">
                {students.filter((s) => s.feeCategory === 'exempt').length} {isUrdu ? 'طلباء' : 'students'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center">
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
            >
              <span>{isUrdu ? 'فیس رجسٹر کھولیں' : 'Open Fee Ledger'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Activity Table & Rapid Lesson Stream with Signatures */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-nastaliq">
              {isUrdu ? 'آج کے سنے گئے اسباق اور دستخط کی تفصیل' : "Today's Lessons Log & Verification"}
            </h2>
            <p className="text-xs text-slate-500">
              {isUrdu
                ? 'سبق، سبقی اور منزل کا یومیہ ریکارڈ، دستخط استاد اور توثیقِ نگران'
                : 'Sabaq, Sabqi, and Manzil audit trail with dual sign-offs'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewLesson}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {isUrdu ? '+ نیا سبق درج کریں' : '+ Log Sabaq'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-3 px-4 text-right">{isUrdu ? 'طالب علم' : 'Student'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'کلاس / درجہ' : 'Class'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'سبق (نیا)' : 'Sabaq (New)'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'سبقی' : 'Sabqi'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'منزل' : 'Manzil'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'گریڈ' : 'Grade'}</th>
                <th className="py-3 px-3 text-center">{isUrdu ? 'دستخط و توثیق' : 'Signatures'}</th>
                <th className="py-3 px-4 text-center">{isUrdu ? 'واٹس ایپ' : 'WhatsApp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayLessons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {isUrdu
                      ? 'آج کا کوئی سبق ابھی تک درج نہیں ہوا۔ "نیا سبق درج کریں" پر کلک کریں۔'
                      : 'No lessons logged yet today. Click "Log Daily Sabaq" to start.'}
                  </td>
                </tr>
              ) : (
                todayLessons.map((log) => {
                  const student = students.find((s) => s.id === log.studentId);
                  const cls = classes.find((c) => c.id === student?.classId);
                  const teacher = teachers.find((t) => t.id === log.recordedByTeacherId);
                  const gradeInfo = GRADE_DETAILS[log.grade];

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                      onClick={() => student && onSelectStudent(student)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {student?.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover border border-emerald-300 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {student?.nameUrdu?.slice(0, 1) || 'ط'}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 font-nastaliq text-sm">
                              {isUrdu ? student?.nameUrdu : student?.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {student?.admissionNo} · ولد {isUrdu ? student?.fatherNameUrdu : student?.fatherName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-700 font-medium">
                          {isUrdu ? cls?.nameUrdu : cls?.name}
                        </span>
                      </td>

                      {/* Sabaq */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-emerald-800">
                          {isUrdu ? `پارہ ${log.sabaqPara}` : `Juz ${log.sabaqPara}`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {log.sabaqSurah} ({log.sabaqAyahRange || `${log.sabaqLinesCount} سطریں`})
                        </div>
                      </td>

                      {/* Sabqi */}
                      <td className="py-3 px-3 text-slate-700">
                        <div className="font-medium">
                          {isUrdu ? `پارہ ${log.sabqiPara}` : `Juz ${log.sabqiPara}`}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {log.sabqiPagesCount}
                        </div>
                      </td>

                      {/* Manzil */}
                      <td className="py-3 px-3 text-slate-700">
                        <div className="font-medium">
                          {isUrdu ? `پارہ ${log.manzilPara}` : `Juz ${log.manzilPara}`}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {log.manzilPortion}
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${gradeInfo?.bg} ${gradeInfo?.color} ${gradeInfo?.border}`}
                        >
                          {isUrdu ? gradeInfo?.labelUrdu : gradeInfo?.labelEn}
                        </span>
                        {log.remarks && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                            {log.remarks}
                          </div>
                        )}
                      </td>

                      {/* Dual Signatures status */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            استاد: {teacher?.nameUrdu?.slice(0, 10) || 'دستخط شدہ'}
                          </span>
                          {log.supervisorSigned ? (
                            <span className="text-[10px] font-bold text-white bg-emerald-800 px-1.5 py-0.5 rounded shadow-2xs">
                              نگران: قاری حامد نواز ✔️
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-semibold">
                              نگران توثیق درکار
                            </span>
                          )}
                        </div>
                      </td>

                      {/* WhatsApp Share Button */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (student) {
                            const msg = formatWhatsAppMessage(
                              student,
                              madrasa,
                              teacher,
                              log,
                              undefined,
                              undefined,
                              lang
                            );
                            openWhatsApp(student.guardianPhone, msg);
                          }
                        }}
                      >
                        <button
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors shadow-xs"
                          title="والد کو واٹس ایپ کریں"
                        >
                          <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
