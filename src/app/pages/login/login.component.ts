import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../pages/login/login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatIconModule, MatButtonModule] 
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router 
  ) {}

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
    this.router.navigate(['/register']);
  }
  goBack() {
    this.router.navigate(['/']);
  }
}
