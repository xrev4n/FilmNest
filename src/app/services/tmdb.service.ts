import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';


/**
 * Interfaz que representa una película básica
 */
export interface Movie {
  /** ID único de la película */
  id: number;
  /** Título de la película */
  title: string;
  /** Sinopsis de la película */
  overview: string;
  /** Ruta del póster de la película */
  poster_path: string;
  /** Fecha de lanzamiento */
  release_date: string;
  /** Calificación promedio */
  vote_average: number;
  /** IDs de los géneros */
  genre_ids: number[];
}

/**
 * Interfaz que extiende Movie con información detallada
 */
export interface MovieDetail extends Movie {
  /** Lista de géneros con información completa */
  genres: { id: number; name: string }[];
  /** Duración en minutos */
  runtime: number;
  /** Estado de la película */
  status: string;
  /** Presupuesto de la película */
  budget: number;
  /** Recaudación de la película */
  revenue: number;
  /** Ruta de la imagen de fondo */
  backdrop_path: string;
  /** Tagline de la película */
  tagline?: string;
  /** Países de producción */
  production_countries: { iso_3166_1: string; name: string }[];
}

/**
 * Interfaz que representa la respuesta de la API de películas
 */
export interface MovieResponse {
  /** Página actual */
  page: number;
  /** Lista de películas */
  results: Movie[];
  /** Total de páginas disponibles */
  total_pages: number;
  /** Total de resultados */
  total_results: number;
}

/**
 * Interfaz que representa los detalles completos de una persona/actor
 */
export interface PersonDetail {
  /** ID único de la persona */
  id: number;
  /** Nombre de la persona */
  name: string;
  /** Biografía de la persona */
  biography: string;
  /** Fecha de nacimiento */
  birthday: string;
  /** Fecha de fallecimiento (si aplica) */
  deathday: string | null;
  /** Lugar de nacimiento */
  place_of_birth: string;
  /** Ruta de la foto de perfil */
  profile_path: string;
  /** Género (1 = femenino, 2 = masculino) */
  gender: number;
  /** Conocido por (departamento) */
  known_for_department: string;
  /** Popularidad */
  popularity: number;
  /** También conocido como */
  also_known_as: string[];
  /** ID de IMDB */
  imdb_id: string;
  /** Página web oficial */
  homepage: string;
}

/**
 * Interfaz que representa una película en los créditos de una persona
 */
export interface PersonMovieCredit {
  /** ID de la película */
  id: number;
  /** Título de la película */
  title: string;
  /** Personaje interpretado */
  character: string;
  /** Ruta del póster */
  poster_path: string;
  /** Ruta de la imagen de fondo */
  backdrop_path: string;
  /** Fecha de lanzamiento */
  release_date: string;
  /** Calificación promedio */
  vote_average: number;
  /** Orden de aparición en los créditos */
  order: number;
}

/**
 * Interfaz que representa una película en los créditos de crew de una persona
 */
export interface PersonCrewCredit {
  /** ID de la película */
  id: number;
  /** Título de la película */
  title: string;
  /** Departamento (Director, Productor, etc.) */
  department: string;
  /** Trabajo específico */
  job: string;
  /** Ruta del póster */
  poster_path: string;
  /** Ruta de la imagen de fondo */
  backdrop_path: string;
  /** Fecha de lanzamiento */
  release_date: string;
  /** Calificación promedio */
  vote_average: number;
}

/**
 * Interfaz que representa la respuesta de créditos de películas de una persona
 */
export interface PersonMovieCreditsResponse {
  /** ID de la persona */
  id: number;
  /** Lista de películas en las que actuó */
  cast: PersonMovieCredit[];
  /** Lista de películas en las que participó como crew */
  crew: PersonCrewCredit[];
}

/**
 * Interfaz que representa una imagen de película
 */
export interface MovieImage {
  /** Ruta de la imagen */
  file_path: string;
  /** Ancho de la imagen */
  width: number;
  /** Alto de la imagen */
  height: number;
  /** Aspecto de la imagen */
  aspect_ratio: number;
  /** Puntuación de la imagen */
  vote_average: number;
  /** Número de votos */
  vote_count: number;
  /** ISO del idioma */
  iso_639_1: string;
}

/**
 * Interfaz que representa la respuesta de imágenes de una película
 */
export interface MovieImagesResponse {
  /** ID de la película */
  id: number;
  /** Lista de backdrops */
  backdrops: MovieImage[];
  /** Lista de posters */
  posters: MovieImage[];
  /** Lista de logos */
  logos: MovieImage[];
}

/**
 * Servicio para interactuar con la API de TMDB
 * Proporciona métodos para obtener información de películas
 */
@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  /** API key para autenticación con TMDB */
  private readonly apiKey = environment.tmdbApiKey;
  /** URL base de la API de TMDB */
  private readonly baseUrl = environment.tmdbBaseUrl;
  /** URL base para las imágenes de TMDB */
  private readonly imageBaseUrl = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las películas populares
   * @param page - Número de página (opcional, por defecto 1)
   * @returns Observable con la respuesta de películas populares
   */
  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=es-ES&page=${page}`
    );
  }

  /**
   * Busca películas por título
   * @param query - Término de búsqueda
   * @param page - Número de página (opcional, por defecto 1)
   * @returns Observable con los resultados de la búsqueda
   */
  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=es-ES&query=${encodeURIComponent(query)}&page=${page}`
    );
  }

  /**
   * Obtiene los detalles completos de una película específica
   * @param id - ID de la película
   * @returns Observable con los detalles de la película
   */
  getMovieDetail(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=es-ES`
    );
  }

  /**
   * Construye la URL completa de una imagen de TMDB
   * @param path - Ruta de la imagen
   * @param size - Tamaño de la imagen (opcional, por defecto 'w500')
   * @returns URL completa de la imagen
   */
  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return 'assets/no-image.jpg';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  /**
   * Construye la URL completa de una imagen de TMDB en alta calidad
   * @param path - Ruta de la imagen
   * @returns URL completa de la imagen en tamaño original
   */
  getHighQualityImageUrl(path: string): string {
    if (!path) return 'assets/no-image.jpg';
    return `${this.imageBaseUrl}/original${path}`;
  }

    /**
   * Obtiene la URL del tráiler en YouTube de una película por su ID
   * @param movieId - ID de la película
   * @returns Observable con la URL del tráiler de YouTube o null si no se encuentra
   */
  getMovieTrailerUrl(movieId: number): Observable<string | null> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}`
    ).pipe(
      map(response => {
        const trailers = response.results?.filter(
          (video: any) =>
            video.site === 'YouTube' && video.type === 'Trailer'
        );
        if (trailers && trailers.length > 0) {
          const trailerKey = trailers[0].key;
          return `https://www.youtube.com/watch?v=${trailerKey}`;
        }
        return null;
      })
    );
  }

  /**
   * Obtiene los detalles completos de múltiples películas
   * @param movieIds - Array de IDs de películas
   * @returns Observable con array de películas con detalles completos
   */
  getMoviesDetails(movieIds: number[]): Observable<MovieDetail[]> {
    const requests = movieIds.map(id => this.getMovieDetail(id));
    return forkJoin(requests);
  }

  /**
   * Obtiene las películas populares con detalles completos
   * @param page - Número de página (opcional, por defecto 1)
   * @returns Observable con películas populares
   */
  getPopularMoviesWithDetails(page: number = 1): Observable<MovieDetail[]> {
    return this.getPopularMovies(page).pipe(
      switchMap(response => {
        const movieIds = response.results.map(movie => movie.id);
        return this.getMoviesDetails(movieIds);
      })
    );
  }

  /**
   * Busca películas con detalles completos
   * @param query - Término de búsqueda
   * @param page - Número de página (opcional, por defecto 1)
   * @returns Observable con películas de búsqueda
   */
  searchMoviesWithDetails(query: string, page: number = 1): Observable<MovieDetail[]> {
    return this.searchMovies(query, page).pipe(
      switchMap(response => {
        const movieIds = response.results.map(movie => movie.id);
        return this.getMoviesDetails(movieIds);
      })
    );
  }

  /**
   * Obtiene todo el cast de una película
   * @param movieId - ID de la película
   * @returns Observable con el cast completo
   */
  getMovieCast(movieId: number): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/movie/${movieId}/credits?api_key=${this.apiKey}`).pipe(
      map(response => response.cast ? response.cast : [])
    );
  }

  /**
   * Obtiene los detalles completos de una persona/actor
   * @param personId - ID de la persona
   * @returns Observable con los detalles de la persona
   */
  getPersonDetail(personId: number): Observable<PersonDetail> {
    return this.http.get<PersonDetail>(
      `${this.baseUrl}/person/${personId}?api_key=${this.apiKey}&language=es-ES`
    );
  }

  /**
   * Obtiene las películas en las que ha actuado una persona
   * @param personId - ID de la persona
   * @returns Observable con las películas en las que actuó
   */
  getPersonMovieCredits(personId: number): Observable<PersonMovieCreditsResponse> {
    return this.http.get<PersonMovieCreditsResponse>(
      `${this.baseUrl}/person/${personId}/movie_credits?api_key=${this.apiKey}&language=es-ES`
    );
  }

  /**
   * Obtiene las imágenes de una película (backdrops, posters, logos)
   * @param movieId - ID de la película
   * @returns Observable con las imágenes de la película
   */
  getMovieImages(movieId: number): Observable<MovieImagesResponse> {
    return this.http.get<MovieImagesResponse>(
      `${this.baseUrl}/movie/${movieId}/images?api_key=${this.apiKey}`
    );
  }

  /**
   * Obtiene las películas recomendadas para una película específica
   * @param movieId - ID de la película
   * @returns Observable con las películas recomendadas
   */
  getMovieRecommendations(movieId: number): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/${movieId}/recommendations?api_key=${this.apiKey}&language=es-ES`
    );
  }
}
