import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule , Location} from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginBackgroundComponent } from './login-background.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../pages/login/login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, LoginBackgroundComponent] 
})
export class LoginComponent implements OnInit{

  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Hacer scroll al inicio de la página
    this.scrollToTop();
  }

  /**
   * Hace scroll al inicio de la página
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async login() {
    this.loading = true;
    this.error = null;
    const { error } = await this.supabaseService.signIn(this.email, this.password);
    this.loading = false;
    if (error) {
      this.error = error.message;
    } else {
      this.router.navigate(['/']); 
    }
  }
  register() {
    this.router.navigate(['/register'], { queryParams: { fromLogin: 'true' } });
  }
  goBack() {
    this.location.back();
  }
}
