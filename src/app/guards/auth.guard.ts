import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Esperar un poco más a que Supabase se inicialice completamente
    return timer(500).pipe(
      switchMap(() => this.supabaseService.currentUser$),
      take(1),
      map(user => {
        console.log('AuthGuard - User:', user ? user.email : 'null');
        if (user !== null) {
          return true;
        } else {
          console.log('AuthGuard - Redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('AuthGuard - Error:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
} 