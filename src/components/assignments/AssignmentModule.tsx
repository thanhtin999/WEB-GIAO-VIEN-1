import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Sparkles,
  Search,
  Filter,
  Check,
  Send,
  User,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentType, Submission } from '../../types';

export const AssignmentModule: React.FC = () => {
  const {
    assignments,
    addAssignment,
    deleteAssignment,
    submissions,
    gradeSubmission,
    classes,
    teacherInfo,
  } = useApp();

  const [selectedAsgId, setSelectedAsgId] = useState<string>(assignments[0]?.id || '');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [gradingSub, setGradingSub] = useState<Submission | null>(null);

  // Grading form state
  const [scoreInput, setScoreInput] = useState<number>(8.0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [isAiGeneratingFeedback, setIsAiGeneratingFeedback] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('9A1');
  const [newType, setNewType] = useState<AssignmentType>('NghiLuanVanHoc');
  const [newDueDate, setNewDueDate] = useState('20/11/2026');
  const [newDescription, setNewDescription] = useState('');

  const currentAssignment = assignments.find((a) => a.id === selectedAsgId) || assignments[0];
  const currentSubmissions = submissions.filter((s) => s.assignmentId === currentAssignment?.id);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetClass = classes.find((c) => c.code === newClass);
    const totalStudents = targetClass ? targetClass.studentCount : 38;

    addAssignment({
      title: newTitle.trim(),
      classCode: newClass,
      grade: parseInt(newClass[0]) || 9,
      type: newType,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      totalStudents,
      submittedCount: 0,
      inProgressCount: 0,
      notSubmittedCount: totalStudents,
      description: newDescription,
      status: 'Active',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleOpenGradeModal = (sub: Submission) => {
    setGradingSub(sub);
    setScoreInput(sub.score || 8.0);
    setFeedbackInput(sub.teacherFeedback || '');
  };

  const handleRequestAiFeedback = async () => {
    if (!gradingSub) return;
    setIsAiGeneratingFeedback(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'nhan_xet',
          prompt: `Gợi ý nhận xét và điểm số cho bài viết của học sinh ${gradingSub.studentName} lớp ${gradingSub.classCode} về đề tài "${currentAssignment.title}". Bài làm ngắn: "${gradingSub.content || 'Học sinh phân tích diễn biến tâm lý nhân vật...'}"`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setFeedbackInput(
          (prev) => (prev ? prev + '\n\n' : '') + `[Gợi ý từ Trợ lý AI]:\n` + data.reply
        );
      }
    } catch {
      setFeedbackInput(
        (prev) =>
          (prev ? prev + '\n\n' : '') +
          `[Gợi ý sư phạm]: Bài viết đã nắm vững trọng tâm tác phẩm, cảm thụ chân thực. Em cần chú ý chau chuốt câu văn liên kết giữa các luận điểm để bài viết đạt chiều sâu ấn tượng hơn.`
      );
    } finally {
      setIsAiGeneratingFeedback(false);
    }
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;
    gradeSubmission(gradingSub.id, Number(scoreInput), feedbackInput);
    setGradingSub(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#258BFF] text-white flex items-center justify-center shadow-md">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2545]">
              Quản lý Bài tập và Bài kiểm tra Ngữ văn
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Theo dõi tiến độ nộp bài, chấm bài theo Rubric và trợ lý AI gợi ý phản hồi
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Giao bài tập mới</span>
        </button>
      </div>

      {/* Main Grid: Assignment List (Left) + Submission & Grading (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Assignment Selection List (col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0B2545]">
              Danh sách bài tập ({assignments.length})
            </h3>
            <span className="text-xs text-slate-400">Chọn bài để xem và chấm điểm</span>
          </div>

          <div className="space-y-3">
            {assignments.map((asg) => {
              const isSelected = asg.id === currentAssignment?.id;
              const percent = Math.round((asg.submittedCount / asg.totalStudents) * 100);

              return (
                <div
                  key={asg.id}
                  onClick={() => setSelectedAsgId(asg.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#1565D8] shadow-md ring-1 ring-blue-400/40'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 mb-1">
                        Lớp {asg.classCode} • {asg.type}
                      </span>
                      <h4 className="font-bold text-sm text-[#0B2545] leading-snug">
                        {asg.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {asg.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Xác nhận xóa bài tập "${asg.title}"?`)) {
                          deleteAssignment(asg.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                      title="Xóa bài tập"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Submission Progress bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="w-2/3 bg-slate-200 rounded-full h-2 overflow-hidden mr-3">
                      <div
                        className="bg-[#16A34A] h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-700 whitespace-nowrap">
                      {asg.submittedCount}/{asg.totalStudents} ({percent}%)
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Hạn nộp: <strong>{asg.dueDate}</strong></span>
                    <span className="text-emerald-700 font-semibold">Đang nhận bài</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Submissions & Grading Manager (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  CHI TIẾT BÀI TẬP & DANH SÁCH BÀI NỘP
                </span>
                <h3 className="text-lg font-bold text-[#0B2545] mt-0.5">
                  {currentAssignment?.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Lớp: <strong>{currentAssignment?.classCode}</strong> • Hạn nộp: {currentAssignment?.dueDate} • Giáo viên: {teacherInfo.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Đã nộp: {currentAssignment?.submittedCount}/{currentAssignment?.totalStudents}
                </span>
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">
                Bài nộp của học sinh ({currentSubmissions.length} bài)
              </h4>

              {currentSubmissions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  Chưa có học sinh nào nộp bài cho nhiệm vụ này.
                </div>
              ) : (
                currentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-sm text-[#0B2545]">{sub.studentName}</span>
                        <span className="text-slate-400">({sub.studentId})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.score !== null && sub.score !== undefined ? (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                            Điểm: {sub.score.toFixed(1).replace('.', ',')}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
                            Chờ chấm
                          </span>
                        )}
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="px-3 py-1 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold transition shadow-xs"
                        >
                          Chấm bài
                        </button>
                      </div>
                    </div>

                    {sub.content && (
                      <p className="p-2.5 rounded-lg bg-white border border-slate-100 text-slate-700 italic">
                        "{sub.content}"
                      </p>
                    )}

                    {sub.teacherFeedback && (
                      <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-blue-900">
                        <strong className="text-blue-800">Nhận xét của Thầy:</strong> {sub.teacherFeedback}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Giao bài tập / bài kiểm tra mới</h3>
              <button onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-5 space-y-3 text-xs text-[#132B50]">
              <div>
                <label className="font-bold block mb-1">Tiêu đề bài tập:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phân tích bài thơ Ánh trăng (Nguyễn Duy)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Giao cho lớp:</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.code}>
                        Lớp {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Dạng bài tập:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as AssignmentType)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="NghiLuanVanHoc">Nghị luận văn học</option>
                    <option value="NghiLuanXaHoi">Nghị luận xã hội</option>
                    <option value="DocHieu">Đọc hiểu văn bản</option>
                    <option value="VietDoan">Viết đoạn văn</option>
                    <option value="TracNghiem">Trắc nghiệm</option>
                    <option value="ThuyetTrinh">Thuyết trình</option>
                    <option value="LuyenTap">Bài luyện tập</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Hạn nộp bài:</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="20/11/2026"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Yêu cầu & Nội dung chi tiết:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Nêu rõ yêu cầu về dung lượng, bố cục, các luận điểm chính cần làm rõ..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Giao bài tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADING MODAL WITH AI FEEDBACK */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Chấm bài: {gradingSub.studentName}</h3>
                <p className="text-xs text-blue-200">
                  Lớp: {gradingSub.classCode} • Bài: {currentAssignment?.title}
                </p>
              </div>
              <button onClick={() => setGradingSub(null)}>✕</button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-5 space-y-4 text-xs text-[#132B50]">
              <div>
                <span className="font-bold block mb-1 text-slate-500">Nội dung bài làm của học sinh:</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 italic max-h-36 overflow-y-auto leading-relaxed">
                  {gradingSub.content || 'Bài viết phân tích cảm thụ văn học chi tiết...'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="font-bold block mb-1">Điểm số (0–10):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-lg font-bold text-[#1565D8]"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleRequestAiFeedback}
                    disabled={isAiGeneratingFeedback}
                    className="w-full mt-4 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>{isAiGeneratingFeedback ? 'AI đang phân tích...' : 'AI đề xuất nhận xét'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Nhận xét & hướng dẫn sửa bài của Thầy:</label>
                <textarea
                  rows={4}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Ghi nhận ưu điểm về cảm thụ, cấu trúc; chỉ rõ lỗi diễn đạt và cách nâng cao điểm số..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Lưu & Trả kết quả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
