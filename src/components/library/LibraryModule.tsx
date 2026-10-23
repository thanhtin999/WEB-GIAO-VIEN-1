import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  ExternalLink,
  FileText,
  Video,
  GitFork,
  Eye,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResourceType, TeachingResource } from '../../types';

export const LibraryModule: React.FC = () => {
  const { resources, addResource, deleteResource, teacherInfo } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewResource, setPreviewResource] = useState<TeachingResource | null>(null);

  // New resource form state
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState<number>(9);
  const [newType, setNewType] = useState<ResourceType>('GiaoAn');
  const [newTheme, setNewTheme] = useState('Truyện hiện đại Việt Nam');
  const [newLesson, setNewLesson] = useState('Tiết 51-53: Làng (Kim Lân)');
  const [newDescription, setNewDescription] = useState('');
  const [newDriveUrl, setNewDriveUrl] = useState('');

  const filteredResources = resources
    .filter((r) => (activeCategory === 'all' ? true : r.type === activeCategory))
    .filter((r) => (gradeFilter === 'all' ? true : r.grade === gradeFilter))
    .filter((r) =>
      searchTerm
        ? r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.lesson.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.theme.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addResource({
      code: `HL-${newGrade}-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      grade: newGrade,
      theme: newTheme,
      lesson: newLesson,
      type: newType,
      createdDate: new Date().toISOString().split('T')[0],
      description: newDescription,
      driveUrl: newDriveUrl || 'https://drive.google.com/drive/folders/sample',
      author: teacherInfo.name,
      fileSize: '1.5 MB',
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewDriveUrl('');
  };

  // Real download handler: generates text file blob with full resource metadata and lesson guide
  const handleDownloadFile = (res: TeachingResource) => {
    const content = `TRƯỜNG THCS PHAN BỘI CHÂU - KHO HỌC LIỆU SỐ
MÃ HỌC LIỆU: ${res.code}
TIÊU ĐỀ: ${res.title}
KHỐI LỚP: ${res.grade}
CHỦ ĐỀ: ${res.theme}
BÀI DẠY: ${res.lesson}
LOẠI HỌC LIỆU: ${res.type}
NGÀY TẠO: ${res.createdDate}
TÁC GIẢ: ${res.author}

NỘI DUNG TỔNG QUAN:
${res.description}

LIÊN KẾT ĐÁM MÂY GOOGLE DRIVE:
${res.driveUrl || 'https://drive.google.com/sample'}
--------------------------------------------------
Hệ thống Văn học 4.0 - Giáo viên Dương Thành Tín
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.code}_${res.title.replace(/[\s/]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1565D8] text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2545]">
              Thư viện Học liệu Ngữ văn THCS
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Kho giáo án điện tử, video bài giảng, sơ đồ tư duy và phiếu học tập phân hóa
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tải lên học liệu mới</span>
        </button>
      </div>

      {/* 4 Category Filter Cards from the reference image */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveCategory(activeCategory === 'GiaoAn' ? 'all' : 'GiaoAn')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
            activeCategory === 'GiaoAn'
              ? 'bg-rose-50 border-rose-400 shadow-md ring-1 ring-rose-300'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0B2545]">Giáo án</h4>
            <p className="text-xs text-rose-700 font-semibold">125 tài liệu</p>
          </div>
        </div>

        <div
          onClick={() => setActiveCategory(activeCategory === 'Video' ? 'all' : 'Video')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
            activeCategory === 'Video'
              ? 'bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-300'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#258BFF] text-white flex items-center justify-center shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0B2545]">Video bài giảng</h4>
            <p className="text-xs text-blue-700 font-semibold">48 video</p>
          </div>
        </div>

        <div
          onClick={() => setActiveCategory(activeCategory === 'SoDoTuDuy' ? 'all' : 'SoDoTuDuy')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
            activeCategory === 'SoDoTuDuy'
              ? 'bg-emerald-50 border-emerald-400 shadow-md ring-1 ring-emerald-300'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0B2545]">Sơ đồ tư duy</h4>
            <p className="text-xs text-emerald-700 font-semibold">62 sơ đồ</p>
          </div>
        </div>

        <div
          onClick={() => setActiveCategory(activeCategory === 'TaiLieu' ? 'all' : 'TaiLieu')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
            activeCategory === 'TaiLieu'
              ? 'bg-purple-50 border-purple-400 shadow-md ring-1 ring-purple-300'
              : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#0B2545]">Tài liệu tham khảo</h4>
            <p className="text-xs text-purple-700 font-semibold">210 tài liệu</p>
          </div>
        </div>
      </div>

      {/* Toolbar: Grade Filter & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-3">
        {/* Grade Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Khối lớp:</span>
          {(['all', 6, 7, 8, 9] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                gradeFilter === g
                  ? 'bg-[#1565D8] text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {g === 'all' ? 'Tất cả các khối' : `Khối ${g}`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tên bài học, chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 w-60 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Khối {res.grade} • {res.code}
                </span>
                <span className="text-xs text-slate-400">{res.createdDate}</span>
              </div>

              <h4 className="font-bold text-sm text-[#0B2545] leading-snug line-clamp-2 group-hover:text-blue-700 transition">
                {res.title}
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {res.theme} • {res.lesson}
              </p>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">{res.author}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewResource(res)}
                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  title="Xem chi tiết học liệu"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownloadFile(res)}
                  className="px-3 py-1.5 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold flex items-center gap-1 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải về</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD RESOURCE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Tải lên học liệu Ngữ văn mới</h3>
              <button onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateResource} className="p-5 space-y-3 text-xs text-[#132B50]">
              <div>
                <label className="font-bold block mb-1">Tên tài liệu / bài giảng:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giáo án chuyên đề bài thơ Đồng chí (Chính Hữu)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Khối lớp:</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Loại học liệu:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ResourceType)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="GiaoAn">Giáo án (Word/PDF)</option>
                    <option value="Video">Video bài giảng</option>
                    <option value="SoDoTuDuy">Sơ đồ tư duy</option>
                    <option value="TaiLieu">Tài liệu tham khảo</option>
                    <option value="PhieuHocTap">Phiếu học tập</option>
                    <option value="DeKiemTra">Đề kiểm tra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Chủ đề:</label>
                  <input
                    type="text"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Bài học / Tiết:</label>
                  <input
                    type="text"
                    value={newLesson}
                    onChange={(e) => setNewLesson(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Liên kết Google Drive (hoặc Cloud Storage):</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Mô tả tóm tắt nội dung sư phạm:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tóm tắt mục tiêu, phương pháp dạy học hoặc các bài tập tích hợp..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Thêm học liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{previewResource.title}</h3>
                <p className="text-xs text-blue-200">
                  {previewResource.code} • Khối {previewResource.grade}
                </p>
              </div>
              <button onClick={() => setPreviewResource(null)}>✕</button>
            </div>

            <div className="p-5 space-y-3 text-xs text-[#132B50]">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Chủ đề:</strong> {previewResource.theme}</p>
                <p><strong>Bài dạy:</strong> {previewResource.lesson}</p>
                <p><strong>Người soạn:</strong> {previewResource.author} (THCS Phan Bội Châu)</p>
                <p><strong>Ngày tạo:</strong> {previewResource.createdDate}</p>
              </div>

              <div>
                <strong className="block mb-1 text-slate-700">Mô tả sư phạm:</strong>
                <p className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 leading-relaxed text-slate-800">
                  {previewResource.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => {
                    deleteResource(previewResource.id);
                    setPreviewResource(null);
                  }}
                  className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Xóa học liệu
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadFile(previewResource)}
                    className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải tệp tin (.txt)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
