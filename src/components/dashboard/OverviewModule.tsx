import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  BarChart2,
  ClipboardCheck,
  Search,
  ChevronRight,
  Send,
  Sparkles,
  Bot,
  Video,
  GitFork,
  FileSpreadsheet,
  FileText,
  Printer,
  Feather,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OverviewModule: React.FC = () => {
  const {
    classes,
    students,
    grades,
    assignments,
    setActiveModule,
    setSelectedClassCode,
    exportGradebookExcel,
    setOpenStudentProfileId,
  } = useApp();

  const [quickClassFilter, setQuickClassFilter] = useState('9A1');
  const [quickSearch, setQuickSearch] = useState('');
  const [quickAiInput, setQuickAiInput] = useState('');
  const [quickAiChat, setQuickAiChat] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: 'Xin chào thầy Dương Thành Tín!\nTôi có thể hỗ trợ gì cho thầy trong dạy học Ngữ văn hôm nay?',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiCollapsed, setIsAiCollapsed] = useState(false);

  // Compute live overview statistics
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const classCodesStr = classes.map((c) => c.code).join(', ');

  // Compute overall average grade
  const validTbList = grades
    .map((g) => g.tbScore)
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));
  const overallAvg = validTbList.length > 0
    ? (validTbList.reduce((acc, v) => acc + v, 0) / validTbList.length).toFixed(1).replace('.', ',')
    : '7,6';

  // Filter grade records for the quick table
  const displayedGrades = grades
    .filter((g) => g.classCode === quickClassFilter)
    .filter((g) =>
      quickSearch
        ? g.fullName.toLowerCase().includes(quickSearch.toLowerCase()) ||
          g.studentCode.toLowerCase().includes(quickSearch.toLowerCase())
        : true
    )
    .slice(0, 6);

  // Handle Quick AI Send
  const handleSendQuickAI = async (textToSend?: string) => {
    const message = textToSend || quickAiInput;
    if (!message.trim() || isAiLoading) return;

    setQuickAiChat((prev) => [...prev, { sender: 'user', text: message }]);
    setQuickAiInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await res.json();
      setQuickAiChat((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply || 'Dạ thưa Thầy, em đã tiếp nhận yêu cầu sư phạm Ngữ văn.',
        },
      ]);
    } catch {
      setQuickAiChat((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thưa Thầy, hệ thống gợi ý Thầy có thể sử dụng câu hỏi đọc hiểu mức độ vận dụng cao hoặc sơ đồ tư duy để củng cố bài giảng.',
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ======================================================== */}
      {/* ROW 1: 4 STAT CARDS + 1 LITERARY QUOTE BANNER           */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Tổng số học sinh */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm font-medium text-slate-500">Tổng số học sinh</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-[#0B2545]">{totalStudents}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                ↑ +12
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">So với học kỳ trước</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#E8F1FF] flex items-center justify-center text-[#1565D8]">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Card 2: Số lớp đang phụ trách */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm font-medium text-slate-500">Số lớp đang phụ trách</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-[#0B2545]">{totalClasses}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-semibold">{classCodesStr}</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#E6F8F0] flex items-center justify-center text-[#16A34A]">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: Điểm trung bình môn Ngữ văn */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm font-medium text-slate-500">Điểm trung bình môn Ngữ văn</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-[#0B2545]">{overallAvg}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                ↑ +0,3
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">So với học kỳ trước</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED]">
            <BarChart2 className="w-7 h-7" />
          </div>
        </div>

        {/* Card 4: Bài tập/kiểm tra chưa chấm */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm font-medium text-slate-500">Bài tập/kiểm tra chưa chấm</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-[#0B2545]">12</span>
            </div>
            <p className="text-xs text-amber-600 font-semibold mt-1">Cần hoàn thành</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#FFF4E5] flex items-center justify-center text-[#F59E0B]">
            <ClipboardCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Card 5: Literary Quote Banner (Marcel Proust) */}
        <div className="bg-gradient-to-br from-[#123668] via-[#1A4F8B] to-[#1565D8] rounded-2xl p-4 shadow-sm border border-blue-400/30 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="absolute right-1 -bottom-2 opacity-20 pointer-events-none">
            <Feather className="w-24 h-24 text-cyan-200" />
          </div>
          <p className="text-sm italic font-serif leading-relaxed text-blue-50 drop-shadow">
            “Văn học giúp chúng ta sống nhiều cuộc đời trong một cuộc đời.”
          </p>
          <p className="text-xs text-cyan-200 font-serif mt-2 text-right">
            - Marcel Proust -
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 2: DANH SÁCH LỚP + PHÂN TÍCH NĂNG LỰC + TIẾN ĐỘ BÀI TẬP */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card A: Danh sách lớp học (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#1565D8] text-white flex items-center justify-center text-xs font-bold">
                  ≡
                </div>
                <h3 className="font-bold text-base text-[#0B2545]">Danh sách lớp học</h3>
              </div>
              <button
                onClick={() => setActiveModule('classes')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center"
              >
                Xem tất cả
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#EBF3FF] text-[#132B50] font-bold">
                    <th className="py-2.5 px-3 text-left rounded-l-lg">Lớp</th>
                    <th className="py-2.5 px-3 text-center">Sĩ số</th>
                    <th className="py-2.5 px-3 text-center">Nam</th>
                    <th className="py-2.5 px-3 text-center">Nữ</th>
                    <th className="py-2.5 px-3 text-left rounded-r-lg">GVCN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {classes.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelectedClassCode(c.code);
                        setActiveModule('classes');
                      }}
                      className="hover:bg-blue-50/60 cursor-pointer transition"
                    >
                      <td className="py-2.5 px-3 font-bold text-[#0B2545]">{c.code}</td>
                      <td className="py-2.5 px-3 text-center font-semibold">{c.studentCount}</td>
                      <td className="py-2.5 px-3 text-center">{c.maleCount}</td>
                      <td className="py-2.5 px-3 text-center">{c.femaleCount}</td>
                      <td className="py-2.5 px-3 text-xs text-slate-600 truncate">{c.homeroomTeacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tổng số lớp phụ trách: <strong>{classes.length}</strong></span>
            <span>Tổng sĩ số: <strong>{totalStudents} học sinh</strong></span>
          </div>
        </div>

        {/* Card B: Phân tích năng lực học sinh (Toàn khối) (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#258BFF] text-white flex items-center justify-center text-xs">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-base text-[#0B2545]">
                Phân tích năng lực học sinh <span className="text-xs text-slate-500 font-normal">(Toàn khối)</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* SVG 4-Axis Radar Chart */}
            <div className="sm:col-span-7 flex justify-center py-2">
              <div className="relative w-56 h-56">
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                  {/* Grid diamond rings (Levels 2, 4, 6, 8, 10) */}
                  {[20, 40, 60, 80].map((r, i) => (
                    <polygon
                      key={i}
                      points={`100,${100 - r} ${100 + r},100 100,${100 + r} ${100 - r},100`}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Outer border diamond (Level 10) */}
                  <polygon
                    points="100,20 180,100 100,180 20,100"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1.2"
                  />
                  {/* Axis lines */}
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#CBD5E1" strokeWidth="1" />

                  {/* Level labels on vertical axis */}
                  <text x="103" y="24" fontSize="8" fill="#94A3B8">10</text>
                  <text x="103" y="44" fontSize="8" fill="#94A3B8">8</text>
                  <text x="103" y="64" fontSize="8" fill="#94A3B8">6</text>
                  <text x="103" y="84" fontSize="8" fill="#94A3B8">4</text>
                  <text x="103" y="104" fontSize="8" fill="#94A3B8">2</text>

                  {/* Radar Polygon: Đọc hiểu 7.8 (top), Viết 7.2 (right), Nói 6.9 (bottom), Nghe 7.4 (left) */}
                  {/* r = score * 8 (since 10 score = 80px radius) */}
                  {/* Top (100, 100 - 7.8*8 = 100 - 62.4 = 37.6) */}
                  {/* Right (100 + 7.2*8 = 157.6, 100) */}
                  {/* Bottom (100, 100 + 6.9*8 = 155.2) */}
                  {/* Left (100 - 7.4*8 = 40.8, 100) */}
                  <polygon
                    points="100,37.6 157.6,100 100,155.2 40.8,100"
                    fill="#38BDF8"
                    fillOpacity="0.25"
                    stroke="#1565D8"
                    strokeWidth="2.5"
                  />
                  {/* Radar Data Points */}
                  <circle cx="100" cy="37.6" r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="157.6" cy="100" r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="100" cy="155.2" r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="40.8" cy="100" r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />

                  {/* Axis Text Labels */}
                  <text x="100" y="10" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Đọc hiểu
                  </text>
                  <text x="195" y="104" textAnchor="start" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Viết
                  </text>
                  <text x="100" y="196" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Nói
                  </text>
                  <text x="5" y="104" textAnchor="end" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Nghe
                  </text>
                </svg>
              </div>
            </div>

            {/* Scores Legend */}
            <div className="sm:col-span-5 space-y-2.5 text-sm">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Điểm trung bình theo kĩ năng
              </p>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="font-semibold text-slate-700">Đọc hiểu</span>
                </div>
                <span className="font-bold text-[#0B2545] text-base">7,8</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
                  <span className="font-semibold text-slate-700">Viết</span>
                </div>
                <span className="font-bold text-[#0B2545] text-base">7,2</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                  <span className="font-semibold text-slate-700">Nói</span>
                </div>
                <span className="font-bold text-[#0B2545] text-base">6,9</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
                  <span className="font-semibold text-slate-700">Nghe</span>
                </div>
                <span className="font-bold text-[#0B2545] text-base">7,4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card C: Tiến độ hoàn thành bài tập (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#16A34A] text-white flex items-center justify-center text-xs">
                  ✓
                </div>
                <h3 className="font-bold text-base text-[#0B2545]">Tiến độ hoàn thành bài tập</h3>
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="flex items-center gap-4 py-2">
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                  {/* Done: 78% (stroke-dasharray: 0.78 * 238.7 = 186.2) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="12"
                    strokeDasharray="186.2 238.7"
                    strokeLinecap="round"
                  />
                  {/* In progress: 16% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#258BFF"
                    strokeWidth="12"
                    strokeDasharray="38 238.7"
                    strokeDashoffset="-186.2"
                  />
                  {/* Not done: 6% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="12"
                    strokeDasharray="14.5 238.7"
                    strokeDashoffset="-224.2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-[#0B2545]">78%</span>
                  <span className="text-[10px] text-slate-500 font-medium">Đã hoàn thành</span>
                </div>
              </div>

              {/* Legend matching image */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600">Đã hoàn thành</span>
                  <strong className="text-slate-900 ml-auto">118</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-600">Đang làm</span>
                  <strong className="text-slate-900 ml-auto">24</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-600">Chưa làm</span>
                  <strong className="text-slate-900 ml-auto">10</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tổng số bài tập: <strong>152</strong></span>
            <button
              onClick={() => setActiveModule('assignments')}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5"
            >
              Xem chi tiết →
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 3: SỔ ĐIỂM NHANH + BÀI TẬP GẦN ĐÂY + TRỢ LÝ AI       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card D: Sổ điểm Ngữ văn – Lớp 9A1 (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#1565D8] text-white flex items-center justify-center text-xs font-bold">
                  ≡
                </div>
                <h3 className="font-bold text-base text-[#0B2545]">
                  Sổ điểm Ngữ văn – Lớp {quickClassFilter}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={quickClassFilter}
                  onChange={(e) => setQuickClassFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.code}>
                      Lớp {c.code}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm học sinh..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 sm:w-36"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1.5" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#EBF3FF] text-[#132B50] font-bold">
                    <th className="py-2 px-2 text-center rounded-l">STT</th>
                    <th className="py-2 px-2 text-left">Họ và tên</th>
                    <th className="py-2 px-1 text-center">TX1</th>
                    <th className="py-2 px-1 text-center">TX2</th>
                    <th className="py-2 px-1 text-center">GK</th>
                    <th className="py-2 px-1 text-center">CK</th>
                    <th className="py-2 px-1 text-center font-bold text-blue-900">TB</th>
                    <th className="py-2 px-2 text-center rounded-r">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {displayedGrades.map((g, idx) => (
                    <tr
                      key={g.id}
                      onClick={() => setOpenStudentProfileId(g.studentId)}
                      className="hover:bg-blue-50/70 cursor-pointer transition"
                    >
                      <td className="py-2 px-2 text-center text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-2 font-bold text-[#0B2545] truncate max-w-[120px]">
                        {g.fullName}
                      </td>
                      <td className="py-2 px-1 text-center">{g.txScores[0]?.toFixed(1).replace('.', ',') || '—'}</td>
                      <td className="py-2 px-1 text-center">{g.txScores[1]?.toFixed(1).replace('.', ',') || '—'}</td>
                      <td className="py-2 px-1 text-center">{g.gkScore?.toFixed(1).replace('.', ',') || '—'}</td>
                      <td className="py-2 px-1 text-center">{g.ckScore?.toFixed(1).replace('.', ',') || '—'}</td>
                      <td className="py-2 px-1 text-center font-bold text-[#1565D8]">
                        {g.tbScore?.toFixed(1).replace('.', ',') || '—'}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            g.classification === 'Giỏi' || g.classification === 'Xuất sắc'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {g.classification || 'Khá'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Hiển thị {displayedGrades.length} học sinh</span>
            <button
              onClick={() => {
                setSelectedClassCode(quickClassFilter);
                setActiveModule('gradebook');
              }}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              Xem sổ điểm đầy đủ →
            </button>
          </div>
        </div>

        {/* Card E: Bài tập và bài kiểm tra (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#258BFF] text-white flex items-center justify-center text-xs">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-base text-[#0B2545]">Bài tập và bài kiểm tra</h3>
              </div>
              <button
                onClick={() => setActiveModule('assignments')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Xem tất cả &gt;
              </button>
            </div>

            <div className="space-y-2.5">
              {assignments.slice(0, 4).map((asg, idx) => {
                const percent = Math.round((asg.submittedCount / asg.totalStudents) * 100);
                const isOver80 = percent >= 80;
                const isUnder50 = percent < 50;

                return (
                  <div
                    key={asg.id}
                    onClick={() => setActiveModule('assignments')}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                            idx === 0
                              ? 'bg-purple-600'
                              : idx === 1
                              ? 'bg-rose-500'
                              : idx === 2
                              ? 'bg-red-500'
                              : 'bg-amber-500'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#0B2545] line-clamp-1">
                            {asg.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Lớp: <strong className="text-slate-700">{asg.classCode}</strong> | Hạn nộp: {asg.dueDate}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          isOver80
                            ? 'bg-emerald-100 text-emerald-800'
                            : isUnder50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isOver80 ? `Đã nộp ${percent}%` : isUnder50 ? `Chưa nộp ${100 - percent}%` : `Đang làm ${percent}%`}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-500">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOver80 ? 'bg-emerald-500' : isUnder50 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="shrink-0 font-semibold text-slate-700">
                        {asg.submittedCount}/{asg.totalStudents}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card F: Trợ lý AI môn Ngữ văn (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#7C3AED] text-white flex items-center justify-center text-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-sm text-[#0B2545]">Trợ lý AI môn Ngữ văn</h3>
              </div>
              <button
                onClick={() => setIsAiCollapsed(!isAiCollapsed)}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                {isAiCollapsed ? 'Mở rộng' : 'Thu nhỏ'}
              </button>
            </div>

            {!isAiCollapsed && (
              <>
                {/* AI Chat Bubble matching image */}
                <div className="flex items-start gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 ring-1 ring-blue-300">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-3 bg-[#F0F6FF] rounded-2xl rounded-tl-sm text-xs text-[#132B50] leading-relaxed shadow-xs">
                    {quickAiChat[quickAiChat.length - 1]?.text}
                  </div>
                </div>

                {/* 6 Quick Prompt Buttons */}
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {[
                    'Tạo câu hỏi trắc nghiệm',
                    'Gợi ý nhận xét học sinh',
                    'Đề xuất hoạt động dạy học',
                    'Tìm ý cho bài giảng',
                    'Phân tích tác phẩm',
                    'Soạn giáo án',
                  ].map((label, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuickAI(label)}
                      disabled={isAiLoading}
                      className="px-2 py-1.5 rounded-lg border border-blue-200/80 bg-blue-50/50 hover:bg-blue-100/70 text-[11px] font-semibold text-blue-800 transition text-left truncate flex items-center gap-1 group"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-blue-500 shrink-0 group-hover:rotate-12 transition-transform" />
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Chat Input Box */}
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi của thầy..."
              value={quickAiInput}
              onChange={(e) => setQuickAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendQuickAI();
              }}
              disabled={isAiLoading}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-9 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSendQuickAI()}
              disabled={isAiLoading || !quickAiInput.trim()}
              className="absolute right-1.5 top-1.5 p-1 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white disabled:opacity-40 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 4: THƯ VIỆN HỌC LIỆU + BÁO CÁO VÀ THỐNG KÊ          */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card G: Thư viện học liệu Ngữ văn (col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#1565D8] text-white flex items-center justify-center text-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-base text-[#0B2545]">Thư viện học liệu Ngữ văn</h3>
              </div>
              <button
                onClick={() => setActiveModule('library')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Xem tất cả
              </button>
            </div>

            {/* 4 Colored Category Cards from reference image */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: Giáo án (125 tài liệu) */}
              <div
                onClick={() => setActiveModule('library')}
                className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-rose-200/70 hover:shadow-md transition cursor-pointer text-center flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-[#0B2545]">Giáo án</span>
                <span className="text-[11px] text-rose-700 font-medium mt-0.5">125 tài liệu</span>
              </div>

              {/* Card 2: Video bài giảng (48 video) */}
              <div
                onClick={() => setActiveModule('library')}
                className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-blue-200/70 hover:shadow-md transition cursor-pointer text-center flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#258BFF] text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-[#0B2545]">Video bài giảng</span>
                <span className="text-[11px] text-blue-700 font-medium mt-0.5">48 video</span>
              </div>

              {/* Card 3: Sơ đồ tư duy (62 sơ đồ) */}
              <div
                onClick={() => setActiveModule('library')}
                className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-emerald-200/70 hover:shadow-md transition cursor-pointer text-center flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  <GitFork className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-[#0B2545]">Sơ đồ tư duy</span>
                <span className="text-[11px] text-emerald-700 font-medium mt-0.5">62 sơ đồ</span>
              </div>

              {/* Card 4: Tài liệu tham khảo (210 tài liệu) */}
              <div
                onClick={() => setActiveModule('library')}
                className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-purple-200/70 hover:shadow-md transition cursor-pointer text-center flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-[#0B2545]">Tài liệu tham khảo</span>
                <span className="text-[11px] text-purple-700 font-medium mt-0.5">210 tài liệu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card H: Báo cáo và thống kê (col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#1565D8] text-white flex items-center justify-center text-xs">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-base text-[#0B2545]">Báo cáo và thống kê</h3>
              </div>
              <button
                onClick={() => setActiveModule('reports')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Xem tất cả
              </button>
            </div>

            <p className="text-xs text-slate-500 font-semibold mb-2">
              Điểm trung bình môn Ngữ văn theo lớp
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Bar Chart comparing 6A1 (7.2), 7A1 (7.5), 8A2 (7.8), 9A1 (7.9) */}
              <div className="sm:col-span-7 h-32 flex items-end justify-between px-3 pb-1 border-b border-l border-slate-200">
                {[
                  { class: '6A1', score: 7.2, height: '72%' },
                  { class: '7A1', score: 7.5, height: '75%' },
                  { class: '8A2', score: 7.8, height: '78%' },
                  { class: '9A1', score: 7.9, height: '79%' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold text-[#1565D8] group-hover:scale-110 transition">
                      {item.score.toFixed(1).replace('.', ',')}
                    </span>
                    <div
                      className="w-10 rounded-t-lg bg-gradient-to-t from-[#1565D8] to-[#38BDF8] shadow-sm hover:brightness-110 transition-all cursor-pointer"
                      style={{ height: item.height }}
                    />
                    <span className="text-xs font-bold text-slate-700 mt-1">{item.class}</span>
                  </div>
                ))}
              </div>

              {/* Quick Report Actions */}
              <div className="sm:col-span-5 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setActiveModule('reports')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Báo cáo học tập</span>
                </button>
                <button
                  onClick={() => setActiveModule('assignments')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thống kê bài tập</span>
                </button>
                <button
                  onClick={() => exportGradebookExcel('9A1')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-green-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xuất Excel</span>
                </button>
                <button
                  onClick={() => setActiveModule('reports')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-rose-600" />
                  <span>Xuất PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
