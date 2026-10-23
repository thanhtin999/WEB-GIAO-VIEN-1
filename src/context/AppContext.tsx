import React, { createContext, useContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  ActiveModule,
  SchoolClass,
  Student,
  GradeRecord,
  GradeAudit,
  Assignment,
  TeachingResource,
  StudentCompetencyRecord,
  Submission,
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_RESOURCES,
  generateSeedData,
  calculateSemesterGPA,
} from '../data/mockData';

interface AppContextType {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  selectedClassCode: string;
  setSelectedClassCode: (code: string) => void;
  selectedAcademicYear: string;
  setSelectedAcademicYear: (year: string) => void;
  selectedSemester: 'HK1' | 'HK2';
  setSelectedSemester: (sem: 'HK1' | 'HK2') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;

  // Teacher Info
  teacherInfo: {
    name: string;
    school: string;
    subject: string;
    role: string;
  };

  // Classes
  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, updated: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;

  // Students
  students: Student[];
  addStudent: (std: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  transferStudentClass: (studentId: string, newClassCode: string) => void;
  importStudentsBatch: (newStudents: Partial<Student>[]) => { added: number; errors: string[] };

  // Grades
  grades: GradeRecord[];
  updateGradeCell: (
    gradeId: string,
    field: 'tx' | 'gk' | 'ck',
    indexOrValue: any,
    val?: any
  ) => void;
  addTxColumn: () => void;
  removeTxColumn: (index: number) => void;
  txColumnCount: number;
  auditLogs: GradeAudit[];
  exportGradebookExcel: (classCode: string) => void;

  // Competencies
  competencies: StudentCompetencyRecord[];
  updateCompetencyScore: (id: string, scores: Partial<{ reading: number; writing: number; speaking: number; listening: number }>, notes?: string) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updated: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submissions: Submission[];
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Resources
  resources: TeachingResource[];
  addResource: (res: Omit<TeachingResource, 'id'>) => void;
  deleteResource: (id: string) => void;

  // Global actions
  resetToDemoData: () => void;
  clearAllData: () => void;
  openStudentProfileId: string | null;
  setOpenStudentProfileId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'vanhoc40_system_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('overview');
  const [selectedClassCode, setSelectedClassCode] = useState<string>('9A1');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2026–2027');
  const [selectedSemester, setSelectedSemester] = useState<'HK1' | 'HK2'>('HK1');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [openStudentProfileId, setOpenStudentProfileId] = useState<string | null>(null);
  const [txColumnCount, setTxColumnCount] = useState<number>(2);

  const teacherInfo = {
    name: 'Dương Thành Tín',
    school: 'THCS Phan Bội Châu',
    subject: 'Ngữ văn',
    role: 'Giáo viên Ngữ văn',
  };

  // State initialization with localStorage fallback or seed data
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    if (saved) return JSON.parse(saved);
    const seed = generateSeedData();
    return seed.students;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_grades`);
    if (saved) return JSON.parse(saved);
    const seed = generateSeedData();
    return seed.grades;
  });

  const [competencies, setCompetencies] = useState<StudentCompetencyRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_competencies`);
    if (saved) return JSON.parse(saved);
    const seed = generateSeedData();
    return seed.competencies;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_submissions`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sub-01',
        assignmentId: 'asg-01',
        studentId: 'std-HS0901',
        studentName: 'Nguyễn Minh Anh',
        classCode: '9A1',
        submittedAt: '2026-11-01 19:40',
        status: 'DaNop',
        score: 8.5,
        content: 'Qua đoạn trích truyện ngắn "Làng", nhà văn Kim Lân đã khắc họa sâu sắc tâm trạng đau đớn, tủi hổ nhưng cũng vô cùng kiên định của nhân vật ông Hai...',
        teacherFeedback: 'Bài viết hành văn trôi chảy, phân tích cảm xúc nhân vật sâu sắc, dẫn chứng chọn lọc.',
      },
      {
        id: 'sub-02',
        assignmentId: 'asg-01',
        studentId: 'std-HS0902',
        studentName: 'Trần Hoàng Bảo',
        classCode: '9A1',
        submittedAt: '2026-11-02 20:15',
        status: 'DaNop',
        score: 7.0,
        content: 'Khi nghe tin làng chợ Dầu theo giặc, ông Hai vô cùng đau lòng. Ông không dám ra ngoài tiếp xúc với ai...',
        teacherFeedback: 'Nắm được diễn biến câu chuyện, cần mở rộng thêm về nghệ thuật độc thoại nội tâm.',
      },
      {
        id: 'sub-03',
        assignmentId: 'asg-01',
        studentId: 'std-HS0903',
        studentName: 'Lê Thị Cẩm Chi',
        classCode: '9A1',
        submittedAt: '2026-11-03 14:10',
        status: 'DaCham',
        score: 9.0,
        content: 'Tình yêu làng của ông Hai không tách rời mà thống nhất hài hòa trong tình yêu Tổ quốc kháng chiến...',
        teacherFeedback: 'Hành văn sắc sảo, có phong cách riêng rất đáng khen ngợi!',
      },
    ];
  });

  const [resources, setResources] = useState<TeachingResource[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_resources`);
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [auditLogs, setAuditLogs] = useState<GradeAudit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'audit-1',
            timestamp: '2026-10-20 14:30',
            studentCode: 'HS0906',
            studentName: 'Đặng Trúc Linh',
            classCode: '9A1',
            field: 'Điểm Cuối kỳ (CK)',
            oldValue: '8.5',
            newValue: '9.0',
            modifiedBy: 'Dương Thành Tín',
          },
          {
            id: 'audit-2',
            timestamp: '2026-10-19 11:20',
            studentCode: 'HS0901',
            studentName: 'Nguyễn Minh Anh',
            classCode: '9A1',
            field: 'Điểm Thường xuyên 2 (TX2)',
            oldValue: '8.0',
            newValue: '8.5',
            modifiedBy: 'Dương Thành Tín',
          },
        ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_grades`, JSON.stringify(grades));
  }, [grades]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_competencies`, JSON.stringify(competencies));
  }, [competencies]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
  }, [assignments]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(submissions));
  }, [submissions]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_resources`, JSON.stringify(resources));
  }, [resources]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Recalculate class stats (student count, male, female) whenever students change
  useEffect(() => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) => {
        const classStudents = students.filter((s) => s.classCode === cls.code);
        const maleCount = classStudents.filter((s) => s.gender === 'Nam').length;
        const femaleCount = classStudents.filter((s) => s.gender === 'Nữ').length;
        return {
          ...cls,
          studentCount: classStudents.length,
          maleCount,
          femaleCount,
        };
      })
    );
  }, [students]);

  // CLASS MANAGEMENT
  const addClass = (newClsData: Omit<SchoolClass, 'id'>) => {
    const id = `class-${Date.now()}`;
    const newCls: SchoolClass = { ...newClsData, id };
    setClasses((prev) => [...prev, newCls]);
  };

  const updateClass = (id: string, updated: Partial<SchoolClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteClass = (id: string) => {
    const cls = classes.find((c) => c.id === id);
    if (!cls) return;
    setClasses((prev) => prev.filter((c) => c.id !== id));
    // Also remove or archive students from that class
    setStudents((prev) => prev.filter((s) => s.classCode !== cls.code));
    setGrades((prev) => prev.filter((g) => g.classCode !== cls.code));
  };

  // STUDENT MANAGEMENT
  const addStudent = (stdData: Omit<Student, 'id'>) => {
    const id = `std-${Date.now()}`;
    const newStudent: Student = { ...stdData, id };
    setStudents((prev) => [...prev, newStudent]);

    // Initialize default grade record
    const newGrade: GradeRecord = {
      id: `grade-${newStudent.studentCode}-${selectedSemester.toLowerCase()}`,
      studentId: newStudent.id,
      studentCode: newStudent.studentCode,
      fullName: newStudent.fullName,
      classCode: newStudent.classCode,
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
      txScores: [null, null],
      gkScore: null,
      ckScore: null,
      tbScore: null,
      classification: 'Chưa đủ điểm',
      lastModified: new Date().toLocaleString('vi-VN'),
      modifiedBy: teacherInfo.name,
    };
    setGrades((prev) => [...prev, newGrade]);

    // Initialize competency record
    const newComp: StudentCompetencyRecord = {
      id: `comp-${newStudent.studentCode}`,
      studentId: newStudent.id,
      studentCode: newStudent.studentCode,
      studentName: newStudent.fullName,
      classCode: newStudent.classCode,
      scores: { reading: 7.0, writing: 7.0, speaking: 7.0, listening: 7.0 },
      evaluatedAt: new Date().toISOString().split('T')[0],
      needsAttention: false,
    };
    setCompetencies((prev) => [...prev, newComp]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const merged = { ...s, ...updated };
          // If name changed, update grade & competency displays as well
          if (updated.fullName) {
            setGrades((gList) =>
              gList.map((g) => (g.studentId === id ? { ...g, fullName: updated.fullName! } : g))
            );
            setCompetencies((cList) =>
              cList.map((c) => (c.studentId === id ? { ...c, studentName: updated.fullName! } : c))
            );
          }
          return merged;
        }
        return s;
      })
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setGrades((prev) => prev.filter((g) => g.studentId !== id));
    setCompetencies((prev) => prev.filter((c) => c.studentId !== id));
  };

  const transferStudentClass = (studentId: string, newClassCode: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, classCode: newClassCode } : s))
    );
    setGrades((prev) =>
      prev.map((g) => (g.studentId === studentId ? { ...g, classCode: newClassCode } : g))
    );
    setCompetencies((prev) =>
      prev.map((c) => (c.studentId === studentId ? { ...c, classCode: newClassCode } : c))
    );
  };

  const importStudentsBatch = (newStudentsList: Partial<Student>[]) => {
    const existingCodes = new Set(students.map((s) => s.studentCode.trim().toUpperCase()));
    const errors: string[] = [];
    const validToAdd: Student[] = [];

    newStudentsList.forEach((raw, idx) => {
      const code = (raw.studentCode || '').trim().toUpperCase();
      const name = (raw.fullName || '').trim();
      const classCode = (raw.classCode || selectedClassCode).trim();

      if (!code) {
        errors.push(`Dòng ${idx + 1}: Thiếu mã học sinh.`);
        return;
      }
      if (!name) {
        errors.push(`Dòng ${idx + 1}: Thiếu họ và tên học sinh.`);
        return;
      }
      if (existingCodes.has(code)) {
        errors.push(`Dòng ${idx + 1}: Mã học sinh "${code}" đã tồn tại trong hệ thống.`);
        return;
      }

      existingCodes.add(code);
      const newStd: Student = {
        id: `std-${Date.now()}-${idx}`,
        studentCode: code,
        fullName: name,
        classCode: classCode,
        grade: parseInt(classCode[0]) || 9,
        gender: raw.gender === 'Nữ' ? 'Nữ' : 'Nam',
        dateOfBirth: raw.dateOfBirth || '2011-01-01',
        academicStatus: 'Đang học',
        notes: raw.notes || 'Nhập từ file Excel',
      };
      validToAdd.push(newStd);
    });

    if (validToAdd.length > 0) {
      setStudents((prev) => [...prev, ...validToAdd]);
      // Add default grade records
      const newGrades: GradeRecord[] = validToAdd.map((s) => ({
        id: `grade-${s.studentCode}-${selectedSemester.toLowerCase()}`,
        studentId: s.id,
        studentCode: s.studentCode,
        fullName: s.fullName,
        classCode: s.classCode,
        academicYear: selectedAcademicYear,
        semester: selectedSemester,
        txScores: [null, null],
        gkScore: null,
        ckScore: null,
        tbScore: null,
        classification: 'Chưa đủ điểm',
        lastModified: new Date().toLocaleString('vi-VN'),
        modifiedBy: teacherInfo.name,
      }));
      setGrades((prev) => [...prev, ...newGrades]);
    }

    return { added: validToAdd.length, errors };
  };

  // GRADE MANAGEMENT
  const updateGradeCell = (
    gradeId: string,
    field: 'tx' | 'gk' | 'ck',
    indexOrValue: any,
    val?: any
  ) => {
    setGrades((prev) =>
      prev.map((rec) => {
        if (rec.id !== gradeId) return rec;

        const newRec = { ...rec };
        let oldValueStr = '';
        let newValueStr = '';
        let fieldName = '';

        if (field === 'tx') {
          const txIdx = Number(indexOrValue);
          const rawNum = val === '' || val === null || isNaN(Number(val)) ? null : Math.min(10, Math.max(0, Number(val)));
          oldValueStr = `${rec.txScores[txIdx] ?? 'Trống'}`;
          newValueStr = `${rawNum ?? 'Trống'}`;
          fieldName = `Điểm TX${txIdx + 1}`;

          const newTx = [...rec.txScores];
          newTx[txIdx] = rawNum;
          newRec.txScores = newTx;
        } else if (field === 'gk') {
          const rawNum = indexOrValue === '' || indexOrValue === null || isNaN(Number(indexOrValue)) ? null : Math.min(10, Math.max(0, Number(indexOrValue)));
          oldValueStr = `${rec.gkScore ?? 'Trống'}`;
          newValueStr = `${rawNum ?? 'Trống'}`;
          fieldName = 'Điểm Giữa kỳ (GK)';
          newRec.gkScore = rawNum;
        } else if (field === 'ck') {
          const rawNum = indexOrValue === '' || indexOrValue === null || isNaN(Number(indexOrValue)) ? null : Math.min(10, Math.max(0, Number(indexOrValue)));
          oldValueStr = `${rec.ckScore ?? 'Trống'}`;
          newValueStr = `${rawNum ?? 'Trống'}`;
          fieldName = 'Điểm Cuối kỳ (CK)';
          newRec.ckScore = rawNum;
        }

        // Recalculate TB and Classification
        const { tb, classification } = calculateSemesterGPA(
          newRec.txScores,
          newRec.gkScore,
          newRec.ckScore
        );
        newRec.tbScore = tb;
        newRec.classification = classification;
        newRec.lastModified = new Date().toLocaleString('vi-VN');
        newRec.modifiedBy = teacherInfo.name;

        // Log audit if changed
        if (oldValueStr !== newValueStr) {
          const auditEntry: GradeAudit = {
            id: `audit-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toLocaleString('vi-VN'),
            studentCode: rec.studentCode,
            studentName: rec.fullName,
            classCode: rec.classCode,
            field: fieldName,
            oldValue: oldValueStr,
            newValue: newValueStr,
            modifiedBy: teacherInfo.name,
          };
          setAuditLogs((aPrev) => [auditEntry, ...aPrev.slice(0, 49)]); // keep latest 50
        }

        return newRec;
      })
    );
  };

  const addTxColumn = () => {
    setTxColumnCount((c) => Math.min(6, c + 1));
    setGrades((prev) =>
      prev.map((g) => ({
        ...g,
        txScores: [...g.txScores, null],
      }))
    );
  };

  const removeTxColumn = (index: number) => {
    if (txColumnCount <= 1) return;
    setTxColumnCount((c) => Math.max(1, c - 1));
    setGrades((prev) =>
      prev.map((g) => {
        const nextTx = g.txScores.filter((_, i) => i !== index);
        const { tb, classification } = calculateSemesterGPA(nextTx, g.gkScore, g.ckScore);
        return {
          ...g,
          txScores: nextTx,
          tbScore: tb,
          classification,
        };
      })
    );
  };

  const exportGradebookExcel = (classCode: string) => {
    const classGrades = grades.filter((g) => g.classCode === classCode);
    const exportData = classGrades.map((g, idx) => {
      const row: any = {
        'STT': idx + 1,
        'Mã Học Sinh': g.studentCode,
        'Họ và Tên': g.fullName,
        'Lớp': g.classCode,
      };
      g.txScores.forEach((score, i) => {
        row[`TX${i + 1}`] = score !== null ? score : '';
      });
      row['Điểm Giữa Kỳ'] = g.gkScore !== null ? g.gkScore : '';
      row['Điểm Cuối Kỳ'] = g.ckScore !== null ? g.ckScore : '';
      row['Điểm TB Học Kỳ'] = g.tbScore !== null ? g.tbScore : '';
      row['Xếp Loại'] = g.classification || '';
      row['Ghi Chú'] = g.notes || '';
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Bảng điểm_${classCode}`);
    XLSX.writeFile(
      workbook,
      `So_Diem_Ngu_Van_${classCode}_${selectedSemester}_${selectedAcademicYear.replace('–', '_')}.xlsx`
    );
  };

  // COMPETENCY MANAGEMENT
  const updateCompetencyScore = (
    id: string,
    scores: Partial<{ reading: number; writing: number; speaking: number; listening: number }>,
    notes?: string
  ) => {
    setCompetencies((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const mergedScores = { ...c.scores, ...scores };
        const avg = (mergedScores.reading + mergedScores.writing + mergedScores.speaking + mergedScores.listening) / 4;
        return {
          ...c,
          scores: mergedScores,
          rubricNotes: notes !== undefined ? notes : c.rubricNotes,
          needsAttention: avg < 6.5,
          evaluatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  // ASSIGNMENTS
  const addAssignment = (asgData: Omit<Assignment, 'id'>) => {
    const id = `asg-${Date.now()}`;
    const newAsg: Assignment = { ...asgData, id };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const updateAssignment = (id: string, updated: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              score,
              teacherFeedback: feedback,
              status: 'DaCham',
            }
          : sub
      )
    );
  };

  // RESOURCES
  const addResource = (resData: Omit<TeachingResource, 'id'>) => {
    const id = `res-${Date.now()}`;
    setResources((prev) => [{ ...resData, id }, ...prev]);
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  // RESET / CLEAR
  const resetToDemoData = () => {
    const seed = generateSeedData();
    setClasses(INITIAL_CLASSES);
    setStudents(seed.students);
    setGrades(seed.grades);
    setCompetencies(seed.competencies);
    setAssignments(INITIAL_ASSIGNMENTS);
    setResources(INITIAL_RESOURCES);
    setIsDemoMode(true);
    localStorage.clear();
  };

  const clearAllData = () => {
    setStudents([]);
    setGrades([]);
    setCompetencies([]);
    setAssignments([]);
    setIsDemoMode(false);
  };

  return (
    <AppContext.Provider
      value={{
        activeModule,
        setActiveModule,
        selectedClassCode,
        setSelectedClassCode,
        selectedAcademicYear,
        setSelectedAcademicYear,
        selectedSemester,
        setSelectedSemester,
        isDemoMode,
        setIsDemoMode,
        teacherInfo,
        classes,
        addClass,
        updateClass,
        deleteClass,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        transferStudentClass,
        importStudentsBatch,
        grades,
        updateGradeCell,
        addTxColumn,
        removeTxColumn,
        txColumnCount,
        auditLogs,
        exportGradebookExcel,
        competencies,
        updateCompetencyScore,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submissions,
        gradeSubmission,
        resources,
        addResource,
        deleteResource,
        resetToDemoData,
        clearAllData,
        openStudentProfileId,
        setOpenStudentProfileId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
