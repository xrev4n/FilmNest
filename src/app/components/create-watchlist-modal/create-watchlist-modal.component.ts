import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { WatchlistService } from '../../services/watchlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-watchlist-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule
  ],
  template: `
    <div class="modal-header">
      <h2 mat-dialog-title>Crear nueva lista</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content>
      <form class="create-list-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la lista</mat-label>
          <input matInput [(ngModel)]="title" name="title" required placeholder="Ej: Películas de terror">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción (opcional)</mat-label>
          <textarea matInput [(ngModel)]="description" name="description" rows="3" placeholder="Ej: Mis películas favoritas de miedo..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!title || loading" (click)="createList()">
        {{ loading ? 'Creando...' : 'Crear lista' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 8px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .create-list-form {
      display: flex;
      flex-direction: column;
      padding-top: 1rem;
    }
  `]
})
export class CreateWatchlistModalComponent {
  title = '';
  description = '';
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<CreateWatchlistModalComponent>,
    private watchlistService: WatchlistService,
    private snackBar: MatSnackBar
  ) { }

  createList(): void {
    if (!this.title) return;

    this.loading = true;
    this.watchlistService.createWatchlist(this.title, this.description).subscribe({
      next: (watchlist) => {
        this.loading = false;
        if (watchlist) {
          this.dialogRef.close(watchlist);
          this.snackBar.open('Lista creada exitosamente', 'Cerrar', { duration: 3000 });
        } else {
          this.snackBar.open('Error al crear la lista', 'Cerrar', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error creating watchlist:', error);
        this.loading = false;
        this.snackBar.open('Error al crear la lista', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
