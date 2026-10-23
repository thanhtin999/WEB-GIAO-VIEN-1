import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  FileText,
  Save,
  Printer,
  Download,
  Plus,
  Minus,
  Search,
  ArrowUpDown,
  History,
  AlertCircle,
  CheckCircle2,
  Filter,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GradeRecord } from '../../types';

export const GradebookModule: React.FC = () => {
  const {
    grades,
    updateGradeCell,
    addTxColumn,
    removeTxColumn,
    txColumnCount,
    auditLogs,
    exportGradebookExcel,
    classes,
    selectedClassCode,
    setSelectedClassCode,
    selectedAcademicYear,
    setSelectedAcademicYear,
    selectedSemester,
    setSelectedSemester,
    teacherInfo,
    setOpenStudentProfileId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'stt' | 'tb' | 'name'>('stt');
  const [sortAsc, setSortAsc] = useState(true);
  const [showAuditDrawer, setShowAuditDrawer] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);

  // Filter grades for current class and semester
  const currentClassGrades = grades.filter(
    (g) => g.classCode === selectedClassCode && g.semester === selectedSemester
  );

  // Sorting
  const sortedGrades = [...currentClassGrades]
    .filter((g) =>
      searchTerm
        ? g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortField === 'tb') {
        const tbA = a.tbScore ?? -1;
        const tbB = b.tbScore ?? -1;
        return sortAsc ? tbA - tbB : tbB - tbA;
      }
      if (sortField === 'name') {
        return sortAsc
          ? a.fullName.localeCompare(b.fullName, 'vi')
          : b.fullName.localeCompare(a.fullName, 'vi');
      }
      return sortAsc ? a.studentCode.localeCompare(b.studentCode) : b.studentCode.localeCompare(a.studentCode);
    });

  // Grade Statistics
  const validScores = currentClassGrades
    .map((g) => g.tbScore)
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));

  const classAvg = validScores.length > 0
    ? (validScores.reduce((acc, v) => acc + v, 0) / validScores.length).toFixed(1).replace('.', ',')
    : '—';

  const maxScore = validScores.length > 0 ? Math.max(...validScores).toFixed(1).replace('.', ',') : '—';
  const minScore = validScores.length > 0 ? Math.min(...validScores).toFixed(1).replace('.', ',') : '—';

  // Distribution
  const distGioi = currentClassGrades.filter((g) => (g.tbScore ?? 0) >= 8.0).length;
  const distKha = currentClassGrades.filter((g) => (g.tbScore ?? 0) >= 6.5 && (g.tbScore ?? 0) < 8.0).length;
  const distDat = currentClassGrades.filter((g) => (g.tbScore ?? 0) >= 5.0 && (g.tbScore ?? 0) < 6.5).length;
  const distChuaDat = currentClassGrades.filter((g) => g.tbScore !== null && (g.tbScore ?? 0) < 5.0).length;

  const handlePrint = () => {
    window.print();
  };

  const handleManualSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* ======================================================== */}
      {/* TOP CONTROLS & FORMULA BANNER                           */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1565D8] text-white flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2545] flex items-center gap-2">
              Sổ điểm điện tử môn Ngữ văn – Lớp {selectedClassCode}
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Chính thức
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Giáo viên: {teacherInfo.name} • {selectedAcademicYear} • {selectedSemester === 'HK1' ? 'Học kỳ 1' : 'Học kỳ 2'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add / Remove TX Column */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <span className="px-2 text-slate-500">Cột TX ({txColumnCount}):</span>
            <button
              onClick={addTxColumn}
              className="p-1.5 hover:bg-white rounded-lg text-blue-700 transition"
              title="Thêm cột điểm Thường xuyên (TX)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => removeTxColumn(txColumnCount - 1)}
              disabled={txColumnCount <= 1}
              className="p-1.5 hover:bg-white rounded-lg text-rose-700 disabled:opacity-40 transition"
              title="Bớt cột điểm Thường xuyên (TX)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => exportGradebookExcel(selectedClassCode)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In sổ điểm A4</span>
          </button>

          <button
            onClick={() => setShowAuditDrawer(!showAuditDrawer)}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-1.5 border border-purple-200 shadow-xs transition"
          >
            <History className="w-4 h-4 text-purple-600" />
            <span>Lịch sử sửa ({auditLogs.length})</span>
          </button>

          <button
            onClick={handleManualSave}
            className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Lưu sổ điểm</span>
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="p-3 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Toàn bộ điểm và công thức tính toán đã được lưu và đồng bộ thành công!</span>
        </div>
      )}

      {/* Formula & Policy Note */}
      <div className="bg-[#EBF3FF] border border-blue-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-[#0B2545] no-print">
        <div className="flex items-center gap-2">
          <span className="font-bold bg-[#1565D8] text-white px-2 py-0.5 rounded">Công thức tính điểm:</span>
          <span className="font-mono text-[13px] font-semibold text-blue-900">
            ĐTB HK = (Tổng điểm TX + 2 × Điểm GK + 3 × Điểm CK) / (Số điểm TX + 5)
          </span>
        </div>
        <div className="text-slate-600 font-medium">
          *Làm tròn 1 chữ số thập phân. Chỉ tính khi đủ các cột bắt buộc. Ô trống không mặc định bằng 0.
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 no-print">
        <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Trung bình lớp</span>
          <p className="text-xl font-bold text-[#1565D8] mt-0.5">{classAvg}</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Điểm cao nhất</span>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{maxScore}</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Điểm thấp nhất</span>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{minScore}</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Giỏi (≥ 8.0)</span>
          <p className="text-xl font-bold text-purple-700 mt-0.5">
            {distGioi} <span className="text-xs text-slate-400 font-normal">học sinh</span>
          </p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Khá (6.5 – 7.9)</span>
          <p className="text-xl font-bold text-blue-700 mt-0.5">
            {distKha} <span className="text-xs text-slate-400 font-normal">học sinh</span>
          </p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Đạt (5.0 – 6.4)</span>
          <p className="text-xl font-bold text-slate-700 mt-0.5">
            {distDat} <span className="text-xs text-slate-400 font-normal">học sinh</span>
          </p>
        </div>
      </div>

      {/* Class & Filter Selector Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-3 no-print">
        {/* Class Selection Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Chọn lớp:</span>
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClassCode(c.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedClassCode === c.code
                  ? 'bg-[#1565D8] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lớp {c.code}
            </button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm học sinh trong lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 w-52 sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
          </div>

          <button
            onClick={() => {
              setSortField('tb');
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Xếp theo ĐTB {sortField === 'tb' && (sortAsc ? '↑' : '↓')}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SPREADSHEET-STYLE GRADEBOOK TABLE                       */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        {/* Printable Official Header */}
        <div className="hidden print-only p-6 text-center border-b border-gray-300">
          <h2 className="text-lg font-bold uppercase tracking-wider">TRƯỜNG THCS PHAN BỘI CHÂU</h2>
          <h1 className="text-xl font-bold uppercase mt-1">BẢNG ĐIỂM TỔNG HỢP MÔN NGỮ VĂN</h1>
          <p className="text-sm mt-1">
            Lớp: <strong>{selectedClassCode}</strong> • {selectedSemester === 'HK1' ? 'Học kỳ I' : 'Học kỳ II'} • Năm học: 2026–2027
          </p>
          <p className="text-xs text-gray-600 mt-0.5">Giáo viên phụ trách: Dương Thành Tín</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#EBF3FF] text-[#132B50] font-bold border-b border-blue-200">
                <th className="py-3 px-2 text-center w-12 border-r border-blue-100">STT</th>
                <th className="py-3 px-3 w-24 border-r border-blue-100">Mã HS</th>
                <th className="py-3 px-3 min-w-[160px] border-r border-blue-100">Họ và tên</th>

                {/* Flexible TX Columns */}
                {Array.from({ length: txColumnCount }).map((_, i) => (
                  <th
                    key={i}
                    className="py-3 px-1 text-center w-16 bg-blue-100/50 border-r border-blue-200 text-[#0B2545]"
                  >
                    TX{i + 1}
                  </th>
                ))}

                {/* Exam Columns */}
                <th className="py-3 px-2 text-center w-20 bg-blue-200/50 border-r border-blue-200 text-[#0B2545]">
                  Giữa kỳ (GK)
                </th>
                <th className="py-3 px-2 text-center w-20 bg-blue-300/40 border-r border-blue-200 text-[#0B2545]">
                  Cuối kỳ (CK)
                </th>

                {/* Calculated Average */}
                <th className="py-3 px-2 text-center w-20 bg-[#1565D8] text-white border-r border-blue-600 font-bold">
                  ĐTB HK
                </th>

                <th className="py-3 px-3 text-center w-24 border-r border-blue-100">Xếp loại</th>
                <th className="py-3 px-3 min-w-[140px] border-r border-blue-100">Ghi chú</th>
                <th className="py-3 px-2 text-center w-16 no-print">Hồ sơ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {sortedGrades.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className="hover:bg-blue-50/60 transition group"
                >
                  <td className="py-2.5 px-2 text-center text-slate-400 font-semibold border-r border-slate-100">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#1565D8] border-r border-slate-100">
                    {rec.studentCode}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#0B2545] border-r border-slate-100">
                    {rec.fullName}
                  </td>

                  {/* TX Score Inputs */}
                  {Array.from({ length: txColumnCount }).map((_, i) => {
                    const val = rec.txScores[i];
                    return (
                      <td
                        key={i}
                        className="p-1 text-center border-r border-slate-200 bg-slate-50/30 group-hover:bg-transparent"
                      >
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={val !== null && val !== undefined ? val : ''}
                          onChange={(e) => updateGradeCell(rec.id, 'tx', i, e.target.value)}
                          placeholder="—"
                          className="w-12 text-center py-1 font-bold rounded-lg border border-transparent hover:border-blue-300 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                        />
                      </td>
                    );
                  })}

                  {/* GK Score Input */}
                  <td className="p-1 text-center border-r border-slate-200 bg-blue-50/20 group-hover:bg-transparent">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rec.gkScore !== null && rec.gkScore !== undefined ? rec.gkScore : ''}
                      onChange={(e) => updateGradeCell(rec.id, 'gk', e.target.value)}
                      placeholder="—"
                      className="w-14 text-center py-1 font-bold text-blue-900 rounded-lg border border-transparent hover:border-blue-300 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                    />
                  </td>

                  {/* CK Score Input */}
                  <td className="p-1 text-center border-r border-slate-200 bg-indigo-50/20 group-hover:bg-transparent">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rec.ckScore !== null && rec.ckScore !== undefined ? rec.ckScore : ''}
                      onChange={(e) => updateGradeCell(rec.id, 'ck', e.target.value)}
                      placeholder="—"
                      className="w-14 text-center py-1 font-bold text-indigo-900 rounded-lg border border-transparent hover:border-blue-300 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                    />
                  </td>

                  {/* Calculated TB Score */}
                  <td className="py-2.5 px-2 text-center font-bold text-sm bg-blue-50/50 border-r border-slate-200 text-[#1565D8]">
                    {rec.tbScore !== null && rec.tbScore !== undefined
                      ? rec.tbScore.toFixed(1).replace('.', ',')
                      : '—'}
                  </td>

                  {/* Classification */}
                  <td className="py-2.5 px-3 text-center border-r border-slate-100">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        rec.classification === 'Xuất sắc'
                          ? 'bg-purple-100 text-purple-800'
                          : rec.classification === 'Giỏi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.classification === 'Khá'
                          ? 'bg-blue-100 text-blue-800'
                          : rec.classification === 'Đạt'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rec.classification || 'Chưa xếp'}
                    </span>
                  </td>

                  {/* Note */}
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] border-r border-slate-100 truncate max-w-[150px]">
                    {rec.notes || '—'}
                  </td>

                  {/* Action: Open Profile */}
                  <td className="py-2.5 px-2 text-center no-print">
                    <button
                      onClick={() => setOpenStudentProfileId(rec.studentId)}
                      className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                      title="Xem hồ sơ chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Printable Footer with Signatures */}
        <div className="hidden print-only p-8 mt-6 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="font-bold uppercase">DUYỆT CỦA BAN GIÁM HIỆU</p>
            <p className="text-gray-500 italic mt-1">(Ký và ghi rõ họ tên)</p>
          </div>
          <div>
            <p className="font-bold uppercase">GIÁO VIÊN BỘ MÔN</p>
            <p className="text-gray-500 italic mt-1">Đã ký xác nhận</p>
            <p className="font-bold text-sm mt-16">{teacherInfo.name}</p>
          </div>
        </div>

        {/* Table Bottom Status */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
          <span>Tổng số học sinh lớp {selectedClassCode}: <strong>{sortedGrades.length}</strong></span>
          <span>Điểm TB toàn lớp: <strong className="text-[#1565D8] font-bold text-sm">{classAvg}</strong></span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* AUDIT LOG DRAWER                                         */}
      {/* ======================================================== */}
      {showAuditDrawer && (
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-purple-200 animate-in fade-in space-y-3 no-print">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-[#0B2545]">
                Lịch sử chỉnh sửa điểm & Kiểm toán hệ thống
              </h3>
            </div>
            <button
              onClick={() => setShowAuditDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Đóng
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Mọi thao tác chỉnh sửa điểm đều được hệ thống tự động lưu vết với đầy đủ định danh người sửa, thời gian và giá trị trước / sau:
          </p>

          <div className="max-h-56 overflow-y-auto space-y-2 text-xs">
            {auditLogs.length === 0 ? (
              <p className="text-slate-400 italic">Chưa có lịch sử sửa đổi nào.</p>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-[#0B2545]">
                      {log.studentName} ({log.studentCode})
                    </span>{' '}
                    • <span className="text-purple-700 font-semibold">{log.field}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Giá trị cũ: <strong className="text-rose-600">{log.oldValue}</strong> ➔ Mới:{' '}
                      <strong className="text-emerald-600">{log.newValue}</strong>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 shrink-0">
                    <div>{log.timestamp}</div>
                    <div className="text-slate-600 font-semibold">{log.modifiedBy}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
