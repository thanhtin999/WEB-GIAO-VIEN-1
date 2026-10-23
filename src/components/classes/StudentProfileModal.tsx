import React, { useState } from 'react';
import {
  X,
  User,
  Award,
  BookOpen,
  Calendar,
  Save,
  CheckCircle,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StudentProfileModalProps {
  studentId: string;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  studentId,
  onClose,
}) => {
  const { students, grades, competencies, updateStudent, updateCompetencyScore, teacherInfo } = useApp();

  const student = students.find((s) => s.id === studentId);
  const studentGrades = grades.filter((g) => g.studentId === studentId);
  const comp = competencies.find((c) => c.studentId === studentId);

  const [strengths, setStrengths] = useState(student?.strengths || '');
  const [improvementAreas, setImprovementAreas] = useState(student?.improvementAreas || '');
  const [personalPlan, setPersonalPlan] = useState(student?.personalPlan || '');
  const [teacherNotes, setTeacherNotes] = useState(student?.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!student) return null;

  const currentGrade = studentGrades[0];

  const handleSave = () => {
    updateStudent(student.id, {
      strengths,
      improvementAreas,
      personalPlan,
      notes: teacherNotes,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#0F4C81] to-[#1565D8] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-xl font-bold">
              {student.fullName.charAt(student.fullName.lastIndexOf(' ') + 1) || 'H'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{student.fullName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                  {student.studentCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-400/20 text-white border border-blue-400/30">
                  Lớp {student.classCode}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Giới tính: {student.gender} • Khối {student.grade} • Năm học: 2026–2027 • Trạng thái: {student.academicStatus}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#132B50]">
          {/* Quick Academic Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <span className="text-xs text-slate-500 font-medium">ĐTB Học kỳ 1</span>
              <p className="text-2xl font-bold text-[#1565D8] mt-0.5">
                {currentGrade?.tbScore !== null && currentGrade?.tbScore !== undefined
                  ? currentGrade.tbScore.toFixed(1).replace('.', ',')
                  : '—'}
              </p>
              <span className="text-xs text-emerald-600 font-semibold">{currentGrade?.classification || 'Khá'}</span>
            </div>
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
              <span className="text-xs text-slate-500 font-medium">Năng lực Đọc hiểu</span>
              <p className="text-2xl font-bold text-purple-700 mt-0.5">
                {comp?.scores.reading.toFixed(1).replace('.', ',') || '7,8'}
              </p>
              <span className="text-xs text-purple-600 font-semibold">Mức Đạt Tốt</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-xs text-slate-500 font-medium">Năng lực Viết</span>
              <p className="text-2xl font-bold text-emerald-700 mt-0.5">
                {comp?.scores.writing.toFixed(1).replace('.', ',') || '7,2'}
              </p>
              <span className="text-xs text-emerald-600 font-semibold">Hành văn lưu loát</span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="text-xs text-slate-500 font-medium">Nói & Nghe</span>
              <p className="text-2xl font-bold text-amber-700 mt-0.5">
                {(((comp?.scores.speaking || 7) + (comp?.scores.listening || 7)) / 2).toFixed(1).replace('.', ',')}
              </p>
              <span className="text-xs text-amber-600 font-semibold">Tự tin tương tác</span>
            </div>
          </div>

          {/* Sổ điểm chi tiết của học sinh */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-sm text-[#0B2545] mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Kết quả học tập môn Ngữ văn (Học kỳ 1 - 2026–2027)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs bg-white rounded-lg border border-slate-200">
                <thead>
                  <tr className="bg-blue-100/50 text-[#0B2545] font-bold">
                    <th className="p-2 text-center">TX1</th>
                    <th className="p-2 text-center">TX2</th>
                    <th className="p-2 text-center">Giữa kỳ (GK)</th>
                    <th className="p-2 text-center">Cuối kỳ (CK)</th>
                    <th className="p-2 text-center">TB Học kỳ</th>
                    <th className="p-2 text-center">Xếp loại</th>
                    <th className="p-2 text-left">Người nhập</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center font-medium">
                  <tr>
                    <td className="p-2 font-bold">{currentGrade?.txScores[0]?.toFixed(1).replace('.', ',') || '—'}</td>
                    <td className="p-2 font-bold">{currentGrade?.txScores[1]?.toFixed(1).replace('.', ',') || '—'}</td>
                    <td className="p-2 font-bold text-blue-700">{currentGrade?.gkScore?.toFixed(1).replace('.', ',') || '—'}</td>
                    <td className="p-2 font-bold text-indigo-700">{currentGrade?.ckScore?.toFixed(1).replace('.', ',') || '—'}</td>
                    <td className="p-2 font-bold text-emerald-700 text-sm">
                      {currentGrade?.tbScore?.toFixed(1).replace('.', ',') || '—'}
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                        {currentGrade?.classification || 'Khá'}
                      </span>
                    </td>
                    <td className="p-2 text-left text-slate-500">{currentGrade?.modifiedBy || teacherInfo.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Hồ sơ chuyên môn: Điểm mạnh, Cần cải thiện, Kế hoạch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-[#0B2545] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                Điểm mạnh nổi bật (Năng lực văn học):
              </label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Tư duy cảm thụ hình tượng nhân vật sâu sắc, biết cách dùng từ ngữ gợi cảm..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-xs text-[#0B2545] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                Kỹ năng cần cải thiện & hoàn thiện:
              </label>
              <textarea
                value={improvementAreas}
                onChange={(e) => setImprovementAreas(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Cần rèn luyện thêm tính mạch lạc trong liên kết các luận điểm nghị luận xã hội..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-xs text-[#0B2545] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Kế hoạch học tập cá nhân & Bài tập bồi dưỡng:
              </label>
              <textarea
                value={personalPlan}
                onChange={(e) => setPersonalPlan(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Luyện viết 1 đoạn văn nghị luận mỗi tuần, tham gia câu lạc bộ Đọc sách..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-xs text-[#0B2545] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Ghi chú chuyên môn của Thầy {teacherInfo.name}:
              </label>
              <textarea
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                rows={3}
                placeholder="Nhận xét tổng thể, lưu ý với phụ huynh hoặc định hướng ôn thi chuyên..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Dữ liệu được bảo mật cho giáo viên THCS Phan Bội Châu.
          </span>
          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                <CheckCircle className="w-4 h-4" /> Đã lưu thành công!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Lưu hồ sơ học sinh
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
