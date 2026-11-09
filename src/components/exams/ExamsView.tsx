import React, { useState, useMemo } from 'react';
import {
  Student,
  Teacher,
  ClassRoom,
  ExamRecord,
  ExamType,
  MadrasaProfile,
  GradeType,
  AppLanguage,
} from '../../types';
import { GRADE_DETAILS, QURAN_JUZ } from '../../utils/quranData';
import { openWhatsApp } from '../../utils/whatsapp';
import {
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  PenTool,
  Printer,
  Share2,
  Sparkles,
  ShieldCheck,
  Trash2,
  Edit2,
} from 'lucide-react';

interface ExamsViewProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  exams: ExamRecord[];
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onAddExam: (exam: Omit<ExamRecord, 'id'>) => void;
  onUpdateExam: (exam: ExamRecord) => void;
  onDeleteExam: (id: string) => void;
  onSelectStudent: (student: Student) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  students,
  teachers,
  classes,
  exams,
  madrasa,
  lang,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  onSelectStudent,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';

  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExam, setEditingExam] = useState<ExamRecord | null>(null);

  // Printable Exam Sanad State
  const [printExam, setPrintExam] = useState<ExamRecord | null>(null);

  // Form State
  const [studentId, setStudentId] = useState<string>('');
  const [examType, setExamType] = useState<ExamType>('semi_annual');
  const [examYear, setExamYear] = useState<string>('1447ھ - 2026ء');
  const [examDate, setExamDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [testedParas, setTestedParas] = useState<string>('پارہ 1 تا 10 (کل 10 پارے)');
  const [marksHifz, setMarksHifz] = useState<number>(45);
  const [marksTajweed, setMarksTajweed] = useState<number>(27);
  const [marksTartil, setMarksTartil] = useState<number>(18);
  const [examinerName, setExaminerName] = useState<string>(
    'مولانا قاری عبد الباسط قاسمی (جامعہ العلوم الاسلامیہ)'
  );
  const [examinerRemarks, setExaminerRemarks] = useState<string>(
    'ماشاء اللہ پختہ حفظ و ترتیل، تمام سوالات کے عمدہ جوابات دیے۔'
  );
  const [examinerSigned, setExaminerSigned] = useState<boolean>(true);
  const [supervisorSigned, setSupervisorSigned] = useState<boolean>(true);
  const [supervisorRemarks, setSupervisorRemarks] = useState<string>(
    'شاندار کارکردگی، اگلے درجہ کی منظوری دی جاتی ہے۔ (قاری حامد نواز)'
  );

  // Auto calculate total, percent and grade
  const currentObtained = marksHifz + marksTajweed + marksTartil;
  const currentPercent = Math.min(100, Math.round((currentObtained / 100) * 100));

  const calculateGrade = (pct: number): GradeType => {
    if (pct >= 90) return 'mumtaz';
    if (pct >= 80) return 'jayyid_jiddan';
    if (pct >= 70) return 'jayyid';
    if (pct >= 60) return 'maqbool';
    return 'weak';
  };

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      if (selectedExamType !== 'all' && e.examType !== selectedExamType) return false;
      const student = students.find((s) => s.id === e.studentId);
      if (!student) return false;
      if (selectedClassId !== 'all' && student.classId !== selectedClassId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          student.name.toLowerCase().includes(q) ||
          student.nameUrdu.includes(q) ||
          student.admissionNo.toLowerCase().includes(q) ||
          e.examinerName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [exams, selectedExamType, selectedClassId, searchQuery, students]);

  // Open modal for new exam
  const handleOpenNew = () => {
    setEditingExam(null);
    setStudentId(students[0]?.id || '');
    setExamType('semi_annual');
    setExamYear('1447ھ - 2026ء');
    setExamDate(new Date().toISOString().slice(0, 10));
    setTestedParas('پارہ 1 تا 10');
    setMarksHifz(45);
    setMarksTajweed(27);
    setMarksTartil(18);
    setExaminerName('مولانا قاری عبد الباسط قاسمی');
    setExaminerRemarks('ماشاء اللہ پختہ حفظ و ترتیل، تمام سوالات کے عمدہ جوابات دیے۔');
    setExaminerSigned(true);
    setSupervisorSigned(true);
    setSupervisorRemarks('شاندار کارکردگی، اگلے درجہ کی منظوری دی جاتی ہے۔ (قاری حامد نواز)');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (exam: ExamRecord) => {
    setEditingExam(exam);
    setStudentId(exam.studentId);
    setExamType(exam.examType);
    setExamYear(exam.examYear);
    setExamDate(exam.examDate);
    setTestedParas(exam.testedParas);
    setMarksHifz(exam.marksHifz);
    setMarksTajweed(exam.marksTajweed);
    setMarksTartil(exam.marksTartil);
    setExaminerName(exam.examinerName);
    setExaminerRemarks(exam.examinerRemarks);
    setExaminerSigned(exam.examinerSigned);
    setSupervisorSigned(exam.supervisorSigned);
    setSupervisorRemarks(exam.supervisorRemarks || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    const total = marksHifz + marksTajweed + marksTartil;
    const pct = Math.min(100, Math.round((total / 100) * 100));
    const finalGrade = calculateGrade(pct);

    if (editingExam) {
      onUpdateExam({
        ...editingExam,
        studentId,
        examType,
        examYear,
        examDate,
        testedParas,
        marksHifz: Number(marksHifz),
        marksTajweed: Number(marksTajweed),
        marksTartil: Number(marksTartil),
        totalMarks: 100,
        obtainedMarks: total,
        percentage: pct,
        grade: finalGrade,
        examinerName,
        examinerRemarks,
        examinerSigned,
        examinerSignedAt: examinerSigned ? examDate : undefined,
        supervisorSigned,
        supervisorSignedAt: supervisorSigned ? examDate : undefined,
        supervisorRemarks,
      });
    } else {
      onAddExam({
        studentId,
        examType,
        examYear,
        examDate,
        testedParas,
        marksHifz: Number(marksHifz),
        marksTajweed: Number(marksTajweed),
        marksTartil: Number(marksTartil),
        totalMarks: 100,
        obtainedMarks: total,
        percentage: pct,
        grade: finalGrade,
        examinerName,
        examinerRemarks,
        examinerSigned,
        examinerSignedAt: examinerSigned ? examDate : undefined,
        supervisorSigned,
        supervisorSignedAt: supervisorSigned ? examDate : undefined,
        supervisorRemarks,
      });
    }

    setIsModalOpen(false);
  };

  // Toggle supervisor signature directly from list
  const handleToggleSupervisorSign = (exam: ExamRecord) => {
    onUpdateExam({
      ...exam,
      supervisorSigned: !exam.supervisorSigned,
      supervisorSignedAt: !exam.supervisorSigned ? new Date().toISOString().slice(0, 10) : undefined,
      supervisorRemarks: !exam.supervisorSigned && !exam.supervisorRemarks
        ? 'بمعائنہ و توثیق از قاری حامد نواز صاحب (نگرانِ شعبہ حفظ)'
        : exam.supervisorRemarks,
    });
  };

  // Send WhatsApp Exam Result to Parent
  const handleSendExamWhatsApp = (exam: ExamRecord) => {
    const student = students.find((s) => s.id === exam.studentId);
    if (!student) return;

    const examTitle = exam.examType === 'semi_annual' ? 'ششماہی امتحان' : 'سالانہ امتحان';
    const gradeObj = GRADE_DETAILS[exam.grade];

    let msg = `*السلام علیکم ورحمۃ اللہ وبرکاتہ*\n`;
    msg += `محترم جناب *${student.fatherNameUrdu || student.fatherName}* صاحب!\n`;
    msg += `*${madrasa.nameUrdu}* کی جانب سے آپ کے فرزند *${student.nameUrdu || student.name}* (داخلہ نمبر: ${student.admissionNo}) کے *${examTitle}* کا نتیجہ مبارکباد کے ساتھ پیش ہے:\n\n`;
    msg += `📖 *امتحان:* ${examTitle} (${exam.examYear})\n`;
    msg += `📍 *امتحانی مقدار:* ${exam.testedParas}\n`;
    msg += `📊 *نمبرات:* ${exam.obtainedMarks} / 100 (${exam.percentage}%)\n`;
    msg += `🔹 حفظ و اتقان: ${exam.marksHifz}/50\n`;
    msg += `🔹 تجوید و مخارج: ${exam.marksTajweed}/30\n`;
    msg += `🔹 حسنِ صوت و ترتیل: ${exam.marksTartil}/20\n`;
    msg += `⭐ *گریڈ / درجہ:* ${gradeObj?.labelUrdu || exam.grade}\n`;
    msg += `✍️ *ریمارکس ممتحن:* ${exam.examinerRemarks}\n`;
    msg += `🛡️ *نگران شعبہ حفظ (${madrasa.supervisorNameUrdu}):* ${exam.supervisorRemarks || 'تصدیق شدہ'}\n\n`;
    msg += `اللہ تبارک و تعالیٰ عزیز کے حفظ میں استحضار اور برکت عطا فرمائے۔\n*${madrasa.nameUrdu}*`;

    openWhatsApp(student.guardianPhone, msg);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {isUrdu ? 'ششماہی و سالانہ امتحانات' : 'Examination Department'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              نگران: {madrasa.supervisorNameUrdu}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq mt-1">
            {isUrdu ? 'شعبہ امتحانات (ششماہی و سالانہ ریکارڈ)' : 'Examinations & Grading'}
          </h1>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'حفظ، تجوید، ترتیل کے نمبرات، باکس برائے ممتحن، اور نگران شعبہ حفظ قاری حامد نواز صاحب کے دستخط'
              : 'Semi-annual and annual exam marks, examiner remarks, and supervisor approval'}
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isUrdu ? 'نیا امتحانی نتیجہ درج کریں' : 'Record Exam Result'}</span>
        </button>
      </div>

      {/* Filter and Switcher Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800"
          >
            <option value="all">{isUrdu ? 'تمام امتحانات (ششماہی و سالانہ)' : 'All Exams'}</option>
            <option value="semi_annual">{isUrdu ? 'ششماہی امتحان (Semi-Annual)' : 'Semi-Annual Exam'}</option>
            <option value="annual">{isUrdu ? 'سالانہ امتحان (Annual Exam)' : 'Annual Exam'}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="all">{isUrdu ? 'تمام کلاسز' : 'All Classes'}</option>
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
                ? 'طالب علم کا نام، داخلہ نمبر یا ممتحن کا نام...'
                : 'Search student, roll #, examiner...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          />
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredExams.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            {isUrdu ? 'کوئی امتحانی ریکارڈ موجود نہیں ہے۔' : 'No examination records found.'}
          </div>
        ) : (
          filteredExams.map((exam) => {
            const student = students.find((s) => s.id === exam.studentId);
            const cls = classes.find((c) => c.id === student?.classId);
            const gradeInfo = GRADE_DETAILS[exam.grade];
            const isSemiAnnual = exam.examType === 'semi_annual';

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500/80 transition-all shadow-xs p-5 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badge: Exam Type & Marks */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isSemiAnnual
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          }`}
                        >
                          {isSemiAnnual
                            ? isUrdu
                              ? 'ششماہی امتحان'
                              : 'Semi-Annual Exam'
                            : isUrdu
                            ? 'سالانہ امتحان'
                            : 'Annual Exam'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {exam.examYear}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold font-nastaliq text-slate-900 mt-1">
                        {isUrdu ? student?.nameUrdu : student?.name}
                      </h2>
                      <div className="text-xs text-slate-500 font-mono">
                        {student?.admissionNo} · ولد {isUrdu ? student?.fatherNameUrdu : student?.fatherName}
                      </div>
                    </div>

                    {/* Total Marks & Grade Stamp */}
                    <div className="text-left shrink-0">
                      <div className="text-2xl font-bold font-mono text-emerald-900 leading-none">
                        {exam.obtainedMarks} <span className="text-xs text-slate-400">/ 100</span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${gradeInfo?.bg} ${gradeInfo?.color} ${gradeInfo?.border}`}
                        >
                          {isUrdu ? gradeInfo?.labelUrdu : gradeInfo?.labelEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tested Paras */}
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 flex items-center justify-between">
                    <span className="text-slate-500">{isUrdu ? 'امتحانی مقدار / پارے:' : 'Tested Paras:'}</span>
                    <span className="font-bold text-emerald-900">{exam.testedParas}</span>
                  </div>

                  {/* Marks Breakdown Box (3 Sub-scores) */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 font-medium block">
                        {isUrdu ? 'حفظ و اتقان' : 'Memorization'}
                      </span>
                      <span className="text-sm font-bold font-mono text-emerald-950">
                        {exam.marksHifz} <span className="text-[10px] text-slate-400">/ 50</span>
                      </span>
                    </div>

                    <div className="bg-teal-50/70 p-2 rounded-xl border border-teal-200">
                      <span className="text-[10px] text-teal-800 font-medium block">
                        {isUrdu ? 'تجوید و مخارج' : 'Tajweed'}
                      </span>
                      <span className="text-sm font-bold font-mono text-teal-950">
                        {exam.marksTajweed} <span className="text-[10px] text-slate-400">/ 30</span>
                      </span>
                    </div>

                    <div className="bg-blue-50/70 p-2 rounded-xl border border-blue-200">
                      <span className="text-[10px] text-blue-800 font-medium block">
                        {isUrdu ? 'حسنِ صوت و ترتیل' : 'Tartil & Voice'}
                      </span>
                      <span className="text-sm font-bold font-mono text-blue-950">
                        {exam.marksTartil} <span className="text-[10px] text-slate-400">/ 20</span>
                      </span>
                    </div>
                  </div>

                  {/* Dual Signature Boxes: Examiner Box & Supervisor Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3 mb-3">
                    {/* Examiner's Box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span>{isUrdu ? 'باکس برائے ممتحن صاحب' : 'Examiner Box'}</span>
                        {exam.examinerSigned ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            {isUrdu ? 'دستخط شدہ' : 'Signed'}
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold">{isUrdu ? 'دستخط درکار' : 'Pending'}</span>
                        )}
                      </div>
                      <div className="font-medium text-slate-800 text-[11px] truncate">
                        {exam.examinerName}
                      </div>
                      <p className="text-[11px] text-slate-600 italic leading-relaxed">
                        "{exam.examinerRemarks}"
                      </p>
                    </div>

                    {/* Supervisor's Box */}
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{isUrdu ? 'نگران شعبہ حفظ' : 'Supervisor Box'}</span>
                        </span>
                        <button
                          onClick={() => handleToggleSupervisorSign(exam)}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                            exam.supervisorSigned
                              ? 'bg-emerald-700 text-white'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                        >
                          {exam.supervisorSigned
                            ? isUrdu
                              ? 'تصدیق شدہ ✔️'
                              : 'Verified'
                            : isUrdu
                            ? 'دستخط کریں'
                            : 'Sign now'}
                        </button>
                      </div>
                      <div className="font-bold text-slate-900 font-nastaliq text-[11px]">
                        {madrasa.supervisorNameUrdu}
                      </div>
                      <p className="text-[11px] text-emerald-950 font-nastaliq leading-relaxed">
                        {exam.supervisorRemarks || (isUrdu ? 'بمعائنہ و منظوری از نگران شعبہ حفظ' : 'Verified by supervisor')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Strip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPrintExam(exam)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'امتحانی سند / رزلٹ کارڈ' : 'Print Certificate'}</span>
                    </button>

                    <button
                      onClick={() => handleSendExamWhatsApp(exam)}
                      className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                      title={isUrdu ? 'والد کو رزلٹ واٹس ایپ کریں' : 'Send WhatsApp'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(exam)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="ترمیم کریں"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteExam(exam.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف کریں"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold font-nastaliq text-emerald-950">
                  {editingExam
                    ? isUrdu
                      ? 'امتحانی نتیجہ میں ترمیم'
                      : 'Edit Exam Result'
                    : isUrdu
                    ? 'نیا امتحانی نتیجہ درج کریں (ششماہی / سالانہ)'
                    : 'Record Exam Result'}
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                  نگران شعبہ حفظ: {madrasa.supervisorNameUrdu}
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              {/* Student & Exam Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'طالب علم منتخب کریں *' : 'Student *'}
                  </label>
                  <select
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq"
                  >
                    <option value="">{isUrdu ? '-- طالب علم کا انتخاب کریں --' : '-- Select student --'}</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isUrdu ? s.nameUrdu : s.name} ({s.admissionNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'امتحان کی قسم *' : 'Exam Type *'}
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as ExamType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-emerald-900"
                  >
                    <option value="semi_annual">{isUrdu ? 'ششماہی امتحان (Semi-Annual)' : 'Semi-Annual Exam'}</option>
                    <option value="annual">{isUrdu ? 'سالانہ امتحان (Annual Exam)' : 'Annual Exam'}</option>
                  </select>
                </div>
              </div>

              {/* Tested Paras & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'امتحانی مقدار / پارے *' : 'Tested Paras *'}
                  </label>
                  <input
                    required
                    type="text"
                    value={testedParas}
                    onChange={(e) => setTestedParas(e.target.value)}
                    placeholder="مثلاً: پارہ 1 تا 10 (کل 10 پارے)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'امتحان کی تاریخ' : 'Exam Date'}
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              {/* 3 Marks Fields (Total 100) */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-950 text-xs flex items-center justify-between">
                  <span>{isUrdu ? 'نمبرات کی تفصیل (کل 100 نمبر):' : 'Marks Breakdown (Total: 100):'}</span>
                  <span className="font-mono text-sm text-emerald-900">
                    حاصل کردہ: {currentObtained} / 100 ({currentPercent}%)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      {isUrdu ? '1. حفظ و اتقان (50)' : 'Hifz (50)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={marksHifz}
                      onChange={(e) => setMarksHifz(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      {isUrdu ? '2. تجوید و مخارج (30)' : 'Tajweed (30)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={marksTajweed}
                      onChange={(e) => setMarksTajweed(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      {isUrdu ? '3. صوت و ترتیل (20)' : 'Voice (20)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={marksTartil}
                      onChange={(e) => setMarksTartil(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Examiner's Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-xs">
                  {isUrdu ? 'باکس برائے ممتحن صاحب (Examiner Details & Remarks):' : 'Examiner Box:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">{isUrdu ? 'نام ممتحن صاحب:' : 'Examiner Name:'}</label>
                    <input
                      type="text"
                      value={examinerName}
                      onChange={(e) => setExaminerName(e.target.value)}
                      placeholder="قاری عبد الباسط قاسمی"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={examinerSigned}
                        onChange={(e) => setExaminerSigned(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>{isUrdu ? 'دستخط ممتحن موجود ہیں' : 'Examiner Signed'}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">{isUrdu ? 'ریمارکس ممتحن:' : 'Examiner Remarks:'}</label>
                  <input
                    type="text"
                    value={examinerRemarks}
                    onChange={(e) => setExaminerRemarks(e.target.value)}
                    placeholder="ماشاء اللہ نہایت عمدہ حفظ سنایا۔"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1"
                  />
                </div>
              </div>

              {/* Supervisor's Box */}
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-950 text-xs flex items-center justify-between">
                  <span>{isUrdu ? `باکس برائے نگران شعبہ حفظ (${madrasa.supervisorNameUrdu}):` : 'Supervisor Box:'}</span>
                  <label className="flex items-center gap-1.5 text-[11px] text-emerald-900 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={supervisorSigned}
                      onChange={(e) => setSupervisorSigned(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>{isUrdu ? 'تصدیق و دستخط از نگران' : 'Supervisor Verified'}</span>
                  </label>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">{isUrdu ? 'نگران کے ریمارکس و ہدایات:' : 'Supervisor Remarks:'}</label>
                  <input
                    type="text"
                    value={supervisorRemarks}
                    onChange={(e) => setSupervisorRemarks(e.target.value)}
                    placeholder="شاندار کارکردگی، اگلے درجہ کی منظوری دی جاتی ہے۔ (قاری حامد نواز)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-nastaliq"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg"
                >
                  {isUrdu ? 'منسوخ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  {isUrdu ? 'امتحانی نتیجہ محفوظ کریں' : 'Save Exam Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Exam Sanad / Result Certificate Modal */}
      {printExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-emerald-900 my-8 print-card relative">
            {/* Header */}
            <div className="text-center pb-5 border-b-2 border-emerald-900/80">
              <div className="text-sm font-bold text-emerald-900 tracking-widest font-sans-modern">
                ﷽
              </div>
              <h1 className="text-3xl font-bold font-nastaliq text-emerald-950 mt-1">
                {madrasa.nameUrdu}
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {madrasa.branch} · {madrasa.city} · فون: {madrasa.phone}
              </p>

              <div className="inline-block mt-3 px-6 py-1 bg-emerald-900 text-white rounded-full text-xs font-bold font-nastaliq tracking-wide shadow-xs">
                {printExam.examType === 'semi_annual'
                  ? isUrdu
                    ? 'باضابطہ امتحانی سند و رزلٹ کارڈ (ششماہی امتحان)'
                    : 'OFFICIAL SEMI-ANNUAL EXAMINATION CERTIFICATE'
                  : isUrdu
                  ? 'باضابطہ امتحانی سند و رزلٹ کارڈ (سالانہ امتحان)'
                  : 'OFFICIAL ANNUAL EXAMINATION CERTIFICATE'}
              </div>
            </div>

            {/* Student Bio */}
            {(() => {
              const stud = students.find((s) => s.id === printExam.studentId);
              const gradeObj = GRADE_DETAILS[printExam.grade];

              return (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block">{isUrdu ? 'طالب علم:' : 'Student:'}</span>
                      <span className="font-bold font-nastaliq text-base text-slate-900">{stud?.nameUrdu}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isUrdu ? 'ولدیت:' : "Father's Name:"}</span>
                      <span className="font-medium font-nastaliq text-sm text-slate-800">{stud?.fatherNameUrdu}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isUrdu ? 'داخلہ نمبر:' : 'Roll #:'}</span>
                      <span className="font-mono font-bold text-emerald-900">{stud?.admissionNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isUrdu ? 'تعلیمی سال:' : 'Year:'}</span>
                      <span className="font-semibold text-slate-800">{printExam.examYear}</span>
                    </div>
                  </div>

                  {/* Tested Paras */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{isUrdu ? 'امتحانی مقدار / منتحب شدہ پارے:' : 'Tested Paras:'}</span>
                    <span className="font-bold text-emerald-900 text-sm">{printExam.testedParas}</span>
                  </div>

                  {/* Marks Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-emerald-900 text-white">
                        <tr>
                          <th className="py-2.5 px-4 text-right">{isUrdu ? 'مضمون / شعبہ' : 'Subject'}</th>
                          <th className="py-2.5 px-3 text-center">{isUrdu ? 'کل نمبر' : 'Total'}</th>
                          <th className="py-2.5 px-4 text-center">{isUrdu ? 'حاصل کردہ نمبر' : 'Obtained'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">1. حفظ و اتقان (Memorization Recall)</td>
                          <td className="py-2.5 px-3 text-center font-mono">50</td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-900">{printExam.marksHifz}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">2. تجوید و مخارج (Tajweed & Phonetics)</td>
                          <td className="py-2.5 px-3 text-center font-mono">30</td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-900">{printExam.marksTajweed}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">3. حسنِ صوت و ترتیل (Voice & Cadence)</td>
                          <td className="py-2.5 px-3 text-center font-mono">20</td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-900">{printExam.marksTartil}</td>
                        </tr>
                        <tr className="bg-emerald-50 font-bold">
                          <td className="py-2.5 px-4 text-emerald-950">{isUrdu ? 'مجموعی میزان (Grand Total)' : 'Grand Total'}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-emerald-950">100</td>
                          <td className="py-2.5 px-4 text-center font-mono text-emerald-950 text-base">{printExam.obtainedMarks} ({printExam.percentage}%)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Grade Badge */}
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">{isUrdu ? 'امتحانی گریڈ و کیفیت:' : 'Final Grade:'}</span>
                    <span className={`px-3 py-1 rounded text-xs font-bold border ${gradeObj?.bg} ${gradeObj?.color} ${gradeObj?.border}`}>
                      {isUrdu ? gradeObj?.labelUrdu : gradeObj?.labelEn}
                    </span>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-0.5">{isUrdu ? 'ریمارکس ممتحن صاحب:' : 'Examiner Remarks:'}</span>
                      <p className="text-slate-700 italic font-nastaliq leading-relaxed">{printExam.examinerRemarks}</p>
                    </div>

                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-950 block mb-0.5">
                        {isUrdu ? `ریمارکس نگران شعبہ حفظ (${madrasa.supervisorNameUrdu}):` : 'Supervisor Remarks:'}
                      </span>
                      <p className="text-emerald-950 font-nastaliq leading-relaxed">
                        {printExam.supervisorRemarks || (isUrdu ? 'شاندار کامیابی پر ادارہ کی جانب سے مبارکباد۔' : 'Congratulations.')}
                      </p>
                    </div>
                  </div>

                  {/* Signatures Row: Examiner, Supervisor, and Seminary Seal */}
                  <div className="pt-8 grid grid-cols-3 gap-4 text-xs text-slate-600 text-center">
                    <div>
                      <div className="w-32 mx-auto border-b-2 border-slate-400 mb-1" />
                      <div className="font-bold font-nastaliq text-slate-800">{printExam.examinerName}</div>
                      <div className="text-[11px] text-slate-400">{isUrdu ? 'دستخط ممتحن صاحب' : 'Examiner Signature'}</div>
                    </div>

                    <div>
                      <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-emerald-700 flex items-center justify-center text-[10px] text-emerald-800 font-bold -mt-3">
                        {isUrdu ? 'مہر شعبہ امتحانات' : 'Exam Seal'}
                      </div>
                    </div>

                    <div>
                      <div className="w-32 mx-auto border-b-2 border-slate-400 mb-1" />
                      <div className="font-bold font-nastaliq text-slate-800">{madrasa.supervisorNameUrdu}</div>
                      <div className="text-[11px] text-slate-400">{isUrdu ? 'دستخط نگرانِ شعبہ حفظ' : 'Supervisor Signature'}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Print & Close Buttons (no-print) */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between no-print">
              <button
                onClick={() => setPrintExam(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>{isUrdu ? 'امتحانی سند پرنٹ کریں' : 'Print Certificate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
