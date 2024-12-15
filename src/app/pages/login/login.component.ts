import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    const authService = new AuthService();
    axios
      .post('http://localhost:3000/api/user/login', {
        username: this.username,
        password: this.password,
      })
      .then((res) => {
        authService.saveToken(res.data.accessToken);
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Invalid login. Try username: admin, password: admin');
      });
  }
}
