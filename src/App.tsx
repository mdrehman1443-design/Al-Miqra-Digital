import React, { useState, useEffect } from 'react';
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
} from './types';
import { Storage } from './utils/storage';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { DailyLessonsView } from './components/lessons/DailyLessonsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { ExamsView } from './components/exams/ExamsView';
import { StudentsView } from './components/students/StudentsView';
import { ClassesView } from './components/classes/ClassesView';
import { FeesView } from './components/fees/FeesView';
import { ReportCardModal } from './components/reports/ReportCardModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { MadrasaSettingsModal } from './components/modals/MadrasaSettingsModal';
import { ShareAppModal } from './components/modals/ShareAppModal';

export default function App() {
  const [lang, setLang] = useState<AppLanguage>('ur');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Madrasa Data States
  const [madrasa, setMadrasa] = useState<MadrasaProfile>(Storage.getMadrasa);
  const [teachers, setTeachers] = useState<Teacher[]>(Storage.getTeachers);
  const [classes, setClasses] = useState<ClassRoom[]>(Storage.getClasses);
  const [students, setStudents] = useState<Student[]>(Storage.getStudents);
  const [lessons, setLessons] = useState<DailyLessonLog[]>(Storage.getLessons);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(Storage.getAttendance);
  const [fees, setFees] = useState<FeePayment[]>(Storage.getFees);
  const [exams, setExams] = useState<ExamRecord[]>(Storage.getExams);
  const [signoffs, setSignoffs] = useState<ClassDailySignoff[]>(Storage.getSignoffs);

  // Modals
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<Student | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);
  const [whatsAppStudent, setWhatsAppStudent] = useState<Student | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr';
  }, [lang]);

  // Lessons handlers
  const handleAddLesson = (newLessonData: Omit<DailyLessonLog, 'id'>) => {
    const newLog: DailyLessonLog = {
      ...newLessonData,
      id: `log-${Date.now()}`,
    };
    const updated = [newLog, ...lessons];
    setLessons(updated);
    Storage.setLessons(updated);

    // Also update student currentPara if advanced
    const stud = students.find((s) => s.id === newLessonData.studentId);
    if (stud && newLessonData.sabaqPara !== stud.currentPara) {
      const updatedStuds = students.map((s) =>
        s.id === stud.id ? { ...s, currentPara: newLessonData.sabaqPara } : s
      );
      setStudents(updatedStuds);
      Storage.setStudents(updatedStuds);
    }
  };

  const handleUpdateLesson = (updatedLog: DailyLessonLog) => {
    const updated = lessons.map((l) => (l.id === updatedLog.id ? updatedLog : l));
    setLessons(updated);
    Storage.setLessons(updated);
  };

  const handleDeleteLesson = (id: string) => {
    const updated = lessons.filter((l) => l.id !== id);
    setLessons(updated);
    Storage.setLessons(updated);
  };

  // Supervisor Batch Sign-off: Verify all lessons today
  const handleSignAllLessonsToday = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const updated = lessons.map((l) =>
      l.date === todayStr
        ? {
            ...l,
            supervisorSigned: true,
            supervisorRemarks:
              l.supervisorRemarks || 'بمعائنہ و توثیق از قاری حامد نواز صاحب (نگرانِ شعبہ حفظ)',
          }
        : l
    );
    setLessons(updated);
    Storage.setLessons(updated);
  };

  // Attendance handlers
  const handleUpdateAttendance = (updated: AttendanceRecord[]) => {
    setAttendance(updated);
    Storage.setAttendance(updated);
  };

  const handleUpdateSignoffs = (updated: ClassDailySignoff[]) => {
    setSignoffs(updated);
    Storage.setSignoffs(updated);
  };

  // Supervisor Batch Sign-off: Verify all classes attendance today
  const handleSignAllAttendanceToday = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' });

    const updated = classes.map((c) => {
      const existing = signoffs.find((s) => s.classId === c.id && s.date === todayStr);
      if (existing) {
        return {
          ...existing,
          supervisorSigned: true,
          supervisorSignedAt: nowTime,
          supervisorRemarks:
            existing.supervisorRemarks ||
            'حاضری رجسٹر بمعائنہ مکمل و درست پایا گیا۔ (قاری حامد نواز)',
        };
      }
      return {
        id: `sign-${c.id}-${todayStr}`,
        classId: c.id,
        date: todayStr,
        teacherSigned: true,
        teacherSignedAt: nowTime,
        supervisorSigned: true,
        supervisorSignedAt: nowTime,
        supervisorRemarks:
          'حاضری رجسٹر بمعائنہ مکمل و درست پایا گیا۔ (قاری حامد نواز)',
      };
    });

    const merged = [
      ...signoffs.filter((s) => s.date !== todayStr),
      ...updated,
    ];
    setSignoffs(merged);
    Storage.setSignoffs(merged);
  };

  // Examinations handlers
  const handleAddExam = (newExamData: Omit<ExamRecord, 'id'>) => {
    const newExam: ExamRecord = {
      ...newExamData,
      id: `exam-${Date.now()}`,
    };
    const updated = [newExam, ...exams];
    setExams(updated);
    Storage.setExams(updated);
  };

  const handleUpdateExam = (updatedExam: ExamRecord) => {
    const updated = exams.map((e) => (e.id === updatedExam.id ? updatedExam : e));
    setExams(updated);
    Storage.setExams(updated);
  };

  const handleDeleteExam = (id: string) => {
    if (confirm(lang === 'ur' ? 'کیا آپ یہ امتحانی ریکارڈ حذف کرنا چاہتے ہیں؟' : 'Delete this exam record?')) {
      const updated = exams.filter((e) => e.id !== id);
      setExams(updated);
      Storage.setExams(updated);
    }
  };

  // Students handlers
  const handleAddStudent = (newStudData: Omit<Student, 'id'>) => {
    const newStud: Student = {
      ...newStudData,
      id: `s-${Date.now()}`,
    };
    const updated = [newStud, ...students];
    setStudents(updated);
    Storage.setStudents(updated);
  };

  const handleUpdateStudent = (updatedStud: Student) => {
    const updated = students.map((s) => (s.id === updatedStud.id ? updatedStud : s));
    setStudents(updated);
    Storage.setStudents(updated);
    if (selectedStudentForDrawer?.id === updatedStud.id) {
      setSelectedStudentForDrawer(updatedStud);
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm(lang === 'ur' ? 'کیا آپ اس طالب علم کا ریکارڈ حذف کرنا چاہتے ہیں؟' : 'Delete this student record?')) {
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      Storage.setStudents(updated);
      if (selectedStudentForDrawer?.id === id) {
        setSelectedStudentForDrawer(null);
      }
    }
  };

  // Classes handlers
  const handleAddClass = (newClsData: Omit<ClassRoom, 'id'>) => {
    const newCls: ClassRoom = {
      ...newClsData,
      id: `c-${Date.now()}`,
    };
    const updated = [...classes, newCls];
    setClasses(updated);
    Storage.setClasses(updated);
  };

  const handleUpdateClass = (updatedCls: ClassRoom) => {
    const updated = classes.map((c) => (c.id === updatedCls.id ? updatedCls : c));
    setClasses(updated);
    Storage.setClasses(updated);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm(lang === 'ur' ? 'کیا آپ یہ کلاس حذف کرنا چاہتے ہیں؟' : 'Delete this class?')) {
      const updated = classes.filter((c) => c.id !== id);
      setClasses(updated);
      Storage.setClasses(updated);
    }
  };

  // Teachers handlers
  const handleAddTeacher = (newTchData: Omit<Teacher, 'id'>) => {
    const newTch: Teacher = {
      ...newTchData,
      id: `t-${Date.now()}`,
    };
    const updated = [...teachers, newTch];
    setTeachers(updated);
    Storage.setTeachers(updated);
  };

  const handleUpdateTeacher = (updatedTch: Teacher) => {
    const updated = teachers.map((t) => (t.id === updatedTch.id ? updatedTch : t));
    setTeachers(updated);
    Storage.setTeachers(updated);
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm(lang === 'ur' ? 'کیا آپ اس استاد کا ریکارڈ حذف کرنا چاہتے ہیں؟' : 'Delete this teacher?')) {
      const updated = teachers.filter((t) => t.id !== id);
      setTeachers(updated);
      Storage.setTeachers(updated);
    }
  };

  // Fees handlers
  const handleRecordPayment = (payment: FeePayment) => {
    const existingIndex = fees.findIndex(
      (f) => f.studentId === payment.studentId && f.month === payment.month
    );
    let updated: FeePayment[];
    if (existingIndex >= 0) {
      updated = [...fees];
      updated[existingIndex] = payment;
    } else {
      updated = [payment, ...fees];
    }
    setFees(updated);
    Storage.setFees(updated);
  };

  // Madrasa settings update
  const handleUpdateMadrasa = (val: MadrasaProfile) => {
    setMadrasa(val);
    Storage.setMadrasa(val);
  };

  const handleResetAll = () => {
    Storage.resetAll();
    setMadrasa(Storage.getMadrasa());
    setTeachers(Storage.getTeachers());
    setClasses(Storage.getClasses());
    setStudents(Storage.getStudents());
    setLessons(Storage.getLessons());
    setAttendance(Storage.getAttendance());
    setFees(Storage.getFees());
    setExams(Storage.getExams());
    setSignoffs(Storage.getSignoffs());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans-modern">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        madrasa={madrasa}
        lang={lang}
        setLang={setLang}
        onOpenNewLesson={() => setActiveTab('lessons')}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            students={students}
            teachers={teachers}
            classes={classes}
            lessons={lessons}
            attendance={attendance}
            fees={fees}
            exams={exams}
            signoffs={signoffs}
            madrasa={madrasa}
            lang={lang}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectStudent={(s) => {
              setSelectedStudentForDrawer(s);
              setActiveTab('students');
            }}
            onOpenNewLesson={() => setActiveTab('lessons')}
            onSignAllAttendanceToday={handleSignAllAttendanceToday}
            onSignAllLessonsToday={handleSignAllLessonsToday}
          />
        )}

        {activeTab === 'lessons' && (
          <DailyLessonsView
            students={students}
            teachers={teachers}
            classes={classes}
            lessons={lessons}
            madrasa={madrasa}
            lang={lang}
            onAddLesson={handleAddLesson}
            onUpdateLesson={handleUpdateLesson}
            onDeleteLesson={handleDeleteLesson}
            onSelectStudent={(s) => {
              setSelectedStudentForDrawer(s);
              setActiveTab('students');
            }}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            students={students}
            teachers={teachers}
            classes={classes}
            attendance={attendance}
            signoffs={signoffs}
            madrasa={madrasa}
            lang={lang}
            onUpdateAttendance={handleUpdateAttendance}
            onUpdateSignoffs={handleUpdateSignoffs}
            onSelectStudent={(s) => {
              setSelectedStudentForDrawer(s);
              setActiveTab('students');
            }}
          />
        )}

        {activeTab === 'exams' && (
          <ExamsView
            students={students}
            teachers={teachers}
            classes={classes}
            exams={exams}
            madrasa={madrasa}
            lang={lang}
            onAddExam={handleAddExam}
            onUpdateExam={handleUpdateExam}
            onDeleteExam={handleDeleteExam}
            onSelectStudent={(s) => {
              setSelectedStudentForDrawer(s);
              setActiveTab('students');
            }}
          />
        )}

        {activeTab === 'students' && (
          <StudentsView
            students={students}
            teachers={teachers}
            classes={classes}
            lessons={lessons}
            attendance={attendance}
            fees={fees}
            madrasa={madrasa}
            lang={lang}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            selectedStudent={selectedStudentForDrawer}
            onSelectStudent={setSelectedStudentForDrawer}
            onOpenReportCard={(s) => setReportCardStudent(s)}
            onOpenWhatsAppModal={(s) => setWhatsAppStudent(s)}
          />
        )}

        {activeTab === 'classes' && (
          <ClassesView
            classes={classes}
            teachers={teachers}
            students={students}
            lang={lang}
            onAddClass={handleAddClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {activeTab === 'fees' && (
          <FeesView
            students={students}
            classes={classes}
            fees={fees}
            madrasa={madrasa}
            lang={lang}
            onRecordPayment={handleRecordPayment}
            onSelectStudent={(s) => {
              setSelectedStudentForDrawer(s);
              setActiveTab('students');
            }}
          />
        )}
      </main>

      {/* Official Madrasa Report Card & Examination Sanad Modal */}
      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          madrasa={madrasa}
          teachers={teachers}
          classes={classes}
          lessons={lessons}
          attendance={attendance}
          fees={fees}
          exams={exams}
          lang={lang}
          onClose={() => setReportCardStudent(null)}
        />
      )}

      {/* WhatsApp Message Composer & Dispatcher */}
      {whatsAppStudent && (
        <WhatsAppModal
          student={whatsAppStudent}
          madrasa={madrasa}
          teachers={teachers}
          classes={classes}
          lessons={lessons}
          attendance={attendance}
          fees={fees}
          lang={lang}
          onClose={() => setWhatsAppStudent(null)}
        />
      )}

      {/* Seminary Settings & Backup Modal */}
      {isSettingsModalOpen && (
        <MadrasaSettingsModal
          madrasa={madrasa}
          lang={lang}
          onUpdateMadrasa={handleUpdateMadrasa}
          onResetAll={handleResetAll}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {/* Share Application Portal Link Modal */}
      {isShareModalOpen && (
        <ShareAppModal
          madrasa={madrasa}
          lang={lang}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-nastaliq text-emerald-950 font-bold text-sm">
              مدرسہ تعلیم القرآن سورگ
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 font-sans font-medium text-[11px]">
              Madrasah Taleem-ul-Quran Surag
            </span>
          </div>
          <div className="text-[11px] text-slate-600 flex items-center gap-2">
            <span>نظام: <strong className="text-emerald-900 font-sans">Al-Miqra Digital (المقرا ڈیجیٹل)</strong></span>
            <span className="text-slate-400">|</span>
            <span className="font-nastaliq">نگرانِ اعلیٰ شعبہ حفظ: <strong className="text-emerald-900">{madrasa.supervisorNameUrdu}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
