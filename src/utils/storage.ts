import {
  Student,
  Teacher,
  ClassRoom,
  DailyLessonLog,
  AttendanceRecord,
  FeePayment,
  MadrasaProfile,
  ExamRecord,
  ClassDailySignoff,
} from '../types';
import {
  INITIAL_MADRASA,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_LESSON_LOGS,
  INITIAL_ATTENDANCE,
  INITIAL_CLASS_SIGNOFFS,
  INITIAL_EXAMS,
  INITIAL_FEES,
} from '../data/initialData';

const KEYS = {
  MADRASA: 'almiqra_madrasa_v3',
  TEACHERS: 'almiqra_teachers_v3',
  CLASSES: 'almiqra_classes_v3',
  STUDENTS: 'almiqra_students_v3',
  LESSONS: 'almiqra_lessons_v3',
  ATTENDANCE: 'almiqra_attendance_v3',
  FEES: 'almiqra_fees_v3',
  EXAMS: 'almiqra_exams_v3',
  SIGNOFFS: 'almiqra_signoffs_v3',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Failed to load ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
}

export const Storage = {
  getMadrasa: (): MadrasaProfile => safeGet(KEYS.MADRASA, INITIAL_MADRASA),
  setMadrasa: (val: MadrasaProfile) => safeSet(KEYS.MADRASA, val),

  getTeachers: (): Teacher[] => safeGet(KEYS.TEACHERS, INITIAL_TEACHERS),
  setTeachers: (val: Teacher[]) => safeSet(KEYS.TEACHERS, val),

  getClasses: (): ClassRoom[] => safeGet(KEYS.CLASSES, INITIAL_CLASSES),
  setClasses: (val: ClassRoom[]) => safeSet(KEYS.CLASSES, val),

  getStudents: (): Student[] => safeGet(KEYS.STUDENTS, INITIAL_STUDENTS),
  setStudents: (val: Student[]) => safeSet(KEYS.STUDENTS, val),

  getLessons: (): DailyLessonLog[] => safeGet(KEYS.LESSONS, INITIAL_LESSON_LOGS),
  setLessons: (val: DailyLessonLog[]) => safeSet(KEYS.LESSONS, val),

  getAttendance: (): AttendanceRecord[] => safeGet(KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  setAttendance: (val: AttendanceRecord[]) => safeSet(KEYS.ATTENDANCE, val),

  getFees: (): FeePayment[] => safeGet(KEYS.FEES, INITIAL_FEES),
  setFees: (val: FeePayment[]) => safeSet(KEYS.FEES, val),

  getExams: (): ExamRecord[] => safeGet(KEYS.EXAMS, INITIAL_EXAMS),
  setExams: (val: ExamRecord[]) => safeSet(KEYS.EXAMS, val),

  getSignoffs: (): ClassDailySignoff[] => safeGet(KEYS.SIGNOFFS, INITIAL_CLASS_SIGNOFFS),
  setSignoffs: (val: ClassDailySignoff[]) => safeSet(KEYS.SIGNOFFS, val),

  resetAll: () => {
    safeSet(KEYS.MADRASA, INITIAL_MADRASA);
    safeSet(KEYS.TEACHERS, INITIAL_TEACHERS);
    safeSet(KEYS.CLASSES, INITIAL_CLASSES);
    safeSet(KEYS.STUDENTS, INITIAL_STUDENTS);
    safeSet(KEYS.LESSONS, INITIAL_LESSON_LOGS);
    safeSet(KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    safeSet(KEYS.FEES, INITIAL_FEES);
    safeSet(KEYS.EXAMS, INITIAL_EXAMS);
    safeSet(KEYS.SIGNOFFS, INITIAL_CLASS_SIGNOFFS);
  },

  exportBackupJson: () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      madrasa: Storage.getMadrasa(),
      teachers: Storage.getTeachers(),
      classes: Storage.getClasses(),
      students: Storage.getStudents(),
      lessons: Storage.getLessons(),
      attendance: Storage.getAttendance(),
      fees: Storage.getFees(),
      exams: Storage.getExams(),
      signoffs: Storage.getSignoffs(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJson: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students)) {
        if (data.madrasa) Storage.setMadrasa(data.madrasa);
        if (data.teachers) Storage.setTeachers(data.teachers);
        if (data.classes) Storage.setClasses(data.classes);
        if (data.students) Storage.setStudents(data.students);
        if (data.lessons) Storage.setLessons(data.lessons);
        if (data.attendance) Storage.setAttendance(data.attendance);
        if (data.fees) Storage.setFees(data.fees);
        if (data.exams) Storage.setExams(data.exams);
        if (data.signoffs) Storage.setSignoffs(data.signoffs);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },
};
