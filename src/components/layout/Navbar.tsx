import React from 'react';
import { BookOpen, Plus, Globe, School, Share2 } from 'lucide-react';
import { MadrasaProfile, AppLanguage } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  onOpenNewLesson: () => void;
  onOpenSettings: () => void;
  onOpenShareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  madrasa,
  lang,
  setLang,
  onOpenNewLesson,
  onOpenSettings,
  onOpenShareModal,
}) => {
  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'dashboard', label: t.dashboard },
    { id: 'lessons', label: t.lessons },
    { id: 'attendance', label: t.attendance },
    { id: 'exams', label: t.exams },
    { id: 'students', label: t.students },
    { id: 'classes', label: t.classes },
    { id: 'fees', label: t.fees },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. Very Top Header: Prominently & Clearly Centered Madrasah Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white border-b border-emerald-800/80 py-2.5 px-4 shadow-sm relative overflow-hidden">
        {/* Subtle decorative Islamic pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px]" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center text-center">
          {/* Centered Madrasah Name in Urdu & English */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-400 select-none text-xs">✦</span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-nastaliq text-amber-200 tracking-wide drop-shadow-sm leading-snug">
                مدرسہ تعلیم القرآن سورگ
              </h1>
              <span className="text-amber-400 select-none text-xs">✦</span>
            </div>

            <div className="flex items-center justify-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider text-emerald-100 font-sans uppercase">
                MADRASAH TALEEM-UL-QURAN SURAG
              </span>
              <span className="text-emerald-400/80 text-[11px] font-mono">
                · سورگ، پاکستان (Surag, Pakistan)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Application Navigation Bar with Al-Miqra Digital Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Application Title & Branding - "Al-Miqra Digital" (المقرا ڈیجیٹل) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
              title="Al-Miqra Digital (المقرا ڈیجیٹل)"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center shadow-sm border border-emerald-700/80 shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-amber-300" />
              </div>

              {/* Al-Miqra Digital App Identity */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-black tracking-tight text-emerald-950 font-sans">
                    Al-Miqra Digital
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-amber-800 font-nastaliq">
                    (المقرا ڈیجیٹل)
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {lang === 'en'
                    ? 'Hifz & Nazra Seminary System'
                    : 'مدارس حفظ و ناظرہ مینجمنٹ سسٹم'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Trilingual Desktop Nav links */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                    isActive
                      ? 'text-emerald-950 font-bold'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Multi-Language Switcher (Urdu, Arabic, English) & Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 3-Language Segmented Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setLang('ur')}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  lang === 'ur'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
                title="اردو زبان"
              >
                اردو
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
                title="اللغة العربية"
              >
                العربية
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
                title="English Language"
              >
                English
              </button>
            </div>

            {/* Share Portal Link Button */}
            <button
              onClick={onOpenShareModal}
              className="px-2.5 py-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs font-bold text-xs"
              title="پورٹل کا لنک شیئر کریں / Share Portal Link"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'en' ? 'Share Link' : 'شیئر لنک'}</span>
            </button>

            {/* Seminary settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title={t.settings}
            >
              <School className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewLesson}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.logLesson}</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
