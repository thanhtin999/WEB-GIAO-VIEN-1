import React, { useState } from 'react';
import {
  X,
  Database,
  Cloud,
  ShieldCheck,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileJson,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SystemConfigModalProps {
  onClose: () => void;
}

export const SystemConfigModal: React.FC<SystemConfigModalProps> = ({ onClose }) => {
  const {
    isDemoMode,
    setIsDemoMode,
    resetToDemoData,
    clearAllData,
    students,
    classes,
    grades,
    competencies,
    assignments,
    resources,
    teacherInfo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'status' | 'firebase' | 'backup'>('status');
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Backup entire application state to a JSON file
  const handleExportBackup = () => {
    const fullBackup = {
      system: 'VĂN HỌC 4.0 - THCS PHAN BỘI CHÂU',
      exportedAt: new Date().toISOString(),
      teacher: teacherInfo,
      data: {
        classes,
        students,
        grades,
        competencies,
        assignments,
        resources,
      },
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VanHoc40_SaoLuu_DuLieu_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-2xl overflow-hidden flex flex-col text-[#132B50]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-300" />
            <div>
              <h3 className="font-bold text-base">Cơ sở dữ liệu & Cấu hình Hệ thống Văn học 4.0</h3>
              <p className="text-[11px] text-blue-200">
                THCS Phan Bội Châu • Giáo viên Dương Thành Tín
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold px-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'status'
                ? 'border-[#1565D8] text-[#1565D8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Trạng thái dữ liệu
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'firebase'
                ? 'border-[#1565D8] text-[#1565D8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kết nối Firebase & Đám mây
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'backup'
                ? 'border-[#1565D8] text-[#1565D8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sao lưu & Phục hồi JSON
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs max-h-[70vh]">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0B2545]">Chế độ dữ liệu hiện tại:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        isDemoMode
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isDemoMode ? 'Dữ liệu minh họa (Demo Mode)' : 'Dữ liệu thực tế'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">
                    {isDemoMode
                      ? 'Đang nạp 152 học sinh mẫu, 4 lớp và sổ điểm chuẩn khớp theo thiết kế tham chiếu.'
                      : 'Đang lưu trữ dữ liệu lớp và học sinh do giáo viên trực tiếp quản lý.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-50 shadow-xs transition"
                >
                  Chuyển sang {isDemoMode ? 'Dữ liệu thật' : 'Dữ liệu minh họa'}
                </button>
              </div>

              {/* Data counts */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-1">Số lớp</span>
                  <span className="text-xl font-bold text-[#0B2545]">{classes.length}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-1">Học sinh</span>
                  <span className="text-xl font-bold text-[#1565D8]">{students.length}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-1">Bản ghi điểm</span>
                  <span className="text-xl font-bold text-purple-700">{grades.length}</span>
                </div>
              </div>

              {/* Reset to initial demo */}
              <div className="pt-2 flex justify-between items-center text-slate-500">
                <span>Khôi phục lại chính xác 152 học sinh và sổ điểm ban đầu:</span>
                <button
                  onClick={() => {
                    if (window.confirm('Khôi phục lại dữ liệu minh họa ban đầu (152 học sinh)?')) {
                      resetToDemoData();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Khôi phục dữ liệu mẫu</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span>Kiến trúc Đám mây & Firestore sẵn sàng</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Hệ thống Văn học 4.0 được thiết kế sẵn cấu trúc dữ liệu tương thích 100% với Google Cloud Firestore và Firebase Authentication theo mô hình bảo vệ thông tin học sinh:
                </p>
                <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1">
                  <li><strong>users</strong>: Tài khoản giáo viên Dương Thành Tín (phân quyền Role: Teacher / Admin).</li>
                  <li><strong>classes & students</strong>: Lưu trữ hồ sơ định danh và lớp học THCS.</li>
                  <li><strong>grades & auditLogs</strong>: Ghi vết toàn bộ thao tác sửa đổi điểm số có mã hóa an toàn.</li>
                  <li><strong>teachingResources</strong>: Lưu liên kết học liệu số và file giáo án trên Google Drive.</li>
                </ul>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Bảo mật thông tin học sinh
                </span>
                <p className="text-[11px]">
                  Thông tin điểm số và lý lịch học sinh chỉ hiển thị cho giáo viên bộ môn được xác thực, không công khai ra bên ngoài.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Thầy có thể xuất toàn bộ cơ sở dữ liệu hiện tại (danh sách học sinh, sổ điểm, bài tập, học liệu) ra tệp tin JSON an toàn để lưu trữ vào máy tính cá nhân hoặc khôi phục bất cứ lúc nào:
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileJson className="w-4 h-4 text-[#1565D8]" />
                    Sao lưu cơ sở dữ liệu hệ thống
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Bao gồm 4 lớp, {students.length} học sinh và toàn bộ lịch sử điểm số.
                  </p>
                </div>

                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải bản sao lưu (.json)</span>
                </button>
              </div>

              {backupSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Đã tải xuống bản sao lưu JSON hoàn tất!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-xs transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
