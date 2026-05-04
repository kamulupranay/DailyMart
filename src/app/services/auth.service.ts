import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';

export interface AuthResponse {
  message: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000';
  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<User | null>(null);

  constructor() {
    this.checkSession().subscribe({
      error: () => {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
      }
    });
  }

  login(username: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        { username, password },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  signUp(userData: { username: string; email: string; name: string; password: string }) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      userData,
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      }),
      catchError((error) => this.handleError(error))
    );
  }

  logout() {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
      })
    );
  }

  checkSession() {
    return this.http.get<{ user: User }>(
      `${this.apiUrl}/profile`,
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        if (response.user) {
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        }
      }),
      catchError(() => {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        return of({ user: null as any });
      })
    );
  }

  getCurrentUser() {
    return this.currentUser();
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage =
      error.error?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    return throwError(() => new Error(errorMessage));
  }
}
