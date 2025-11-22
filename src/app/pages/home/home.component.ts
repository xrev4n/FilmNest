import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { TmdbService, MovieDetail } from '../../services/tmdb.service';
import { ThemeService } from '../../services/theme.service';

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
    SearchBarComponent,
    SideMenuComponent
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

  /** Estado del menú lateral */
  sideMenuOpen = false;

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /** Alterna el menú lateral */
  toggleSideMenu(): void {
    this.sideMenuOpen = !this.sideMenuOpen;
  }

  /**
   * Inicializa el componente cargando las películas populares
   */
  ngOnInit(): void {
    // Hacer scroll al inicio de la página
    this.scrollToTop();

    this.loadPopularMovies();
  }

  /**
   * Hace scroll al inicio de la página
   */
  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    this.currentPage = 1; // Solo reiniciar página en búsquedas nuevas

    if (!query.trim()) {
      this.loadPopularMovies();
      return;
    }

    this.performSearch(query, this.currentPage);
  }

  /**
   * Realiza la búsqueda de películas con la página especificada
   * @param query - Término de búsqueda
   * @param page - Número de página
   */
  private performSearch(query: string, page: number): void {
    this.loading = true;
    this.tmdbService.searchMoviesWithDetails(query, page).subscribe({
      next: (movies) => {
        this.movies = movies;
        // Para mantener la paginación, necesitamos obtener el total de páginas
        this.tmdbService.searchMovies(query, page).subscribe({
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

    // Hacer scroll al top cuando cambie de página
    this.scrollToTop();

    if (this.searchQuery) {
      // Usar el método de búsqueda paginada sin reiniciar la página
      this.performSearch(this.searchQuery, this.currentPage);
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
