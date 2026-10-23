import React from 'react';
import {
  Home,
  Users,
  FileText,
  TrendingUp,
  ClipboardList,
  BookOpen,
  Bot,
  PieChart,
  BookMarked,
  Feather,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveModule } from '../../types';

interface NavItem {
  id: ActiveModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Tổng quan', icon: Home },
  { id: 'classes', label: 'Quản lý lớp học và học sinh', icon: Users },
  { id: 'gradebook', label: 'Sổ điểm Ngữ văn', icon: FileText },
  { id: 'competency', label: 'Phân tích năng lực học sinh', icon: TrendingUp },
  { id: 'assignments', label: 'Bài tập và bài kiểm tra', icon: ClipboardList },
  { id: 'library', label: 'Thư viện học liệu Ngữ văn', icon: BookOpen },
  { id: 'ai', label: 'Trợ lý AI môn Ngữ văn', icon: Bot },
  { id: 'reports', label: 'Báo cáo và thống kê', icon: PieChart },
];

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule } = useApp();

  return (
    <aside className="w-[250px] lg:w-[260px] shrink-0 bg-gradient-to-b from-[#0B2545] via-[#0D3465] to-[#081B33] text-white flex flex-col justify-between shadow-2xl z-30 select-none">
      {/* Top Logo and Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-blue-900/50 bg-[#0B2545]/70">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1565D8] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/40">
            <BookMarked className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white drop-shadow">
              VĂN HỌC 4.0
            </h1>
            <p className="text-xs text-blue-200 tracking-wider uppercase font-semibold">
              THCS PHAN BỘI CHÂU
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5 mt-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-[15px] font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#258BFF] to-[#1565D8] text-white shadow-md shadow-blue-600/40 font-semibold'
                    : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-blue-300'
                  }`}
                />
                <span className="leading-snug">{item.label}</span>
                {isActive && (
                  <span className="absolute right-2.5 w-1.5 h-6 bg-cyan-300 rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Literary Quote Banner matching reference image */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-[#13386B]/80 to-[#0A1E38]/90 border border-blue-400/20 shadow-inner relative overflow-hidden text-center group">
        <div className="absolute -right-3 -bottom-3 opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
          <Feather className="w-20 h-20 text-cyan-300" />
        </div>
        <div className="relative z-10">
          <p className="text-sm italic font-serif text-cyan-200 leading-relaxed drop-shadow">
            “Văn chương là nhân học.”
          </p>
          <p className="text-xs text-blue-300/80 mt-1 font-serif">
            – Nguyễn Đình Thi –
          </p>
          <div className="mt-2.5 pt-2 border-t border-blue-400/20 flex items-center justify-center gap-1.5 text-[11px] text-blue-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Học kỳ I • Năm 2026–2027</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
