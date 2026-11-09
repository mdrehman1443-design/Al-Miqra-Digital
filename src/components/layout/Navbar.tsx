import React from 'react';
import { BookOpen, Plus, Globe, School } from 'lucide-react';
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
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  madrasa,
  lang,
  setLang,
  onOpenNewLesson,
  onOpenSettings,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18">
          {/* Zone 1: Bilingual Branding Block */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center shadow-sm border border-emerald-700/80 shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6 text-amber-300" />
              </div>

              {/* Distinct Bilingual Blocks */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-emerald-950 font-nastaliq leading-tight">
                    {madrasa.nameUrdu}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 font-sans-modern tracking-wider uppercase">
                  MADRASAH TALEEM-UL-QURAN SURAG
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Trilingual Desktop Nav links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
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

          {/* Zone 3: Multi-Language Switcher (Urdu, Arabic, English) & Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 3-Language Segmented Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setLang('ur')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
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
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
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
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
                title="English Language"
              >
                English
              </button>
            </div>

            {/* Seminary settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors"
              title={t.settings}
            >
              <School className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewLesson}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 active:scale-95"
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
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
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
