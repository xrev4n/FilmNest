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
import { TmdbService, Movie, MovieDetail } from '../../services/tmdb.service';

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
  movies: MovieDetail[] = [];
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

  /** Estado del desplegable de categorías */
  categoriesOpen = false;
  /** Estado del menú lateral */
  sideMenuOpen = false;

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /** Alterna el menú lateral */
  toggleSideMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
  }

  /** Alterna el desplegable de categorías */
  toggleCategories(): void {
    this.categoriesOpen = !this.categoriesOpen;
  }

  /** Navega al login y cierra el menú */
  navigateToLogin(): void {
    this.sideMenuOpen = false;
    this.router.navigate(['/login']);
  }

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
    
    this.tmdbService.getPopularMoviesWithDetails(this.currentPage).subscribe({
      next: (movies) => {
        this.movies = movies;
        // Para mantener la paginación, necesitamos obtener el total de páginas
        this.tmdbService.getPopularMovies(this.currentPage).subscribe({
          next: (response) => {
            this.totalPages = response.total_pages;
            this.totalResults = response.total_results;
            this.loading = false;
          }
        });
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
    this.tmdbService.searchMoviesWithDetails(query, this.currentPage).subscribe({
      next: (movies) => {
        this.movies = movies;
        // Para mantener la paginación, necesitamos obtener el total de páginas
        this.tmdbService.searchMovies(query, this.currentPage).subscribe({
          next: (response) => {
            this.totalPages = response.total_pages;
            this.totalResults = response.total_results;
            this.loading = false;
          }
        });
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
   * Navega a la página de género
   * @param genreId - ID del género
   * @param event - Evento del click
   */
  viewGenre(genreId: number, event: Event): void {
    event.stopPropagation(); // Evita que se active el click de la tarjeta
    this.router.navigate(['/genre', genreId]);
  }
}
