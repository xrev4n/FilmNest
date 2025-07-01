import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TmdbService, MovieDetail } from '../../services/tmdb.service';

/**
 * Componente de detalle de película
 * Muestra información completa de una película específica
 */
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  /** Datos de la película actual */
  movie: MovieDetail | null = null;
  /** Estado de carga */
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Inicializa el componente y carga los detalles de la película
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const movieId = +params['id'];
      if (movieId) {
        this.loadMovieDetail(movieId);
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
   * Navega de vuelta a la página principal
   */
  goBack(): void {
    this.router.navigate(['/']);
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
   * Extrae el año de la fecha de lanzamiento
   * @param date - Fecha de lanzamiento
   * @returns Año como string
   */
  getYear(date: string): string {
    return new Date(date).getFullYear().toString();
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
}
