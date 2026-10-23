import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Users,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  Upload,
  UserCheck,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Eye,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SchoolClass, Student } from '../../types';
import { StudentProfileModal } from './StudentProfileModal';
import { ExcelImportModal } from '../common/ExcelImportModal';

export const ClassStudentModule: React.FC = () => {
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    transferStudentClass,
    selectedClassCode,
    setSelectedClassCode,
    teacherInfo,
    openStudentProfileId,
    setOpenStudentProfileId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'classes'>('students');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showImportExcelModal, setShowImportExcelModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [transferringStudent, setTransferringStudent] = useState<Student | null>(null);

  // New Class Form state
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassGrade, setNewClassGrade] = useState(9);
  const [newClassHomeroom, setNewClassHomeroom] = useState('Dương Thành Tín');
  const [newClassNote, setNewClassNote] = useState('');

  // New Student Form state
  const [newStdCode, setNewStdCode] = useState('');
  const [newStdName, setNewStdName] = useState('');
  const [newStdGender, setNewStdGender] = useState<'Nam' | 'Nữ'>('Nữ');
  const [newStdDob, setNewStdDob] = useState('2011-04-15');
  const [newStdClass, setNewStdClass] = useState(selectedClassCode);
  const [newStdNote, setNewStdNote] = useState('');

  // Filtered lists
  const currentClass = classes.find((c) => c.code === selectedClassCode) || classes[0];

  const filteredStudents = students
    .filter((s) => (selectedClassCode === 'ALL' ? true : s.classCode === selectedClassCode))
    .filter((s) => (gradeFilter === 'all' ? true : s.grade === gradeFilter))
    .filter((s) =>
      searchTerm
        ? s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  // Export current class list to Excel
  const handleExportStudentsExcel = () => {
    const dataToExport = filteredStudents.map((s, idx) => ({
      STT: idx + 1,
      'Mã Học Sinh': s.studentCode,
      'Họ và Tên': s.fullName,
      'Lớp': s.classCode,
      'Khối': s.grade,
      'Giới Tính': s.gender,
      'Ngày Sinh': s.dateOfBirth || '',
      'Trạng Thái': s.academicStatus,
      'Điểm Mạnh': s.strengths || '',
      'Kỹ Năng Cần Hoàn Thiện': s.improvementAreas || '',
      'Ghi Chú': s.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `HocSinh_${selectedClassCode}`);
    XLSX.writeFile(wb, `Danh_Sach_Hoc_Sinh_${selectedClassCode}_2026_2027.xlsx`);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassCode.trim()) return;
    addClass({
      code: newClassCode.trim().toUpperCase(),
      grade: Number(newClassGrade),
      academicYear: '2026–2027',
      subjectTeacher: teacherInfo.name,
      homeroomTeacher: newClassHomeroom.trim() || teacherInfo.name,
      studentCount: 0,
      maleCount: 0,
      femaleCount: 0,
      note: newClassNote,
    });
    setSelectedClassCode(newClassCode.trim().toUpperCase());
    setShowAddClassModal(false);
    setNewClassCode('');
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdCode.trim() || !newStdName.trim()) return;

    addStudent({
      studentCode: newStdCode.trim().toUpperCase(),
      fullName: newStdName.trim(),
      classCode: newStdClass,
      grade: parseInt(newStdClass[0]) || 9,
      gender: newStdGender,
      dateOfBirth: newStdDob,
      academicStatus: 'Đang học',
      notes: newStdNote,
    });

    setShowAddStudentModal(false);
    setNewStdCode('');
    setNewStdName('');
    setNewStdNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Controls & Navigation Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1565D8] text-white flex items-center justify-center shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B2545]">
              Quản lý Lớp học và Hồ sơ Học sinh
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Năm học 2026–2027 • Bộ môn Ngữ văn • THCS Phan Bội Châu
            </p>
          </div>
        </div>

        {/* Tab switcher: Học sinh vs Danh sách Lớp */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'students' ? 'bg-[#1565D8] text-white shadow' : 'hover:text-blue-700'
            }`}
          >
            Danh sách học sinh ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'classes' ? 'bg-[#1565D8] text-white shadow' : 'hover:text-blue-700'
            }`}
          >
            Quản lý các lớp ({classes.length})
          </button>
        </div>
      </div>

      {activeTab === 'students' ? (
        /* ======================================================== */
        /* TAB 1: QUẢN LÝ HỌC SINH                                 */
        /* ======================================================== */
        <div className="space-y-4">
          {/* Sub Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 flex flex-wrap items-center justify-between gap-3">
            {/* Class Pill Selectors */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedClassCode('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedClassCode === 'ALL'
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả các lớp
              </button>
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClassCode(c.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedClassCode === c.code
                      ? 'bg-[#1565D8] text-white shadow-sm'
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <span>Lớp {c.code}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {c.studentCount}
                  </span>
                </button>
              ))}
            </div>

            {/* Actions: Add Student, Import Excel, Export Excel, Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mã HS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm học sinh</span>
              </button>

              <button
                onClick={() => setShowImportExcelModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Nhập Excel</span>
              </button>

              <button
                onClick={handleExportStudentsExcel}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất Excel</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EBF3FF] text-[#132B50] font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 text-center">STT</th>
                    <th className="py-3 px-3">Mã học sinh</th>
                    <th className="py-3 px-3">Họ và tên</th>
                    <th className="py-3 px-3 text-center">Lớp</th>
                    <th className="py-3 px-3 text-center">Giới tính</th>
                    <th className="py-3 px-3">Ngày sinh</th>
                    <th className="py-3 px-3">Trạng thái</th>
                    <th className="py-3 px-3">Ghi chú chuyên môn</th>
                    <th className="py-3 px-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        Không tìm thấy học sinh nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => (
                      <tr
                        key={s.id}
                        className="hover:bg-blue-50/50 transition group"
                      >
                        <td className="py-2.5 px-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-[#1565D8]">{s.studentCode}</td>
                        <td className="py-2.5 px-3 font-bold text-[#0B2545]">{s.fullName}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800">
                            {s.classCode}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              s.gender === 'Nữ'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {s.gender}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{s.dateOfBirth || '—'}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {s.academicStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-[200px] truncate" title={s.notes || s.strengths}>
                          {s.strengths || s.notes || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setOpenStudentProfileId(s.id)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                              title="Xem hồ sơ chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setTransferringStudent(s)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                              title="Chuyển lớp học"
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Xóa học sinh ${s.fullName} (${s.studentCode}) khỏi hệ thống?`)) {
                                  deleteStudent(s.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                              title="Xóa học sinh"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Đang hiển thị {filteredStudents.length} học sinh</span>
              <span>Lớp đang chọn: <strong>{selectedClassCode}</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* TAB 2: QUẢN LÝ LỚP HỌC                                   */
        /* ======================================================== */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0B2545]">
              Danh sách các lớp giảng dạy ({classes.length} lớp)
            </h3>
            <button
              onClick={() => setShowAddClassModal(true)}
              className="px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm lớp mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-[#0B2545]">{cls.code}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Khối {cls.grade}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sĩ số:</span>
                      <strong className="text-slate-900">{cls.studentCount} học sinh</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nam / Nữ:</span>
                      <span>{cls.maleCount} Nam • {cls.femaleCount} Nữ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GV Chủ nhiệm:</span>
                      <span className="font-semibold text-slate-800">{cls.homeroomTeacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GV Bộ môn:</span>
                      <span>{cls.subjectTeacher}</span>
                    </div>
                    {cls.note && (
                      <p className="p-2 bg-slate-50 rounded-lg text-slate-500 italic mt-2">
                        {cls.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedClassCode(cls.code);
                      setActiveTab('students');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs text-center transition"
                  >
                    Xem học sinh
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Xác nhận xóa lớp ${cls.code}?`)) {
                        deleteClass(cls.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                    title="Xóa lớp"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: THÊM LỚP MỚI */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Thêm lớp học mới</h3>
              <button onClick={() => setShowAddClassModal(false)}>
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreateClass} className="p-5 space-y-3 text-xs text-[#132B50]">
              <div>
                <label className="font-bold block mb-1">Mã lớp (Ví dụ: 6A2, 8A1):</label>
                <input
                  type="text"
                  required
                  placeholder="6A2"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Khối lớp:</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Năm học:</label>
                  <input
                    type="text"
                    disabled
                    value="2026–2027"
                    className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Giáo viên chủ nhiệm:</label>
                <input
                  type="text"
                  value={newClassHomeroom}
                  onChange={(e) => setNewClassHomeroom(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Ghi chú lớp:</label>
                <textarea
                  rows={2}
                  value={newClassNote}
                  onChange={(e) => setNewClassNote(e.target.value)}
                  placeholder="Lớp năng khiếu, học sinh chuẩn bị bồi dưỡng..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM HỌC SINH MỚI */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Thêm học sinh mới</h3>
              <button onClick={() => setShowAddStudentModal(false)}>
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="p-5 space-y-3 text-xs text-[#132B50]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Mã học sinh:</label>
                  <input
                    type="text"
                    required
                    placeholder="HS0939"
                    value={newStdCode}
                    onChange={(e) => setNewStdCode(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Vào lớp:</label>
                  <select
                    value={newStdClass}
                    onChange={(e) => setNewStdClass(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.code}>
                        Lớp {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn An"
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Giới tính:</label>
                  <select
                    value={newStdGender}
                    onChange={(e) => setNewStdGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Nữ">Nữ</option>
                    <option value="Nam">Nam</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Ngày sinh:</label>
                  <input
                    type="date"
                    value={newStdDob}
                    onChange={(e) => setNewStdDob(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Ghi chú chuyên môn:</label>
                <textarea
                  rows={2}
                  value={newStdNote}
                  onChange={(e) => setNewStdNote(e.target.value)}
                  placeholder="Ghi chú năng lực hoặc yêu cầu giáo dục riêng..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Thêm học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHUYỂN LỚP */}
      {transferringStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-sm overflow-hidden p-5 text-xs text-[#132B50]">
            <h3 className="font-bold text-sm text-[#0B2545] mb-2">
              Chuyển lớp cho học sinh: {transferringStudent.fullName}
            </h3>
            <p className="text-slate-500 mb-3">
              Lớp hiện tại: <strong>{transferringStudent.classCode}</strong> (Mã: {transferringStudent.studentCode})
            </p>
            <label className="font-bold block mb-1">Chọn lớp mới:</label>
            <select
              id="new-transfer-class"
              defaultValue={classes.find((c) => c.code !== transferringStudent.classCode)?.code || '9A1'}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.code}>
                  Lớp {c.code}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTransferringStudent(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 font-bold"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  const targetSelect = document.getElementById('new-transfer-class') as HTMLSelectElement;
                  if (targetSelect) {
                    transferStudentClass(transferringStudent.id, targetSelect.value);
                  }
                  setTransferringStudent(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1565D8] hover:bg-blue-700 text-white font-bold shadow-md"
              >
                Xác nhận chuyển lớp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXCEL IMPORT MODAL */}
      {showImportExcelModal && (
        <ExcelImportModal
          onClose={() => setShowImportExcelModal(false)}
          targetClassCode={selectedClassCode === 'ALL' ? '9A1' : selectedClassCode}
        />
      )}

      {/* STUDENT PROFILE MODAL */}
      {openStudentProfileId && (
        <StudentProfileModal
          studentId={openStudentProfileId}
          onClose={() => setOpenStudentProfileId(null)}
        />
      )}
    </div>
  );
};
