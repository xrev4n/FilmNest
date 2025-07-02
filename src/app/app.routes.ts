import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  {
    path: 'cast/:id',
    loadComponent: () => import('./pages/cast-detail/cast-detail.component').then(m => m.CastDetailComponent)
  },
  { path: '**', redirectTo: '' }
];
