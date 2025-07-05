import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

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
  { path: '**', redirectTo: '' }
];
