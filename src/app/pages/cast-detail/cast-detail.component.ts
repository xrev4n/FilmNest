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
import { isPlatformBrowser } from '@angular/common';

import { TmdbService, PersonDetail, PersonMovieCredit, PersonCrewCredit } from '../../services/tmdb.service';

/**
 * Componente de detalle de actor
 * Muestra información completa de un actor específico
 */
@Component({
  selector: 'app-cast-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './cast-detail.component.html',
  styleUrls: ['./cast-detail.component.scss']
})
export class CastDetailComponent implements OnInit, OnDestroy {
  /** Datos del actor actual */
  person: PersonDetail | null = null;
  /** Estado de carga */
  loading = false;
  /** Películas en las que ha actuado */
  movies: PersonMovieCredit[] = [];
  /** Página actual de películas */
  moviesPage = 0;
  /** Tamaño de página de películas */
  moviesPageSize = 3; // 3 cards por línea (una línea por página)
  /** Películas en las que ha participado como crew */
  crewMovies: PersonCrewCredit[] = [];
  /** Página actual de películas de crew */
  crewPage = 0;
  /** Tamaño de página de películas de crew */
  crewPageSize = 3; // 3 cards por línea (una línea por página)
  /** Imagen de fondo aleatoria de una película */
  randomBackdrop: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService,
    private snackBar: MatSnackBar,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.updatePageSizes();
      window.addEventListener('resize', this.updatePageSizes.bind(this));
    }
  }

  /**
   * Inicializa el componente y carga los detalles del actor
   */
  ngOnInit(): void {
    // Hacer scroll al inicio de la página
    this.scrollToTop();
    
    this.route.params.subscribe(params => {
      const personId = +params['id'];
      if (personId) {
        this.loadPersonDetail(personId);
        this.loadPersonMovieCredits(personId);
      }
    });
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
   * Carga los detalles de un actor específico desde la API
   * @param personId - ID del actor a cargar
   */
  loadPersonDetail(personId: number): void {
    this.loading = true;
    
    this.tmdbService.getPersonDetail(personId).subscribe({
      next: (person) => {
        this.person = person;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading person detail:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar los detalles del actor', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Carga las películas en las que ha actuado el actor
   * @param personId - ID del actor
   */
  loadPersonMovieCredits(personId: number): void {
    this.tmdbService.getPersonMovieCredits(personId).subscribe({
      next: (credits) => {
        // Ordenar por fecha de lanzamiento (más recientes primero)
        this.movies = credits.cast
          .filter(movie => movie.title && movie.release_date) // Filtrar películas sin título o fecha
          .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        
        // Cargar también las películas de crew
        this.crewMovies = credits.crew
          .filter(movie => movie.title && movie.release_date) // Filtrar películas sin título o fecha
          .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        
        // Seleccionar imagen de fondo aleatoria
        this.selectRandomBackdrop();
      },
      error: (error) => {
        console.error('Error loading person movie credits:', error);
      }
    });
  }

  /**
   * Selecciona una imagen de fondo aleatoria de las películas del actor
   */
  selectRandomBackdrop(): void {
    // Filtrar películas que tienen backdrop_path
    const moviesWithBackdrop = this.movies.filter(movie => movie.backdrop_path);
    
    if (moviesWithBackdrop.length > 0) {
      // Seleccionar una película aleatoria
      const randomMovie = moviesWithBackdrop[Math.floor(Math.random() * moviesWithBackdrop.length)];
      this.randomBackdrop = this.tmdbService.getHighQualityImageUrl(randomMovie.backdrop_path);
    } else {
      // Si no hay películas con backdrop, usar la foto de perfil del actor
      this.randomBackdrop = this.person?.profile_path ? this.tmdbService.getHighQualityImageUrl(this.person.profile_path) : '';
    }
  }

  /**
   * Navega de vuelta a la página anterior
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Obtiene la URL de la imagen del perfil
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
    event.target.src = 'assets/img/cast-not-found.png';
  }

  /**
   * Calcula la edad del actor
   * @param birthday - Fecha de nacimiento
   * @param deathday - Fecha de fallecimiento (opcional)
   * @returns Edad calculada
   */
  calculateAge(birthday: string, deathday?: string | null): number {
    if (!birthday) return 0;
    
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Formatea la fecha de nacimiento
   * @param date - Fecha a formatear
   * @returns Fecha formateada
   */
  formatDate(date: string): string {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Devuelve las películas visibles en la página actual
   */
  get visibleMovies(): PersonMovieCredit[] {
    const start = this.moviesPage * this.moviesPageSize;
    return this.movies.slice(start, start + this.moviesPageSize);
  }

  /**
   * Navega a la página anterior de películas
   */
  prevMoviesPage(): void {
    if (this.moviesPage > 0) this.moviesPage--;
  }

  /**
   * Navega a la página siguiente de películas
   */
  nextMoviesPage(): void {
    if ((this.moviesPage + 1) * this.moviesPageSize < this.movies.length) this.moviesPage++;
  }

  /**
   * Devuelve el número total de páginas de películas
   */
  get moviesTotalPages(): number {
    return Math.ceil(this.movies.length / this.moviesPageSize);
  }

  /**
   * Devuelve las películas de crew visibles en la página actual
   */
  get visibleCrewMovies(): PersonCrewCredit[] {
    const start = this.crewPage * this.crewPageSize;
    return this.crewMovies.slice(start, start + this.crewPageSize);
  }

  /**
   * Navega a la página anterior de películas de crew
   */
  prevCrewPage(): void {
    if (this.crewPage > 0) this.crewPage--;
  }

  /**
   * Navega a la página siguiente de películas de crew
   */
  nextCrewPage(): void {
    if ((this.crewPage + 1) * this.crewPageSize < this.crewMovies.length) this.crewPage++;
  }

  /**
   * Devuelve el número total de páginas de películas de crew
   */
  get crewTotalPages(): number {
    return Math.ceil(this.crewMovies.length / this.crewPageSize);
  }

  /**
   * Ajusta el tamaño de página de películas según el ancho de pantalla
   */
  updatePageSizes(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth <= 480) {
        this.moviesPageSize = 1; // 1 card por línea en móviles
        this.crewPageSize = 1;
      } else if (window.innerWidth <= 768) {
        this.moviesPageSize = 2; // 2 cards por línea en tablets
        this.crewPageSize = 2;
      } else {
        this.moviesPageSize = 3; // 3 cards por línea en desktop
        this.crewPageSize = 3;
      }
      
      if (this.moviesPage * this.moviesPageSize >= this.movies.length) {
        this.moviesPage = 0;
      }
      
      if (this.crewPage * this.crewPageSize >= this.crewMovies.length) {
        this.crewPage = 0;
      }
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.updatePageSizes.bind(this));
    }
  }
} 