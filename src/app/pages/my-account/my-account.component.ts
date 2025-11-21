import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { SupabaseService, UserProfile } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = false;
  isEditing = false;
  saving = false;
  editForm: {
    username: string;
    full_name: string;
    bio: string;
    birthdate: Date | null;
  } = {
      username: '',
      full_name: '',
      bio: '',
      birthdate: null
    };

  constructor(
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  async loadProfile(): Promise<void> {
    this.loading = true;
    try {
      const { data, error } = await this.supabaseService.getUserProfile();
      if (error) {
        this.snackBar.open('Error al cargar el perfil', 'Cerrar', { duration: 3000 });
      } else {
        this.profile = data;
        this.initializeEditForm();
      }
    } catch {
      this.snackBar.open('Error al cargar el perfil', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  private initializeEditForm(): void {
    if (this.profile) {
      // Convert string date to Date object for the datepicker
      let birthdateObj: Date | null = null;
      if (this.profile.birthdate) {
        // Assuming format YYYY-MM-DD from Supabase
        // We append 'T00:00:00' to ensure local time isn't messed up by UTC conversion if needed,
        // but simpler is to just parse it.
        // However, new Date('YYYY-MM-DD') is treated as UTC.
        // To avoid timezone issues showing the wrong day, we can split and create the date manually
        // or use a library. For native Date, let's be careful.
        // Actually, for a birthdate, we usually want the exact date.
        // Let's try standard parsing first, but be aware of timezone offsets.
        const parts = this.profile.birthdate.split('-');
        if (parts.length === 3) {
          birthdateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
      }

      this.editForm = {
        username: this.profile.username || '',
        full_name: this.profile.full_name || '',
        bio: this.profile.bio || '',
        birthdate: birthdateObj
      };
    }
  }

  startEditing(): void {
    this.isEditing = true;
    this.initializeEditForm();
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.initializeEditForm();
  }

  async saveProfile(): Promise<void> {
    this.saving = true;
    try {
      // Convert Date object back to YYYY-MM-DD string
      let birthdateStr: string | null = null;
      if (this.editForm.birthdate) {
        const d = this.editForm.birthdate;
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        birthdateStr = `${year}-${month}-${day}`;
      }

      const { data, error } = await this.supabaseService.updateUserProfile({
        username: this.editForm.username || null,
        full_name: this.editForm.full_name || null,
        bio: this.editForm.bio || null,
        birthdate: birthdateStr
      });
      if (error) {
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
      } else {
        this.profile = data;
        this.isEditing = false;
        this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', { duration: 3000 });
      }
    } catch {
      this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 3000 });
    } finally {
      this.saving = false;
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  }
}