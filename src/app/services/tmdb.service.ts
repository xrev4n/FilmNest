import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
}
