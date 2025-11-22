import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WatchlistService, Watchlist } from '../../services/watchlist.service';
import { TmdbService } from '../../services/tmdb.service';
import { CreateWatchlistModalComponent } from '../../components/create-watchlist-modal/create-watchlist-modal.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';

interface WatchlistWithCover extends Watchlist {
  coverUrl?: string;
}

@Component({
  selector: 'app-my-watchlists',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatTooltipModule,
    SideMenuComponent
  ],
  template: `
    <app-side-menu [isOpen]="sideMenuOpen" (close)="sideMenuOpen = false"></app-side-menu>

    <!-- Botón de menú hamburguesa -->
    <button mat-icon-button class="menu-toggle-btn" (click)="toggleSideMenu()">
      <mat-icon>menu</mat-icon>
    </button>

    <div class="watchlists-container">
      <header class="page-header">
        <h1>Mis Listas</h1>
        <button mat-flat-button color="primary" (click)="openCreateModal()">
          <mat-icon>add</mat-icon>
          Crear lista
        </button>
      </header>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Cargando tus listas...</p>
      </div>

      <div *ngIf="!loading && watchlists.length === 0" class="empty-state">
        <mat-icon class="empty-icon">playlist_add</mat-icon>
        <h3>No tienes listas creadas</h3>
        <p>Crea tu primera lista para organizar tus películas favoritas.</p>
        <button mat-stroked-button color="primary" (click)="openCreateModal()">
          Crear mi primera lista
        </button>
      </div>

      <div *ngIf="!loading && watchlists.length > 0" class="watchlists-grid">
        <mat-card *ngFor="let list of watchlists" class="watchlist-card">
          <div class="card-cover" [style.background-image]="list.coverUrl ? 'url(' + list.coverUrl + ')' : 'none'">
            <div class="cover-overlay"></div>
            <mat-icon *ngIf="!list.coverUrl" class="placeholder-icon">movie</mat-icon>
          </div>
          <mat-card-content>
            <h3 class="watchlist-title">{{ list.title }}</h3>
            <p class="watchlist-desc">{{ list.description || 'Sin descripción' }}</p>
            <div class="watchlist-meta">
              <span>{{ list.created_at | date:'mediumDate' }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-icon-button color="warn" (click)="deleteWatchlist(list)" 
                    [disabled]="list.title === 'Mi Lista'" 
                    [matTooltip]="list.title === 'Mi Lista' ? 'No se puede eliminar la lista por defecto' : 'Eliminar lista'">
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-button color="primary" [routerLink]="['/watchlist', list.id]">
              Ver lista
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .watchlists-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 80vh;
      padding-top: 80px; /* Espacio para el botón hamburguesa en móvil si se superpone, o ajuste general */
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 0;
      color: var(--text-secondary);
      gap: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--surface-card);
      border-radius: 16px;
      border: 1px dashed var(--border-color);
      
      .empty-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        color: var(--text-secondary);
        opacity: 0.5;
      }

      h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }
    }

    .watchlists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .watchlist-card {
      background: var(--surface-card);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid var(--border-color);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }

      .card-cover {
        height: 160px;
        background-color: var(--surface-hover);
        background-size: cover;
        background-position: center;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .cover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%);
        }

        .placeholder-icon {
          font-size: 3rem;
          width: 3rem;
          height: 3rem;
          color: var(--text-secondary);
          opacity: 0.3;
        }
      }

      mat-card-content {
        padding: 1rem;
      }

      .watchlist-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .watchlist-desc {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0 0 1rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 2.7em;
      }

      .watchlist-meta {
        font-size: 0.8rem;
        color: var(--text-secondary);
        opacity: 0.7;
      }

      mat-card-actions {
        padding: 0.5rem;
        border-top: 1px solid var(--border-color);
      }
    }

    @media (max-width: 600px) {
      .watchlists-container {
        padding: 1rem;
        padding-top: 60px;
      }
      
      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }
  `]
})
export class MyWatchlistsComponent implements OnInit {
  watchlists: WatchlistWithCover[] = [];
  loading = true;
  sideMenuOpen = false;

  constructor(
    private watchlistService: WatchlistService,
    private tmdbService: TmdbService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadWatchlists();
    }
  }

  toggleSideMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
  }

  loadWatchlists(): void {
    this.loading = true;
    this.watchlistService.getWatchlists().subscribe({
      next: (lists) => {
        this.watchlists = lists;
        this.loading = false;
        // Cargar portadas
        this.loadCovers();
      },
      error: (error) => {
        console.error('Error loading watchlists:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar tus listas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadCovers(): void {
    this.watchlists.forEach(list => {
      this.watchlistService.getWatchlistCover(list.id).subscribe(movieId => {
        if (movieId) {
          this.tmdbService.getMovieDetail(+movieId).subscribe(movie => {
            if (movie && movie.backdrop_path) {
              list.coverUrl = this.tmdbService.getImageUrl(movie.backdrop_path, 'w780');
            }
          });
        }
      });
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CreateWatchlistModalComponent, {
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWatchlists();
      }
    });
  }

  deleteWatchlist(list: WatchlistWithCover): void {
    if (list.title === 'Mi Lista') {
      this.snackBar.open('No puedes eliminar tu lista por defecto', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar la lista "${list.title}"?`)) {
      this.watchlistService.deleteWatchlist(list.id).subscribe(success => {
        if (success) {
          this.snackBar.open('Lista eliminada', 'Cerrar', { duration: 3000 });
          this.loadWatchlists();
        } else {
          this.snackBar.open('Error al eliminar la lista', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
