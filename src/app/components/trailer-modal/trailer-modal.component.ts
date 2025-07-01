import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TmdbService } from '../../services/tmdb.service';
import { SafePipe } from '../../pipes/safe.pipe';

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SafePipe
  ],
  templateUrl: './trailer-modal.component.html',
  styleUrls: ['./trailer-modal.component.scss']
})
export class TrailerModalComponent implements OnInit {
  trailerUrl: string | null = null;
  loading = true;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<TrailerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movieId: number, movieTitle: string },
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.loadTrailer();
  }

  loadTrailer(): void {
    this.tmdbService.getMovieTrailerUrl(this.data.movieId).subscribe({
      next: (url) => {
        this.trailerUrl = url;
        this.loading = false;
        if (!url) {
          this.error = true;
        }
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  getEmbedUrl(): string {
    if (!this.trailerUrl) return '';
    // Convertir URL de YouTube a formato embed
    const videoId = this.trailerUrl.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}
