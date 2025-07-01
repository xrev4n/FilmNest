import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TmdbService, Movie } from '../../services/tmdb.service';

/**
 * Componente de la página principal del catálogo de películas
 * Muestra una lista de películas populares y permite búsquedas
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    SearchBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** Lista de películas a mostrar */
  movies: Movie[] = [];
  /** Estado de carga */
  loading = false;
  /** Página actual */
  currentPage = 1;
  /** Total de páginas disponibles */
  totalPages = 0;
  /** Total de resultados */
  totalResults = 0;
  /** Término de búsqueda actual */
  searchQuery = '';

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Inicializa el componente cargando las películas populares
   */
  ngOnInit(): void {
    this.loadPopularMovies();
  }

  /**
   * Carga las películas populares desde la API
   */
  loadPopularMovies(): void {
    this.loading = true;
    this.searchQuery = '';
    
    this.tmdbService.getPopularMovies(this.currentPage).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar las películas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Realiza una búsqueda de películas por título
   * @param query - Término de búsqueda
   */
  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    
    if (!query.trim()) {
      this.loadPopularMovies();
      return;
    }

    this.loading = true;
    this.tmdbService.searchMovies(query, this.currentPage).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching movies:', error);
        this.loading = false;
        this.snackBar.open('Error al buscar películas', 'Cerrar', {
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
    
    if (this.searchQuery) {
      this.onSearch(this.searchQuery);
    } else {
      this.loadPopularMovies();
    }
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
   * Trunca la sinopsis a un número máximo de caracteres
   * @param overview - Sinopsis completa
   * @returns Sinopsis truncada
   */
  truncateOverview(overview: string): string {
    return overview.length > 120 ? overview.substring(0, 120) + '...' : overview;
  }
}
