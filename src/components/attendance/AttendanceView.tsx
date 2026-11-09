import React, { useState, useMemo } from 'react';
import {
  Student,
  Teacher,
  ClassRoom,
  AttendanceRecord,
  AttendanceStatus,
  ClassDailySignoff,
  MadrasaProfile,
  AppLanguage,
} from '../../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Users,
  Check,
  Search,
  ShieldCheck,
  PenTool,
  Printer,
  Sparkles,
} from 'lucide-react';

interface AttendanceViewProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  attendance: AttendanceRecord[];
  signoffs: ClassDailySignoff[];
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  onUpdateSignoffs: (signoffs: ClassDailySignoff[]) => void;
  onSelectStudent: (student: Student) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  teachers,
  classes,
  attendance,
  signoffs,
  madrasa,
  lang,
  onUpdateAttendance,
  onUpdateSignoffs,
  onSelectStudent,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';
  const todayStr = new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classes[0]?.id || 'all'
  );
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Current selected class object
  const currentClass = classes.find((c) => c.id === selectedClassId);
  const classTeacher = teachers.find((t) => t.id === currentClass?.teacherId);

  // Active students in current view
  const currentClassStudents = useMemo(() => {
    return students.filter((s) => {
      if (s.status !== 'active') return false;
      if (selectedClassId !== 'all' && s.classId !== selectedClassId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          s.name.toLowerCase().includes(q) ||
          s.nameUrdu.includes(q) ||
          s.admissionNo.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [students, selectedClassId, searchQuery]);

  // Attendance map for selected date: studentId -> AttendanceRecord
  const dateAttendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance
      .filter((a) => a.date === selectedDate)
      .forEach((a) => map.set(a.studentId, a));
    return map;
  }, [attendance, selectedDate]);

  // Stats for selected date
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let unmarked = 0;

    currentClassStudents.forEach((s) => {
      const rec = dateAttendanceMap.get(s.id);
      if (!rec) unmarked++;
      else if (rec.status === 'present') present++;
      else if (rec.status === 'absent') absent++;
      else if (rec.status === 'leave') leave++;
    });

    return { present, absent, leave, unmarked };
  }, [currentClassStudents, dateAttendanceMap]);

  // Signoff for current class and date
  const currentSignoff = useMemo(() => {
    return signoffs.find(
      (s) => s.classId === selectedClassId && s.date === selectedDate
    );
  }, [signoffs, selectedClassId, selectedDate]);

  // Handle single status change
  const handleSetStatus = (
    studentId: string,
    status: AttendanceStatus,
    note?: string
  ) => {
    const existing = dateAttendanceMap.get(studentId);
    let updated: AttendanceRecord[];

    if (existing) {
      updated = attendance.map((a) =>
        a.id === existing.id ? { ...a, status, note: note ?? a.note } : a
      );
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        classId: selectedClassId === 'all' ? (students.find(s => s.id === studentId)?.classId || '') : selectedClassId,
        date: selectedDate,
        status,
        note,
      };
      updated = [...attendance, newRec];
    }
    onUpdateAttendance(updated);
  };

  // Mark all present in currently filtered list
  const handleMarkAllPresent = () => {
    const updated = [...attendance];
    currentClassStudents.forEach((s) => {
      const existing = updated.find(
        (a) => a.studentId === s.id && a.date === selectedDate
      );
      if (existing) {
        existing.status = 'present';
      } else {
        updated.push({
          id: `att-${Date.now()}-${Math.random()}`,
          studentId: s.id,
          classId: s.classId,
          date: selectedDate,
          status: 'present',
        });
      }
    });
    onUpdateAttendance(updated);
  };

  // Toggle Teacher Signature
  const handleToggleTeacherSign = () => {
    if (selectedClassId === 'all') {
      alert(isUrdu ? 'براہ کرم مخصوص کلاس منتخب کریں تاکہ استاد دستخط کر سکیں۔' : 'Please select a specific class to sign.');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (currentSignoff) {
      const updated = signoffs.map((s) =>
        s.id === currentSignoff.id
          ? {
              ...s,
              teacherSigned: !s.teacherSigned,
              teacherSignedAt: !s.teacherSigned ? timeStr : undefined,
            }
          : s
      );
      onUpdateSignoffs(updated);
    } else {
      const newSignoff: ClassDailySignoff = {
        id: `sign-${selectedClassId}-${selectedDate}`,
        classId: selectedClassId,
        date: selectedDate,
        teacherSigned: true,
        teacherSignedAt: timeStr,
        supervisorSigned: false,
      };
      onUpdateSignoffs([...signoffs, newSignoff]);
    }
  };

  // Toggle Supervisor (Qari Hamid Nawaz Sahib) Signature
  const handleToggleSupervisorSign = () => {
    if (selectedClassId === 'all') {
      alert(isUrdu ? 'براہ کرم مخصوص کلاس منتخب کریں تاکہ نگران دستخط کر سکیں۔' : 'Please select a specific class.');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (currentSignoff) {
      const updated = signoffs.map((s) =>
        s.id === currentSignoff.id
          ? {
              ...s,
              supervisorSigned: !s.supervisorSigned,
              supervisorSignedAt: !s.supervisorSigned ? timeStr : undefined,
              supervisorRemarks: !s.supervisorSigned && !s.supervisorRemarks
                ? 'حاضری رجسٹر بمعائنہ مکمل پایا گیا، تمام طلباء حاضر ہیں۔ (قاری حامد نواز)'
                : s.supervisorRemarks,
            }
          : s
      );
      onUpdateSignoffs(updated);
    } else {
      const newSignoff: ClassDailySignoff = {
        id: `sign-${selectedClassId}-${selectedDate}`,
        classId: selectedClassId,
        date: selectedDate,
        teacherSigned: true,
        teacherSignedAt: '08:30 AM',
        supervisorSigned: true,
        supervisorSignedAt: timeStr,
        supervisorRemarks: 'حاضری رجسٹر بمعائنہ مکمل پایا گیا، تمام طلباء حاضر ہیں۔ (قاری حامد نواز)',
      };
      onUpdateSignoffs([...signoffs, newSignoff]);
    }
  };

  // Update Supervisor Remarks
  const handleUpdateSupervisorRemarks = (text: string) => {
    if (!currentSignoff) {
      const newSignoff: ClassDailySignoff = {
        id: `sign-${selectedClassId}-${selectedDate}`,
        classId: selectedClassId,
        date: selectedDate,
        teacherSigned: true,
        supervisorSigned: true,
        supervisorRemarks: text,
      };
      onUpdateSignoffs([...signoffs, newSignoff]);
    } else {
      const updated = signoffs.map((s) =>
        s.id === currentSignoff.id ? { ...s, supervisorRemarks: text } : s
      );
      onUpdateSignoffs(updated);
    }
  };

  // Monthly summary calculation
  const monthlyStats = useMemo(() => {
    const monthPrefix = selectedDate.slice(0, 7);
    const monthRecords = attendance.filter((a) => a.date.startsWith(monthPrefix));

    return currentClassStudents.map((s) => {
      const studentMonthRecs = monthRecords.filter((a) => a.studentId === s.id);
      const presentDays = studentMonthRecs.filter((a) => a.status === 'present').length;
      const absentDays = studentMonthRecs.filter((a) => a.status === 'absent').length;
      const leaveDays = studentMonthRecs.filter((a) => a.status === 'leave').length;
      const totalRecorded = studentMonthRecs.length;
      const percentage =
        totalRecorded > 0 ? Math.round((presentDays / totalRecorded) * 100) : 100;

      return {
        student: s,
        presentDays,
        absentDays,
        leaveDays,
        totalRecorded,
        percentage,
      };
    });
  }, [currentClassStudents, attendance, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {madrasa.nameUrdu}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              نگران: {madrasa.supervisorNameUrdu}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq mt-1">
            {isUrdu ? 'حاضری کا نظام و باضابطہ دستخط رجسٹر' : 'Attendance & Dual Sign-off Register'}
          </h1>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'یومیہ حاضری کی تصدیق از استادِ کلاس اور نگرانِ شعبہ حفظ قاری حامد نواز صاحب'
              : 'Daily class attendance with required signatures from teacher and supervisor'}
          </p>
        </div>

        {/* View Switcher: Daily vs Monthly */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'daily'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'یومیہ حاضری و دستخط' : 'Daily & Signatures'}
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'monthly'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'ماہانہ رپورٹ' : 'Monthly Summary'}
          </button>
        </div>
      </div>

      {/* Filter and Date Bar */}
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
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-emerald-600"
          >
            <option value="all">{isUrdu ? 'تمام کلاسز (مجموعی)' : 'All Classes'}</option>
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
            placeholder={isUrdu ? 'طالب علم کا نام تلاش کریں...' : 'Search student...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Summary KPI Strip for Selected Day */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-emerald-800">
                {isUrdu ? 'کل حاضر طلباء' : 'Present (Hazir)'}
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-950 mt-1">
                {stats.present}
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-rose-800">
                {isUrdu ? 'غیر حاضر' : 'Absent (Ghair Hazir)'}
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-rose-950 mt-1">
                {stats.absent}
              </div>
            </div>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-amber-800">
                {isUrdu ? 'با رخصت' : 'On Leave (Rukhsat)'}
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-amber-950 mt-1">
                {stats.leave}
              </div>
            </div>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-600">
                {isUrdu ? 'غیر نشان زدہ' : 'Unmarked'}
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                {stats.unmarked}
              </div>
            </div>
            <button
              onClick={handleMarkAllPresent}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold transition-colors"
            >
              {isUrdu ? 'سب حاضر کریں' : 'All Present'}
            </button>
          </div>
        </div>
      )}

      {/* Daily Marking Table */}
      {activeTab === 'daily' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 font-nastaliq">
                  {isUrdu ? 'حاضری رجسٹر' : 'Attendance Sheet'} ({currentClassStudents.length})
                </h2>
                <div className="text-xs text-slate-500">
                  {selectedClassId !== 'all' ? (
                    <span>
                      کلاس: <strong>{currentClass?.nameUrdu}</strong> · استادِ متعلقہ: {classTeacher?.nameUrdu || 'قاری صاحب'}
                    </span>
                  ) : (
                    <span>تمام درجات کی مجموعی حاضری</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'تمام طلباء کو حاضر کریں' : 'Mark All Present'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  title="پرنٹ کریں"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'پرنٹ رجسٹر' : 'Print'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                  <tr>
                    <th className="py-3 px-4 text-right">{isUrdu ? 'طالب علم' : 'Student'}</th>
                    <th className="py-3 px-3 text-right">{isUrdu ? 'کلاس' : 'Class'}</th>
                    <th className="py-3 px-4 text-center">{isUrdu ? 'حاضری اسٹیٹس' : 'Status'}</th>
                    <th className="py-3 px-3 text-right">{isUrdu ? 'وجہ / نوٹ' : 'Leave Reason / Note'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentClassStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400">
                        {isUrdu ? 'کوئی طالب علم موجود نہیں ہے۔' : 'No students found.'}
                      </td>
                    </tr>
                  ) : (
                    currentClassStudents.map((s) => {
                      const record = dateAttendanceMap.get(s.id);
                      const status = record?.status;
                      const cls = classes.find((c) => c.id === s.classId);

                      return (
                        <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <button
                              onClick={() => onSelectStudent(s)}
                              className="text-right hover:text-emerald-800 focus:outline-none"
                            >
                              <div className="font-bold text-slate-900 font-nastaliq text-sm">
                                {isUrdu ? s.nameUrdu : s.name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {s.admissionNo} · ولد {isUrdu ? s.fatherNameUrdu : s.fatherName}
                              </div>
                            </button>
                          </td>

                          <td className="py-3 px-3">
                            <span className="text-slate-600 font-medium">
                              {isUrdu ? cls?.nameUrdu : cls?.name}
                            </span>
                          </td>

                          {/* Interactive Status Switcher */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                              <button
                                onClick={() => handleSetStatus(s.id, 'present')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                  status === 'present'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-emerald-700'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isUrdu ? 'حاضر' : 'Present'}</span>
                              </button>

                              <button
                                onClick={() => handleSetStatus(s.id, 'absent')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                  status === 'absent'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-rose-700'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{isUrdu ? 'غیر حاضر' : 'Absent'}</span>
                              </button>

                              <button
                                onClick={() => handleSetStatus(s.id, 'leave')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                                  status === 'leave'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-amber-700'
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>{isUrdu ? 'رخصت' : 'Leave'}</span>
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <input
                              type="text"
                              placeholder={
                                isUrdu
                                  ? 'رخصت یا غیر حاضری کی وجہ...'
                                  : 'Reason for absence...'
                              }
                              defaultValue={record?.note || ''}
                              onBlur={(e) => {
                                if (e.target.value !== (record?.note || '')) {
                                  handleSetStatus(s.id, status || 'present', e.target.value);
                                }
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-emerald-600"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DUAL SIGNATURES BOX (TEACHER & SUPERVISOR QARI HAMID NAWAZ SAHIB) */}
          <div className="bg-white rounded-2xl border-2 border-emerald-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="text-sm font-bold text-slate-900 font-nastaliq">
                  {isUrdu
                    ? 'باضابطہ توثیق و دستخط رجسٹر (استادِ متعلقہ اور نگران شعبہ حفظ)'
                    : 'Class Daily Verification & Dual Sign-off Boxes'}
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                تاریخ: {selectedDate}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Teacher's Signature Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      {isUrdu ? '1. باکس برائے دستخط استادِ متعلقہ' : '1. Class Teacher Signature Box'}
                    </span>
                    {currentSignoff?.teacherSigned ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'دستخط شدہ ✔️' : 'Signed'}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {isUrdu ? 'دستخط درکار ⚠️' : 'Pending Signature'}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-slate-900 font-nastaliq text-base">
                    {classTeacher?.nameUrdu || (isUrdu ? 'استادِ شعبہ حفظ' : 'Class Teacher')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {isUrdu
                      ? 'میں تصدیق کرتا ہوں کہ اوپر درج تمام طلباء کی حاضری میرے روبرو لی گئی ہے۔'
                      : 'I certify that the attendance recorded above was taken in my presence.'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    {currentSignoff?.teacherSignedAt ? `وقت: ${currentSignoff.teacherSignedAt}` : 'وقت: بعد تکمیلِ کلاس'}
                  </span>
                  <button
                    onClick={handleToggleTeacherSign}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                      currentSignoff?.teacherSigned
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>{currentSignoff?.teacherSigned ? (isUrdu ? 'دستخط واپس لیں' : 'Undo Sign') : (isUrdu ? 'دستخط استاد لگائیں' : 'Sign as Teacher')}</span>
                  </button>
                </div>
              </div>

              {/* Box 2: Supervisor's Signature Box (Qari Hamid Nawaz Sahib) */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border-2 border-emerald-600/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>{isUrdu ? '2. باکس برائے نگرانِ شعبہ حفظ' : '2. Head Supervisor Box'}</span>
                    </span>
                    {currentSignoff?.supervisorSigned ? (
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isUrdu ? 'بمعائنہ تصدیق شدہ ✔️' : 'Verified'}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        {isUrdu ? 'نگران معائنہ درکار ⚠️' : 'Supervisor Review Due'}
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-emerald-950 font-nastaliq text-base">
                    {madrasa.supervisorNameUrdu}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium">
                    {madrasa.supervisorDesignation}
                  </div>

                  {/* Supervisor Remarks Input */}
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder={
                        isUrdu
                          ? 'نگران کے خصوصی ریمارکس / معائنہ نوٹ...'
                          : 'Supervisor inspection remarks...'
                      }
                      defaultValue={
                        currentSignoff?.supervisorRemarks ||
                        'حاضری رجسٹر بمعائنہ مکمل پایا گیا، تمام طلباء حاضر ہیں۔ (قاری حامد نواز)'
                      }
                      onBlur={(e) => handleUpdateSupervisorRemarks(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-nastaliq focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-800">
                    {currentSignoff?.supervisorSignedAt ? `توثیق: ${currentSignoff.supervisorSignedAt}` : 'معائنہ: یومیہ دفتری وقت'}
                  </span>
                  <button
                    onClick={handleToggleSupervisorSign}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      currentSignoff?.supervisorSigned
                        ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{currentSignoff?.supervisorSigned ? (isUrdu ? 'دستخط واپس لیں' : 'Undo Sign') : (isUrdu ? 'دستخط و مہر نگران' : 'Sign & Stamp')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Monthly Summary Report */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-nastaliq">
                {isUrdu ? 'ماہانہ حاضری کا خلاصہ' : 'Monthly Attendance Breakdown'} (
                {selectedDate.slice(0, 7)})
              </h2>
              <div className="text-xs text-slate-500">
                نگران شعبہ حفظ: <strong>{madrasa.supervisorNameUrdu}</strong>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {isUrdu ? '80 فیصد سے کم حاضری پر خصوصی توجہ دیں' : 'Target: >= 80%'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-3 px-4 text-right">{isUrdu ? 'طالب علم' : 'Student'}</th>
                  <th className="py-3 px-3 text-right">{isUrdu ? 'کل ایام' : 'Recorded Days'}</th>
                  <th className="py-3 px-3 text-right">{isUrdu ? 'حاضر (دن)' : 'Present Days'}</th>
                  <th className="py-3 px-3 text-right">{isUrdu ? 'غیر حاضر' : 'Absent Days'}</th>
                  <th className="py-3 px-3 text-right">{isUrdu ? 'با رخصت' : 'Leave Days'}</th>
                  <th className="py-3 px-4 text-right">{isUrdu ? 'حاضری فیصد' : 'Attendance %'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyStats.map(
                  ({
                    student,
                    presentDays,
                    absentDays,
                    leaveDays,
                    totalRecorded,
                    percentage,
                  }) => {
                    const isLow = percentage < 80;

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => onSelectStudent(student)}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 font-nastaliq text-sm">
                            {isUrdu ? student.nameUrdu : student.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {student.admissionNo}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-medium text-slate-700">
                          {totalRecorded}
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                          {presentDays}
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-rose-700">
                          {absentDays}
                        </td>

                        <td className="py-3 px-3 font-mono text-amber-700">
                          {leaveDays}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  isLow ? 'bg-rose-500' : 'bg-emerald-600'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono font-bold ${
                                isLow ? 'text-rose-600' : 'text-slate-800'
                              }`}
                            >
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
