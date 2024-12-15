import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import axiosInstance from '../../utils/axios-instance';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  authService = new AuthService();
  isLoggedIn = this.authService.isAuthenticated();

  courseCode = '';
  courseTitle = '';
  courseDescription = '';

  constructor(private router: Router) {}

  async joinCourse() {
    console.log(
      `http://localhost:3000/api/course/join?courseId=${this.courseCode}`
    );
    await axiosInstance
      .put(`http://localhost:3000/api/course/join?courseId=${this.courseCode}`)
      .then((response) => {
        console.log('Course joined successfully:', response.data);
      })
      .catch((err) => {
        console.error('Error joining course:', err);
      });
    window.location.reload();
  }

  async createCourse() {
    await axiosInstance
      .post(`http://localhost:3000/api/course`, {
        title: this.courseTitle,
        description: this.courseDescription,
        teachers: [this.authService.getUserId()],
      })
      .then((response) => {
        console.log('Course created successfully:', response.data);
      })
      .catch((err) => {
        console.error('Error creating course:', err);
      });
    window.location.reload();
  }

  logout() {
    this.authService.logout();
  }
}
