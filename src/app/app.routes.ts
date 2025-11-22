import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { MyWatchlistsComponent } from './pages/my-watchlists/my-watchlists.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  {
    path: 'cast/:id',
    loadComponent: () => import('./pages/cast-detail/cast-detail.component').then(m => m.CastDetailComponent)
  },
  {
    path: 'genre/:id',
    loadComponent: () => import('./pages/genre/genre.component').then(m => m.GenreComponent)
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Rutas protegidas que requieren autenticación
  {
    path: 'my-account',
    loadComponent: () => import('./pages/my-account/my-account.component').then(m => m.MyAccountComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-watchlists',
    loadComponent: () => import('./pages/my-watchlists/my-watchlists.component').then(m => m.MyWatchlistsComponent),
    canActivate: [AuthGuard]
  },
  // Ejemplo: { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  // Ejemplo: { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
