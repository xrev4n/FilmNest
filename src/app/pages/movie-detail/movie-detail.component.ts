import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

import { TmdbService, MovieDetail, MovieImagesResponse } from '../../services/tmdb.service';
import { TrailerModalComponent } from '../../components/trailer-modal/trailer-modal.component';

/**
 * Componente de detalle de película
 * Muestra información completa de una película específica
 */
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  /** Datos de la película actual */
  movie: MovieDetail | null = null;
  /** Estado de carga */
  loading = false;
  /** Actores principales */
  actors: any[] = [];
  /** Página actual del cast */
  castPage = 0;
  /** Tamaño de página del cast */
  castPageSize = 5;
  /** Backdrop aleatorio de la película */
  randomBackdrop: string = '';
  /** Películas recomendadas */
  recommendations: any[] = [];
  /** Página actual de recomendaciones */
  recommendationsPage = 0;
  /** Tamaño de página de recomendaciones */
  recommendationsPageSize = 3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.updateCastPageSize();
      this.updateRecommendationsPageSize();
      window.addEventListener('resize', () => {
        this.updateCastPageSize();
        this.updateRecommendationsPageSize();
      });
    }
  }

  /**
   * Ajusta el tamaño de página del cast según el ancho de pantalla
   */
  updateCastPageSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.castPageSize = window.innerWidth <= 480 ? 3 : 5;
      if (this.castPage * this.castPageSize >= this.actors.length) {
        this.castPage = 0;
      }
    }
  }

  /**
   * Ajusta el tamaño de página de recomendaciones según el ancho de pantalla
   */
  updateRecommendationsPageSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.recommendationsPageSize = window.innerWidth <= 480 ? 1 : 3;
      if (this.recommendationsPage * this.recommendationsPageSize >= this.recommendations.length) {
        this.recommendationsPage = 0;
      }
    }
  }

  /**
   * Inicializa el componente y carga los detalles de la película
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const movieId = +params['id'];
      if (movieId) {
        this.loadMovieDetail(movieId);
        this.loadMovieCast(movieId);
        this.loadMovieRecommendations(movieId);
      }
    });
  }

  /**
   * Carga los detalles de una película específica desde la API
   * @param movieId - ID de la película a cargar
   */
  loadMovieDetail(movieId: number): void {
    this.loading = true;
    
    this.tmdbService.getMovieDetail(movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
        // Cargar imágenes de la película para obtener backdrop aleatorio
        this.loadMovieImages(movieId);
      },
      error: (error) => {
        console.error('Error loading movie detail:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar los detalles de la película', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Carga las imágenes de la película y selecciona un backdrop aleatorio
   * @param movieId - ID de la película
   */
  loadMovieImages(movieId: number): void {
    this.tmdbService.getMovieImages(movieId).subscribe({
      next: (images) => {
        this.selectRandomBackdrop(images);
      },
      error: (error) => {
        console.error('Error loading movie images:', error);
        // Si falla, usar el backdrop original de la película
        if (this.movie?.backdrop_path) {
          this.randomBackdrop = this.getBackdropUrl(this.movie.backdrop_path);
        }
      }
    });
  }

  /**
   * Selecciona un backdrop aleatorio de las imágenes de la película
   * @param images - Respuesta de imágenes de la película
   */
  selectRandomBackdrop(images: MovieImagesResponse): void {
    if (images.backdrops && images.backdrops.length > 0) {
      // Seleccionar cualquier backdrop aleatorio
      const randomBackdrop = images.backdrops[Math.floor(Math.random() * images.backdrops.length)];
      // Usar tamaño original para máxima calidad
      this.randomBackdrop = this.tmdbService.getHighQualityImageUrl(randomBackdrop.file_path);
      this.updateBackdropBackground();
    } else {
      // Si no hay backdrops, usar el original
      this.useOriginalBackdrop();
    }
  }

  /**
   * Usa el backdrop original de la película
   */
  private useOriginalBackdrop(): void {
    if (this.movie?.backdrop_path) {
      this.randomBackdrop = this.getBackdropUrl(this.movie.backdrop_path);
      this.updateBackdropBackground();
    }
  }

  /**
   * Actualiza la variable CSS del backdrop
   */
  private updateBackdropBackground(): void {
    if (isPlatformBrowser(this.platformId)) {
      const backdropUrl = this.randomBackdrop || this.getBackdropUrl(this.movie?.backdrop_path || '');
      document.documentElement.style.setProperty('--backdrop-image', `url(${backdropUrl})`);
    }
  }

  /**
   * Carga los 4 primeros actores del cast
   */
  loadMovieCast(movieId: number): void {
    this.tmdbService.getMovieCast(movieId).subscribe({
      next: (actors) => {
        this.actors = actors;
      },
      error: (error) => {
        console.error('Error loading cast:', error);
      }
    });
  }

  /**
   * Carga las películas recomendadas para la película actual
   */
  loadMovieRecommendations(movieId: number): void {
    this.tmdbService.getMovieRecommendations(movieId).subscribe({
      next: (response) => {
        this.recommendations = response.results || [];
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
      }
    });
  }

  /**
   * Navega de vuelta a la página principal
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Obtiene la URL de la imagen del póster
   * @param path - Ruta de la imagen
   * @returns URL completa de la imagen
   */
  getImageUrl(path: string): string {
    return this.tmdbService.getImageUrl(path);
  }

  /**
   * Obtiene la URL de la imagen de fondo
   * @param path - Ruta de la imagen
   * @returns URL completa de la imagen de fondo
   */
  getBackdropUrl(path: string): string {
    return this.tmdbService.getImageUrl(path, 'w1280');
  }

  /**
   * Maneja errores de carga de imágenes
   * @param event - Evento de error de la imagen
   */
  onImageError(event: any): void {
    event.target.src = 'assets/no-image.jpg';
  }

  /**
   * Formatea una cantidad monetaria en formato de moneda
   * @param amount - Cantidad a formatear
   * @returns String formateado de la moneda
   */
  formatCurrency(amount: number): string {
    if (amount === 0) return 'No disponible';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Abre el modal del trailer
   */
  openTrailerModal(): void {
    if (this.movie) {
      this.dialog.open(TrailerModalComponent, {
        data: {
          movieId: this.movie.id,
          movieTitle: this.movie.title
        },
        maxWidth: '90vw',
        maxHeight: '90vh',
        width: '800px'
      });
    }
  }

  /**
   * Convierte un código ISO de país a emoji de bandera
   * @param isoCode - Código ISO 3166-1 del país (ej: 'US', 'ES')
   * @returns Emoji de la bandera del país
   */
  getCountryFlag(isoCode: string): string {
    const codePoints = isoCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  /**
   * Obtiene la URL de la bandera de un país usando flagsapi.com
   * @param isoCode - Código ISO 3166-1 del país (ej: 'US', 'ES')
   * @returns URL de la imagen de la bandera
   */
  getCountryFlagUrl(isoCode: string): string {
    return `https://flagsapi.com/${isoCode.toUpperCase()}/flat/32.png`;
  }

  /**
   * Devuelve los actores visibles en la página actual
   */
  get visibleActors(): any[] {
    const start = this.castPage * this.castPageSize;
    return this.actors.slice(start, start + this.castPageSize);
  }

  /**
   * Navega a la página anterior del cast
   */
  prevCastPage(): void {
    if (this.castPage > 0) this.castPage--;
  }

  /**
   * Navega a la página siguiente del cast
   */
  nextCastPage(): void {
    if ((this.castPage + 1) * this.castPageSize < this.actors.length) this.castPage++;
  }

  /**
   * Devuelve el número total de páginas del cast
   */
  get castTotalPages(): number {
    return Math.ceil(this.actors.length / this.castPageSize);
  }

  /** Devuelve las películas recomendadas visibles en la página actual */
  get visibleRecommendations(): any[] {
    const start = this.recommendationsPage * this.recommendationsPageSize;
    return this.recommendations.slice(start, start + this.recommendationsPageSize);
  }

  /** Número total de páginas de recomendaciones */
  get recommendationsTotalPages(): number {
    return Math.ceil(this.recommendations.length / this.recommendationsPageSize);
  }

  /** Página anterior de recomendaciones */
  prevRecommendationsPage(): void {
    if (this.recommendationsPage > 0) this.recommendationsPage--;
  }

  /** Página siguiente de recomendaciones */
  nextRecommendationsPage(): void {
    if ((this.recommendationsPage + 1) * this.recommendationsPageSize < this.recommendations.length) this.recommendationsPage++;
  }

  /**
   * Navega a la página de género
   * @param genreId - ID del género
   */
  viewGenre(genreId: number): void {
    this.router.navigate(['/genre', genreId]);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', () => {
        this.updateCastPageSize();
        this.updateRecommendationsPageSize();
      });
    }
  }
}
