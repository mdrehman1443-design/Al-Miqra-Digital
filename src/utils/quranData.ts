import { GradeType } from '../types';

export interface JuzInfo {
  number: number;
  nameUrdu: string;
  nameArabic: string;
  transliteration: string;
}

export const QURAN_JUZ: JuzInfo[] = [
  { number: 1, nameUrdu: 'الم', nameArabic: 'الم', transliteration: 'Alif Lam Meem' },
  { number: 2, nameUrdu: 'سَیَقُولُ', nameArabic: 'سَيَقُولُ', transliteration: 'Sayaqool' },
  { number: 3, nameUrdu: 'تِلْکَ الرُّسُلُ', nameArabic: 'تِلْكَ الرُّسُلُ', transliteration: 'Tilkar Rusul' },
  { number: 4, nameUrdu: 'لَنْ تَنَالُوا', nameArabic: 'لَنْ تَنَالُوا', transliteration: 'Lan Tanaaloo' },
  { number: 5, nameUrdu: 'وَالْمُحْصَنَاتُ', nameArabic: 'وَالْمُحْصَنَاتُ', transliteration: 'Wal Mohsanat' },
  { number: 6, nameUrdu: 'لَا یُحِبُّ اللّٰہُ', nameArabic: 'لَا يُحِبُّ اللَّهُ', transliteration: 'La Yuhibbullah' },
  { number: 7, nameUrdu: 'وَإِذَا سَمِعُوا', nameArabic: 'وَإِذَا سَمِعُوا', transliteration: 'Wa Iza Samiu' },
  { number: 8, nameUrdu: 'وَلَوْ أَنَّنَا', nameArabic: 'وَلَوْ أَنَّنَا', transliteration: 'Wa Law Annana' },
  { number: 9, nameUrdu: 'قَالَ الْمَلَأُ', nameArabic: 'قَالَ الْمَلَأُ', transliteration: 'Qalal Malao' },
  { number: 10, nameUrdu: 'وَاعْلَمُوا', nameArabic: 'وَاعْلَمُوا', transliteration: 'Wa A\'lamu' },
  { number: 11, nameUrdu: 'یَعْتَذِرُونَ', nameArabic: 'يَعْتَذِرُونَ', transliteration: 'Ya\'taziroon' },
  { number: 12, nameUrdu: 'وَمَا مِنْ دَابَّۃٍ', nameArabic: 'وَمَا مِنْ دَابَّةٍ', transliteration: 'Wa Mamin Da\'abbah' },
  { number: 13, nameUrdu: 'وَمَا أُبَرِّئُ', nameArabic: 'وَمَا أُبَرِّئُ', transliteration: 'Wa Ma Obarri\'o' },
  { number: 14, nameUrdu: 'رُبَمَا', nameArabic: 'رُبَمَا', transliteration: 'Rubama' },
  { number: 15, nameUrdu: 'سُبْحَانَ الَّذِی', nameArabic: 'سُبْحَانَ الَّذِي', transliteration: 'Subhanallazi' },
  { number: 16, nameUrdu: 'قَالَ أَلَمْ', nameArabic: 'قَالَ أَلَمْ', transliteration: 'Qala Alam' },
  { number: 17, nameUrdu: 'اقْتَرَبَ لِلنَّاسِ', nameArabic: 'اقْتَرَبَ لِلنَّاسِ', transliteration: 'Iqtaraba Linnas' },
  { number: 18, nameUrdu: 'قَدْ أَفْلَحَ', nameArabic: 'قَدْ أَفْلَحَ', transliteration: 'Qadd Aflaha' },
  { number: 19, nameUrdu: 'وَقَالَ الَّذِینَ', nameArabic: 'وَقَالَ الَّذِينَ', transliteration: 'Wa Qalallazina' },
  { number: 20, nameUrdu: 'أَمَّنْ خَلَقَ', nameArabic: 'أَمَّنْ خَلَقَ', transliteration: 'Amman Khalaq' },
  { number: 21, nameUrdu: 'اتْلُ مَا أُوحِیَ', nameArabic: 'اتْلُ مَا أُوحِيَ', transliteration: 'Utlu Ma Oohiya' },
  { number: 22, nameUrdu: 'وَمَنْ یَّقْنُتْ', nameArabic: 'وَمَنْ يَّقْنُتْ', transliteration: 'Wa Manyaqnut' },
  { number: 23, nameUrdu: 'وَمَا لِیَ', nameArabic: 'وَمَا لِيَ', transliteration: 'Wa Maliya' },
  { number: 24, nameUrdu: 'فَمَنْ أَظْلَمُ', nameArabic: 'فَمَنْ أَظْلَمُ', transliteration: 'Faman Azlamo' },
  { number: 25, nameUrdu: 'إِلَیْہِ یُرَدُّ', nameArabic: 'إِلَيْهِ يُرَدُّ', transliteration: 'Ilaihi Yuraddu' },
  { number: 26, nameUrdu: 'حٰمٓ', nameArabic: 'حٰمٓ', transliteration: 'Ha-Meem' },
  { number: 27, nameUrdu: 'قَالَ فَمَا خَطْبُکُمْ', nameArabic: 'قَالَ فَمَا خَطْبُكُمْ', transliteration: 'Qala Fama Khatbukum' },
  { number: 28, nameUrdu: 'قَدْ سَمِعَ اللّٰہُ', nameArabic: 'قَدْ سَمِعَ اللَّهُ', transliteration: 'Qadd Sami Allah' },
  { number: 29, nameUrdu: 'تَبَارَكَ الَّذِی', nameArabic: 'تَبَارَكَ الَّذِي', transliteration: 'Tabarakallazi' },
  { number: 30, nameUrdu: 'عَمَّ یَتَسَاءَلُونَ', nameArabic: 'عَمَّ يَتَسَاءَلُونَ', transliteration: 'Amma Yatasa\'aloon' },
];

export const POPULAR_SURAHS = [
  'الفاتحۃ', 'البقرۃ', 'آل عمران', 'النساء', 'المائدۃ', 'الانعام', 'الاعراف', 'الانفال',
  'التوبۃ', 'یونس', 'ہود', 'یوسف', 'الرعد', 'ابراہیم', 'الحجر', 'النحل', 'الاسراء',
  'الکہف', 'مریم', 'طٰہٰ', 'الانبیاء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء',
  'النمل', 'القصص', 'العنکبوت', 'الروم', 'لقمان', 'السجدۃ', 'الاحزاب', 'سبا', 'فاطر',
  'یٰسٓ', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورٰی', 'الزخرف', 'الدخان',
  'الجاثیۃ', 'الاحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاریات', 'الطور', 'النجم',
  'القمر', 'الرحمن', 'الواقعۃ', 'الحدید', 'المجادلۃ', 'الحشر', 'الممتحنۃ', 'الصف',
  'الجمعۃ', 'المنافقون', 'التغابن', 'الطلاق', 'التحریم', 'الملک', 'القلم', 'الحاقۃ',
  'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القیامۃ', 'الانسان', 'المرسلات',
  'النباء', 'النازعات', 'عبس', 'التکویر', 'الانفطار', 'المطففین', 'الانشقاق', 'البروج',
  'الطارق', 'الاعلیٰ', 'الغاشیۃ', 'الفجر', 'البلد', 'الشمس', 'اللیل', 'الضحٰی',
  'الانشراح', 'التین', 'العلق', 'القدر', 'البینۃ', 'الزلزال', 'العادیات', 'القارعۃ',
  'التکاثر', 'العصر', 'الہمزۃ', 'الفیل', 'قریش', 'الماعون', 'الکوثر', 'الکافرون',
  'النصر', 'المسد', 'الاخلاص', 'الفلق', 'الناس'
];

export const GRADE_DETAILS: Record<GradeType, { labelUrdu: string; labelEn: string; color: string; bg: string; border: string }> = {
  mumtaz: {
    labelUrdu: 'ممتاز (Excellent)',
    labelEn: 'Excellent (Mumtaz)',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-300 dark:border-emerald-800',
  },
  jayyid_jiddan: {
    labelUrdu: 'جید جداً (Very Good)',
    labelEn: 'Very Good (Jayyid Jiddan)',
    color: 'text-teal-700 dark:text-teal-300',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    border: 'border-teal-300 dark:border-teal-800',
  },
  jayyid: {
    labelUrdu: 'جید (Good)',
    labelEn: 'Good (Jayyid)',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-300 dark:border-blue-800',
  },
  maqbool: {
    labelUrdu: 'مقبول (Fair)',
    labelEn: 'Fair (Maqbool)',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-300 dark:border-amber-800',
  },
  weak: {
    labelUrdu: 'اعادہ / کمزور (Weak / Repeat)',
    labelEn: 'Weak / Repeat (Iaadah)',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-300 dark:border-rose-800',
  },
};
