export type ActiveModule =
  | 'overview'
  | 'classes'
  | 'gradebook'
  | 'competency'
  | 'assignments'
  | 'library'
  | 'ai'
  | 'reports';

export interface SchoolClass {
  id: string;
  code: string; // e.g. "6A1", "7A1", "8A2", "9A1"
  grade: number; // 6, 7, 8, 9
  academicYear: string; // "2026–2027"
  subjectTeacher: string; // "Dương Thành Tín"
  homeroomTeacher: string; // "Dương Thành Tín"
  studentCount: number;
  maleCount: number;
  femaleCount: number;
  note?: string;
}

export interface Student {
  id: string;
  studentCode: string; // Unique e.g. "HS0901"
  fullName: string;
  classCode: string;
  grade: number;
  gender: 'Nam' | 'Nữ';
  dateOfBirth?: string;
  academicStatus: 'Đang học' | 'Chuyển trường' | 'Nghỉ học';
  strengths?: string;
  improvementAreas?: string;
  personalPlan?: string;
  notes?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  classCode: string;
  academicYear: string;
  semester: 'HK1' | 'HK2';
  txScores: (number | null)[]; // Thường xuyên: TX1, TX2, TX3...
  gkScore: number | null; // Giữa kỳ
  ckScore: number | null; // Cuối kỳ
  tbScore: number | null; // Điểm trung bình học kỳ
  tbYearScore?: number | null; // Điểm trung bình cả năm
  classification?: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt' | 'Chưa đạt' | 'Chưa đủ điểm';
  notes?: string;
  lastModified?: string;
  modifiedBy?: string;
}

export interface GradeAudit {
  id: string;
  timestamp: string;
  studentCode: string;
  studentName: string;
  classCode: string;
  field: string;
  oldValue: any;
  newValue: any;
  modifiedBy: string;
}

export interface CompetencyData {
  reading: number; // Đọc hiểu (0-10)
  writing: number; // Viết (0-10)
  speaking: number; // Nói (0-10)
  listening: number; // Nghe (0-10)
}

export interface StudentCompetencyRecord {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classCode: string;
  scores: CompetencyData;
  evaluatedAt: string;
  rubricNotes?: string;
  needsAttention?: boolean;
  recommendedExercises?: string[];
}

export type AssignmentType =
  | 'TracNghiem'
  | 'DocHieu'
  | 'VietDoan'
  | 'VietBai'
  | 'NghiLuanXaHoi'
  | 'NghiLuanVanHoc'
  | 'ThuyetTrinh'
  | 'LuyenTap';

export interface Assignment {
  id: string;
  title: string;
  classCode: string;
  grade: number;
  type: AssignmentType;
  assignedDate: string;
  dueDate: string;
  totalStudents: number;
  submittedCount: number;
  inProgressCount: number;
  notSubmittedCount: number;
  description: string;
  status: 'Active' | 'Closed' | 'Draft';
  badgeColor?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  classCode: string;
  submittedAt?: string;
  status: 'DaNop' | 'DangLam' | 'ChuaNop' | 'NopMuon' | 'DaCham';
  score?: number | null;
  content?: string;
  teacherFeedback?: string;
  aiSuggestion?: {
    strengths: string;
    weaknesses: string;
    revisionTips: string;
    suggestedComment: string;
  };
}

export type ResourceType =
  | 'GiaoAn'
  | 'Video'
  | 'SoDoTuDuy'
  | 'TaiLieu'
  | 'PhieuHocTap'
  | 'DeKiemTra'
  | 'VanBan'
  | 'TuongTac';

export interface TeachingResource {
  id: string;
  code: string;
  title: string;
  grade: number;
  theme: string;
  lesson: string;
  type: ResourceType;
  createdDate: string;
  description: string;
  fileUrl?: string;
  driveUrl?: string;
  author: string;
  fileSize?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  toolType?: string;
}
