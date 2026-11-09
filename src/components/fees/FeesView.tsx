import React, { useState, useMemo } from 'react';
import {
  Student,
  ClassRoom,
  FeePayment,
  MadrasaProfile,
  AppLanguage,
} from '../../types';
import { openWhatsApp } from '../../utils/whatsapp';
import {
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Plus,
  Receipt,
  AlertCircle,
} from 'lucide-react';

interface FeesViewProps {
  students: Student[];
  classes: ClassRoom[];
  fees: FeePayment[];
  madrasa: MadrasaProfile;
  lang: AppLanguage;
  onRecordPayment: (payment: FeePayment) => void;
  onSelectStudent: (student: Student) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  students,
  classes,
  fees,
  madrasa,
  lang,
  onRecordPayment,
  onSelectStudent,
}) => {
  const isUrdu = lang === 'ur' || lang === 'ar';
  const currentMonthStr = '2026-11';

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Payment Recording Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payStudent, setPayStudent] = useState<Student | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<FeePayment['paymentMethod']>('cash');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  // Printable receipt state
  const [receiptStudent, setReceiptStudent] = useState<Student | null>(null);
  const [receiptRecord, setReceiptRecord] = useState<FeePayment | null>(null);

  // Map of studentId -> fee record for selectedMonth
  const monthFeeMap = useMemo(() => {
    const map = new Map<string, FeePayment>();
    fees
      .filter((f) => f.month === selectedMonth)
      .forEach((f) => map.set(f.studentId, f));
    return map;
  }, [fees, selectedMonth]);

  // Combined ledger data
  const ledgerData = useMemo(() => {
    return students
      .filter((s) => s.status === 'active')
      .map((s) => {
        const feeRecord = monthFeeMap.get(s.id);
        const monthlyFee = s.monthlyFee || 0;
        const amountPaid = feeRecord?.amountPaid || 0;
        const status =
          s.feeCategory === 'exempt'
            ? 'exempt'
            : amountPaid >= monthlyFee && monthlyFee > 0
            ? 'paid'
            : 'unpaid';
        const pendingAmount =
          s.feeCategory === 'exempt' ? 0 : Math.max(0, monthlyFee - amountPaid);

        return {
          student: s,
          feeRecord,
          monthlyFee,
          amountPaid,
          status,
          pendingAmount,
        };
      })
      .filter((item) => {
        if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
        if (selectedClassId !== 'all' && item.student.classId !== selectedClassId)
          return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            item.student.name.toLowerCase().includes(q) ||
            item.student.nameUrdu.includes(q) ||
            item.student.admissionNo.toLowerCase().includes(q) ||
            item.student.fatherName.toLowerCase().includes(q) ||
            item.student.fatherNameUrdu.includes(q);
          if (!match) return false;
        }
        return true;
      });
  }, [students, monthFeeMap, selectedStatus, selectedClassId, searchQuery]);

  // Totals for top statistics
  const totals = useMemo(() => {
    let expected = 0;
    let collected = 0;
    let pending = 0;
    let exemptCount = 0;

    students.forEach((s) => {
      if (s.status !== 'active') return;
      expected += s.monthlyFee || 0;
      const rec = monthFeeMap.get(s.id);
      if (rec) {
        collected += rec.amountPaid || 0;
      }
      if (s.feeCategory === 'exempt') {
        exemptCount++;
      } else {
        const paid = rec?.amountPaid || 0;
        pending += Math.max(0, (s.monthlyFee || 0) - paid);
      }
    });

    return { expected, collected, pending, exemptCount };
  }, [students, monthFeeMap]);

  // Handle open payment modal
  const handleOpenPayment = (s: Student, pendingAmount: number) => {
    setPayStudent(s);
    setPayAmount(pendingAmount > 0 ? pendingAmount : s.monthlyFee);
    const rndNum = Math.floor(1000 + Math.random() * 9000);
    setReceiptNo(`REC-${selectedMonth.slice(5)}-${rndNum}`);
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setPaymentMethod('cash');
    setPaymentNotes('');
    setIsPaymentModalOpen(true);
  };

  // Submit payment
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStudent) return;

    const existing = monthFeeMap.get(payStudent.id);
    const newPayment: FeePayment = {
      id: existing ? existing.id : `fee-${Date.now()}-${payStudent.id}`,
      studentId: payStudent.id,
      month: selectedMonth,
      monthlyFee: payStudent.monthlyFee,
      amountPaid: Number(payAmount),
      status: Number(payAmount) >= payStudent.monthlyFee ? 'paid' : 'unpaid',
      paymentDate,
      receiptNo,
      paymentMethod,
      notes: paymentNotes,
    };

    onRecordPayment(newPayment);
    setIsPaymentModalOpen(false);

    // Prompt receipt preview
    setReceiptStudent(payStudent);
    setReceiptRecord(newPayment);
  };

  // Send WhatsApp Fee reminder
  const handleSendFeeReminder = (item: typeof ledgerData[0]) => {
    const s = item.student;
    let msg = `*السلام علیکم ورحمۃ اللہ وبرکاتہ*\n`;
    msg += `محترم جناب *${s.fatherNameUrdu || s.fatherName}* صاحب!\n`;
    msg += `امید ہے آپ بخیر ہوں گے۔ *${madrasa.nameUrdu}* کی جانب سے آپ کے صاحبزادے *${s.nameUrdu || s.name}* (داخلہ نمبر: ${s.admissionNo}) کی ماہانہ فیس برائے ماہ ${selectedMonth} کی یاد دہانی:\n\n`;
    msg += `🔹 *ماہانہ فیس:* Rs. ${item.monthlyFee}\n`;
    msg += `🔹 *وصول شدہ رقم:* Rs. ${item.amountPaid}\n`;
    msg += `⚠️ *بقایا واجب الادا رقم:* Rs. ${item.pendingAmount}\n\n`;
    msg += `گزارش ہے کہ بقایا فیس برائے مہربانی دفتر جامعہ میں جمع فرما کر رسید حاصل فرمائیں۔\n`;
    msg += `*${madrasa.nameUrdu}*\nرابطہ: ${madrasa.phone}`;

    openWhatsApp(s.guardianPhone, msg);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-nastaliq">
            {isUrdu ? 'فیس رجسٹر اور بقایا جات کا نظام' : 'Fee Ledger & Outstanding Dues'}
          </h1>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'طلباء کی ماہانہ فیس کا ریکارڈ، وصولی، فیس سلپ / رسید اور واجبات کی وصولی'
              : 'Monthly fee collection, balance tracking, and voucher slips'}
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">{isUrdu ? 'ماہ:' : 'Month:'}</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value="2026-11">نومبر 2026ء / جمادی الاول 1447ھ</option>
            <option value="2026-10">اکتوبر 2026ء / ربیع الثانی 1447ھ</option>
            <option value="2026-09">ستمبر 2026ء / ربیع الاول 1447ھ</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs">{isUrdu ? 'کل قابلِ وصول فیس' : 'Expected Fees'}</div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            Rs. {totals.expected.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {students.length} {isUrdu ? 'طلباء' : 'students'}
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl shadow-xs">
          <div className="text-emerald-800 text-xs font-medium">{isUrdu ? 'وصول شدہ فیس' : 'Collected Fees'}</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-950">
            Rs. {totals.collected.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
            {totals.expected > 0 ? Math.round((totals.collected / totals.expected) * 100) : 0}% {isUrdu ? 'وصولی مکمل' : 'rate'}
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl shadow-xs">
          <div className="text-rose-800 text-xs font-medium">{isUrdu ? 'بقایا واجبات' : 'Pending Dues'}</div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-950">
            Rs. {totals.pending.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-rose-700">
            {ledgerData.filter((i) => i.pendingAmount > 0).length} {isUrdu ? 'طلباء کے ذمے' : 'students owing'}
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl shadow-xs">
          <div className="text-amber-800 text-xs font-medium">{isUrdu ? 'مستحقِ زکوٰۃ / معاف' : 'Exempt / Zakat'}</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-950">
            {totals.exemptCount}
          </div>
          <div className="mt-1 text-[11px] text-amber-700">
            {isUrdu ? 'مفت تعلیم و کفالت' : 'Fully sponsored'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          >
            <option value="all">{isUrdu ? 'تمام اسٹیٹس (ادا و بقایا)' : 'All Status'}</option>
            <option value="paid">{isUrdu ? 'مکمل ادا شدہ' : 'Paid'}</option>
            <option value="unpaid">{isUrdu ? 'غیر ادا شدہ / بقایا' : 'Pending / Unpaid'}</option>
            <option value="exempt">{isUrdu ? 'معاف / مستحق وظیفہ' : 'Exempt / Zakat'}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          >
            <option value="all">{isUrdu ? 'تمام کلاسز' : 'All Classes'}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {isUrdu ? c.nameUrdu : c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1 lg:col-span-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={isUrdu ? 'طالب علم کا نام یا داخلہ نمبر...' : 'Search student...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 font-nastaliq">
            {isUrdu ? 'فیس رجسٹر کی تفصیل' : 'Monthly Fee Sheet'} ({ledgerData.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">{selectedMonth}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-3 px-4 text-right">{isUrdu ? 'طالب علم' : 'Student'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'کلاس' : 'Class'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'ماہانہ فیس' : 'Monthly Fee'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'وصول شدہ' : 'Paid Amount'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'بقایا واجبات' : 'Balance Due'}</th>
                <th className="py-3 px-3 text-right">{isUrdu ? 'اسٹیٹس' : 'Status'}</th>
                <th className="py-3 px-4 text-center">{isUrdu ? 'کارروائی' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    {isUrdu ? 'کوئی ریکارڈ نہیں ملا۔' : 'No records found.'}
                  </td>
                </tr>
              ) : (
                ledgerData.map((item) => {
                  const s = item.student;
                  const cls = classes.find((c) => c.id === s.classId);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="text-right hover:text-emerald-800 focus:outline-none"
                        >
                          <div className="font-bold text-slate-900 font-nastaliq text-sm">
                            {isUrdu ? s.nameUrdu : s.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {s.admissionNo} · ولد {isUrdu ? s.fatherNameUrdu : s.fatherName}
                          </div>
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-600 font-medium">
                          {isUrdu ? cls?.nameUrdu : cls?.name}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono tabular-nums font-bold text-slate-800">
                        Rs. {item.monthlyFee.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 font-mono tabular-nums font-semibold text-emerald-800">
                        Rs. {item.amountPaid.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 font-mono tabular-nums font-bold">
                        {item.pendingAmount > 0 ? (
                          <span className="text-rose-600">
                            Rs. {item.pendingAmount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {item.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            {isUrdu ? 'ادا شدہ' : 'Paid'}
                          </span>
                        ) : item.status === 'exempt' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {isUrdu ? 'معاف / وظیفہ' : 'Exempt'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <Clock className="w-3 h-3" />
                            {isUrdu ? 'بقایا واجبات' : 'Pending'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Record Payment Button */}
                          <button
                            onClick={() => handleOpenPayment(s, item.pendingAmount)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                          >
                            {isUrdu ? 'وصولی درج کریں' : 'Collect Fee'}
                          </button>

                          {/* Print Receipt Slip if paid */}
                          {item.feeRecord && item.feeRecord.amountPaid > 0 && (
                            <button
                              onClick={() => {
                                setReceiptStudent(s);
                                setReceiptRecord(item.feeRecord || null);
                              }}
                              className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors"
                              title={isUrdu ? 'رسید / فیس سلپ دیکھیں' : 'View Receipt'}
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* WhatsApp Reminder if pending */}
                          {item.pendingAmount > 0 && (
                            <button
                              onClick={() => handleSendFeeReminder(item)}
                              className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                              title={isUrdu ? 'واٹس ایپ یاد دہانی بھیجیں' : 'Send WhatsApp Reminder'}
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Recording Modal */}
      {isPaymentModalOpen && payStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold font-nastaliq text-emerald-900">
                  {isUrdu ? 'ماہانہ فیس کی وصولی درج کریں' : 'Record Fee Payment'}
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                  {payStudent.nameUrdu} ({payStudent.admissionNo})
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'وصول شدہ رقم (روپے) *' : 'Amount Paid (PKR) *'}
                </label>
                <input
                  required
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base font-mono font-bold text-emerald-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'رسید نمبر *' : 'Receipt # *'}
                  </label>
                  <input
                    required
                    type="text"
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isUrdu ? 'تاریخ وصولی *' : 'Payment Date *'}
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'طریقہ ادائیگی' : 'Payment Mode'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as FeePayment['paymentMethod'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                >
                  <option value="cash">{isUrdu ? 'نقدی (Cash In Office)' : 'Cash'}</option>
                  <option value="easypaisa">{isUrdu ? 'ایزی پیسہ / جاز کیش (Mobile Wallet)' : 'EasyPaisa / JazzCash'}</option>
                  <option value="bank">{isUrdu ? 'بینک ٹرانسفر (Online Transfer)' : 'Bank Transfer'}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isUrdu ? 'اضافی نوٹ / تفصیل' : 'Payment Notes'}
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: والد صاحب نے نقد جمع کروائی' : 'e.g. Paid in cash by father'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm"
                >
                  {isUrdu ? 'رسید جاری کریں' : 'Save & Issue Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Fee Receipt Slip Modal */}
      {receiptStudent && receiptRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-emerald-800 my-8 print-card">
            {/* Seminary Header for Receipt */}
            <div className="text-center pb-4 border-b-2 border-emerald-800">
              <div className="text-xs text-emerald-800 font-bold tracking-widest font-sans-modern">
                ﷽
              </div>
              <h2 className="text-xl font-bold font-nastaliq text-emerald-950 mt-1">
                {madrasa.nameUrdu}
              </h2>
              <div className="text-[11px] text-slate-600 font-medium">
                {madrasa.branch} · فون: {madrasa.phone}
              </div>
              <div className="inline-block mt-2 px-3 py-0.5 bg-emerald-800 text-white rounded text-xs font-bold tracking-wider">
                {isUrdu ? 'ماہانہ فیس کی باضابطہ رسید' : 'OFFICIAL FEE RECEIPT'}
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-slate-200 font-mono">
              <div>
                <span className="text-slate-500">{isUrdu ? 'رسید نمبر:' : 'Receipt #:'}</span>{' '}
                <span className="font-bold text-slate-900">{receiptRecord.receiptNo || 'REC-001'}</span>
              </div>
              <div className="text-left">
                <span className="text-slate-500">{isUrdu ? 'تاریخ:' : 'Date:'}</span>{' '}
                <span className="font-bold text-slate-900">{receiptRecord.paymentDate}</span>
              </div>
            </div>

            {/* Student & Fee details */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{isUrdu ? 'نام طالب علم:' : 'Student Name:'}</span>
                <span className="font-bold font-nastaliq text-sm text-slate-900">
                  {receiptStudent.nameUrdu} ({receiptStudent.admissionNo})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isUrdu ? 'ولدیت:' : "Father's Name:"}</span>
                <span className="font-medium text-slate-800">{receiptStudent.fatherNameUrdu}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isUrdu ? 'کلاس / درجہ:' : 'Class:'}</span>
                <span className="font-medium text-slate-800">
                  {classes.find((c) => c.id === receiptStudent.classId)?.nameUrdu || 'شعبہ حفظ'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isUrdu ? 'برائے ماہ:' : 'For Month:'}</span>
                <span className="font-bold text-emerald-800">{receiptRecord.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isUrdu ? 'طریقہ ادائیگی:' : 'Payment Mode:'}</span>
                <span className="font-medium text-slate-800">{receiptRecord.paymentMethod?.toUpperCase()}</span>
              </div>

              {/* Amount Box */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 mt-3 flex justify-between items-center">
                <span className="font-bold text-emerald-900 text-xs">
                  {isUrdu ? 'وصول شدہ کل رقم:' : 'Total Amount Paid:'}
                </span>
                <span className="text-xl font-bold font-mono text-emerald-950">
                  Rs. {receiptRecord.amountPaid.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
              <div className="text-center">
                <div className="w-24 border-b border-slate-400 mb-1" />
                <span>{isUrdu ? 'دستخط محاسب / کیشئر' : 'Cashier Signature'}</span>
              </div>
              <div className="text-center">
                <div className="w-24 border-b border-slate-400 mb-1" />
                <span>{isUrdu ? 'مہر دفتر جامعہ' : 'Madrasa Seal'}</span>
              </div>
            </div>

            {/* Action buttons (hidden on print) */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end gap-2 no-print">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>{isUrdu ? 'رسید پرنٹ کریں' : 'Print Slip'}</span>
              </button>
              <button
                onClick={() => {
                  setReceiptStudent(null);
                  setReceiptRecord(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
