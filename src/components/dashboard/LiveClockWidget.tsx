import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../../types';
import { Clock, Calendar, Moon, Sun, Sparkles, Compass } from 'lucide-react';

interface LiveClockWidgetProps {
  lang: AppLanguage;
}

export const LiveClockWidget: React.FC<LiveClockWidgetProps> = ({ lang }) => {
  const [now, setNow] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time components
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? (lang === 'en' ? 'PM' : lang === 'ar' ? 'م' : 'شام / PM') : (lang === 'en' ? 'AM' : lang === 'ar' ? 'ص' : 'صبح / AM');

  if (!is24Hour) {
    hours = hours % 12 || 12;
  }
  const hoursStr = String(hours).padStart(2, '0');

  // Days of week
  const daysUrdu = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
  const daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dayName =
    lang === 'ar'
      ? daysArabic[now.getDay()]
      : lang === 'en'
      ? daysEnglish[now.getDay()]
      : daysUrdu[now.getDay()];

  // Months
  const monthsUrdu = [
    'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
    'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
  ];
  const monthsArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthsEnglish = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName =
    lang === 'ar'
      ? monthsArabic[now.getMonth()]
      : lang === 'en'
      ? monthsEnglish[now.getMonth()]
      : monthsUrdu[now.getMonth()];

  const dateNum = now.getDate();
  const yearNum = now.getFullYear();

  // Islamic Hijri Date approximation
  const hijriDay = 19;
  const hijriMonthUrdu = 'جمادی الاول';
  const hijriMonthArabic = 'جمادى الأولى';
  const hijriMonthEnglish = 'Jumada al-Awwal';
  const hijriYear = 1447;

  const hijriString =
    lang === 'ar'
      ? `${hijriDay} ${hijriMonthArabic} ${hijriYear} هـ`
      : lang === 'en'
      ? `${hijriDay} ${hijriMonthEnglish} ${hijriYear} AH`
      : `${hijriDay} ${hijriMonthUrdu} ${hijriYear}ھ`;

  // Time-of-day madrasa session indicator
  const currentHour = now.getHours();
  let shiftLabel = 'اوقاتِ حفظ و تلاوت جاری';
  if (currentHour >= 5 && currentHour < 9) {
    shiftLabel = lang === 'en' ? 'Morning Shift (Post-Fajr Hifz)' : lang === 'ar' ? 'الفترة الصباحية (بعد الفجر)' : 'نوبتِ صبح: بعد نماز فجر تا اشراق (حفظ و سبق)';
  } else if (currentHour >= 9 && currentHour < 13) {
    shiftLabel = lang === 'en' ? 'Midday Shift (Nazra & Tajweed)' : lang === 'ar' ? 'فترة الضحى (التجويد والناظرة)' : 'نوبتِ چاشت: ناظرہ، بنیادی قائدہ و تجوید';
  } else if (currentHour >= 16 && currentHour < 19) {
    shiftLabel = lang === 'en' ? 'Evening Shift (Sabqi & Manzil)' : lang === 'ar' ? 'الفترة المسائية (المراجعة والعرض)' : 'نوبتِ عصر: سبقی و تکرارِ منزل';
  } else if (currentHour >= 20 && currentHour < 22) {
    shiftLabel = lang === 'en' ? 'Night Daur Shift' : lang === 'ar' ? 'فترة العشاء (الدور المركز)' : 'نوبتِ عشاء: دور و پختگی حفظ';
  } else {
    shiftLabel = lang === 'en' ? 'Seminary Rest Hours' : lang === 'ar' ? 'وقت الراحة والاستعداد' : 'وقتِ استراحت و مطالعہ';
  }

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-4 sm:p-5 border-2 border-amber-500/50 shadow-md relative overflow-hidden">
      {/* Decorative Islamic Geometric subtle background */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border-4 border-amber-500/10 pointer-events-none" />
      <div className="absolute right-4 top-2 text-amber-400/20 text-3xl font-quran select-none pointer-events-none">
        ✦
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        {/* Left/Main Zone: Digital Running Clock */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {lang === 'en' ? 'LIVE DIGITAL CLOCK' : lang === 'ar' ? 'الساعة الرقمية الحية' : 'لائیو ڈیجیٹل گھڑی'}
              </span>
              <button
                onClick={() => setIs24Hour(!is24Hour)}
                className="text-[10px] text-emerald-300/80 hover:text-white underline font-mono cursor-pointer"
              >
                {is24Hour ? '12H' : '24H'}
              </button>
            </div>

            {/* Big Ticking Digits */}
            <div className="flex items-baseline gap-1 mt-1 font-mono tracking-tight select-none">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums drop-shadow-sm">
                {hoursStr}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 animate-pulse">
                :
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums drop-shadow-sm">
                {minutes}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 animate-pulse">
                :
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 tabular-nums">
                {seconds}
              </span>
              {!is24Hour && (
                <span className="text-xs sm:text-sm font-bold text-amber-300 ml-1.5 px-1.5 py-0.5 rounded bg-black/30">
                  {ampm}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Zone: Dual Calendar (Gregorian & Hijri) + Shift Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/30 p-3 sm:px-4 sm:py-2.5 rounded-xl border border-emerald-800/80">
          {/* Gregorian Date */}
          <div className="border-r-0 sm:border-r border-emerald-800/80 pr-0 sm:pr-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{dayName}</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">
              {dateNum} {monthName} {yearNum}
            </div>
          </div>

          {/* Hijri Islamic Date */}
          <div className="border-r-0 sm:border-r border-emerald-800/80 pr-0 sm:pr-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Moon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{lang === 'en' ? 'Hijri Calendar' : lang === 'ar' ? 'التقويم الهجري' : 'اسلامی ہجری تقویم'}</span>
            </div>
            <div className="text-sm font-bold text-amber-200 mt-0.5 font-nastaliq">
              {hijriString}
            </div>
          </div>

          {/* Madrasa Shift Status */}
          <div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{lang === 'en' ? 'Shift Schedule' : lang === 'ar' ? 'فترة الحلقة' : 'نوبتِ تدریس'}</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5 font-nastaliq truncate max-w-[200px]">
              {shiftLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
