import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  Assignment,
  CourseInfoDto,
  Lesson,
  Submission,
} from '../../types/course-info-dto';
import { ActivatedRoute } from '@angular/router';
import axiosInstance from '../../utils/axios-instance';
import { AuthService } from '../../auth/auth.service';
import { UserDto } from '../../types/user-dto';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
})
export class CourseInfoComponent {
  authService = new AuthService();

  course!: CourseInfoDto;
  courseId!: string;
  students: UserDto[] = [];
  teachers: UserDto[] = [];
  isTeacher!: boolean;

  selectedMaterialId: string = '';
  openSectionIndex!: number;
  sectionId!: string;
  material!: Lesson | Assignment;
  mySubmissions!: Submission[];
  studentsSubmissions!: Submission[];
  answer = '';
  isEditingScore = false;
  newScore = 0;
  newSectionTitle = '';

  newMaterialType = 'Lesson';
  newMaterialTitle = '';
  newMaterialContent = '';
  newMaterialDueDate = '';
  newMaterialMaxScore = 100;
  newMaterialAllowedSubmissions = 1;

  editMaterialTitle = '';
  editMaterialContent = '';
  editMaterialDueDate = '';
  editMaterialMaxScore = 100;
  editMaterialAllowedSubmissions = 1;

  editCourseTitle = '';
  editCourseDescription = '';

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseId = params['id'];
    });

    axiosInstance
      .get(`http://localhost:3000/api/course?courseId=${this.courseId}`)
      .then((res) => {
        this.course = res.data.course;
        console.log('Course:', this.course);

        const userId = this.authService.getUserId();
        this.isTeacher = this.course.teachers.includes(userId!);

        this.editCourseTitle = this.course.title;
        this.editCourseDescription = this.course.description;

        this.course.students.map(async (studentId) => {
          axiosInstance
            .get(`http://localhost:3000/api/user?userId=${studentId}`)
            .then((res) => {
              this.students.push(res.data.user as UserDto);
            });
        });

        this.course.teachers.map(async (teacherId) => {
          await axiosInstance
            .get(`http://localhost:3000/api/user?userId=${teacherId}`)
            .then((res) => {
              this.teachers.push(res.data.user as UserDto);
            });
        });

        if (this.course.sections.length > 0) {
          this.sectionId = this.course.sections[0]._id;
        }

        console.log('sections', this.course.sections);

        this.route.queryParams.subscribe((params) => {
          if (params['materialId']) {
            this.selectedMaterialId = params['materialId'];
          } else if (
            this.course.sections.length > 0 &&
            this.course.sections[0].materials.length > 0
          ) {
            this.selectedMaterialId = this.course.sections[0].materials[0]._id;
          }
        });

        console.log('selectedMaterialId:', this.selectedMaterialId);

        if (this.selectedMaterialId === '') {
          return;
        }

        const { material, sectionIndex } = getMaterialInCourse(
          this.course,
          this.selectedMaterialId
        )!;

        this.material = material;
        this.openSectionIndex = sectionIndex;

        if (this.material.type === 'Lesson') {
          this.editMaterialTitle = this.material.title;
          this.editMaterialContent = this.material.content;
        } else if (this.isAssignment(this.material)) {
          this.editMaterialTitle = this.material.title;
          this.editMaterialContent = this.material.content;
          // this.editMaterialDueDate = this.material.dueDate;
          this.editMaterialMaxScore = this.material.maxScore;
          this.editMaterialAllowedSubmissions =
            this.material.allowedSubmissionNumber;
        }

        if (this.isAssignment(material)) {
          if (this.isTeacher) {
            const assignment = this.material as Assignment;
            this.studentsSubmissions = assignment.submissions;
          } else {
            this.mySubmissions = getMySubmissionsInMaterial(material, userId!);
          }
        }
      });
  }

  async editCourse() {
    await axiosInstance
      .put(`http://localhost:3000/api/course?courseId=${this.course._id}`, {
        title: this.editCourseTitle,
        description: this.editCourseDescription,
      })
      .then((res) => {
        console.log('Course edited:', res.data);
      })
      .catch((err) => {
        console.error('Error editing course:', err);
      });
    window.location.reload();
  }

  async leaveCourse() {
    await axiosInstance
      .put(`http://localhost:3000/api/course/leave?courseId=${this.course._id}`)
      .then((res) => {
        console.log('Course left:', res.data);
      })
      .catch((err) => {
        console.error('Error leaving course:', err);
      });
    window.location.href = '/';
  }

  async deleteCourse() {
    await axiosInstance
      .delete(`http://localhost:3000/api/course?courseId=${this.course._id}`)
      .then((res) => {
        console.log('Course deleted:', res.data);
      })
      .catch((err) => {
        console.error('Error deleting course:', err);
      });
    window.location.href = '/';
  }

  selectMaterial(materialId: string) {
    this.selectedMaterialId = materialId;
    this.location.replaceState(
      '/course/' + this.courseId + '?materialId=' + materialId
    );
    const { material, sectionIndex } = getMaterialInCourse(
      this.course,
      this.selectedMaterialId
    )!;

    this.material = material;
    this.openSectionIndex = sectionIndex;

    if (this.material.type === 'Lesson') {
      this.editMaterialTitle = this.material.title;
      this.editMaterialContent = this.material.content;
    } else if (this.isAssignment(this.material)) {
      this.editMaterialTitle = this.material.title;
      this.editMaterialContent = this.material.content;
      // this.editMaterialDueDate = this.material.dueDate;
      this.editMaterialMaxScore = this.material.maxScore;
      this.editMaterialAllowedSubmissions =
        this.material.allowedSubmissionNumber;
    }

    if (this.isAssignment(material)) {
      if (this.isTeacher) {
        const assignment = this.material as Assignment;
        this.studentsSubmissions = assignment.submissions;
      } else {
        const userId = this.authService.getUserId();
        this.mySubmissions = getMySubmissionsInMaterial(material, userId!);
      }
    }
  }

  async submitAnswer() {
    console.log('btn pressed', this.answer);
    console.log('courseId:', this.courseId);
    await axiosInstance
      .post(
        `http://localhost:3000/api/submission?assignmentId=${this.material._id}&courseId=${this.courseId}`,
        {
          content: this.answer,
        }
      )
      .then((res) => {
        console.log('Answer submitted:', res.data);
      })
      .catch((err) => {
        console.error('Error submitting answer:', err);
      });
    window.location.reload();
  }

  async submitScore(submissionId: string) {
    await axiosInstance
      .put(
        `http://localhost:3000/api/submission?assignmentId=${this.material._id}&submissionId=${submissionId}&courseId=${this.courseId}`,
        {
          score: this.newScore,
        }
      )
      .then((res) => {
        console.log('Submission scored:', res.data);
      })
      .catch((err) => {
        console.error('Error scoring submission:', err);
      });
    window.location.reload();
  }

  async createSection() {
    await axiosInstance
      .post(
        `http://localhost:3000/api/section?courseId=${this.courseId}&sectionTitle=${this.newSectionTitle}`
      )
      .then((res) => {
        console.log('Section created:', res.data);
      })
      .catch((err) => {
        console.error('Error creating section:', err);
      });
    window.location.reload();
  }

  async createMaterial() {
    if (this.newMaterialType === 'Lesson') {
      // create lesson
      console.log('sectionId:', this.sectionId);
      await axiosInstance
        .post(
          `http://localhost:3000/api/lesson?courseId=${this.courseId}&sectionId=${this.sectionId}`,
          {
            title: this.newMaterialTitle,
            content: this.newMaterialContent,
          }
        )
        .then((res) => {
          console.log('Material created:', res.data);
        })
        .catch((err) => {
          console.error('Error creating material:', err);
        });
    } else {
      // create assignment
      await axiosInstance
        .post(
          `http://localhost:3000/api/assignment?courseId=${this.courseId}&sectionId=${this.sectionId}`,
          {
            title: this.newMaterialTitle,
            content: this.newMaterialContent,
            dueDate: this.newMaterialDueDate,
            maxScore: this.newMaterialMaxScore,
            allowedSubmissionNumber: this.newMaterialAllowedSubmissions,
          }
        )
        .then((res) => {
          console.log('Material created:', res.data);
        })
        .catch((err) => {
          console.error('Error creating material:', err);
        });
    }
    window.location.reload();
  }

  async editMaterial(materialType: string) {
    if (materialType === 'Lesson') {
      // edit lesson
      await axiosInstance
        .put(
          `http://localhost:3000/api/lesson?lessonId=${this.material._id}&courseId=${this.course._id}`,
          {
            title: this.editMaterialTitle,
            content: this.editMaterialContent,
          }
        )
        .then((res) => {
          console.log('Material edited:', res.data);
        })
        .catch((err) => {
          console.error('Error editing material:', err);
        });
    } else {
      // edit assignment
      await axiosInstance
        .put(
          `http://localhost:3000/api/assignment?assignmentId=${this.material._id}&courseId=${this.course._id}`,
          {
            title: this.editMaterialTitle,
            content: this.editMaterialContent,
            dueDate: this.editMaterialDueDate,
            maxScore: this.editMaterialMaxScore,
            allowedSubmissionNumber: this.editMaterialAllowedSubmissions,
          }
        )
        .then((res) => {
          console.log('Material edited:', res.data);
        })
        .catch((err) => {
          console.error('Error editing material:', err);
        });
    }
    window.location.reload();
  }

  async deleteMaterial(materialType: string) {
    if (materialType === 'Lesson') {
      // delete lesson
      await axiosInstance
        .delete(
          `http://localhost:3000/api/lesson?lessonId=${this.material._id}&courseId=${this.course._id}`
        )
        .then((res) => {
          console.log('Material deleted:', res.data);
        })
        .catch((err) => {
          console.error('Error deleting material:', err);
        });
    } else {
      // delete assignment
      await axiosInstance
        .delete(
          `http://localhost:3000/api/assignment?assignmentId=${this.material._id}&courseId=${this.course._id}`
        )
        .then((res) => {
          console.log('Material deleted:', res.data);
        })
        .catch((err) => {
          console.error('Error deleting material:', err);
        });
    }
    window.location.reload();
  }

  isAssignment(material: Lesson | Assignment): material is Assignment {
    return material.type === 'Assignment';
  }
}

function getMaterialInCourse(
  course: CourseInfoDto,
  materialId: string
): { material: Lesson | Assignment; sectionIndex: number } | undefined {
  for (
    let sectionIndex = 0;
    sectionIndex < course.sections.length;
    sectionIndex++
  ) {
    const section = course.sections[sectionIndex];
    for (const material of section.materials) {
      if (material._id === materialId) {
        return { material, sectionIndex };
      }
    }
  }
  return undefined;
}

function getMySubmissionsInMaterial(material: Assignment, studentId: string) {
  return material.submissions.filter(
    (submission) => submission.student === studentId
  );
}
