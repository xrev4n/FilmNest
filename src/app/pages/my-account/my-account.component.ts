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
import { SupabaseService, UserProfile } from '../../services/supabase.service';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = false;
  isEditing = false;
  saving = false;
  editForm = {
    username: '',
    full_name: '',
    bio: '',
    birthdate: ''
  };

  constructor(
    private supabaseService: SupabaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProfile();
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
      this.editForm = {
        username: this.profile.username || '',
        full_name: this.profile.full_name || '',
        bio: this.profile.bio || '',
        birthdate: this.profile.birthdate || ''
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
      const { data, error } = await this.supabaseService.updateUserProfile({
        username: this.editForm.username,
        full_name: this.editForm.full_name,
        bio: this.editForm.bio,
        birthdate: this.editForm.birthdate
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