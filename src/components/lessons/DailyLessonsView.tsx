import React, { useState, useMemo } from 'react';
import {
  Student,
  Teacher,
  ClassRoom,
  DailyLessonLog,
  MadrasaProfile,
  AppLanguage,
} from '../../types';
import { GRADE_DETAILS, QURAN_JUZ, POPULAR_SURAHS } from '../../utils/quranData';
import { formatWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Share2,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  PenTool,
} from 'lucide-react';

interface DailyLessonsViewProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  lessons: DailyLessonLog[];
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onAddLesson: (log: Omit<DailyLessonLog, 'id'>) => void;
  onUpdateLesson?: (log: DailyLessonLog) => void;
  onDeleteLesson: (id: string) => void;
  onSelectStudent: (student: Student) => void;
}

export const DailyLessonsView: React.FC<DailyLessonsViewProps> = ({
  students,
  teachers,
  classes,
  lessons,
  madrasa,
  lang,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onSelectStudent,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';
  const todayStr = new Date().toISOString().slice(0, 10);

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new lesson
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [sabaqPara, setSabaqPara] = useState<number>(1);
  const [sabaqSurah, setSabaqSurah] = useState<string>('الفاتحۃ');
  const [sabaqAyahRange, setSabaqAyahRange] = useState<string>('آیت 1 تا 7');
  const [sabaqLinesCount, setSabaqLinesCount] = useState<number>(16);
  const [sabqiPara, setSabqiPara] = useState<number>(1);
  const [sabqiPagesCount, setSabqiPagesCount] = useState<string>('4 صفحات');
  const [manzilPara, setManzilPara] = useState<number>(30);
  const [manzilPortion, setManzilPortion] = useState<string>('مکمل پارہ');
  const [grade, setGrade] = useState<DailyLessonLog['grade']>('mumtaz');
  const [remarks, setRemarks] = useState<string>('ماشاء اللہ عمدہ حفظ و ترتیل۔');
  const [teacherId, setTeacherId] = useState<string>(teachers[0]?.id || '');
  const [teacherSigned, setTeacherSigned] = useState<boolean>(true);
  const [supervisorSigned, setSupervisorSigned] = useState<boolean>(true);
  const [supervisorRemarks, setSupervisorRemarks] = useState<string>(
    'سبق کی سماعت تسلی بخش ہے۔ (قاری حامد نواز)'
  );

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    return lessons
      .filter((l) => {
        if (selectedDate && l.date !== selectedDate) return false;
        const student = students.find((s) => s.id === l.studentId);
        if (!student) return false;
        if (selectedClassId !== 'all' && student.classId !== selectedClassId) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            student.name.toLowerCase().includes(q) ||
            student.nameUrdu.includes(q) ||
            student.admissionNo.toLowerCase().includes(q) ||
            student.fatherName.toLowerCase().includes(q) ||
            student.fatherNameUrdu.includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [lessons, selectedDate, selectedClassId, searchQuery, students]);

  // Students who haven't logged Sabaq today
  const pendingStudents = useMemo(() => {
    const loggedStudentIds = new Set(
      lessons.filter((l) => l.date === selectedDate).map((l) => l.studentId)
    );
    return students.filter((s) => {
      if (s.status !== 'active') return false;
      if (selectedClassId !== 'all' && s.classId !== selectedClassId) return false;
      return !loggedStudentIds.has(s.id);
    });
  }, [lessons, selectedDate, students, selectedClassId]);

  // Pre-fill form when student is selected
  const handleSelectStudentForForm = (studId: string) => {
    setSelectedStudentId(studId);
    const stud = students.find((s) => s.id === studId);
    if (stud) {
      setSabaqPara(stud.currentPara || 1);
      setSabqiPara(Math.max(1, (stud.currentPara || 1) - 1));
      const lastCompleted = stud.completedParas?.[0] || 1;
      setManzilPara(lastCompleted);
      if (stud.teacherId) setTeacherId(stud.teacherId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onAddLesson({
      studentId: selectedStudentId,
      date: selectedDate,
      timestamp: timeStr,
      sabaqPara,
      sabaqSurah,
      sabaqAyahRange,
      sabaqLinesCount,
      sabqiPara,
      sabqiPagesCount,
      manzilPara,
      manzilPortion,
      grade,
      remarks,
      recordedByTeacherId: teacherId || teachers[0]?.id || '',
      teacherSigned,
      supervisorSigned,
      supervisorRemarks,
    });

    setIsModalOpen(false);
    setSelectedStudentId('');
  };

  // Toggle single supervisor signature on a lesson
  const handleToggleSupervisorSign = (log: DailyLessonLog) => {
    if (!onUpdateLesson) return;
    onUpdateLesson({
      ...log,
      supervisorSigned: !log.supervisorSigned,
      supervisorRemarks: !log.supervisorSigned && !log.supervisorRemarks
        ? 'بمعائنہ و توثیق از قاری حامد نواز صاحب (نگرانِ شعبہ حفظ)'
        : log.supervisorRemarks,
    });
  };

  // Batch sign all lessons of the day by Qari Hamid Nawaz
  const handleBatchVerifyAllLessons = () => {
    if (!onUpdateLesson) return;
    filteredLessons.forEach((l) => {
      if (!l.supervisorSigned) {
        onUpdateLesson({
          ...l,
          supervisorSigned: true,
          supervisorRemarks: l.supervisorRemarks || 'بمعائنہ و توثیق از قاری حامد نواز صاحب (نگرانِ شعبہ حفظ)',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {madrasa.nameUrdu}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              نگرانِ اعلیٰ: {madrasa.supervisorNameUrdu}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq mt-1">
            {isUrdu ? 'یومیہ اسباق و باضابطہ توثیق رجسٹر' : 'Daily Lessons & Verified Sign-offs'}
          </h1>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'سبق (نیا سبق)، سبقی اور منزل کی سماعت مع دستخط استاد اور توثیق از نگران شعبہ حفظ قاری حامد نواز صاحب'
              : 'Sabaq, Sabqi, and Manzil tracking with dual sign-off from Teacher and Supervisor'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleBatchVerifyAllLessons}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 font-bold text-xs rounded-xl shadow-2xs transition-colors"
            title="نگران تمام اسباق کی تصدیق کریں"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{isUrdu ? 'تمام اسباق توثیق کریں (نگران)' : 'Verify All (Supervisor)'}</span>
          </button>

          <button
            onClick={() => {
              if (pendingStudents.length > 0) {
                handleSelectStudentForForm(pendingStudents[0].id);
              }
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isUrdu ? 'نیا سبق درج کریں' : 'Log New Lesson'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-700 focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600 font-medium"
          >
            <option value="all">{isUrdu ? 'تمام کلاسز و درجات' : 'All Classes'}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {isUrdu ? c.nameUrdu : c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1 lg:col-span-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={
              isUrdu
                ? 'طالب علم کا نام یا داخلہ نمبر تلاش کریں...'
                : 'Search student name or roll #...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Pending Students Quick Bar */}
      {selectedDate === todayStr && pendingStudents.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>
                {isUrdu
                  ? `آج کی سماعت کے منتظر طلباء (${pendingStudents.length})`
                  : `Awaiting Sabaq Hearing Today (${pendingStudents.length})`}
              </span>
            </div>
            <span className="text-[11px] text-amber-700">
              {isUrdu ? 'کسی بھی طالب علم پر کلک کر کے فوری سبق درج کریں' : 'Click to log'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {pendingStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  handleSelectStudentForForm(s.id);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-800 text-xs rounded-lg border border-amber-300 font-medium transition-all shadow-2xs hover:scale-102"
              >
                <span className="font-nastaliq font-bold">{isUrdu ? s.nameUrdu : s.name}</span>
                <span className="text-[10px] text-amber-700 font-mono">({s.admissionNo})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 font-nastaliq">
            {isUrdu ? 'ریکارڈ شدہ اسباق مع توثیق و دستخط' : 'Recorded Lesson Logs & Signatures'} (
            {filteredLessons.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">{selectedDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-3 px-4 text-right">{isUrdu ? 'طالب علم' : 'Student'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? '1. سبق (نیا)' : '1. Sabaq (New)'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? '2. سبقی' : '2. Sabqi'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? '3. منزل' : '3. Manzil'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'کیفیت / ریمارکس' : 'Grade & Notes'}</th>
                <th className="py-3 px-3 text-center">{isUrdu ? 'دستخط استاد' : 'Teacher Sign'}</th>
                <th className="py-3 px-3 text-center">{isUrdu ? 'توثیق نگران' : 'Supervisor Sign'}</th>
                <th className="py-3 px-4 text-center">{isUrdu ? 'کارروائی' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    {isUrdu
                      ? 'اس تاریخ یا کلاس کا کوئی سبق درج نہیں ملا۔'
                      : 'No lessons logged for this date and filter.'}
                  </td>
                </tr>
              ) : (
                filteredLessons.map((log) => {
                  const student = students.find((s) => s.id === log.studentId);
                  const teacher = teachers.find((t) => t.id === log.recordedByTeacherId);
                  const gradeInfo = GRADE_DETAILS[log.grade];

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => student && onSelectStudent(student)}
                          className="text-right hover:text-emerald-800 focus:outline-none"
                        >
                          <div className="font-bold text-slate-900 font-nastaliq text-sm">
                            {isUrdu ? student?.nameUrdu : student?.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {student?.admissionNo} · ولد {isUrdu ? student?.fatherNameUrdu : student?.fatherName}
                          </div>
                        </button>
                      </td>

                      {/* Sabaq */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-emerald-800">
                          {isUrdu ? `پارہ ${log.sabaqPara}` : `Juz ${log.sabaqPara}`}
                        </div>
                        <div className="text-slate-600 font-medium">
                          {log.sabaqSurah}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {log.sabaqAyahRange || `${log.sabaqLinesCount} سطریں`}
                        </div>
                      </td>

                      {/* Sabqi */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">
                          {isUrdu ? `پارہ ${log.sabqiPara}` : `Juz ${log.sabqiPara}`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {log.sabqiPagesCount}
                        </div>
                      </td>

                      {/* Manzil */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">
                          {isUrdu ? `پارہ ${log.manzilPara}` : `Juz ${log.manzilPara}`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {log.manzilPortion}
                        </div>
                      </td>

                      {/* Grade & Remarks */}
                      <td className="py-3 px-3 max-w-xs">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${gradeInfo.bg} ${gradeInfo.color} ${gradeInfo.border}`}
                        >
                          {isUrdu ? gradeInfo.labelUrdu : gradeInfo.labelEn}
                        </span>
                        {log.remarks && (
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {log.remarks}
                          </p>
                        )}
                        {log.supervisorRemarks && (
                          <p className="text-[10px] text-emerald-900 mt-0.5 bg-emerald-50 px-1.5 py-0.5 rounded font-nastaliq">
                            نگران: {log.supervisorRemarks}
                          </p>
                        )}
                      </td>

                      {/* Teacher Signature */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>{isUrdu ? teacher?.nameUrdu?.slice(0, 12) || 'دستخط' : 'Signed'}</span>
                        </span>
                      </td>

                      {/* Supervisor Signature (Qari Hamid Nawaz) */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleSupervisorSign(log)}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                            log.supervisorSigned
                              ? 'bg-emerald-800 text-white shadow-2xs'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                          title="نگران کی تصدیق ٹوگل کریں"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{log.supervisorSigned ? (isUrdu ? 'قاری حامد نواز ✔️' : 'Verified') : (isUrdu ? 'دستخط درکار' : 'Pending')}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
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
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                            title="والد کو واٹس ایپ کریں"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteLesson(log.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف کریں"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Lesson Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold font-nastaliq text-emerald-950">
                  {isUrdu ? 'یومیہ سبق کی سماعت و اندراج' : 'Log Daily Lesson (Sabaq)'}
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                  {madrasa.nameUrdu}
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              {/* Select Student */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'طالب علم منتخب کریں *' : 'Select Student *'}
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => handleSelectStudentForForm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-emerald-600 font-nastaliq"
                >
                  <option value="">{isUrdu ? '-- طالب علم کا انتخاب کریں --' : '-- Select student --'}</option>
                  {students
                    .filter((s) => s.status === 'active')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {isUrdu ? s.nameUrdu : s.name} ({s.admissionNo}) - پارے: {s.completedParas?.length || 0}
                      </option>
                    ))}
                </select>
              </div>

              {/* 1. Sabaq (New Lesson) */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-3">
                <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{isUrdu ? '1. سبق (نیا سبق - New Lesson)' : '1. Sabaq (New Lesson)'}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">{isUrdu ? 'پارہ نمبر:' : 'Juz #:'}</label>
                    <select
                      value={sabaqPara}
                      onChange={(e) => setSabaqPara(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                    >
                      {QURAN_JUZ.map((j) => (
                        <option key={j.number} value={j.number}>
                          {j.number}. {j.nameUrdu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">{isUrdu ? 'سورت کا نام:' : 'Surah Name:'}</label>
                    <input
                      type="text"
                      list="surahs-list"
                      value={sabaqSurah}
                      onChange={(e) => setSabaqSurah(e.target.value)}
                      placeholder="مثلاً: البقرۃ / یٰسٓ"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-quran"
                    />
                    <datalist id="surahs-list">
                      {POPULAR_SURAHS.map((s, idx) => (
                        <option key={idx} value={s} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">{isUrdu ? 'آیات یا مقام:' : 'Ayah Range:'}</label>
                    <input
                      type="text"
                      value={sabaqAyahRange}
                      onChange={(e) => setSabaqAyahRange(e.target.value)}
                      placeholder="مثلاً: آیت 15 تا 25 / رکوع 2"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">{isUrdu ? 'سطریں / صفحات:' : 'Lines/Pages:'}</label>
                    <input
                      type="number"
                      value={sabaqLinesCount}
                      onChange={(e) => setSabaqLinesCount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Sabqi & 3. Manzil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>{isUrdu ? '2. سبقی (حالیہ اعادہ)' : '2. Sabqi'}</span>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">{isUrdu ? 'پارہ:' : 'Juz:'}</label>
                    <select
                      value={sabqiPara}
                      onChange={(e) => setSabqiPara(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                    >
                      {QURAN_JUZ.map((j) => (
                        <option key={j.number} value={j.number}>
                          {j.number}. {j.nameUrdu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">{isUrdu ? 'مقدار / صفحات:' : 'Pages/Portion:'}</label>
                    <input
                      type="text"
                      value={sabqiPagesCount}
                      onChange={(e) => setSabqiPagesCount(e.target.value)}
                      placeholder="مثلاً: 4 صفحات / ربع پارہ"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{isUrdu ? '3. منزل (دورِ قدیم)' : '3. Manzil'}</span>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">{isUrdu ? 'پارہ:' : 'Juz:'}</label>
                    <select
                      value={manzilPara}
                      onChange={(e) => setManzilPara(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                    >
                      {QURAN_JUZ.map((j) => (
                        <option key={j.number} value={j.number}>
                          {j.number}. {j.nameUrdu}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">{isUrdu ? 'مقدار:' : 'Portion:'}</label>
                    <input
                      type="text"
                      value={manzilPortion}
                      onChange={(e) => setManzilPortion(e.target.value)}
                      placeholder="مثلاً: مکمل پارہ / نصف پارہ"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Grade & Teacher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'کیفیت / گریڈ *' : 'Grade *'}
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as DailyLessonLog['grade'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium"
                  >
                    <option value="mumtaz">{isUrdu ? 'ممتاز (Excellent - 5/5)' : 'Excellent (Mumtaz)'}</option>
                    <option value="jayyid_jiddan">{isUrdu ? 'جید جداً (Very Good - 4/5)' : 'Very Good (Jayyid Jiddan)'}</option>
                    <option value="jayyid">{isUrdu ? 'جید (Good - 3/5)' : 'Good (Jayyid)'}</option>
                    <option value="maqbool">{isUrdu ? 'مقبول (Fair - 2/5)' : 'Fair (Maqbool)'}</option>
                    <option value="weak">{isUrdu ? 'اعادہ / کمزور (Weak / Re-hearing - 1/5)' : 'Weak / Re-hearing'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'استاد محترم *' : 'Teacher / Qari *'}
                  </label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {isUrdu ? t.nameUrdu : t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'استاد کے ریمارکس / تجوید و حفظ نوٹ' : 'Teacher Remarks'}
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'مثلاً: ماشاء اللہ سبق پختہ سنایا، غنہ اور اخفاء پر خصوصی توجہ دی جائے۔'
                      : 'e.g. Excellent memorization.'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              {/* DUAL SIGNATURES IN LESSON FORM */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-300 space-y-2">
                <div className="font-bold text-emerald-950 text-xs flex items-center justify-between">
                  <span>{isUrdu ? 'دستخط و توثیق (استاد اور نگران):' : 'Dual Sign-off:'}</span>
                  <span className="text-[11px] text-emerald-800 font-mono">
                    نگران: {madrasa.supervisorNameUrdu}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={teacherSigned}
                      onChange={(e) => setTeacherSigned(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>{isUrdu ? 'دستخط استاد موجود ہیں' : 'Teacher Signed'}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-emerald-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={supervisorSigned}
                      onChange={(e) => setSupervisorSigned(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>{isUrdu ? 'توثیق از قاری حامد نواز' : 'Supervisor Verified'}</span>
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    value={supervisorRemarks}
                    onChange={(e) => setSupervisorRemarks(e.target.value)}
                    placeholder={isUrdu ? 'نگران شعبہ حفظ کے ریمارکس...' : 'Supervisor remarks...'}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-xs font-nastaliq"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudentId}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all"
                >
                  {isUrdu ? 'سبق محفوظ کریں' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
