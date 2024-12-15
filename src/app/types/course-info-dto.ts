export interface Lesson {
  _id: string;
  type: string;
  title: string;
  content: string;
}

export interface Submission {
  _id: string;
  student: string;
  content: string;
  score: number;
  submittedAt: Date;
}

export interface Assignment {
  _id: string;
  type: string;
  title: string;
  content: string;
  maxScore: number;
  dueDate: Date;
  allowedSubmissionNumber: number;
  submissions: Submission[];
}

export interface CourseInfoDto {
  _id: string;
  title: string;
  description: string;
  sections: {
    _id: string;
    title: string;
    materials: Lesson[] & Assignment[];
  }[];
  teachers: string[];
  students: string[];
}
