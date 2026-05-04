import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  loginForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Please fill in all fields correctly');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.successMessage.set(`Welcome, ${response.user.name}! Login successful.`);
        this.loginForm.reset();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || error.message || 'Login failed');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  resetForm(): void {
    this.loginForm.reset();
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}
