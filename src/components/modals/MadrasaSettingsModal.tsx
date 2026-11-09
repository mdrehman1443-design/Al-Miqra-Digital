import React, { useState } from 'react';
import { MadrasaProfile, AppLanguage } from '../../types';
import { Storage } from '../../utils/storage';
import { School, Download, Upload, RotateCcw, Save, Check, ShieldCheck } from 'lucide-react';

interface MadrasaSettingsModalProps {
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onUpdateMadrasa: (val: MadrasaProfile) => void;
  onResetAll: () => void;
  onClose: () => void;
}

export const MadrasaSettingsModal: React.FC<MadrasaSettingsModalProps> = ({
  madrasa,
  lang,
  onUpdateMadrasa,
  onResetAll,
  onClose,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';

  const [nameUrdu, setNameUrdu] = useState(madrasa.nameUrdu);
  const [nameEn, setNameEn] = useState(madrasa.nameEn);
  const [taglineUrdu, setTaglineUrdu] = useState(madrasa.taglineUrdu);
  const [taglineEn, setTaglineEn] = useState(madrasa.taglineEn || 'Hifz & Nazra Quran Memorization Management System');
  const [branch, setBranch] = useState(madrasa.branch);
  const [registrationNo, setRegistrationNo] = useState(madrasa.registrationNo);
  const [nazimNameUrdu, setNazimNameUrdu] = useState(madrasa.nazimNameUrdu);
  const [supervisorNameUrdu, setSupervisorNameUrdu] = useState(madrasa.supervisorNameUrdu || 'قاری حامد نواز صاحب');
  const [supervisorNameEn, setSupervisorNameEn] = useState(madrasa.supervisorNameEn || 'Qari Hamid Nawaz Sahib');
  const [supervisorDesignation, setSupervisorDesignation] = useState(madrasa.supervisorDesignation || 'نگرانِ اعلیٰ شعبہ حفظ القرآن والترتیل');
  const [phone, setPhone] = useState(madrasa.phone);
  const [city, setCity] = useState(madrasa.city);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMadrasa({
      nameUrdu,
      nameEn,
      taglineUrdu,
      taglineEn,
      branch,
      registrationNo,
      nazimNameUrdu,
      supervisorNameUrdu,
      supervisorNameEn,
      supervisorDesignation,
      phone,
      city,
      address: madrasa.address,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleExportBackup = () => {
    const jsonStr = Storage.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shasthiyat_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = Storage.importBackupJson(content);
      if (success) {
        alert(isUrdu ? 'بیک اپ کامیابی سے بحال ہو گیا ہے۔ صفحہ ریفریش ہو رہا ہے۔' : 'Backup restored successfully!');
        window.location.reload();
      } else {
        setImportError(isUrdu ? 'فائل کا فارمیٹ درست نہیں ہے۔' : 'Invalid backup JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold font-nastaliq text-emerald-950">
              {isUrdu ? 'دارالعلوم ترتیبات و ڈیٹا بیک اپ' : 'Madrasa Settings & Backup'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isUrdu ? 'دارالعلوم / جامعہ کا نام (اردو) *' : 'Madrasa Name (Urdu) *'}
            </label>
            <input
              required
              type="text"
              value={nameUrdu}
              onChange={(e) => setNameUrdu(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq font-bold text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isUrdu ? 'نام (انگریزی)' : 'Madrasa Name (English)'}
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
            />
          </div>

          {/* Supervisor Name Box */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'نگرانِ شعبہ حفظ و ناظرہ:' : 'Head Supervisor - Hifz Dept:'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">{isUrdu ? 'نام (اردو):' : 'Name (Urdu):'}</label>
                <input
                  type="text"
                  value={supervisorNameUrdu}
                  onChange={(e) => setSupervisorNameUrdu(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-nastaliq font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">{isUrdu ? 'منصب / عہدہ:' : 'Designation:'}</label>
                <input
                  type="text"
                  value={supervisorDesignation}
                  onChange={(e) => setSupervisorDesignation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isUrdu ? 'شاخ / کیمپس' : 'Branch / Campus'}
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isUrdu ? 'شہر' : 'City'}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isUrdu ? 'مہتمم / ناظم کا نام' : 'Principal / Nazim'}
              </label>
              <input
                type="text"
                value={nazimNameUrdu}
                onChange={(e) => setNazimNameUrdu(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-nastaliq"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {isUrdu ? 'مرکزی فون نمبر' : 'Phone'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{isUrdu ? 'محفوظ ہو گیا!' : 'Saved!'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isUrdu ? 'معلومات محفوظ کریں' : 'Save Details'}</span>
              </>
            )}
          </button>
        </form>

        {/* Data Backup & Restore Section */}
        <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 font-nastaliq">
            {isUrdu ? 'ڈیٹا بیک اپ، فائل ایکسپورٹ اور ری سیٹ' : 'Data Portability & Backup'}
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleExportBackup}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>{isUrdu ? 'بیک اپ ڈاؤن لوڈ' : 'Export JSON'}</span>
            </button>

            <label className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-blue-700" />
              <span>{isUrdu ? 'بیک اپ اپلوڈ' : 'Import JSON'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {importError && (
            <p className="text-[11px] text-rose-600 font-medium">{importError}</p>
          )}

          {/* Reset Demo Data */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (
                  confirm(
                    isUrdu
                      ? 'کیا آپ تمام ڈیٹا کو دارالعلوم شاستھیات کے ابتدائی ڈیمو ڈیٹا پر ری سیٹ کرنا چاہتے ہیں؟'
                      : 'Reset all data to default demo state?'
                  )
                ) {
                  onResetAll();
                  onClose();
                }
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ڈیمو ڈیٹا بحال کریں (دارالعلوم شاستھیات)' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
