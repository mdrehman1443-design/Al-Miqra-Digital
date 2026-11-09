import React, { useState } from 'react';
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
import { formatWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp';
import { Share2, Copy, Check, MessageSquare } from 'lucide-react';

interface WhatsAppModalProps {
  student: Student;
  madrasa: MadrasaProfile;
  teachers: Teacher[];
  classes: ClassRoom[];
  lessons: DailyLessonLog[];
  attendance: AttendanceRecord[];
  fees: FeePayment[];
  lang: AppLanguage;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  student,
  madrasa,
  teachers,
  classes,
  lessons,
  attendance,
  fees,
  lang,
  onClose,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';
  const teacher = teachers.find((t) => t.id === student.teacherId);
  const studentLessons = lessons.filter((l) => l.studentId === student.id);
  const latestLesson = studentLessons[0];
  const studentAttendance = attendance.find((a) => a.studentId === student.id);
  const studentFee = fees.find((f) => f.studentId === student.id);

  const defaultMessage = formatWhatsAppMessage(
    student,
    madrasa,
    teacher,
    latestLesson,
    studentAttendance,
    studentFee,
    lang
  );

  const [messageText, setMessageText] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    openWhatsApp(student.guardianPhone, messageText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold font-nastaliq text-slate-900">
                {isUrdu ? 'والد / سرپرست کو واٹس ایپ پیغام' : 'WhatsApp Notification'}
              </h2>
              <div className="text-xs text-slate-500 font-mono">
                {student.guardianPhone} ({student.nameUrdu})
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            {isUrdu
              ? 'پیغام کا متن (آپ اپنی مرضی کے مطابق ترمیم بھی کر سکتے ہیں):'
              : 'Message Text (Editable):'}
          </label>
          <textarea
            rows={10}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-emerald-600 font-nastaliq leading-relaxed"
          />
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isUrdu ? 'کاپی ہو گیا!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{isUrdu ? 'متن کاپی کریں' : 'Copy Text'}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg"
            >
              {isUrdu ? 'منسوخ' : 'Cancel'}
            </button>
            <button
              onClick={handleSend}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{isUrdu ? 'واٹس ایپ پر کھولیں' : 'Open WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
