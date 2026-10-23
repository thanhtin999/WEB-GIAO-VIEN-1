import {
  SchoolClass,
  Student,
  GradeRecord,
  Assignment,
  TeachingResource,
  StudentCompetencyRecord,
} from '../types';

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'class-6a1',
    code: '6A1',
    grade: 6,
    academicYear: '2026–2027',
    subjectTeacher: 'Dương Thành Tín',
    homeroomTeacher: 'Dương Thành Tín',
    studentCount: 38,
    maleCount: 18,
    femaleCount: 20,
    note: 'Lớp chọn khối 6, năng nổ thảo luận, tích cực tham gia các bài nói và nghe.',
  },
  {
    id: 'class-7a1',
    code: '7A1',
    grade: 7,
    academicYear: '2026–2027',
    subjectTeacher: 'Dương Thành Tín',
    homeroomTeacher: 'Dương Thành Tín',
    studentCount: 36,
    maleCount: 17,
    femaleCount: 19,
    note: 'Kỹ năng đọc hiểu văn bản thơ văn tốt, cần rèn luyện thêm kỹ năng viết đoạn văn biểu cảm.',
  },
  {
    id: 'class-8a2',
    code: '8A2',
    grade: 8,
    academicYear: '2026–2027',
    subjectTeacher: 'Dương Thành Tín',
    homeroomTeacher: 'Dương Thành Tín',
    studentCount: 40,
    maleCount: 21,
    femaleCount: 19,
    note: 'Học sinh có tư duy phản biện mạnh, tích cực với các đề tài nghị luận xã hội.',
  },
  {
    id: 'class-9a1',
    code: '9A1',
    grade: 9,
    academicYear: '2026–2027',
    subjectTeacher: 'Dương Thành Tín',
    homeroomTeacher: 'Dương Thành Tín',
    studentCount: 38,
    maleCount: 19,
    femaleCount: 19,
    note: 'Lớp chuẩn bị thi vào 10 chuyên, điểm trung bình cao, kỹ năng phân tích tác phẩm sâu sắc.',
  },
];

// Helper to calculate semester GPA: (sum(TX) + 2*GK + 3*CK) / (count(TX) + 5)
export function calculateSemesterGPA(tx: (number | null)[], gk: number | null, ck: number | null): {
  tb: number | null;
  classification: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt' | 'Chưa đạt' | 'Chưa đủ điểm';
} {
  const validTx = tx.filter((v): v is number => typeof v === 'number' && !isNaN(v));
  if (validTx.length === 0 || gk === null || ck === null || isNaN(gk) || isNaN(ck)) {
    return { tb: null, classification: 'Chưa đủ điểm' };
  }
  const sumTx = validTx.reduce((acc, v) => acc + v, 0);
  const totalWeight = validTx.length + 2 + 3;
  const weightedSum = sumTx + 2 * gk + 3 * ck;
  const tb = Math.round((weightedSum / totalWeight) * 10) / 10;

  let classification: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt' | 'Chưa đạt' = 'Chưa đạt';
  if (tb >= 9.0) classification = 'Xuất sắc';
  else if (tb >= 8.0) classification = 'Giỏi';
  else if (tb >= 6.5) classification = 'Khá';
  else if (tb >= 5.0) classification = 'Đạt';

  return { tb, classification };
}

// Generate the 38 students for Class 9A1 matching the reference image exactly
const class9A1Raw = [
  { stt: 1, name: 'Nguyễn Minh Anh', code: 'HS0901', gender: 'Nữ', tx1: 8.0, tx2: 8.5, gk: 7.5, ck: 8.0 },
  { stt: 2, name: 'Trần Hoàng Bảo', code: 'HS0902', gender: 'Nam', tx1: 7.0, tx2: 7.5, gk: 6.5, ck: 7.0 },
  { stt: 3, name: 'Lê Thị Cẩm Chi', code: 'HS0903', gender: 'Nữ', tx1: 9.0, tx2: 8.5, gk: 9.0, ck: 8.5 },
  { stt: 4, name: 'Phạm Gia Hân', code: 'HS0904', gender: 'Nữ', tx1: 6.5, tx2: 7.0, gk: 6.0, ck: 6.5 },
  { stt: 5, name: 'Vũ Quang Huy', code: 'HS0905', gender: 'Nam', tx1: 7.5, tx2: 7.0, gk: 8.0, ck: 7.5 },
  { stt: 6, name: 'Đặng Trúc Linh', code: 'HS0906', gender: 'Nữ', tx1: 8.0, tx2: 8.5, gk: 8.0, ck: 9.0 },
  { stt: 7, name: 'Bùi Đức Nam', code: 'HS0907', gender: 'Nam', tx1: 8.0, tx2: 8.0, gk: 7.0, ck: 8.0 },
  { stt: 8, name: 'Hoàng Yến Nhi', code: 'HS0908', gender: 'Nữ', tx1: 9.0, tx2: 9.0, gk: 8.5, ck: 9.0 },
  { stt: 9, name: 'Ngô Tuấn Kiệt', code: 'HS0909', gender: 'Nam', tx1: 7.5, tx2: 8.0, gk: 7.5, ck: 7.5 },
  { stt: 10, name: 'Đỗ Thảo My', code: 'HS0910', gender: 'Nữ', tx1: 8.5, tx2: 8.5, gk: 8.5, ck: 8.5 },
  { stt: 11, name: 'Phan Minh Khang', code: 'HS0911', gender: 'Nam', tx1: 7.0, tx2: 7.0, gk: 7.5, ck: 7.0 },
  { stt: 12, name: 'Trịnh Bảo Ngọc', code: 'HS0912', gender: 'Nữ', tx1: 8.0, tx2: 8.5, gk: 8.0, ck: 8.5 },
  { stt: 13, name: 'Lý Quốc Huy', code: 'HS0913', gender: 'Nam', tx1: 6.5, tx2: 7.5, gk: 7.0, ck: 7.0 },
  { stt: 14, name: 'Dương Mai Phương', code: 'HS0914', gender: 'Nữ', tx1: 9.0, tx2: 9.5, gk: 9.0, ck: 9.0 },
  { stt: 15, name: 'Hồ Văn Long', code: 'HS0915', gender: 'Nam', tx1: 7.5, tx2: 7.5, gk: 7.0, ck: 7.5 },
  { stt: 16, name: 'Lâm Khánh Vy', code: 'HS0916', gender: 'Nữ', tx1: 8.5, tx2: 8.0, gk: 8.0, ck: 8.5 },
  { stt: 17, name: 'Chu Đình Trọng', code: 'HS0917', gender: 'Nam', tx1: 7.0, tx2: 7.5, gk: 7.5, ck: 7.0 },
  { stt: 18, name: 'Võ Thanh Hà', code: 'HS0918', gender: 'Nữ', tx1: 8.0, tx2: 8.5, gk: 8.5, ck: 8.0 },
  { stt: 19, name: 'Mai Anh Tuấn', code: 'HS0919', gender: 'Nam', tx1: 7.5, tx2: 8.0, gk: 7.5, ck: 8.0 },
  { stt: 20, name: 'Tạ Minh Châu', code: 'HS0920', gender: 'Nữ', tx1: 9.0, tx2: 8.5, gk: 9.0, ck: 9.0 },
  { stt: 21, name: 'Nguyễn Tấn Đạt', code: 'HS0921', gender: 'Nam', tx1: 7.0, tx2: 7.0, gk: 6.5, ck: 7.0 },
  { stt: 22, name: 'Đoàn Thị Hồng', code: 'HS0922', gender: 'Nữ', tx1: 8.0, tx2: 8.0, gk: 8.0, ck: 8.0 },
  { stt: 23, name: 'Lương Việt Thắng', code: 'HS0923', gender: 'Nam', tx1: 7.5, tx2: 7.5, gk: 8.0, ck: 7.5 },
  { stt: 24, name: 'Nguyễn Bích Thủy', code: 'HS0924', gender: 'Nữ', tx1: 8.5, tx2: 8.5, gk: 8.0, ck: 8.5 },
  { stt: 25, name: 'Vũ Đức Thành', code: 'HS0925', gender: 'Nam', tx1: 6.5, tx2: 7.0, gk: 7.0, ck: 7.0 },
  { stt: 26, name: 'Phạm Quỳnh Nga', code: 'HS0926', gender: 'Nữ', tx1: 9.0, tx2: 9.0, gk: 9.0, ck: 9.0 },
  { stt: 27, name: 'Thái Hoàng Hải', code: 'HS0927', gender: 'Nam', tx1: 7.5, tx2: 8.0, gk: 7.5, ck: 7.5 },
  { stt: 28, name: 'Tạ Hương Giang', code: 'HS0928', gender: 'Nữ', tx1: 8.5, tx2: 8.0, gk: 8.5, ck: 8.5 },
  { stt: 29, name: 'Quách Hùng Dũng', code: 'HS0929', gender: 'Nam', tx1: 7.0, tx2: 7.5, gk: 7.0, ck: 7.0 },
  { stt: 30, name: 'Dương Kim Ngân', code: 'HS0930', gender: 'Nữ', tx1: 8.0, tx2: 8.5, gk: 8.0, ck: 8.0 },
  { stt: 31, name: 'Lê Gia Bảo', code: 'HS0931', gender: 'Nam', tx1: 8.0, tx2: 8.0, gk: 8.5, ck: 8.0 },
  { stt: 32, name: 'Nguyễn Thùy Dương', code: 'HS0932', gender: 'Nữ', tx1: 8.5, tx2: 9.0, gk: 8.5, ck: 8.5 },
  { stt: 33, name: 'Cao Nhật Minh', code: 'HS0933', gender: 'Nam', tx1: 7.5, tx2: 7.0, gk: 7.5, ck: 7.5 },
  { stt: 34, name: 'Trần Tuyết Mai', code: 'HS0934', gender: 'Nữ', tx1: 8.0, tx2: 8.0, gk: 8.0, ck: 8.0 },
  { stt: 35, name: 'Hoàng Thế Vinh', code: 'HS0935', gender: 'Nam', tx1: 7.0, tx2: 7.5, gk: 7.0, ck: 7.5 },
  { stt: 36, name: 'Ngô Khánh An', code: 'HS0936', gender: 'Nữ', tx1: 8.5, tx2: 8.5, gk: 8.5, ck: 8.5 },
  { stt: 37, name: 'Đặng Khắc Tiệp', code: 'HS0937', gender: 'Nam', tx1: 7.5, tx2: 8.0, gk: 7.0, ck: 7.5 },
  { stt: 38, name: 'Trần Diệu Hương', code: 'HS0938', gender: 'Nữ', tx1: 9.0, tx2: 9.0, gk: 9.0, ck: 9.5 },
];

export function generateSeedData(): {
  students: Student[];
  grades: GradeRecord[];
  competencies: StudentCompetencyRecord[];
} {
  const students: Student[] = [];
  const grades: GradeRecord[] = [];
  const competencies: StudentCompetencyRecord[] = [];

  // 1. Process Class 9A1 (38 students)
  class9A1Raw.forEach((row) => {
    const student: Student = {
      id: `std-${row.code}`,
      studentCode: row.code,
      fullName: row.name,
      classCode: '9A1',
      grade: 9,
      gender: row.gender as 'Nam' | 'Nữ',
      dateOfBirth: '2011-04-15',
      academicStatus: 'Đang học',
      strengths: row.ck >= 8.5 ? 'Tư duy cảm thụ văn học sâu sắc, cảm quan ngôn từ sắc sảo' : 'Nắm chắc kiến thức cơ bản, trình bày rõ ràng',
      improvementAreas: row.ck < 8.0 ? 'Cần rèn luyện tính khái quát và liên hệ thực tiễn trong bài văn nghị luận' : 'Chăm chút thêm tính liên kết câu',
      notes: 'Học sinh lớp 9 chuẩn bị thi tuyển sinh',
    };
    students.push(student);

    const { tb, classification } = calculateSemesterGPA([row.tx1, row.tx2], row.gk, row.ck);
    const gradeRec: GradeRecord = {
      id: `grade-${row.code}-hk1`,
      studentId: student.id,
      studentCode: row.code,
      fullName: row.name,
      classCode: '9A1',
      academicYear: '2026–2027',
      semester: 'HK1',
      txScores: [row.tx1, row.tx2],
      gkScore: row.gk,
      ckScore: row.ck,
      tbScore: tb,
      classification,
      notes: row.stt <= 6 ? 'Đạt kết quả học tập xuất sắc theo bảng tổng quan' : '',
      lastModified: '2026-10-20 14:30',
      modifiedBy: 'Dương Thành Tín',
    };
    grades.push(gradeRec);

    competencies.push({
      id: `comp-${row.code}`,
      studentId: student.id,
      studentCode: row.code,
      studentName: row.name,
      classCode: '9A1',
      scores: {
        reading: Math.min(10, Math.round((row.gk + 0.3) * 10) / 10),
        writing: Math.min(10, Math.round((row.ck - 0.2) * 10) / 10),
        speaking: Math.min(10, Math.round((row.tx1 - 0.4) * 10) / 10),
        listening: Math.min(10, Math.round((row.tx2 - 0.3) * 10) / 10),
      },
      evaluatedAt: '2026-10-18',
      needsAttention: (row.gk < 7.0 || row.ck < 7.0),
    });
  });

  // 2. Class 8A2 (40 students: 21 Nam, 19 Nữ)
  const maleFirstNames = ['Anh', 'Bình', 'Cường', 'Dũng', 'Đức', 'Hải', 'Huy', 'Khoa', 'Long', 'Minh', 'Nam', 'Phong', 'Quân', 'Sơn', 'Thắng', 'Tú', 'Việt', 'Vũ', 'Trí', 'Phúc', 'Lâm'];
  const femaleFirstNames = ['An', 'Chi', 'Dung', 'Hà', 'Hân', 'Hiền', 'Hương', 'Linh', 'Mai', 'My', 'Ngân', 'Ngọc', 'Nhi', 'Phương', 'Quỳnh', 'Thảo', 'Trang', 'Trúc', 'Vy'];
  const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
  const middleMale = ['Văn', 'Đình', 'Hữu', 'Quang', 'Minh', 'Quốc', 'Tuấn'];
  const middleFemale = ['Thị', 'Ngọc', 'Thanh', 'Mai', 'Khánh', 'Như', 'Bích'];

  for (let i = 1; i <= 40; i++) {
    const isMale = i <= 21;
    const lName = lastNames[(i * 3) % lastNames.length];
    const mName = isMale ? middleMale[(i * 2) % middleMale.length] : middleFemale[(i * 2) % middleFemale.length];
    const fName = isMale ? maleFirstNames[(i - 1) % maleFirstNames.length] : femaleFirstNames[(i - 22) % femaleFirstNames.length];
    const code = `HS08${String(i).padStart(2, '0')}`;
    const name = `${lName} ${mName} ${fName}`;

    const student: Student = {
      id: `std-${code}`,
      studentCode: code,
      fullName: name,
      classCode: '8A2',
      grade: 8,
      gender: isMale ? 'Nam' : 'Nữ',
      dateOfBirth: '2012-05-10',
      academicStatus: 'Đang học',
      notes: 'Lớp 8A2',
    };
    students.push(student);

    // Target class average ~ 7.8
    const base = 7.5 + ((i % 5) - 2) * 0.4;
    const tx1 = Math.min(10, Math.max(5.0, Math.round((base + 0.3) * 10) / 10));
    const tx2 = Math.min(10, Math.max(5.0, Math.round((base - 0.2) * 10) / 10));
    const gk = Math.min(10, Math.max(5.0, Math.round((base + 0.1) * 10) / 10));
    const ck = Math.min(10, Math.max(5.0, Math.round((base + 0.4) * 10) / 10));
    const { tb, classification } = calculateSemesterGPA([tx1, tx2], gk, ck);

    grades.push({
      id: `grade-${code}-hk1`,
      studentId: student.id,
      studentCode: code,
      fullName: name,
      classCode: '8A2',
      academicYear: '2026–2027',
      semester: 'HK1',
      txScores: [tx1, tx2],
      gkScore: gk,
      ckScore: ck,
      tbScore: tb,
      classification,
      lastModified: '2026-10-19 11:20',
      modifiedBy: 'Dương Thành Tín',
    });

    competencies.push({
      id: `comp-${code}`,
      studentId: student.id,
      studentCode: code,
      studentName: name,
      classCode: '8A2',
      scores: {
        reading: Math.min(10, Math.round((base + 0.3) * 10) / 10),
        writing: Math.min(10, Math.round((base - 0.3) * 10) / 10),
        speaking: Math.min(10, Math.round((base - 0.5) * 10) / 10),
        listening: Math.min(10, Math.round((base + 0.2) * 10) / 10),
      },
      evaluatedAt: '2026-10-18',
      needsAttention: tb !== null && tb < 6.5,
    });
  }

  // 3. Class 7A1 (36 students: 17 Nam, 19 Nữ)
  for (let i = 1; i <= 36; i++) {
    const isMale = i <= 17;
    const lName = lastNames[(i * 5) % lastNames.length];
    const mName = isMale ? middleMale[(i * 3) % middleMale.length] : middleFemale[(i * 3) % middleFemale.length];
    const fName = isMale ? maleFirstNames[(i - 1) % maleFirstNames.length] : femaleFirstNames[(i - 18) % femaleFirstNames.length];
    const code = `HS07${String(i).padStart(2, '0')}`;
    const name = `${lName} ${mName} ${fName}`;

    const student: Student = {
      id: `std-${code}`,
      studentCode: code,
      fullName: name,
      classCode: '7A1',
      grade: 7,
      gender: isMale ? 'Nam' : 'Nữ',
      dateOfBirth: '2013-09-12',
      academicStatus: 'Đang học',
      notes: 'Lớp 7A1',
    };
    students.push(student);

    // Target class average ~ 7.5
    const base = 7.3 + ((i % 5) - 2) * 0.4;
    const tx1 = Math.min(10, Math.max(5.0, Math.round((base + 0.2) * 10) / 10));
    const tx2 = Math.min(10, Math.max(5.0, Math.round((base - 0.1) * 10) / 10));
    const gk = Math.min(10, Math.max(5.0, Math.round((base + 0.1) * 10) / 10));
    const ck = Math.min(10, Math.max(5.0, Math.round((base + 0.3) * 10) / 10));
    const { tb, classification } = calculateSemesterGPA([tx1, tx2], gk, ck);

    grades.push({
      id: `grade-${code}-hk1`,
      studentId: student.id,
      studentCode: code,
      fullName: name,
      classCode: '7A1',
      academicYear: '2026–2027',
      semester: 'HK1',
      txScores: [tx1, tx2],
      gkScore: gk,
      ckScore: ck,
      tbScore: tb,
      classification,
      lastModified: '2026-10-18 10:15',
      modifiedBy: 'Dương Thành Tín',
    });

    competencies.push({
      id: `comp-${code}`,
      studentId: student.id,
      studentCode: code,
      studentName: name,
      classCode: '7A1',
      scores: {
        reading: Math.min(10, Math.round((base + 0.4) * 10) / 10),
        writing: Math.min(10, Math.round((base - 0.2) * 10) / 10),
        speaking: Math.min(10, Math.round((base - 0.6) * 10) / 10),
        listening: Math.min(10, Math.round((base + 0.1) * 10) / 10),
      },
      evaluatedAt: '2026-10-18',
      needsAttention: tb !== null && tb < 6.5,
    });
  }

  // 4. Class 6A1 (38 students: 18 Nam, 20 Nữ)
  for (let i = 1; i <= 38; i++) {
    const isMale = i <= 18;
    const lName = lastNames[(i * 7) % lastNames.length];
    const mName = isMale ? middleMale[(i * 4) % middleMale.length] : middleFemale[(i * 4) % middleFemale.length];
    const fName = isMale ? maleFirstNames[(i - 1) % maleFirstNames.length] : femaleFirstNames[(i - 19) % femaleFirstNames.length];
    const code = `HS06${String(i).padStart(2, '0')}`;
    const name = `${lName} ${mName} ${fName}`;

    const student: Student = {
      id: `std-${code}`,
      studentCode: code,
      fullName: name,
      classCode: '6A1',
      grade: 6,
      gender: isMale ? 'Nam' : 'Nữ',
      dateOfBirth: '2014-02-28',
      academicStatus: 'Đang học',
      notes: 'Lớp 6A1',
    };
    students.push(student);

    // Target class average ~ 7.2
    const base = 7.0 + ((i % 5) - 2) * 0.4;
    const tx1 = Math.min(10, Math.max(5.0, Math.round((base + 0.2) * 10) / 10));
    const tx2 = Math.min(10, Math.max(5.0, Math.round((base - 0.2) * 10) / 10));
    const gk = Math.min(10, Math.max(5.0, Math.round((base + 0.1) * 10) / 10));
    const ck = Math.min(10, Math.max(5.0, Math.round((base + 0.3) * 10) / 10));
    const { tb, classification } = calculateSemesterGPA([tx1, tx2], gk, ck);

    grades.push({
      id: `grade-${code}-hk1`,
      studentId: student.id,
      studentCode: code,
      fullName: name,
      classCode: '6A1',
      academicYear: '2026–2027',
      semester: 'HK1',
      txScores: [tx1, tx2],
      gkScore: gk,
      ckScore: ck,
      tbScore: tb,
      classification,
      lastModified: '2026-10-17 09:40',
      modifiedBy: 'Dương Thành Tín',
    });

    competencies.push({
      id: `comp-${code}`,
      studentId: student.id,
      studentCode: code,
      studentName: name,
      classCode: '6A1',
      scores: {
        reading: Math.min(10, Math.round((base + 0.5) * 10) / 10),
        writing: Math.min(10, Math.round((base - 0.4) * 10) / 10),
        speaking: Math.min(10, Math.round((base - 0.3) * 10) / 10),
        listening: Math.min(10, Math.round((base + 0.2) * 10) / 10),
      },
      evaluatedAt: '2026-10-18',
      needsAttention: tb !== null && tb < 6.5,
    });
  }

  return { students, grades, competencies };
}

// Assignments matching reference image
export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Phân tích đoạn trích “Làng” (Kim Lân)',
    classCode: '9A1',
    grade: 9,
    type: 'NghiLuanVanHoc',
    assignedDate: '2026-10-25',
    dueDate: '15/11/2026',
    totalStudents: 38,
    submittedCount: 32,
    inProgressCount: 4,
    notSubmittedCount: 2,
    description: 'Viết bài văn ngắn (khoảng 400 - 500 chữ) làm nổi bật diễn biến tâm trạng nhân vật ông Hai khi nghe tin làng chợ Dầu theo giặc.',
    status: 'Active',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    id: 'asg-02',
    title: 'Viết đoạn văn nghị luận xã hội',
    classCode: '8A2',
    grade: 8,
    type: 'VietDoan',
    assignedDate: '2026-10-22',
    dueDate: '12/11/2026',
    totalStudents: 40,
    submittedCount: 28,
    inProgressCount: 9,
    notSubmittedCount: 3,
    description: 'Viết đoạn văn khoảng 200 chữ trình bày suy nghĩ của em về ý nghĩa của lòng biết ơn trong cuộc sống hiện đại.',
    status: 'Active',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    id: 'asg-03',
    title: 'Kiểm tra giữa kỳ – Phần Đọc hiểu',
    classCode: '7A1',
    grade: 7,
    type: 'DocHieu',
    assignedDate: '2026-10-20',
    dueDate: '10/11/2026',
    totalStudents: 36,
    submittedCount: 30,
    inProgressCount: 4,
    notSubmittedCount: 2,
    description: 'Đọc hiểu ngữ liệu ngoài sách giáo khoa và trả lời 4 câu hỏi nhận biết, thông hiểu, vận dụng theo ma trận kiểm tra.',
    status: 'Active',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    id: 'asg-04',
    title: 'Bài tập luyện nói: Thuyết trình tác phẩm',
    classCode: '6A1',
    grade: 6,
    type: 'ThuyetTrinh',
    assignedDate: '2026-10-18',
    dueDate: '08/11/2026',
    totalStudents: 38,
    submittedCount: 26,
    inProgressCount: 8,
    notSubmittedCount: 4,
    description: 'Chuẩn bị bài thuyết trình 3 phút về một câu chuyện truyền thuyết hoặc cổ tích mà em yêu thích nhất.',
    status: 'Active',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
  },
];

// Initial Teaching Resources matching reference image:
// Giáo án (125), Video bài giảng (48), Sơ đồ tư duy (62), Tài liệu tham khảo (210)
export const INITIAL_RESOURCES: TeachingResource[] = [
  {
    id: 'res-01',
    code: 'GA-09-01',
    title: 'Giáo án bài dạy: Làng (Kim Lân) - Chuẩn công văn 5512',
    grade: 9,
    theme: 'Truyện hiện đại Việt Nam',
    lesson: 'Tiết 51-53: Làng',
    type: 'GiaoAn',
    createdDate: '2026-10-15',
    description: 'Kế hoạch bài dạy chi tiết tích hợp hoạt động nhóm và phiếu học tập phân hóa năng lực đọc hiểu.',
    author: 'Dương Thành Tín',
    fileSize: '420 KB',
  },
  {
    id: 'res-02',
    code: 'GA-08-01',
    title: 'Giáo án chuyên đề: Kỹ năng viết đoạn văn nghị luận xã hội',
    grade: 8,
    theme: 'Văn nghị luận',
    lesson: 'Tiết 35: Luyện tập viết đoạn văn',
    type: 'GiaoAn',
    createdDate: '2026-10-12',
    description: 'Hệ thống bài tập rèn luyện cấu trúc diễn dịch, quy nạp, tổng-phân-hợp và cách đưa dẫn chứng thời sự.',
    author: 'Dương Thành Tín',
    fileSize: '310 KB',
  },
  {
    id: 'res-03',
    code: 'VD-09-01',
    title: 'Video bài giảng: Bối cảnh lịch sử và diễn biến tâm lí nhân vật ông Hai',
    grade: 9,
    theme: 'Học liệu số đa phương tiện',
    lesson: 'Tác phẩm Làng',
    type: 'Video',
    createdDate: '2026-10-10',
    description: 'Video tư liệu ngắn ghi lại hình ảnh làng quê Bắc Bộ những năm đầu kháng chiến chống thực dân Pháp.',
    author: 'Dương Thành Tín',
    fileSize: '45 MB',
  },
  {
    id: 'res-04',
    code: 'SD-09-01',
    title: 'Sơ đồ tư duy: Hệ thống hóa tác phẩm truyện ngắn lớp 9 HK1',
    grade: 9,
    theme: 'Tổng kết văn học',
    lesson: 'Ôn tập truyện hiện đại',
    type: 'SoDoTuDuy',
    createdDate: '2026-10-08',
    description: 'Bản đồ trực quan tóm tắt chủ đề, nhân vật chính, nét nghệ thuật đặc sắc của các tác phẩm Làng, Lặng lẽ Sa Pa, Chiếc lược ngà.',
    author: 'Dương Thành Tín',
    fileSize: '1.2 MB',
  },
  {
    id: 'res-05',
    code: 'TL-TH-01',
    title: 'Tài liệu tham khảo: Tuyển tập 50 đoạn văn nghị luận mẫu điểm 9+',
    grade: 9,
    theme: 'Bồi dưỡng học sinh giỏi',
    lesson: 'Chuyên đề ôn thi vào 10',
    type: 'TaiLieu',
    createdDate: '2026-10-05',
    description: 'Tài liệu độc quyền tổng hợp các bài viết giàu cảm xúc, lập luận sắc bén và dẫn chứng phong phú.',
    author: 'Dương Thành Tín',
    fileSize: '2.4 MB',
  },
  {
    id: 'res-06',
    code: 'SD-07-01',
    title: 'Sơ đồ tư duy: Cấu trúc văn bản biểu cảm môn Ngữ văn 7',
    grade: 7,
    theme: 'Phương pháp biểu cảm',
    lesson: 'Cách lập ý bài văn biểu cảm',
    type: 'SoDoTuDuy',
    createdDate: '2026-10-02',
    description: 'Hướng dẫn trực quan cách tìm cảm xúc, kết hợp miêu tả và tự sự để bộc lộ tình cảm chân thành.',
    author: 'Dương Thành Tín',
    fileSize: '890 KB',
  },
  {
    id: 'res-07',
    code: 'VD-06-01',
    title: 'Video hướng dẫn: 5 bước thuyết trình tự tin trước lớp',
    grade: 6,
    theme: 'Rèn luyện kỹ năng Nói & Nghe',
    lesson: 'Nói và nghe đầu năm',
    type: 'Video',
    createdDate: '2026-09-28',
    description: 'Video sinh động hướng dẫn học sinh lớp 6 ánh mắt, giọng điệu, ngôn ngữ cơ thể khi đứng trước tập thể.',
    author: 'Dương Thành Tín',
    fileSize: '38 MB',
  },
];
