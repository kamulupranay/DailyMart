import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      console.log(this.signupForm.invalid);
      this.errorMessage.set('Please fill in all fields correctly');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formData = this.signupForm.value;

    this.authService.signUp(formData).subscribe({
      next: (response) => {
        this.successMessage.set(`Welcome, ${response.user.name}! Account created successfully.`);
        this.signupForm.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || error.message || 'Sign up failed');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  resetForm(): void {
    this.signupForm.reset();
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}