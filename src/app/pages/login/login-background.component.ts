import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-login-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="background-wrapper">
      <div *ngFor="let url of backdropUrls; let i = index"
           class="background-image"
           [class.visible]="i === currentIndex"
           [style.backgroundImage]="'url(' + url + ')'">
      </div>
    </div>
  `,
  styleUrls: ['./login-background.component.scss']
})
export class LoginBackgroundComponent implements OnInit, OnDestroy {
  backdropUrls: string[] = [];
  currentIndex = 0;
  private timerSub?: Subscription;
  private fadeInterval = 5000;
  private isBrowser: boolean;

  constructor(
    private tmdb: TmdbService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadPopularMovies();
    }
  }

  /**
   * Carga las películas populares desde la API
   */
  loadPopularMovies(): void {
    this.tmdb.getPopularMovies(1).subscribe({
      next: (movies) => {
        this.backdropUrls = movies.results
          .map(movie => movie.backdrop_path)
          .filter(Boolean)
          .map(path => this.tmdb.getHighQualityImageUrl(path));

        this.startAnimation();
      },
      error: (err) => {
        console.error('Error cargando películas populares:', err);
      }
    });
  }

  /**
   * Inicia la animación de cambio de fondo
   */
  startAnimation(): void {
    if (this.backdropUrls.length > 1) {
      this.timerSub = interval(this.fadeInterval).subscribe(() => {
        this.currentIndex = (this.currentIndex + 1) % this.backdropUrls.length;
      });
    }
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }
}
