import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Database,
  RefreshCw,
  Sparkles,
  Info,
  LogOut,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenDbModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDbModal }) => {
  const {
    teacherInfo,
    selectedAcademicYear,
    setSelectedAcademicYear,
    selectedSemester,
    setSelectedSemester,
    isDemoMode,
    resetToDemoData,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="relative bg-gradient-to-r from-[#0B2545] via-[#0F4C81] to-[#1565D8] text-white shadow-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 overflow-hidden border-b border-blue-400/20 z-20">
      {/* Background aesthetic tech-book glowing light effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400 via-blue-600 to-transparent" />
      <div className="absolute right-48 -bottom-10 opacity-15 pointer-events-none">
        <BookOpen className="w-56 h-56 text-cyan-200 transform -rotate-12" />
      </div>

      {/* Left: Branding & Teacher Info */}
      <div className="relative z-10 flex flex-col">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Văn học 4.0 – Hệ thống quản lý và hỗ trợ dạy học Ngữ văn
          </h2>
          {isDemoMode && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Dữ liệu minh họa
            </span>
          )}
        </div>
        <p className="text-sm md:text-base text-blue-100/90 font-medium mt-0.5 flex items-center gap-2">
          <span>Giáo viên: <strong className="text-white font-semibold">{teacherInfo.name}</strong></span>
          <span className="text-blue-300">|</span>
          <span>Trường: <strong className="text-white font-semibold">{teacherInfo.school}</strong></span>
          <span className="text-blue-300">|</span>
          <span>Bộ môn: <strong className="text-white font-semibold">{teacherInfo.subject}</strong></span>
        </p>
      </div>

      {/* Right Controls: Year/Semester selectors, Notifications, Avatar */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Academic Year & Semester selector */}
        <div className="hidden sm:flex items-center bg-black/25 backdrop-blur-md rounded-xl p-1 border border-white/15 text-xs font-medium">
          <select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            className="bg-transparent text-white px-2 py-1 rounded focus:outline-none cursor-pointer"
          >
            <option value="2026–2027" className="text-gray-900">Năm 2026–2027</option>
            <option value="2025–2026" className="text-gray-900">Năm 2025–2026</option>
          </select>
          <span className="text-white/40">|</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value as 'HK1' | 'HK2')}
            className="bg-transparent text-white px-2 py-1 rounded focus:outline-none cursor-pointer"
          >
            <option value="HK1" className="text-gray-900">Học kỳ 1</option>
            <option value="HK2" className="text-gray-900">Học kỳ 2</option>
          </select>
        </div>

        {/* Database & Firebase Status Button */}
        <button
          onClick={onOpenDbModal}
          title="Xem cấu hình Firebase & Cơ sở dữ liệu"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/20 transition-all text-blue-100 hover:text-white"
        >
          <Database className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden md:inline">Cơ sở dữ liệu</span>
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-blue-100 hover:text-white relative border border-white/15"
            title="Thông báo hệ thống"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0F4C81]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-[#132B50] rounded-xl shadow-2xl border border-gray-200 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-bold text-sm text-[#0B2545]">Thông báo chuyên môn</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">2 mới</span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="p-2 bg-blue-50/60 rounded-lg border-l-3 border-[#1565D8]">
                  <p className="font-semibold text-gray-900">12 bài tập cần chấm</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">Lớp 9A1: Phân tích đoạn trích "Làng" đã nộp 32/38 bài.</p>
                </div>
                <div className="p-2 bg-emerald-50/60 rounded-lg border-l-3 border-emerald-500">
                  <p className="font-semibold text-gray-900">Báo cáo giữa kỳ sẵn sàng</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">Đã hoàn thành tính điểm cho toàn bộ 4 lớp phụ trách.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teacher profile with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 ring-2 ring-white/40 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                alt="Dương Thành Tín"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="hidden lg:block leading-tight">
              <div className="text-sm font-bold text-white tracking-wide">
                {teacherInfo.name}
              </div>
              <div className="text-[11px] text-blue-200">
                {teacherInfo.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-blue-200" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-[#132B50] rounded-xl shadow-2xl border border-gray-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-sm">
              <div className="p-3 border-b border-gray-100 bg-slate-50 rounded-lg mb-1">
                <p className="font-bold text-gray-900">{teacherInfo.name}</p>
                <p className="text-xs text-gray-500">{teacherInfo.school}</p>
                <p className="text-xs text-blue-700 font-semibold mt-1">thanhtin.umx@gmail.com</p>
              </div>

              <button
                onClick={() => {
                  onOpenDbModal();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-800 text-left transition"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Hồ sơ & Phân quyền giáo viên</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu (152 học sinh, 4 lớp)?')) {
                    resetToDemoData();
                  }
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-800 text-left transition"
              >
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>Khôi phục dữ liệu mẫu</span>
              </button>

              <div className="border-t border-gray-100 my-1 pt-1">
                <button
                  onClick={() => {
                    alert('Hệ thống đang hoạt động ở chế độ phân quyền Giáo viên: Dương Thành Tín.');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-left transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
