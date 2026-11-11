import React, { useState } from 'react';
import { MadrasaProfile, AppLanguage } from '../../types';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Globe,
  Github,
  QrCode,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ShareAppModalProps {
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  madrasa,
  lang,
  onClose,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';

  const [copiedGH, setCopiedGH] = useState(false);
  const [copiedCloud, setCopiedCloud] = useState(false);

  // GitHub Pages URL
  const githubPagesUrl = 'https://mdrehman1443-design.github.io/Al-Miqra-Digital/';
  
  // Cloud Preview URL
  const cloudAppUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-pre-t4ero6q7kq4mpjemnzqph7-833260995307.asia-east1.run.app';

  const handleCopy = (url: string, type: 'gh' | 'cloud') => {
    navigator.clipboard.writeText(url).then(() => {
      if (type === 'gh') {
        setCopiedGH(true);
        setTimeout(() => setCopiedGH(false), 2500);
      } else {
        setCopiedCloud(true);
        setTimeout(() => setCopiedCloud(false), 2500);
      }
    });
  };

  const handleShareWhatsApp = (url: string) => {
    const text = isUrdu
      ? `السلام علیکم ورحمۃ اللہ وبرکاتہ\n\n*مدرسہ تعلیم القرآن سورگ*\n*نظام: المقرا ڈیجیٹل (Al-Miqra Digital)*\n\nآن لائن چیکنگ اور معائنہ کے لیے لائیو پورٹل لنک:\n${url}\n\nنگرانِ اعلیٰ شعبہ حفظ: ${madrasa.supervisorNameUrdu}\nبرانچ: ${madrasa.branch}، ${madrasa.city}`
      : `Assalam-o-Alaikum wa Rahmatullah\n\n*Madrasah Taleem-ul-Quran Surag*\n*Al-Miqra Digital Portal*\n\nLive portal link for inspection & review:\n${url}\n\nHead Supervisor: ${madrasa.supervisorNameEn}\nBranch: ${madrasa.branch}, ${madrasa.city}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
              <Share2 className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-nastaliq">
                {isUrdu ? 'پورٹل کا لنک شیئر کریں' : 'Share Application Portal'}
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Al-Miqra Digital · Madrasah Taleem-ul-Quran Surag
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mt-4 text-xs">
          {/* Quick Notice */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              {isUrdu ? (
                <span>
                  یہ لائیو لنکس اساتذہ، نگرانِ حفظ اور معاونین کے ساتھ شیئر کیے جا سکتے ہیں تاکہ وہ اپنے موبائل یا کمپیوٹر پر سسٹم کو چیک کر سکیں۔
                </span>
              ) : (
                <span>
                  Share these live links with teachers, supervisors, and stakeholders to test and review the portal on mobile or desktop.
                </span>
              )}
            </div>
          </div>

          {/* Link Option 1: GitHub Pages Link */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                <Github className="w-4 h-4 text-slate-700" />
                <span>GitHub Pages Link (گٹ ہب پیجز لنک)</span>
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                Public / پبلک
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 break-all select-all">
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="flex-1 truncate">{githubPagesUrl}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleCopy(githubPagesUrl, 'gh')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  copiedGH
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                }`}
              >
                {copiedGH ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGH ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'لنک کاپی کریں' : 'Copy Link')}</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(githubPagesUrl)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                title="واٹس ایپ پر شیئر کریں"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp</span>
              </button>

              <a
                href={githubPagesUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="لنک کھولیں"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Link Option 2: Live Cloud App Preview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>Direct Live App Link (مستقل لائیو لنک)</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active / فعال
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 break-all select-all">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="flex-1 truncate">{cloudAppUrl}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleCopy(cloudAppUrl, 'cloud')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  copiedCloud
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-900 text-white shadow-2xs'
                }`}
              >
                {copiedCloud ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCloud ? (isUrdu ? 'کاپی ہو گیا!' : 'Copied!') : (isUrdu ? 'لنک کاپی کریں' : 'Copy Link')}</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(cloudAppUrl)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                title="واٹس ایپ پر شیئر کریں"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp</span>
              </button>

              <a
                href={cloudAppUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="لنک کھولیں"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* GitHub Pages Setup Note */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1 text-amber-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{isUrdu ? 'گٹ ہب پیجز کو فعال کرنے کا طریقہ:' : 'How to enable GitHub Pages:'}</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-700 font-sans pr-1">
              <li>{isUrdu ? 'اپنے GitHub ریپوزٹری میں جائیں: Settings > Pages' : 'In your GitHub repository, go to: Settings > Pages'}</li>
              <li>{isUrdu ? 'Build and deployment کے نیچے Source میں "GitHub Actions" منتخب کریں۔' : 'Under "Build and deployment", set Source to "GitHub Actions".'}</li>
              <li>{isUrdu ? 'ورک فلو خودکار طور پر چند منٹوں میں پورٹل کو لائیو کر دے گا۔' : 'The workflow will automatically build and publish your portal.'}</li>
            </ol>
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
