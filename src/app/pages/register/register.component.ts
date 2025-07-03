import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { signal } from '@angular/core';
import { RegisterBackgroundComponent } from './register-background.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, RegisterBackgroundComponent],
})
export class RegisterComponent implements AfterViewInit, OnInit {
  @ViewChild(RegisterBackgroundComponent) registerBackground!: RegisterBackgroundComponent;
  
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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  hide = signal(true);

  ngOnInit() {
    // Verificar si viene desde login
    this.route.queryParams.subscribe(params => {
      if (params['fromLogin'] === 'true') {
        console.log('RegisterComponent: Detectada navegación desde login');
        // Forzar reinicialización del fondo después de que se inicialice la vista
        setTimeout(() => {
          this.triggerBackgroundAnimation();
        }, 300);
      }
    });
  }

  ngAfterViewInit() {
    console.log('RegisterComponent: ngAfterViewInit ejecutado');
    // Asegurar que la animación se inicie correctamente
    setTimeout(() => {
      console.log('RegisterComponent: Intentando iniciar animación del fondo');
      if (this.registerBackground) {
        console.log('RegisterComponent: Componente de fondo encontrado');
        this.registerBackground.startAnimation();
      } else {
        console.log('RegisterComponent: Componente de fondo no encontrado');
      }
    }, 100);
  }

  /**
   * Método para reiniciar la animación del fondo
   */
  triggerBackgroundAnimation() {
    console.log('RegisterComponent: Forzando reinicio de animación del fondo');
    if (this.registerBackground) {
      this.registerBackground.startAnimation();
    }
  }

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

  /**
   * Método para manejar la navegación desde login
   */
  onNavigateFromLogin() {
    console.log('RegisterComponent: Navegación desde login detectada');
    // Forzar la reinicialización del fondo
    setTimeout(() => {
      this.triggerBackgroundAnimation();
    }, 200);
  }
} 