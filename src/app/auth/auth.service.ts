import { Injectable } from '@angular/core';
import { UserPayloadDTO } from '../types/user-payload-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = 'token';

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.token);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Save token
  saveToken(token: string): void {
    localStorage.setItem(this.token, token);
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])) as UserPayloadDTO;
    return payload._id;
  }

  // Clear token
  logout(): void {
    localStorage.removeItem(this.token);
    window.location.reload();
  }
}
