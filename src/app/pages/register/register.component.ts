import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) { }

  hide = signal(true);

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.password.length > 0;
  }

  async register() {
    if (!this.passwordsMatch()) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;
    const { error, data } = await this.supabaseService.signUp(this.email, this.password);
    this.loading = false;
    if (error) {
      this.error = error.message;
    } else {
      this.success = 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.';
      // Opcional: Redirigir después de unos segundos
      // setTimeout(() => this.router.navigate(['/login']), 2000);
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }
} 