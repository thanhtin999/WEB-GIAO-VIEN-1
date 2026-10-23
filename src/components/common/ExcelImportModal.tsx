import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, X, Check, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

interface ExcelImportModalProps {
  onClose: () => void;
  targetClassCode: string;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  onClose,
  targetClassCode,
}) => {
  const { importStudentsBatch } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [previewStudents, setPreviewStudents] = useState<Partial<Student>[]>([]);
  const [importResult, setImportResult] = useState<{ added: number; errors: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (data.length <= 1) {
          alert('Tệp không có dữ liệu học sinh!');
          setIsLoading(false);
          return;
        }

        // Auto-detect header row
        const headers = (data[0] as string[]).map((h) => String(h || '').trim().toLowerCase());
        const rows = data.slice(1) as any[];

        setParsedRows(rows);

        // Map columns
        const codeIdx = headers.findIndex((h) => h.includes('mã') || h.includes('id') || h.includes('code'));
        const nameIdx = headers.findIndex((h) => h.includes('tên') || h.includes('họ'));
        const genderIdx = headers.findIndex((h) => h.includes('giới') || h.includes('phái'));
        const dobIdx = headers.findIndex((h) => h.includes('sinh') || h.includes('ngày'));

        const mapped: Partial<Student>[] = rows
          .filter((r) => r.length > 0 && (r[nameIdx !== -1 ? nameIdx : 1] || r[0]))
          .map((r, i) => {
            const rawCode = codeIdx !== -1 ? r[codeIdx] : r[1] || `HS${targetClassCode}${String(i + 1).padStart(2, '0')}`;
            const rawName = nameIdx !== -1 ? r[nameIdx] : r[2] || r[1] || 'Học sinh';
            const rawGender = genderIdx !== -1 ? r[genderIdx] : 'Nam';
            const rawDob = dobIdx !== -1 ? r[dobIdx] : '2011-01-01';

            return {
              studentCode: String(rawCode).trim().toUpperCase(),
              fullName: String(rawName).trim(),
              classCode: targetClassCode,
              gender: String(rawGender).toLowerCase().includes('nữ') ? 'Nữ' : 'Nam',
              dateOfBirth: String(rawDob),
              academicStatus: 'Đang học',
              notes: 'Nhập từ file Excel',
            };
          });

        setPreviewStudents(mapped);
      } catch (err) {
        console.error(err);
        alert('Lỗi đọc tệp Excel. Vui lòng đảm bảo tệp định dạng .xlsx hoặc .csv hợp lệ.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleConfirmImport = () => {
    if (previewStudents.length === 0) return;
    const res = importStudentsBatch(previewStudents);
    setImportResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 w-full max-w-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B2545] to-[#1565D8] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-300" />
            <h3 className="font-bold text-base">Nhập danh sách học sinh từ Excel / CSV – Lớp {targetClassCode}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-[#132B50] max-h-[75vh] overflow-y-auto">
          {!file ? (
            <div className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center hover:border-blue-400 transition bg-blue-50/30">
              <Upload className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <p className="font-bold text-sm text-[#0B2545]">Kéo thả tệp Excel (.xlsx, .xls) hoặc bấm để chọn</p>
              <p className="text-slate-500 mt-1">Cột tối thiểu yêu cầu: Mã học sinh, Họ và tên (hoặc tự sinh mã theo lớp).</p>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-file-input"
              />
              <label
                htmlFor="excel-file-input"
                className="mt-4 inline-block px-4 py-2 rounded-xl bg-[#1565D8] hover:bg-blue-700 text-white font-bold cursor-pointer transition shadow-md"
              >
                Chọn tệp từ máy tính
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="font-bold text-slate-800">{file.name}</p>
                  <p className="text-slate-500">Tìm thấy {previewStudents.length} học sinh sẵn sàng nhập.</p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewStudents([]);
                    setImportResult(null);
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Chọn tệp khác
                </button>
              </div>

              {/* Preview Table */}
              <div>
                <p className="font-bold mb-1.5 text-slate-700">Xem trước dữ liệu (Trước khi lưu vào hệ thống):</p>
                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 sticky top-0 text-[#0B2545] font-bold">
                      <tr>
                        <th className="p-2">STT</th>
                        <th className="p-2">Mã HS</th>
                        <th className="p-2">Họ và tên</th>
                        <th className="p-2">Giới tính</th>
                        <th className="p-2">Lớp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewStudents.slice(0, 30).map((s, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50">
                          <td className="p-2 text-slate-500">{idx + 1}</td>
                          <td className="p-2 font-bold text-blue-800">{s.studentCode}</td>
                          <td className="p-2 font-semibold text-slate-800">{s.fullName}</td>
                          <td className="p-2">{s.gender}</td>
                          <td className="p-2">{s.classCode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Result Summary */}
              {importResult && (
                <div className="p-3 rounded-xl border space-y-1.5 animate-in fade-in bg-slate-50">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <Check className="w-4 h-4" /> Đã nhập thành công {importResult.added} học sinh vào lớp {targetClassCode}!
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="text-amber-800 font-medium">
                      <p className="flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Bỏ qua {importResult.errors.length} dòng lỗi:
                      </p>
                      <ul className="list-disc pl-5 max-h-24 overflow-y-auto text-[11px] text-amber-700 mt-1">
                        {importResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Kiểm tra mã trùng lặp tự động trước khi ghi đè.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-xs transition"
            >
              Đóng
            </button>
            {previewStudents.length > 0 && !importResult && (
              <button
                onClick={handleConfirmImport}
                className="px-4 py-1.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <Check className="w-4 h-4" /> Xác nhận nhập vào lớp {targetClassCode}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
