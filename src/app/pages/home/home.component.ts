import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import axiosInstance from '../../utils/axios-instance';
import { CourseInfoDto } from '../../types/course-info-dto';

@Component({
  selector: 'app-course-list',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  courses: CourseInfoDto[] = [];

  isLoading = true;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    axiosInstance
      .get('http://localhost:3000/api/user/courses')
      .then((res) => {
        const fetchedCourses = res.data.courses;

        fetchedCourses.forEach(async (course: string) => {
          const courseInfo = await axiosInstance
            .get(`http://localhost:3000/api/course?courseId=${course}`)
            .then((res) => res.data.course);
          this.courses.push(courseInfo);
        });
      })
      .catch((err) => {
        console.error(err);
      });

    console.log(this.courses);
    this.isLoading = false;
  }

  viewCourse(_id: string) {
    this.router.navigate(['/course', _id]);
  }

  goBack() {
    this.location.back();
  }
}
