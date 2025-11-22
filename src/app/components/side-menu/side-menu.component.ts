import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { TmdbService } from '../../services/tmdb.service';
import { ThemeService } from '../../services/theme.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-side-menu',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    categoriesOpen = false;
    genres: { id: number; name: string }[] = [];
    loadingGenres = false;
    isAuthenticated = false;
    currentUser: any = null;
    private authSubscription?: Subscription;

    constructor(
        private tmdbService: TmdbService,
        private router: Router,
        private snackBar: MatSnackBar,
        private themeService: ThemeService,
        private supabaseService: SupabaseService
    ) { }

    ngOnInit(): void {
        this.loadGenres();
        this.initializeAuth();
    }

    ngOnDestroy(): void {
        this.authSubscription?.unsubscribe();
    }

    private initializeAuth(): void {
        this.authSubscription = this.supabaseService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.isAuthenticated = user !== null;
        });
    }

    closeMenu(): void {
        this.close.emit();
    }

    toggleCategories(): void {
        this.categoriesOpen = !this.categoriesOpen;
    }

    navigateToLogin(): void {
        this.closeMenu();
        this.router.navigate(['/login']);
    }

    navigateToProfile(): void {
        this.closeMenu();
        this.router.navigate(['/my-account']);
    }

    navigateToWatchlists(): void {
        this.closeMenu();
        this.router.navigate(['/my-watchlists']);
    }

    navigateToGenre(genreId: number): void {
        this.closeMenu();
        this.router.navigate(['/genre', genreId]);
    }

    async logout(): Promise<void> {
        try {
            const { error } = await this.supabaseService.signOut();
            if (error) {
                this.snackBar.open('Error al cerrar sesión', 'Cerrar', { duration: 3000 });
            } else {
                this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', { duration: 3000 });
                this.closeMenu();
                this.router.navigate(['/']);
            }
        } catch (error) {
            this.snackBar.open('Error al cerrar sesión', 'Cerrar', { duration: 3000 });
        }
    }

    loadGenres(): void {
        this.loadingGenres = true;
        this.tmdbService.getGenres().subscribe({
            next: (response) => {
                this.genres = response.genres;
                this.loadingGenres = false;
            },
            error: (error) => {
                console.error('Error loading genres:', error);
                this.loadingGenres = false;
            }
        });
    }

    get isDarkMode(): boolean {
        return this.themeService.isDarkMode;
    }

    toggleDarkMode(): void {
        this.themeService.toggleDarkMode();
    }
}
