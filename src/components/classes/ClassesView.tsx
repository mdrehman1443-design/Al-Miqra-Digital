import React, { useState, useRef } from 'react';
import { ClassRoom, Teacher, Student, AppLanguage } from '../../types';
import {
  School,
  UserCheck,
  Plus,
  Clock,
  Calendar,
  Users,
  Edit2,
  Trash2,
  Phone,
  Award,
  BookOpen,
  Camera,
  Upload,
  X,
} from 'lucide-react';

interface ClassesViewProps {
  classes: ClassRoom[];
  teachers: Teacher[];
  students: Student[];
  lang: AppLanguage;
  onAddClass: (newClass: Omit<ClassRoom, 'id'>) => void;
  onUpdateClass: (cls: ClassRoom) => void;
  onDeleteClass: (id: string) => void;
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  classes,
  teachers,
  students,
  lang,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}) => {
  const isUrdu = lang === 'ur';

  const [activeTab, setActiveTab] = useState<'classes' | 'teachers'>('classes');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Class Form State
  const [classNameUrdu, setClassNameUrdu] = useState('');
  const [classNameEn, setClassNameEn] = useState('');
  const [classLevel, setClassLevel] = useState<ClassRoom['level']>('hifz_pukhta');
  const [classTeacherId, setClassTeacherId] = useState(teachers[0]?.id || '');
  const [timingUrdu, setTimingUrdu] = useState('بعد نماز فجر تا 08:30 صبح');
  const [timingEn, setTimingEn] = useState('06:00 AM - 08:30 AM');
  const [roomNumber, setRoomNumber] = useState('ہال نمبر 1');
  const [capacity, setCapacity] = useState(25);

  // Teacher Form State
  const teacherFileInputRef = useRef<HTMLInputElement | null>(null);
  const [teacherPhotoUrl, setTeacherPhotoUrl] = useState<string>('');
  const [teacherNameUrdu, setTeacherNameUrdu] = useState('');
  const [teacherNameEn, setTeacherNameEn] = useState('');
  const [designation, setDesignation] = useState('استاد شعبہ حفظ');
  const [phone, setPhone] = useState('+92 300 ');
  const [qualification, setQualification] = useState('حفظ القرآن، تجوید و قرات');
  const [experienceYears, setExperienceYears] = useState(5);

  const handleTeacherPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isUrdu ? 'براہ کرم 2 ایم بی سے کم سائز کی تصویر منتخب کریں۔' : 'Please select an image smaller than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeacherPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTeacherPhoto = () => {
    setTeacherPhotoUrl('');
    if (teacherFileInputRef.current) {
      teacherFileInputRef.current.value = '';
    }
  };

  // Handle open Class modal
  const handleOpenClassModal = (cls?: ClassRoom) => {
    if (cls) {
      setEditingClass(cls);
      setClassNameUrdu(cls.nameUrdu);
      setClassNameEn(cls.name);
      setClassLevel(cls.level);
      setClassTeacherId(cls.teacherId);
      setTimingUrdu(cls.timingUrdu);
      setTimingEn(cls.timingEn);
      setRoomNumber(cls.roomNumber);
      setCapacity(cls.capacity);
    } else {
      setEditingClass(null);
      setClassNameUrdu('');
      setClassNameEn('');
      setClassLevel('hifz_pukhta');
      setClassTeacherId(teachers[0]?.id || '');
      setTimingUrdu('بعد نماز فجر تا 08:30 صبح');
      setTimingEn('06:00 AM - 08:30 AM');
      setRoomNumber('ہال نمبر 1');
      setCapacity(25);
    }
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      onUpdateClass({
        ...editingClass,
        name: classNameEn || classNameUrdu,
        nameUrdu: classNameUrdu || classNameEn,
        level: classLevel,
        teacherId: classTeacherId,
        timingUrdu,
        timingEn,
        roomNumber,
        capacity: Number(capacity),
        days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
      });
    } else {
      onAddClass({
        name: classNameEn || classNameUrdu,
        nameUrdu: classNameUrdu || classNameEn,
        level: classLevel,
        teacherId: classTeacherId,
        timingUrdu,
        timingEn,
        roomNumber,
        capacity: Number(capacity),
        days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
      });
    }
    setIsClassModalOpen(false);
  };

  // Handle open Teacher modal
  const handleOpenTeacherModal = (tch?: Teacher) => {
    if (tch) {
      setEditingTeacher(tch);
      setTeacherPhotoUrl(tch.photoUrl || '');
      setTeacherNameUrdu(tch.nameUrdu);
      setTeacherNameEn(tch.name);
      setDesignation(tch.designation);
      setPhone(tch.phone);
      setQualification(tch.qualification);
      setExperienceYears(tch.experienceYears);
    } else {
      setEditingTeacher(null);
      setTeacherPhotoUrl('');
      setTeacherNameUrdu('');
      setTeacherNameEn('');
      setDesignation('استاد شعبہ حفظ');
      setPhone('+92 300 ');
      setQualification('حفظ القرآن، تجوید و قرات');
      setExperienceYears(5);
    }
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      onUpdateTeacher({
        ...editingTeacher,
        photoUrl: teacherPhotoUrl || undefined,
        name: teacherNameEn || teacherNameUrdu,
        nameUrdu: teacherNameUrdu || teacherNameEn,
        designation,
        phone,
        qualification,
        experienceYears: Number(experienceYears),
        assignedClassIds: editingTeacher.assignedClassIds,
      });
    } else {
      onAddTeacher({
        photoUrl: teacherPhotoUrl || undefined,
        name: teacherNameEn || teacherNameUrdu,
        nameUrdu: teacherNameUrdu || teacherNameEn,
        designation,
        phone,
        qualification,
        experienceYears: Number(experienceYears),
        assignedClassIds: [],
      });
    }
    setIsTeacherModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
            {isUrdu ? 'کلاسز، نظام الاوقات اور اساتذہ کا انتظام' : 'Classes & Teachers Management'}
          </h1>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'شعبہ جات (حفظ، ناظرہ، دور)، اوقاتِ تدریس اور قراء کرام کے کوائف'
              : 'Seminary departments, timetables, and teacher assignments'}
          </p>
        </div>

        {/* Tab switch & Add buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                activeTab === 'classes'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isUrdu ? 'کلاسز و نظام الاوقات' : 'Classes & Timetable'}
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
                activeTab === 'teachers'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isUrdu ? 'اساتذہ و قراء کرام' : 'Teachers & Staff'}
            </button>
          </div>

          {activeTab === 'classes' ? (
            <button
              onClick={() => handleOpenClassModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'نئی کلاس بنائیں' : 'Create Class'}</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenTeacherModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'نیا استاد شامل کریں' : 'Add Teacher'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Classes Grid */}
      {activeTab === 'classes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => {
            const assignedTeacher = teachers.find((t) => t.id === cls.teacherId);
            const classStudents = students.filter((s) => s.classId === cls.id);

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                        <School className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 font-nastaliq">
                          {isUrdu ? cls.nameUrdu : cls.name}
                        </h2>
                        <span className="text-xs text-slate-400">
                          {cls.roomNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenClassModal(cls)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="ترمیم کریں"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClass(cls.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Assigned Teacher and Timetable */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5 text-xs mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        {isUrdu ? 'استاد محترم:' : 'Teacher:'}
                      </span>
                      <span className="font-bold text-slate-900 font-nastaliq text-sm">
                        {isUrdu ? assignedTeacher?.nameUrdu : assignedTeacher?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {isUrdu ? 'اوقاتِ تدریس:' : 'Timing:'}
                      </span>
                      <span className="font-medium text-slate-800">
                        {isUrdu ? cls.timingUrdu : cls.timingEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {isUrdu ? 'ایامِ تعلیم:' : 'Days:'}
                      </span>
                      <span className="font-medium text-slate-700">
                        {isUrdu ? 'ہفتہ تا جمعرات (جمعہ تعطیل)' : 'Sat - Thu (Fri Off)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Student count and capacity */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>
                      {classStudents.length} {isUrdu ? 'طلباء زیر تعلیم' : 'students'}
                    </span>
                    <span className="text-slate-400">/ گنجائش {cls.capacity}</span>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {Math.round((classStudents.length / cls.capacity) * 100)}% گنجائش
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Teachers Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teachers.map((tch) => {
            const assignedCount = students.filter((s) => s.teacherId === tch.id).length;

            return (
              <div
                key={tch.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {tch.photoUrl ? (
                        <img
                          src={tch.photoUrl}
                          alt={tch.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-nastaliq font-bold text-lg shrink-0 shadow-xs">
                          {tch.nameUrdu.slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <h2 className="text-base font-bold text-slate-900 font-nastaliq">
                          {isUrdu ? tch.nameUrdu : tch.name}
                        </h2>
                        <span className="text-xs text-emerald-700 font-medium">
                          {tch.designation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenTeacherModal(tch)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="ترمیم کریں"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTeacher(tch.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        {isUrdu ? 'سند / قابلیت:' : 'Qualification:'}
                      </span>
                      <span className="font-medium text-slate-800 text-right max-w-xs truncate">
                        {tch.qualification}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {isUrdu ? 'رابطہ نمبر:' : 'Phone:'}
                      </span>
                      <span className="font-mono text-slate-800 font-medium">
                        {tch.phone}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isUrdu ? 'تدریسی تجربہ:' : 'Experience:'}</span>
                      <span className="font-medium text-slate-800">
                        {tch.experienceYears} {isUrdu ? 'سال' : 'years'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {assignedCount} {isUrdu ? 'طلباء تفویض شدہ' : 'assigned students'}
                  </span>
                  <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    فعال استاد
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold font-nastaliq text-emerald-900">
                {editingClass
                  ? isUrdu
                    ? 'کلاس کی تفصیلات میں ترمیم'
                    : 'Edit Class'
                  : isUrdu
                  ? 'نئی کلاس بنائیں'
                  : 'Create New Class'}
              </h2>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'کلاس کا نام (اردو) *' : 'Class Name (Urdu) *'}
                </label>
                <input
                  required
                  type="text"
                  value={classNameUrdu}
                  onChange={(e) => setClassNameUrdu(e.target.value)}
                  placeholder="مثلاً: حفظ القرآن (درجہ وسطیٰ)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'کلاس کا نام (انگریزی)' : 'Class Name (English)'}
                </label>
                <input
                  type="text"
                  value={classNameEn}
                  onChange={(e) => setClassNameEn(e.target.value)}
                  placeholder="e.g. Hifz Intermediate"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'سطح / کیٹیگری *' : 'Level *'}
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as ClassRoom['level'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  >
                    <option value="hifz_ibtidai">{isUrdu ? 'حفظ ابتدائی (پارہ 1 تا 10)' : 'Hifz Ibtidai'}</option>
                    <option value="hifz_pukhta">{isUrdu ? 'حفظ پختہ و اخیرہ' : 'Hifz Pukhta'}</option>
                    <option value="manzil">{isUrdu ? 'دور و منزل کلاس' : 'Manzil Class'}</option>
                    <option value="nazra">{isUrdu ? 'ناظرہ مع تجوید' : 'Nazra Quran'}</option>
                    <option value="tajweed">{isUrdu ? 'تجوید و قرات' : 'Tajweed'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'استاد محترم *' : 'Teacher *'}
                  </label>
                  <select
                    value={classTeacherId}
                    onChange={(e) => setClassTeacherId(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'اوقات (اردو)' : 'Timing (Urdu)'}
                  </label>
                  <input
                    type="text"
                    value={timingUrdu}
                    onChange={(e) => setTimingUrdu(e.target.value)}
                    placeholder="بعد نماز فجر تا 8:30 صبح"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'کمرہ نمبر / ہال' : 'Room / Hall'}
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="ہال نمبر 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'زیادہ سے زیادہ گنجائش (طلباء)' : 'Max Capacity'}
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  {isUrdu ? 'محفوظ کریں' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold font-nastaliq text-emerald-900">
                {editingTeacher
                  ? isUrdu
                    ? 'استاد کے کوائف میں ترمیم'
                    : 'Edit Teacher'
                  : isUrdu
                  ? 'نیا استاد شامل کریں'
                  : 'Add New Teacher'}
              </h2>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4 mt-4 text-xs">
              {/* Teacher Photo Upload & Preview */}
              <div className="flex items-center gap-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <input
                  ref={teacherFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleTeacherPhotoChange}
                  className="hidden"
                />
                <div className="relative shrink-0">
                  {teacherPhotoUrl ? (
                    <img
                      src={teacherPhotoUrl}
                      alt="Teacher Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                      <Camera className="w-6 h-6 text-slate-400" />
                      <span className="text-[9px] mt-0.5">تصویر استاد</span>
                    </div>
                  )}
                  {teacherPhotoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveTeacherPhoto}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-xs"
                      title={isUrdu ? 'تصویر ہٹائیں' : 'Remove Photo'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800">
                    {isUrdu ? 'استاد محترم کی تصویر' : 'Teacher Photo'}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    {isUrdu
                      ? 'تصویر اپلوڈ کریں (JPG, PNG یا WebP - زیادہ سے زیادہ 2 ایم بی)'
                      : 'Upload photo (JPG, PNG, WebP up to 2MB)'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => teacherFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{teacherPhotoUrl ? (isUrdu ? 'تصویر تبدیل کریں' : 'Change Photo') : (isUrdu ? 'تصویر اپلوڈ کریں' : 'Upload Photo')}</span>
                    </button>
                    {teacherPhotoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveTeacherPhoto}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-lg transition-colors"
                      >
                        {isUrdu ? 'تصویر ختم کریں' : 'Remove'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'استاد محترم کا نام (اردو) *' : 'Teacher Name (Urdu) *'}
                </label>
                <input
                  required
                  type="text"
                  value={teacherNameUrdu}
                  onChange={(e) => setTeacherNameUrdu(e.target.value)}
                  placeholder="مثلاً: قاری محمد عاصم"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'استاد کا نام (انگریزی)' : 'Teacher Name (English)'}
                </label>
                <input
                  type="text"
                  value={teacherNameEn}
                  onChange={(e) => setTeacherNameEn(e.target.value)}
                  placeholder="e.g. Qari Muhammad Asim"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'عہدہ / منصب' : 'Designation'}
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="صدر مدرس / استاد حفظ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'رابطہ نمبر (فون / واٹس ایپ) *' : 'Phone *'}
                  </label>
                  <input
                    required
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'سند / تعلیمی قابلیت' : 'Qualifications'}
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="شہادت العالمیہ، حفظ مع تجوید"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'تجربہ (سال)' : 'Experience (Years)'}
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  {isUrdu ? 'محفوظ کریں' : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
