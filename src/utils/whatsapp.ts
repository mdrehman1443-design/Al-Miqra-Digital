import { Student, DailyLessonLog, AttendanceRecord, FeePayment, MadrasaProfile, Teacher, AppLanguage } from '../types';
import { GRADE_DETAILS } from './quranData';

export function formatWhatsAppMessage(
  student: Student,
  madrasa: MadrasaProfile,
  teacher?: Teacher,
  lesson?: DailyLessonLog,
  attendance?: AttendanceRecord,
  fee?: FeePayment,
  lang: AppLanguage = 'ur'
): string {
  const todayStr = lesson?.date || new Date().toISOString().slice(0, 10);

  if (lang === 'en') {
    let msg = `*Assalam-o-Alaikum wa Rahmatullah*\n`;
    msg += `Respected Guardian of *${student.name}* (Roll: ${student.admissionNo}),\n\n`;
    msg += `Daily progress report from *${madrasa.nameEn}* for ${todayStr}:\n\n`;

    if (lesson) {
      const grade = GRADE_DETAILS[lesson.grade]?.labelEn || lesson.grade;
      msg += `📖 *Sabaq (New Lesson):* Para ${lesson.sabaqPara}, Surah ${lesson.sabaqSurah} (${lesson.sabaqAyahRange || `${lesson.sabaqLinesCount} lines`})\n`;
      msg += `🔄 *Sabqi (Recent Revision):* Para ${lesson.sabqiPara} (${lesson.sabqiPagesCount})\n`;
      msg += `🏛️ *Manzil (Grand Revision):* Para ${lesson.manzilPara} (${lesson.manzilPortion})\n`;
      msg += `⭐ *Performance Grade:* ${grade}\n`;
      if (lesson.remarks) {
        msg += `✍️ *Teacher Note:* ${lesson.remarks}\n`;
      }
    } else {
      msg += `ℹ️ *Daily Lesson:* Today's lesson is being revised.\n`;
    }

    if (attendance) {
      const attMap = { present: 'Present ✔️', absent: 'Absent ❌', leave: 'On Leave 🟡' };
      msg += `📌 *Attendance:* ${attMap[attendance.status] || attendance.status}\n`;
    }

    if (fee) {
      const feeStatus = fee.status === 'paid' ? 'Paid (Ada Shuda)' : fee.status === 'exempt' ? 'Exempt / Zakat' : `Pending: PKR ${fee.monthlyFee - fee.amountPaid}`;
      msg += `💳 *Monthly Fee Status:* ${feeStatus}\n`;
    }

    if (teacher) {
      msg += `\nUstadh: ${teacher.name} (${teacher.phone})\n`;
    }
    msg += `\nMay Allah bless the student with excellence in Quran memorization.\n*${madrasa.nameEn}*`;
    return msg;
  }

  // Urdu Format
  let msg = `*السلام علیکم ورحمۃ اللہ وبرکاتہ*\n`;
  msg += `محترم جناب *${student.fatherNameUrdu || student.fatherName}* صاحب!\n`;
  msg += `امید ہے آپ بخیر و عافیت ہوں گے۔ *${madrasa.nameUrdu}* کی جانب سے آپ کے فرزند *${student.nameUrdu || student.name}* (داخلہ نمبر: ${student.admissionNo}) کی یومیہ تعلیمی و ترتیلی کارکردگی رپورٹ برائے تاریخ *${todayStr}* پیشِ خدمت ہے:\n\n`;

  if (lesson) {
    const grade = GRADE_DETAILS[lesson.grade]?.labelUrdu || lesson.grade;
    msg += `🔹 *سبق (نیا سبق):* پارہ ${lesson.sabaqPara}، سورۃ ${lesson.sabaqSurah} (${lesson.sabaqAyahRange || `${lesson.sabaqLinesCount} سطریں`})\n`;
    msg += `🔹 *سبقی (حالیہ اعادہ):* پارہ ${lesson.sabqiPara} (${lesson.sabqiPagesCount})\n`;
    msg += `🔹 *منزل (دورِ قدیم):* پارہ ${lesson.manzilPara} (${lesson.manzilPortion})\n`;
    msg += `⭐ *کیفیت / گریڈ:* ${grade}\n`;
    if (lesson.remarks) {
      msg += `✍️ *استاد محترم کے ریمارکس:* ${lesson.remarks}\n`;
    }
  } else {
    msg += `🔹 *یومیہ سبق:* آج کا سبق درج کیا جا رہا ہے یا اعادہ جاری ہے۔\n`;
  }

  if (attendance) {
    const attMap = { present: 'حاضر ✔️', absent: 'غیر حاضر ❌', leave: 'رخصت 🟡' };
    msg += `📌 *حاضری:* ${attMap[attendance.status] || attendance.status}\n`;
  }

  if (fee) {
    const feeStatus = fee.status === 'paid' ? 'مکمل ادا شدہ ✔️' : fee.status === 'exempt' ? 'معاف / مستحقِ وظیفہ' : `بقایا جات: Rs. ${fee.monthlyFee - fee.amountPaid}`;
    msg += `💳 *ماہانہ فیس کی صورتحال:* ${feeStatus}\n`;
  }

  if (teacher) {
    msg += `\nاستاد محترم: ${teacher.nameUrdu || teacher.name}\n`;
  }

  msg += `\nاللہ تبارک و تعالیٰ عزیز کے حفظِ قرآن کریم، علم و عمل اور اخلاق میں برکت عطا فرمائے۔ آمین۔\n`;
  msg += `*${madrasa.nameUrdu}*\nرابطہ: ${madrasa.phone}`;

  return msg;
}

export function openWhatsApp(phone: string, text: string) {
  // Clean phone number: remove +, spaces, dashes
  let cleanNumber = phone.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    // Convert 0300... to 92300...
    cleanNumber = '92' + cleanNumber.substring(1);
  }
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${cleanNumber}?text=${encodedText}`;
  window.open(url, '_blank');
}
