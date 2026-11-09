import React, { useState, useMemo, useRef } from 'react';
import {
  Student,
  Teacher,
  ClassRoom,
  DailyLessonLog,
  AttendanceRecord,
  FeePayment,
  MadrasaProfile,
  AppLanguage,
} from '../../types';
import { QURAN_JUZ } from '../../utils/quranData';
import { TRANSLATIONS } from '../../utils/translations';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Calendar,
  Award,
  BookOpen,
  DollarSign,
  Edit2,
  Trash2,
  Share2,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  lessons: DailyLessonLog[];
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
  onOpenReportCard: (student: Student) => void;
  onOpenWhatsAppModal: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  teachers,
  classes,
  lessons,
  attendance,
  fees,
  madrasa,
  lang,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  selectedStudent,
  onSelectStudent,
  onOpenReportCard,
  onOpenWhatsAppModal,
}) => {
  const isUrdu = lang === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedFeeCategory, setSelectedFeeCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State for Add / Edit
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherNameUrdu, setFatherNameUrdu] = useState('');
  const [dob, setDob] = useState('2014-01-01');
  const [enrollmentDate, setEnrollmentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [guardianPhone, setGuardianPhone] = useState('+92 300 ');
  const [guardianRelation, setGuardianRelation] = useState('والد محترم');
  const [address, setAddress] = useState('کراچی');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [currentPara, setCurrentPara] = useState<number>(1);
  const [completedParasInput, setCompletedParasInput] = useState<string>('1, 2, 3');
  const [monthlyFee, setMonthlyFee] = useState<number>(2000);
  const [feeCategory, setFeeCategory] = useState<Student['feeCategory']>('regular');
  const [status, setStatus] = useState<Student['status']>('active');
  const [notes, setNotes] = useState('');

  // Handle Photo selection & conversion to Base64
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isUrdu ? 'براہ کرم 2 ایم بی سے کم سائز کی تصویر منتخب کریں۔' : 'Please select an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedClassId !== 'all' && s.classId !== selectedClassId) return false;
      if (selectedFeeCategory !== 'all' && s.feeCategory !== selectedFeeCategory)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          s.name.toLowerCase().includes(q) ||
          s.nameUrdu.includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.fatherName.toLowerCase().includes(q) ||
          s.fatherNameUrdu.includes(q) ||
          s.guardianPhone.includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [students, selectedClassId, selectedFeeCategory, searchQuery]);

  // Open modal in edit mode
  const handleOpenEdit = (stud: Student) => {
    setEditingStudent(stud);
    setPhotoUrl(stud.photoUrl || '');
    setAdmissionNo(stud.admissionNo);
    setName(stud.name);
    setNameUrdu(stud.nameUrdu);
    setFatherName(stud.fatherName);
    setFatherNameUrdu(stud.fatherNameUrdu);
    setDob(stud.dob);
    setEnrollmentDate(stud.enrollmentDate);
    setGuardianPhone(stud.guardianPhone);
    setGuardianRelation(stud.guardianRelation);
    setAddress(stud.address);
    setClassId(stud.classId);
    setTeacherId(stud.teacherId);
    setCurrentPara(stud.currentPara || 1);
    setCompletedParasInput(stud.completedParas ? stud.completedParas.join(', ') : '');
    setMonthlyFee(stud.monthlyFee);
    setFeeCategory(stud.feeCategory);
    setStatus(stud.status);
    setNotes(stud.notes || '');
    setIsAddModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setPhotoUrl('');
    const nextNum = students.length + 1;
    setAdmissionNo(`DQ-2024-${String(nextNum).padStart(3, '0')}`);
    setName('');
    setNameUrdu('');
    setFatherName('');
    setFatherNameUrdu('');
    setDob('2014-01-01');
    setEnrollmentDate(new Date().toISOString().slice(0, 10));
    setGuardianPhone('+92 300 ');
    setGuardianRelation('والد محترم');
    setAddress('کراچی');
    setClassId(classes[0]?.id || '');
    setTeacherId(teachers[0]?.id || '');
    setCurrentPara(1);
    setCompletedParasInput('');
    setMonthlyFee(2000);
    setFeeCategory('regular');
    setStatus('active');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse completed paras: "1, 2, 3, 4" -> [1, 2, 3, 4]
    const parsedCompleted = completedParasInput
      .split(',')
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p) && p >= 1 && p <= 30);

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        photoUrl: photoUrl || undefined,
        admissionNo,
        name: name || nameUrdu,
        nameUrdu: nameUrdu || name,
        fatherName: fatherName || fatherNameUrdu,
        fatherNameUrdu: fatherNameUrdu || fatherName,
        dob,
        enrollmentDate,
        guardianPhone,
        guardianRelation,
        address,
        classId,
        teacherId,
        currentPara,
        completedParas: parsedCompleted,
        monthlyFee: Number(monthlyFee),
        feeCategory,
        status,
        notes,
      });
    } else {
      onAddStudent({
        photoUrl: photoUrl || undefined,
        admissionNo,
        name: name || nameUrdu,
        nameUrdu: nameUrdu || name,
        fatherName: fatherName || fatherNameUrdu,
        fatherNameUrdu: fatherNameUrdu || fatherName,
        dob,
        enrollmentDate,
        guardianPhone,
        guardianRelation,
        address,
        classId,
        teacherId,
        currentPara,
        completedParas: parsedCompleted,
        monthlyFee: Number(monthlyFee),
        feeCategory,
        status,
        notes,
      });
    }

    setIsAddModalOpen(false);
  };

  // Toggle single juz completion in student profile
  const handleToggleJuzCompletion = (stud: Student, juzNumber: number) => {
    const currentCompleted = stud.completedParas || [];
    let updated: number[];
    if (currentCompleted.includes(juzNumber)) {
      updated = currentCompleted.filter((j) => j !== juzNumber);
    } else {
      updated = [...currentCompleted, juzNumber].sort((a, b) => a - b);
    }
    onUpdateStudent({
      ...stud,
      completedParas: updated,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
            {isUrdu ? 'طلباء ریکارڈ و کوائف (طالب علم ڈائریکٹری)' : 'Student Records & Directory'}
          </h1>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'مکمل ذاتی کوائف، داخلہ نمبر، 30 پاروں کی حفظ پیش رفت اور فیس ریکارڈ'
              : 'Complete admissions, 30-Juz memorization status, and fee profiles'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isUrdu ? 'نیا طالب علم داخل کریں' : 'New Admission'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          >
            <option value="all">{isUrdu ? 'تمام کلاسز و درجات' : 'All Classes'}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {isUrdu ? c.nameUrdu : c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedFeeCategory}
            onChange={(e) => setSelectedFeeCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          >
            <option value="all">{isUrdu ? 'تمام فیس کیٹیگریز' : 'All Fee Types'}</option>
            <option value="regular">{isUrdu ? 'مکمل فیس (باقاعدہ)' : 'Regular'}</option>
            <option value="concession">{isUrdu ? 'رعایتی فیس (نصف)' : 'Concession'}</option>
            <option value="exempt">{isUrdu ? 'مستحقِ زکوٰۃ / معاف' : 'Exempt / Zakat'}</option>
          </select>
        </div>

        <div className="sm:col-span-1 lg:col-span-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={
              isUrdu
                ? 'نام، ولدیت، داخلہ نمبر یا فون تلاش کریں...'
                : 'Search by student, father, roll #, phone...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Main Grid: Student Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            {isUrdu ? 'کوئی طالب علم موجود نہیں ہے۔' : 'No students matching filter.'}
          </div>
        ) : (
          filteredStudents.map((s) => {
            const cls = classes.find((c) => c.id === s.classId);
            const teacher = teachers.find((t) => t.id === s.teacherId);
            const completedCount = s.completedParas?.length || 0;
            const hifzPercent = Math.round((completedCount / 30) * 100);

            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {s.photoUrl ? (
                        <img
                          src={s.photoUrl}
                          alt={s.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-nastaliq text-lg font-bold shrink-0 shadow-xs">
                          {s.nameUrdu.slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <h2 className="text-base font-bold text-slate-900 font-nastaliq leading-tight">
                          {isUrdu ? s.nameUrdu : s.name}
                        </h2>
                        <div className="text-xs text-slate-500 font-medium">
                          ولد {isUrdu ? s.fatherNameUrdu : s.fatherName}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                      {s.admissionNo}
                    </span>
                  </div>

                  {/* Class and Teacher */}
                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isUrdu ? 'درجہ / کلاس:' : 'Class:'}</span>
                      <span className="font-semibold text-emerald-800">
                        {isUrdu ? cls?.nameUrdu : cls?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isUrdu ? 'استاد محترم:' : 'Teacher:'}</span>
                      <span className="font-medium text-slate-700">
                        {isUrdu ? teacher?.nameUrdu : teacher?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isUrdu ? 'سرپرست رابطہ:' : 'Phone:'}</span>
                      <span className="font-mono text-slate-700">{s.guardianPhone}</span>
                    </div>
                  </div>

                  {/* 30-Juz Progress Bar */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        {isUrdu ? 'حفظ شدہ پارے:' : 'Hifz Completed:'}
                      </span>
                      <span className="font-mono font-bold text-emerald-800">
                        {completedCount} / 30 ({hifzPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${hifzPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{isUrdu ? `جاری پارہ: ${s.currentPara || 1}` : `Current Juz: ${s.currentPara || 1}`}</span>
                      <span>
                        {completedCount >= 28 ? (
                          <span className="text-amber-700 font-bold flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            {isUrdu ? 'قریب الختم' : 'Near Khatm'}
                          </span>
                        ) : (
                          <span>Rs. {s.monthlyFee} / ماہ</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Button Strip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                  <button
                    onClick={() => onSelectStudent(s)}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-center transition-colors text-[11px]"
                  >
                    {isUrdu ? 'مکمل ریکارڈ' : 'Profile & 30 Juz'}
                  </button>

                  <button
                    onClick={() => onOpenReportCard(s)}
                    className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title={isUrdu ? 'کارکردگی سرٹیفکیٹ پرنٹ کریں' : 'Print Report Card'}
                  >
                    <Award className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenWhatsAppModal(s)}
                    className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="ترمیم کریں"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteStudent(s.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="حذف کریں"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Individual Student 30-Juz Progress Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {selectedStudent.photoUrl ? (
                  <img
                    src={selectedStudent.photoUrl}
                    alt={selectedStudent.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-nastaliq text-2xl font-bold shadow-md shrink-0">
                    {selectedStudent.nameUrdu.slice(0, 1)}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold font-nastaliq text-slate-900">
                    {isUrdu ? selectedStudent.nameUrdu : selectedStudent.name}
                  </h2>
                  <div className="text-xs text-slate-500 font-mono">
                    {selectedStudent.admissionNo} · ولد {isUrdu ? selectedStudent.fatherNameUrdu : selectedStudent.fatherName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-6">
              {/* Top Quick Actions */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => onOpenReportCard(selectedStudent)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  <span>{isUrdu ? 'کارکردگی سرٹیفکیٹ / رزلٹ کارڈ' : 'View Report Card'}</span>
                </button>

                <button
                  onClick={() => onOpenWhatsAppModal(selectedStudent)}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg border border-emerald-200 flex items-center gap-1.5 shadow-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isUrdu ? 'والد کو واٹس ایپ پیغام بھیجیں' : 'Send WhatsApp to Guardian'}</span>
                </button>
              </div>

              {/* 30-Juz Interactive Visual Map */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-nastaliq">
                      {isUrdu ? 'قرآنِ کریم 30 پارے حفظ کا نقشہ' : '30-Juz Memorization Map'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isUrdu
                        ? 'سبز رنگ مکمل پختہ حفظ، نیلا جاری سبق، سرمئی باقی پاروں کو ظاہر کرتا ہے۔ کلک کر کے اسٹیٹس بدلیں۔'
                        : 'Click any Juz to toggle completed status.'}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {selectedStudent.completedParas?.length || 0} / 30 {isUrdu ? 'پارے مکمل' : 'Juz Done'}
                  </span>
                </div>

                {/* 30 Juz Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
                  {QURAN_JUZ.map((juz) => {
                    const isCompleted = selectedStudent.completedParas?.includes(juz.number);
                    const isCurrent = selectedStudent.currentPara === juz.number;

                    return (
                      <button
                        key={juz.number}
                        onClick={() => handleToggleJuzCompletion(selectedStudent, juz.number)}
                        className={`p-2 rounded-xl text-center transition-all border ${
                          isCompleted
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs hover:bg-emerald-700'
                            : isCurrent
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold hover:bg-amber-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                        title={`${juz.number}. ${juz.nameUrdu}`}
                      >
                        <div className="text-[10px] font-mono opacity-80">{juz.number}</div>
                        <div className="font-quran text-xs font-bold truncate">
                          {juz.nameUrdu}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">{isUrdu ? 'تاریخ داخلہ:' : 'Enrollment Date:'}</span>
                  <span className="font-mono font-medium text-slate-800">
                    {selectedStudent.enrollmentDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isUrdu ? 'تاریخ پیدائش:' : 'DOB:'}</span>
                  <span className="font-mono font-medium text-slate-800">
                    {selectedStudent.dob}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isUrdu ? 'سرپرست رابطہ:' : 'Guardian Phone:'}</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedStudent.guardianPhone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isUrdu ? 'ماہانہ فیس:' : 'Monthly Fee:'}</span>
                  <span className="font-mono font-bold text-emerald-800">
                    Rs. {selectedStudent.monthlyFee} ({selectedStudent.feeCategory})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isUrdu ? 'شعبہ / کلاس:' : 'Class:'}</span>
                  <span className="font-medium text-slate-800">
                    {classes.find((c) => c.id === selectedStudent.classId)?.nameUrdu || 'تعین نہیں'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isUrdu ? 'استاد محترم:' : 'Teacher:'}</span>
                  <span className="font-medium text-slate-800">
                    {teachers.find((t) => t.id === selectedStudent.teacherId)?.nameUrdu || 'تعین نہیں'}
                  </span>
                </div>
              </div>

              {/* Recent Sabaq History */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 font-nastaliq">
                  {isUrdu ? 'حالیہ اسباق کی تاریخچہ' : 'Recent Lesson History'}
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="py-2 px-3">{isUrdu ? 'تاریخ' : 'Date'}</th>
                        <th className="py-2 px-3">{isUrdu ? 'سبق' : 'Sabaq'}</th>
                        <th className="py-2 px-3">{isUrdu ? 'سبقی' : 'Sabqi'}</th>
                        <th className="py-2 px-3">{isUrdu ? 'منزل' : 'Manzil'}</th>
                        <th className="py-2 px-3">{isUrdu ? 'گریڈ' : 'Grade'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lessons
                        .filter((l) => l.studentId === selectedStudent.id)
                        .slice(0, 5)
                        .map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-slate-500">{l.date}</td>
                            <td className="py-2 px-3 font-medium text-emerald-800">
                              پارہ {l.sabaqPara} ({l.sabaqSurah})
                            </td>
                            <td className="py-2 px-3 text-slate-600">پارہ {l.sabqiPara}</td>
                            <td className="py-2 px-3 text-slate-600">پارہ {l.manzilPara}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                                {l.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onSelectStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold font-nastaliq text-emerald-900">
                {editingStudent
                  ? isUrdu
                    ? 'طالب علم کے کوائف میں ترمیم'
                    : 'Edit Student Details'
                  : isUrdu
                  ? 'نیا طالب علم داخل کریں (داخلہ فارم)'
                  : 'New Student Admission'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 mt-4 text-xs">
              {/* Photo Upload & Preview Section */}
              <div className="flex items-center gap-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="relative shrink-0">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Student Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                      <Camera className="w-6 h-6 text-slate-400" />
                      <span className="text-[9px] mt-0.5">تصویر</span>
                    </div>
                  )}
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-xs"
                      title={isUrdu ? 'تصویر ہٹائیں' : 'Remove Photo'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800">
                    {isUrdu ? 'طالب علم کی تصویر (پروفائل فوٹو)' : 'Student Profile Photo'}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    {isUrdu
                      ? 'تصویر اپلوڈ کریں (JPG, PNG یا WebP - زیادہ سے زیادہ 2 ایم بی)'
                      : 'Upload photo (JPG, PNG, WebP up to 2MB)'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{photoUrl ? (isUrdu ? 'تصویر تبدیل کریں' : 'Change Photo') : (isUrdu ? 'تصویر اپلوڈ کریں' : 'Upload Photo')}</span>
                    </button>
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-lg transition-colors"
                      >
                        {isUrdu ? 'تصویر ختم کریں' : 'Remove'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 1: Admission No & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'داخلہ نمبر *' : 'Admission / Roll # *'}
                  </label>
                  <input
                    required
                    type="text"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'نام طالب علم (اردو) *' : 'Student Name (Urdu) *'}
                  </label>
                  <input
                    required
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    placeholder="مثلاً: محمد حمزہ احمد"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'نام طالب علم (انگریزی)' : 'Student Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Hamza"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Row 2: Father Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'ولدیت (والد کا نام اردو) *' : "Father's Name (Urdu) *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={fatherNameUrdu}
                    onChange={(e) => setFatherNameUrdu(e.target.value)}
                    placeholder="مثلاً: احمد بلال"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'ولدیت (انگریزی)' : "Father's Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Ahmad Bilal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Row 3: Class & Teacher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'کلاس / درجہ *' : 'Class *'}
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isUrdu ? c.nameUrdu : c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'استاد محترم / قاری صاحب *' : 'Assigned Teacher *'}
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

              {/* Row 4: Guardian Phone & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'سرپرست کا فون (واٹس ایپ) *' : 'Guardian WhatsApp Phone *'}
                  </label>
                  <input
                    required
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'تاریخ داخلہ' : 'Enrollment Date'}
                  </label>
                  <input
                    type="date"
                    value={enrollmentDate}
                    onChange={(e) => setEnrollmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'تاریخ پیدائش' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Hifz Progress & Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'موجودہ پارہ (1 تا 30)' : 'Current Juz (1-30)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={currentPara}
                    onChange={(e) => setCurrentPara(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'ماہانہ فیس (روپے)' : 'Monthly Fee (PKR)'}
                  </label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'فیس کیٹیگری' : 'Fee Category'}
                  </label>
                  <select
                    value={feeCategory}
                    onChange={(e) => setFeeCategory(e.target.value as Student['feeCategory'])}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                  >
                    <option value="regular">{isUrdu ? 'باقاعدہ (پوری فیس)' : 'Regular'}</option>
                    <option value="concession">{isUrdu ? 'رعایتی (نصف فیس)' : 'Concession'}</option>
                    <option value="exempt">{isUrdu ? 'مستحقِ زکوٰۃ / معاف' : 'Exempt / Zakat'}</option>
                  </select>
                </div>
              </div>

              {/* Completed Paras String input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'مکمل شدہ پارے (کوما سے الگ کریں)' : 'Completed Juz (comma-separated, e.g. 1, 2, 3)'}
                </label>
                <input
                  type="text"
                  value={completedParasInput}
                  onChange={(e) => setCompletedParasInput(e.target.value)}
                  placeholder="مثلاً: 1, 2, 3, 4, 5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  {editingStudent
                    ? isUrdu
                      ? 'تبدیلیاں محفوظ کریں'
                      : 'Update Record'
                    : isUrdu
                    ? 'طالب علم داخل کریں'
                    : 'Confirm Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
