import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatIconModule, MatButtonModule],
  templateUrl: './custom-snackbar.html',
  styleUrl: './custom-snackbar.scss',
})
export class CustomSnackbarComponent {
  [x: string]: any;
  private snackBar = inject(MatSnackBar);
  // data!: { message: string; action: string; };
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string; action: string; }) {}
  private snackBarRef: MatSnackBarRef<CustomSnackbarComponent> | undefined;

  show(message: string, duration: number = 3000, action: string = '<mat-icon>close</mat-icon>') {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-success-snackbar'],
    });
  }

  dismiss() {
    this.snackBarRef?.dismiss();
  }
}
