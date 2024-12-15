import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  @ViewChild('successModal') successModal!: ElementRef<HTMLDialogElement>;

  constructor(private router: Router) {}

  register() {
    axios
      .post('http://localhost:3000/api/user/register', {
        username: this.username,
        password: this.password,
      })
      .then((res) => {
        this.successModal.nativeElement.showModal();
      })
      .catch((err) => {
        console.error(err);
        alert('Invalid login. Try username: admin, password: admin');
      });
  }
}
