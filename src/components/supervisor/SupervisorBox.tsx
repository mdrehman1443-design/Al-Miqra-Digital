import React, { useState } from 'react';
import { MadrasaProfile, ClassDailySignoff, DailyLessonLog, AppLanguage } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  FileCheck,
  Award,
  Sparkles,
  PenTool,
} from 'lucide-react';

interface SupervisorBoxProps {
  madrasa: MadrasaProfile;
  todayLessonsCount: number;
  todayVerifiedLessonsCount: number;
  pendingAttendanceCount: number;
  verifiedAttendanceCount: number;
  lang: AppLanguage;
  onSignAllAttendanceToday?: () => void;
  onSignAllLessonsToday?: () => void;
  compact?: boolean;
}

export const SupervisorBox: React.FC<SupervisorBoxProps> = ({
  madrasa,
  todayLessonsCount,
  todayVerifiedLessonsCount,
  pendingAttendanceCount,
  verifiedAttendanceCount,
  lang,
  onSignAllAttendanceToday,
  onSignAllLessonsToday,
  compact = false,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';
  const supervisorName = isUrdu ? madrasa.supervisorNameUrdu : madrasa.supervisorNameEn;
  const supervisorDesig = isUrdu ? madrasa.supervisorDesignation : 'Head Supervisor - Hifz Dept';

  const [supervisorNote, setSupervisorNote] = useState<string>(
    'تمام اساتذہ کرام وقت کی پابندی اور تجوید و ترتیل کے معیار کو اولین ترجیح دیں۔ کمزور طلباء پر خصوصی توجہ دی جائے۔'
  );
  const [isSavedNote, setIsSavedNote] = useState(false);

  const handleSaveNote = () => {
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  if (compact) {
    return (
      <div className="bg-emerald-950 text-white rounded-2xl p-4 border-2 border-emerald-700/60 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-lg border border-emerald-600 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-[11px] text-emerald-300 font-semibold tracking-wide">
                {isUrdu ? 'نگران شعبہ حفظ و ناظرہ' : 'Hifz Department Supervisor'}
              </div>
              <div className="text-base font-bold font-nastaliq text-white">
                {supervisorName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 bg-emerald-900/80 rounded-lg text-emerald-200 border border-emerald-700">
              {todayVerifiedLessonsCount} / {todayLessonsCount} {isUrdu ? 'اسباق تصدیق شدہ' : 'verified'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-5 border-2 border-emerald-600/70 shadow-lg relative overflow-hidden">
      {/* Decorative Islamic Watermark */}
      <div className="absolute top-2 left-3 text-emerald-800/40 text-4xl select-none pointer-events-none font-quran">
        ﷽
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
        {/* Supervisor Profile */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xl border-2 border-emerald-500 shadow-md shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 border border-emerald-700">
                {isUrdu ? 'باکس برائے نگران شعبہ حفظ' : 'Supervisor Box'}
              </span>
              <span className="text-[11px] text-emerald-300 font-mono">
                {madrasa.nameUrdu}
              </span>
            </div>

            <h2 className="text-xl font-bold font-nastaliq text-white mt-1 leading-tight">
              {supervisorName}
            </h2>
            <p className="text-xs text-emerald-200 font-medium">
              {supervisorDesig}
            </p>

            <div className="flex items-center gap-3 mt-2 text-[11px] text-emerald-300/90 font-mono">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+92 300 8899112</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>روزانہ تدریسی معائنہ و توثیق</span>
            </div>
          </div>
        </div>

        {/* Supervision Counters & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Attendance Signoff Counter */}
          <div className="bg-emerald-900/80 border border-emerald-700/60 p-3 rounded-xl min-w-[130px] text-center">
            <div className="text-[10px] text-emerald-300 font-medium">
              {isUrdu ? 'حاضری رجسٹر دستخط' : 'Attendance Sign-off'}
            </div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {verifiedAttendanceCount}{' '}
              <span className="text-xs text-emerald-300">کلاسز</span>
            </div>
            {onSignAllAttendanceToday && (
              <button
                onClick={onSignAllAttendanceToday}
                className="mt-2 w-full py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <PenTool className="w-3 h-3" />
                <span>{isUrdu ? 'بطور نگران دستخط کریں' : 'Sign Attendance'}</span>
              </button>
            )}
          </div>

          {/* Lessons Oversight Counter */}
          <div className="bg-emerald-900/80 border border-emerald-700/60 p-3 rounded-xl min-w-[130px] text-center">
            <div className="text-[10px] text-emerald-300 font-medium">
              {isUrdu ? 'اسباق توثیق و منظوری' : 'Lessons Verified'}
            </div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {todayVerifiedLessonsCount} / {todayLessonsCount}
            </div>
            {onSignAllLessonsToday && (
              <button
                onClick={onSignAllLessonsToday}
                className="mt-2 w-full py-1 px-2 bg-teal-600 hover:bg-teal-500 text-white rounded text-[10px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{isUrdu ? 'تمام اسباق تصدیق کریں' : 'Verify All'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Supervisor Daily Directives / Guidance Note */}
      <div className="mt-4 pt-3 border-t border-emerald-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-300 font-bold font-nastaliq">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? 'نگرانِ اعلیٰ کی یومیہ ہدایات برائے اساتذہ کرام:' : 'Supervisor Daily Directive:'}</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={supervisorNote}
              onChange={(e) => setSupervisorNote(e.target.value)}
              className="bg-emerald-900/90 border border-emerald-700 text-emerald-100 rounded-lg px-2.5 py-1 text-xs w-full sm:w-80 focus:outline-emerald-400 font-nastaliq"
            />
            <button
              onClick={handleSaveNote}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors"
            >
              {isSavedNote ? (isUrdu ? 'محفوظ!' : 'Saved') : (isUrdu ? 'تبدیل کریں' : 'Update')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
