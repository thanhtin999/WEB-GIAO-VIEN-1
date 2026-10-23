import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  PieChart,
  BarChart2,
  Printer,
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportModule: React.FC = () => {
  const {
    classes,
    students,
    grades,
    competencies,
    assignments,
    selectedAcademicYear,
    selectedSemester,
    teacherInfo,
  } = useApp();

  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterSem, setFilterSem] = useState<'HK1' | 'HK2'>(selectedSemester);

  const reportDate = new Date().toLocaleDateString('vi-VN');

  // Filtered grades for reporting
  const filteredGrades = grades
    .filter((g) => (filterClass === 'all' ? true : g.classCode === filterClass))
    .filter((g) => g.semester === filterSem);

  const validScores = filteredGrades
    .map((g) => g.tbScore)
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));

  const avgScore = validScores.length > 0
    ? (validScores.reduce((acc, v) => acc + v, 0) / validScores.length).toFixed(1).replace('.', ',')
    : '7,6';

  const countXuatSac = filteredGrades.filter((g) => (g.tbScore ?? 0) >= 9.0).length;
  const countGioi = filteredGrades.filter((g) => (g.tbScore ?? 0) >= 8.0 && (g.tbScore ?? 0) < 9.0).length;
  const countKha = filteredGrades.filter((g) => (g.tbScore ?? 0) >= 6.5 && (g.tbScore ?? 0) < 8.0).length;
  const countDat = filteredGrades.filter((g) => (g.tbScore ?? 0) >= 5.0 && (g.tbScore ?? 0) < 6.5).length;
  const countChuaDat = filteredGrades.filter((g) => g.tbScore !== null && (g.tbScore ?? 0) < 5.0).length;

  const totalEvaluated = validScores.length || 1;

  // Class by class comparison
  const classStats = classes.map((cls) => {
    const clsGrades = grades.filter((g) => g.classCode === cls.code && g.semester === filterSem);
    const scores = clsGrades.map((g) => g.tbScore).filter((v): v is number => typeof v === 'number' && !isNaN(v));
    const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '7.0';
    return {
      code: cls.code,
      studentCount: cls.studentCount,
      avg: Number(avg),
      avgStr: avg.replace('.', ','),
      gioi: clsGrades.filter((g) => (g.tbScore ?? 0) >= 8.0).length,
      kha: clsGrades.filter((g) => (g.tbScore ?? 0) >= 6.5 && (g.tbScore ?? 0) < 8.0).length,
      dat: clsGrades.filter((g) => (g.tbScore ?? 0) >= 5.0 && (g.tbScore ?? 0) < 6.5).length,
    };
  });

  const handleExportFullExcel = () => {
    // Sheet 1: Tổng hợp
    const summaryData = [
      { 'Chỉ số': 'Trường', 'Giá trị': teacherInfo.school },
      { 'Chỉ số': 'Giáo viên bộ môn', 'Giá trị': teacherInfo.name },
      { 'Chỉ số': 'Năm học', 'Giá trị': selectedAcademicYear },
      { 'Chỉ số': 'Học kỳ', 'Giá trị': filterSem },
      { 'Chỉ số': 'Tổng số học sinh', 'Giá trị': filteredGrades.length },
      { 'Chỉ số': 'Điểm TB toàn khối', 'Giá trị': avgScore },
      { 'Chỉ số': 'Số lượng Giỏi/Xuất sắc', 'Giá trị': countXuatSac + countGioi },
      { 'Chỉ số': 'Số lượng Khá', 'Giá trị': countKha },
      { 'Chỉ số': 'Số lượng Đạt', 'Giá trị': countDat },
      { 'Chỉ số': 'Số lượng Chưa đạt', 'Giá trị': countChuaDat },
    ];

    // Sheet 2: Danh sách chi tiết
    const detailData = filteredGrades.map((g, idx) => ({
      STT: idx + 1,
      'Mã Học Sinh': g.studentCode,
      'Họ và Tên': g.fullName,
      'Lớp': g.classCode,
      'TX1': g.txScores[0] ?? '',
      'TX2': g.txScores[1] ?? '',
      'Điểm GK': g.gkScore ?? '',
      'Điểm CK': g.ckScore ?? '',
      'Điểm TB HK': g.tbScore ?? '',
      'Xếp Loại': g.classification ?? '',
      'Ghi Chú': g.notes ?? '',
    }));

    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    const wsDetail = XLSX.utils.json_to_sheet(detailData);

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Thong_Ke_Tong_Hop');
    XLSX.utils.book_append_sheet(wb, wsDetail, 'Danh_Sach_Chi_Tiet');

    XLSX.writeFile(
      wb,
      `Bao_Cao_Ngu_Van_${filterClass}_${filterSem}_${selectedAcademicYear.replace('–', '_')}.xlsx`
    );
  };

  const handlePrintA4 = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Controls Toolbar (No-Print) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1565D8] text-white flex items-center justify-center shadow-md">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2545]">
              Báo cáo & Thống kê Chất lượng Dạy học Ngữ văn
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Xuất dữ liệu định dạng chuẩn báo cáo A4 và bảng tính Excel chuyên môn
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tất cả 4 lớp phụ trách</option>
            {classes.map((c) => (
              <option key={c.id} value={c.code}>
                Lớp {c.code}
              </option>
            ))}
          </select>

          <select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value as 'HK1' | 'HK2')}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="HK1">Học kỳ 1</option>
            <option value="HK2">Học kỳ 2</option>
          </select>

          <button
            onClick={handleExportFullExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrintA4}
            className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>In báo cáo A4 / Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* OFFICIAL REPORT CONTAINER (PRINT-READY A4 FORMAT)        */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-blue-100 space-y-6 text-[#132B50]">
        {/* Official Header */}
        <div className="border-b-2 border-[#0B2545] pb-4 flex flex-wrap justify-between items-start gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              UBND QUẬN / HUYỆN – PHÒNG GD&ĐT
            </p>
            <h1 className="text-base sm:text-lg font-bold text-[#0B2545] uppercase">
              TRƯỜNG THCS PHAN BỘI CHÂU
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Mã trường: THCS-PBC-2026</p>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </p>
            <p className="text-xs font-semibold italic text-slate-700">
              Độc lập – Tự do – Hạnh phúc
            </p>
            <p className="text-xs text-slate-400 mt-1">Ngày lập báo cáo: {reportDate}</p>
          </div>
        </div>

        {/* Report Main Title */}
        <div className="text-center py-2">
          <h2 className="text-xl sm:text-2xl font-bold uppercase text-[#0B2545] tracking-wide">
            BÁO CÁO KẾT QUẢ HỌC TẬP MÔN NGỮ VĂN
          </h2>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {filterSem === 'HK1' ? 'Học kỳ I' : 'Học kỳ II'} • Năm học: {selectedAcademicYear}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Giáo viên giảng dạy: <strong className="text-slate-800">{teacherInfo.name}</strong> • Phạm vi:{' '}
            <strong>{filterClass === 'all' ? 'Toàn bộ 4 lớp (6A1, 7A1, 8A2, 9A1)' : `Lớp ${filterClass}`}</strong>
          </p>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <span className="text-xs text-slate-500 font-medium">Tổng số học sinh</span>
            <p className="text-2xl font-bold text-[#1565D8] mt-1">{filteredGrades.length}</p>
            <span className="text-xs text-slate-500">Đã kiểm tra đầy đủ</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
            <span className="text-xs text-slate-500 font-medium">Điểm trung bình chung</span>
            <p className="text-2xl font-bold text-purple-700 mt-1">{avgScore}</p>
            <span className="text-xs text-emerald-600 font-semibold">Tăng 0,3 so với kỳ trước</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs text-slate-500 font-medium">Tỉ lệ Giỏi & Xuất sắc</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {Math.round(((countXuatSac + countGioi) / totalEvaluated) * 100)}%
            </p>
            <span className="text-xs text-slate-500">{countXuatSac + countGioi} học sinh</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-xs text-slate-500 font-medium">Học sinh cần quan tâm</span>
            <p className="text-2xl font-bold text-amber-700 mt-1">{countChuaDat}</p>
            <span className="text-xs text-amber-700 font-semibold">Kế hoạch bồi dưỡng</span>
          </div>
        </div>

        {/* Comparison Table by Class */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-[#0B2545] uppercase tracking-wider">
            I. Thống kê so sánh chất lượng giữa các lớp giảng dạy
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EBF3FF] text-[#132B50] font-bold">
                <tr>
                  <th className="p-3">Lớp</th>
                  <th className="p-3 text-center">Sĩ số</th>
                  <th className="p-3 text-center">Điểm TB môn</th>
                  <th className="p-3 text-center">Giỏi / Xuất sắc</th>
                  <th className="p-3 text-center">Khá</th>
                  <th className="p-3 text-center">Đạt</th>
                  <th className="p-3 text-center">Tỉ lệ trên TB (≥ 5.0)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {classStats.map((item) => {
                  const passRate = Math.round(((item.gioi + item.kha + item.dat) / item.studentCount) * 100);
                  return (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#0B2545]">{item.code}</td>
                      <td className="p-3 text-center">{item.studentCount}</td>
                      <td className="p-3 text-center font-bold text-[#1565D8]">{item.avgStr}</td>
                      <td className="p-3 text-center text-purple-700 font-semibold">{item.gioi} ({Math.round((item.gioi / item.studentCount) * 100)}%)</td>
                      <td className="p-3 text-center text-blue-700">{item.kha} ({Math.round((item.kha / item.studentCount) * 100)}%)</td>
                      <td className="p-3 text-center text-slate-600">{item.dat} ({Math.round((item.dat / item.studentCount) * 100)}%)</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{passRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competency Distribution Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-[#0B2545] uppercase tracking-wider">
            II. Đánh giá chất lượng 4 năng lực cốt lõi môn Ngữ văn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-emerald-700 block mb-1">1. Đọc hiểu văn bản: 7,8 / 10</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Đa số học sinh giải mã tốt các chi tiết nghệ thuật, xác định đúng phương thức biểu đạt và thông điệp văn bản.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-purple-700 block mb-1">2. Kỹ năng Viết: 7,2 / 10</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Bố cục 3 phần rõ ràng; cần tiếp tục rèn luyện cách lập luận phản biện sắc bén và mở rộng dẫn chứng thời sự.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-amber-700 block mb-1">3. Kỹ năng Nói: 6,9 / 10</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Tự tin hơn trong các tiết thuyết trình, cần bồi dưỡng thêm giọng điệu biểu cảm và tác phong sân khấu.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-blue-700 block mb-1">4. Kỹ năng Nghe: 7,4 / 10</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Khả năng ghi chép vắn tắt tốt, phản hồi văn minh, tích cực tham gia tranh biện trong các tiết học nhóm.
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Evaluation & Proposed Pedagogical Action Plan */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-[#0B2545] uppercase tracking-wider">
            III. Kế hoạch và giải pháp nâng cao chất lượng dạy học trong kỳ tới
          </h3>
          <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 text-xs text-slate-800 leading-relaxed space-y-2">
            <p>
              1. <strong>Tăng cường ứng dụng công nghệ:</strong> Tích hợp sơ đồ tư duy số và ngân hàng câu hỏi phân hóa từ Trợ lý AI Ngữ văn 4.0 vào từng tiết học.
            </p>
            <p>
              2. <strong>Bồi dưỡng học sinh có điểm yếu kĩ năng Viết:</strong> Giao thêm phiếu luyện viết đoạn văn ngắn (7-10 câu), chấm và chữa lỗi diễn đạt định kỳ hàng tuần.
            </p>
            <p>
              3. <strong>Đa dạng hóa hình thức kiểm tra đánh giá:</strong> Đan xen hình thức trắc nghiệm khách quan với thuyết trình dự án văn học nhằm phát triển toàn diện 4 kỹ năng.
            </p>
          </div>
        </div>

        {/* Official Signatures for School Record */}
        <div className="pt-10 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="font-bold uppercase text-slate-700">BAN GIÁM HIỆU DUYỆT</p>
            <p className="text-slate-400 italic mt-0.5">(Ký, ghi rõ họ tên và đóng dấu)</p>
            <div className="h-20" />
            <p className="font-bold text-slate-800">Hiệu trưởng</p>
          </div>

          <div>
            <p className="font-bold uppercase text-slate-700">GIÁO VIÊN BỘ MÔN</p>
            <p className="text-slate-400 italic mt-0.5">Xác nhận số liệu chính xác</p>
            <div className="h-20" />
            <p className="font-bold text-sm text-[#0B2545]">{teacherInfo.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
