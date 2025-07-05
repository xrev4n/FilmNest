import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TmdbService, MovieDetail } from '../../services/tmdb.service';

/**
 * Componente de la página de género
 * Muestra películas filtradas por un género específico
 */
@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule
  ],
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {
  /** Lista de películas del género */
  movies: MovieDetail[] = [];
  /** Estado de carga */
  loading = false;
  /** Página actual */
  currentPage = 1;
  /** Total de páginas disponibles */
  totalPages = 0;
  /** Total de resultados */
  totalResults = 0;
  /** ID del género actual */
  genreId: number = 0;
  /** Nombre del género actual */
  genreName: string = '';
  /** Lista de géneros disponibles */
  genres: { id: number; name: string }[] = [];

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Inicializa el componente cargando las películas del género
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.genreId = +params['id'];
      if (this.genreId) {
        this.loadGenresAndMovies();
      }
    });
  }

  /**
   * Carga los géneros y luego las películas del género especificado
   */
  loadGenresAndMovies(): void {
    this.loading = true;
    
    this.tmdbService.getGenres().subscribe({
      next: (response) => {
        this.genres = response.genres;
        // Actualizar el nombre del género después de cargar los géneros
        this.updateGenreName();
        // Cargar las películas del género
        this.loadMoviesByGenre();
      },
      error: (error) => {
        console.error('Error loading genres:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar los géneros', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Actualiza el nombre del género basado en el ID
   */
  updateGenreName(): void {
    const genre = this.genres.find(g => g.id === this.genreId);
    this.genreName = genre ? genre.name : `Género ${this.genreId}`;
  }

  /**
   * Carga las películas del género especificado
   */
  loadMoviesByGenre(): void {
    this.tmdbService.getMoviesByGenreWithDetails(this.genreId, this.currentPage).subscribe({
      next: (movies) => {
        this.movies = movies;
        // Para mantener la paginación, necesitamos obtener el total de páginas
        this.tmdbService.getMoviesByGenre(this.genreId, this.currentPage).subscribe({
          next: (response) => {
            this.totalPages = response.total_pages;
            this.totalResults = response.total_results;
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading movies by genre:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar las películas del género', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Maneja el cambio de página en el paginador
   * @param event - Evento de cambio de página
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.loadMoviesByGenre();
  }

  /**
   * Navega a la página de detalle de una película
   * @param movieId - ID de la película
   */
  viewMovieDetail(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }

  /**
   * Obtiene la URL de la imagen de la película
   * @param path - Ruta de la imagen
   * @returns URL completa de la imagen
   */
  getImageUrl(path: string): string {
    return this.tmdbService.getImageUrl(path);
  }

  /**
   * Maneja errores de carga de imágenes
   * @param event - Evento de error de la imagen
   */
  onImageError(event: any): void {
    event.target.src = 'assets/img/poster-not-found.png';
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
   * Navega a la página de género
   * @param genreId - ID del género
   * @param event - Evento del click
   */
  viewGenre(genreId: number, event: Event): void {
    event.stopPropagation(); // Evita que se active el click de la tarjeta
    this.router.navigate(['/genre', genreId]);
  }

  /**
   * Navega a la página de inicio
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
} 