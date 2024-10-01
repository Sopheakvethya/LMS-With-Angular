import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit {
  courses = [
    {
      id: 1,
      title: 'Introduction to Angular',
      description: 'Learn the basics of Angular framework',
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      description: 'Deep dive into modern JavaScript features',
    },
    {
      id: 3,
      title: 'Web Development with TypeScript',
      description: 'Master web development with TypeScript',
    },
  ];

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {}

  viewCourse(id: number) {
    this.router.navigate(['/course', id]);
  }

  goBack() {
    this.location.back();
  }
}
