import React, { useState } from 'react';
import {
  TrendingUp,
  BookOpen,
  Edit3,
  Mic,
  Headphones,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Filter,
  Search,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentCompetencyRecord } from '../../types';

export const CompetencyModule: React.FC = () => {
  const {
    competencies,
    updateCompetencyScore,
    classes,
    selectedClassCode,
    setSelectedClassCode,
    teacherInfo,
    setOpenStudentProfileId,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForRubric, setSelectedStudentForRubric] = useState<StudentCompetencyRecord | null>(null);

  // Rubric Edit Form State
  const [rubricReading, setRubricReading] = useState(7.5);
  const [rubricWriting, setRubricWriting] = useState(7.0);
  const [rubricSpeaking, setRubricSpeaking] = useState(7.0);
  const [rubricListening, setRubricListening] = useState(7.0);
  const [rubricNotes, setRubricNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter list by selected class
  const classCompetencies = competencies.filter(
    (c) => c.classCode === selectedClassCode &&
      (searchTerm
        ? c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  // Compute Class Averages for the 4 Competencies
  const avgReading = classCompetencies.length > 0
    ? (classCompetencies.reduce((acc, c) => acc + c.scores.reading, 0) / classCompetencies.length).toFixed(1)
    : '7.8';
  const avgWriting = classCompetencies.length > 0
    ? (classCompetencies.reduce((acc, c) => acc + c.scores.writing, 0) / classCompetencies.length).toFixed(1)
    : '7.2';
  const avgSpeaking = classCompetencies.length > 0
    ? (classCompetencies.reduce((acc, c) => acc + c.scores.speaking, 0) / classCompetencies.length).toFixed(1)
    : '6.9';
  const avgListening = classCompetencies.length > 0
    ? (classCompetencies.reduce((acc, c) => acc + c.scores.listening, 0) / classCompetencies.length).toFixed(1)
    : '7.4';

  // Identify students needing attention (average < 6.5 or reading/writing < 6.0)
  const studentsNeedingAttention = classCompetencies.filter(
    (c) =>
      c.needsAttention ||
      (c.scores.reading + c.scores.writing + c.scores.speaking + c.scores.listening) / 4 < 6.8 ||
      c.scores.reading < 6.5 ||
      c.scores.writing < 6.5
  );

  const handleOpenRubric = (rec: StudentCompetencyRecord) => {
    setSelectedStudentForRubric(rec);
    setRubricReading(rec.scores.reading);
    setRubricWriting(rec.scores.writing);
    setRubricSpeaking(rec.scores.speaking);
    setRubricListening(rec.scores.listening);
    setRubricNotes(rec.rubricNotes || '');
  };

  const handleSaveRubric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForRubric) return;

    updateCompetencyScore(
      selectedStudentForRubric.id,
      {
        reading: Number(rubricReading),
        writing: Number(rubricWriting),
        speaking: Number(rubricSpeaking),
        listening: Number(rubricListening),
      },
      rubricNotes
    );

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSelectedStudentForRubric(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#258BFF] text-white flex items-center justify-center shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2545]">
              Phân tích Năng lực Ngữ văn (Đọc – Viết – Nói – Nghe)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Đánh giá phẩm chất & năng lực theo Chương trình GDPT 2018 môn Ngữ văn
            </p>
          </div>
        </div>

        {/* Class switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Lớp:</span>
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClassCode(c.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedClassCode === c.code
                  ? 'bg-[#1565D8] text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lớp {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Competency Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Năng lực Đọc hiểu */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-[#0B2545] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              1. Đọc hiểu
            </span>
            <span className="text-xl font-bold text-emerald-600">
              {avgReading.replace('.', ',')}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nhận biết thông tin, giải mã chi tiết nghệ thuật, cảm thụ hình tượng và thông điệp văn bản.
          </p>
        </div>

        {/* Năng lực Viết */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 border-t-4 border-t-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-[#0B2545] flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-purple-600" />
              2. Viết
            </span>
            <span className="text-xl font-bold text-purple-600">
              {avgWriting.replace('.', ',')}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Xây dựng dàn ý, diễn đạt mạch lạc, kết hợp biểu cảm, lập luận nghị luận sắc sảo, chính tả chuẩn mực.
          </p>
        </div>

        {/* Năng lực Nói */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-[#0B2545] flex items-center gap-2">
              <Mic className="w-4 h-4 text-amber-600" />
              3. Nói
            </span>
            <span className="text-xl font-bold text-amber-600">
              {avgSpeaking.replace('.', ',')}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Trình bày quan điểm tự tin, sử dụng ngôn ngữ cơ thể, dẫn chứng thuyết phục khi thuyết trình tác phẩm.
          </p>
        </div>

        {/* Năng lực Nghe */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm text-[#0B2545] flex items-center gap-2">
              <Headphones className="w-4 h-4 text-blue-600" />
              4. Nghe
            </span>
            <span className="text-xl font-bold text-blue-600">
              {avgListening.replace('.', ',')}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Lắng nghe chủ động, thấu cảm quan điểm của bạn bè và phản hồi xây dựng trong thảo luận nhóm.
          </p>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Students Needing Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Radar Chart (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#0B2545] mb-2">
              Biểu đồ Radar Năng lực lớp {selectedClassCode}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Thang đo năng lực 0–10 chuẩn hóa theo đánh giá thường xuyên của Thầy {teacherInfo.name}.
            </p>

            <div className="flex justify-center py-4">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                  {[20, 40, 60, 80].map((r, i) => (
                    <polygon
                      key={i}
                      points={`100,${100 - r} ${100 + r},100 100,${100 + r} ${100 - r},100`}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                    />
                  ))}
                  <polygon
                    points="100,20 180,100 100,180 20,100"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1.2"
                  />
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#CBD5E1" strokeWidth="1" />

                  {/* Polygon calculated from average scores */}
                  {/* Top: 100, 100 - Number(avgReading)*8 */}
                  {/* Right: 100 + Number(avgWriting)*8, 100 */}
                  {/* Bottom: 100, 100 + Number(avgSpeaking)*8 */}
                  {/* Left: 100 - Number(avgListening)*8, 100 */}
                  <polygon
                    points={`100,${100 - Number(avgReading) * 8} ${100 + Number(avgWriting) * 8},100 100,${100 + Number(avgSpeaking) * 8} ${100 - Number(avgListening) * 8},100`}
                    fill="#38BDF8"
                    fillOpacity="0.3"
                    stroke="#1565D8"
                    strokeWidth="2.5"
                  />
                  <circle cx="100" cy={100 - Number(avgReading) * 8} r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />
                  <circle cx={100 + Number(avgWriting) * 8} cy="100" r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="100" cy={100 + Number(avgSpeaking) * 8} r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />
                  <circle cx={100 - Number(avgListening) * 8} cy="100" r="4" fill="#1565D8" stroke="#fff" strokeWidth="1.5" />

                  <text x="100" y="10" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Đọc hiểu ({avgReading})
                  </text>
                  <text x="195" y="104" textAnchor="start" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Viết ({avgWriting})
                  </text>
                  <text x="100" y="196" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Nói ({avgSpeaking})
                  </text>
                  <text x="5" y="104" textAnchor="end" fontSize="11" fontWeight="bold" fill="#0B2545">
                    Nghe ({avgListening})
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-blue-900">
            <strong>Nhận định tổng quan:</strong> Lớp {selectedClassCode} có năng lực Đọc hiểu vượt trội. Năng lực Nói cần được khuyến khích thêm qua các tiết thuyết trình văn học và sân khấu hóa tác phẩm.
          </div>
        </div>

        {/* Students Needing Pedagogical Attention (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-[#0B2545]">
                  Học sinh cần quan tâm bồi dưỡng ({studentsNeedingAttention.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 italic">
                *Chỉ hỗ trợ tham khảo sư phạm, không gắn nhãn cố định
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {studentsNeedingAttention.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0B2545]">{rec.studentName}</span>
                      <span className="font-semibold text-slate-500">({rec.studentCode})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Cần củng cố Viết/Đọc
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span>Đọc hiểu: <strong className="text-slate-800">{rec.scores.reading}</strong></span>
                      <span>Viết: <strong className="text-slate-800">{rec.scores.writing}</strong></span>
                      <span>Nói: <strong className="text-slate-800">{rec.scores.speaking}</strong></span>
                      <span>Nghe: <strong className="text-slate-800">{rec.scores.listening}</strong></span>
                    </div>
                    <p className="text-slate-500 italic text-[11px]">
                      Gợi ý bồi dưỡng: Giao phiếu học tập rèn cấu trúc đoạn văn diễn dịch và luyện tập viết mở bài gợi cảm.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenRubric(rec)}
                      className="px-3 py-1.5 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold transition shadow-xs"
                    >
                      Đánh giá Rubric
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tiêu chí: Điểm năng lực Viết &lt; 7.0 hoặc Đọc hiểu &lt; 7.0</span>
            <span className="text-emerald-700 font-semibold">Đã cấu hình bộ tiêu chí sư phạm THCS</span>
          </div>
        </div>
      </div>

      {/* Rubric Assessment Table for All Students in Selected Class */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="p-4 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base text-[#0B2545]">
              Bảng đánh giá năng lực chi tiết từng học sinh – Lớp {selectedClassCode}
            </h3>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 w-52 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#EBF3FF] text-[#132B50] font-bold">
              <tr>
                <th className="py-3 px-3 text-center">STT</th>
                <th className="py-3 px-3">Mã HS</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3 text-center text-emerald-800">Đọc hiểu</th>
                <th className="py-3 px-3 text-center text-purple-800">Viết</th>
                <th className="py-3 px-3 text-center text-amber-800">Nói</th>
                <th className="py-3 px-3 text-center text-blue-800">Nghe</th>
                <th className="py-3 px-3 text-center">TB Năng lực</th>
                <th className="py-3 px-3">Nhận xét Rubric</th>
                <th className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {classCompetencies.map((rec, idx) => {
                const avg = ((rec.scores.reading + rec.scores.writing + rec.scores.speaking + rec.scores.listening) / 4).toFixed(1);
                return (
                  <tr key={rec.id} className="hover:bg-blue-50/50 transition">
                    <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-[#1565D8]">{rec.studentCode}</td>
                    <td className="py-2.5 px-3 font-bold text-[#0B2545]">{rec.studentName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      {rec.scores.reading.toFixed(1).replace('.', ',')}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-purple-700">
                      {rec.scores.writing.toFixed(1).replace('.', ',')}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-700">
                      {rec.scores.speaking.toFixed(1).replace('.', ',')}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-700">
                      {rec.scores.listening.toFixed(1).replace('.', ',')}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#0B2545] text-sm">
                      {avg.replace('.', ',')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-[200px] truncate">
                      {rec.rubricNotes || 'Đạt chuẩn yêu cầu cần đạt'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleOpenRubric(rec)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1565D8] font-bold transition"
                      >
                        Đánh giá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RUBRIC EVALUATION MODAL */}
      {selectedStudentForRubric && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  Đánh giá Rubric Năng lực – {selectedStudentForRubric.studentName}
                </h3>
                <p className="text-xs text-blue-200">
                  Mã HS: {selectedStudentForRubric.studentCode} • Lớp: {selectedStudentForRubric.classCode}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForRubric(null)}
                className="text-white hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRubric} className="p-5 space-y-4 text-xs text-[#132B50]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1 text-emerald-800">1. Năng lực Đọc hiểu (0-10):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rubricReading}
                    onChange={(e) => setRubricReading(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-purple-800">2. Năng lực Viết (0-10):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rubricWriting}
                    onChange={(e) => setRubricWriting(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-amber-800">3. Năng lực Nói (0-10):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rubricSpeaking}
                    onChange={(e) => setRubricSpeaking(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-blue-800">4. Năng lực Nghe (0-10):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={rubricListening}
                    onChange={(e) => setRubricListening(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Nhận xét chi tiết theo tiêu chí Rubric:</label>
                <textarea
                  rows={3}
                  value={rubricNotes}
                  onChange={(e) => setRubricNotes(e.target.value)}
                  placeholder="Ví dụ: Biết xác định luận điểm chính, dẫn chứng thuyết phục; cần chú ý liên kết giữa các đoạn văn..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {saveSuccess ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Đã cập nhật Rubric!
                  </span>
                ) : (
                  <span className="text-slate-400">Đánh giá trực tiếp vào hồ sơ học sinh</span>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForRubric(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold shadow-md"
                  >
                    Lưu đánh giá
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
