import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { SupabaseService } from './supabase.service';
import { Observable, from, map, switchMap, of } from 'rxjs';

export interface Watchlist {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    is_public: boolean;
    created_at: string;
}

export interface WatchlistItem {
    id: string;
    watchlist_id: string;
    movie_id: number;
    added_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class WatchlistService {

    constructor(private supabaseService: SupabaseService) { }

    /**
     * Obtiene la watchlist por defecto del usuario (o crea una si no existe)
     */
    getDefaultWatchlist(): Observable<Watchlist | null> {
        const user = this.supabaseService.getCurrentUser();
        if (!user) return of(null);

        return from(supabase
            .from('watchlists')
            .select('*')
            .eq('user_id', user.id)
            .eq('title', 'Mi Lista') // Asumimos 'Mi Lista' como la default
            .single()
        ).pipe(
            switchMap(({ data, error }) => {
                if (data) {
                    return of(data as Watchlist);
                } else if (error && error.code === 'PGRST116') { // No rows found
                    // Crear la lista por defecto
                    return this.createWatchlist('Mi Lista', 'Lista de películas guardadas');
                } else {
                    console.error('Error fetching watchlist:', error);
                    return of(null);
                }
            })
        );
    }

    /**
     * Crea una nueva watchlist
     */
    createWatchlist(title: string, description: string = ''): Observable<Watchlist | null> {
        const user = this.supabaseService.getCurrentUser();
        if (!user) return of(null);

        return from(supabase
            .from('watchlists')
            .insert({
                user_id: user.id,
                title: title,
                description: description
            })
            .select()
            .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('Error creating watchlist:', error);
                    return null;
                }
                return data as Watchlist;
            })
        );
    }

    /**
     * Verifica si una película está en la watchlist por defecto
     */
    isMovieInWatchlist(movieId: number): Observable<boolean> {
        return this.getDefaultWatchlist().pipe(
            switchMap(watchlist => {
                if (!watchlist) return of(false);

                return from(supabase
                    .from('watchlist_items')
                    .select('id')
                    .eq('watchlist_id', watchlist.id)
                    .eq('movie_id', movieId)
                    .single()
                ).pipe(
                    map(({ data }) => !!data)
                );
            })
        );
    }

    /**
     * Agrega o quita una película de la watchlist por defecto
     */
    toggleWatchlist(movieId: number): Observable<boolean> {
        return this.getDefaultWatchlist().pipe(
            switchMap(watchlist => {
                if (!watchlist) throw new Error('No se pudo obtener la watchlist');

                // Primero verificamos si ya existe
                return from(supabase
                    .from('watchlist_items')
                    .select('id')
                    .eq('watchlist_id', watchlist.id)
                    .eq('movie_id', movieId)
                    .single()
                ).pipe(
                    switchMap(({ data }) => {
                        if (data) {
                            // Si existe, la borramos
                            return from(supabase
                                .from('watchlist_items')
                                .delete()
                                .eq('id', data.id)
                            ).pipe(map(() => false)); // Retorna false (no está en la lista)
                        } else {
                            // Si no existe, la agregamos
                            return from(supabase
                                .from('watchlist_items')
                                .insert({
                                    watchlist_id: watchlist.id,
                                    movie_id: movieId
                                })
                            ).pipe(map(() => true)); // Retorna true (está en la lista)
                        }
                    })
                );
            })
        );
    }
    /**
     * Obtiene todas las watchlists del usuario
     */
    getWatchlists(): Observable<Watchlist[]> {
        const user = this.supabaseService.getCurrentUser();
        if (!user) return of([]);

        return from(supabase
            .from('watchlists')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('Error fetching watchlists:', error);
                    return [];
                }
                return data as Watchlist[];
            })
        );
    }

    /**
     * Elimina una watchlist
     */
    deleteWatchlist(watchlistId: string): Observable<boolean> {
        return from(supabase
            .from('watchlists')
            .delete()
            .eq('id', watchlistId)
        ).pipe(
            map(({ error }) => {
                if (error) {
                    console.error('Error deleting watchlist:', error);
                    return false;
                }
                return true;
            })
        );
    }

    /**
     * Obtiene el poster de la primera película de una watchlist
     */
    getWatchlistCover(watchlistId: string): Observable<string | null> {
        return from(supabase
            .from('watchlist_items')
            .select('movie_id')
            .eq('watchlist_id', watchlistId)
            .order('added_at', { ascending: false })
            .limit(1)
            .single()
        ).pipe(
            map(({ data }) => {
                if (data) {
                    // Aquí solo devolvemos el ID, el componente deberá buscar la imagen en TMDB
                    // O podríamos hacer la llamada a TMDB aquí si inyectamos el servicio, 
                    // pero para mantenerlo simple retornaremos el ID como string
                    return data.movie_id.toString();
                }
                return null;
            })
        );
    }
}
