import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * Servicio para manejar el tema de la aplicación
 * Proporciona funcionalidad para cambiar entre modo claro y oscuro
 * y mantiene la preferencia del usuario en localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /** Subject que emite el estado actual del tema */
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  
  /** Observable público del estado del tema */
  public isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadThemePreference();
  }

  /**
   * Obtiene el estado actual del tema
   * @returns true si está en modo oscuro, false si está en modo claro
   */
  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  /**
   * Carga la preferencia de tema guardada en localStorage
   */
  private loadThemePreference(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('darkMode');
      const isDark = savedTheme === 'true';
      this.isDarkModeSubject.next(isDark);
      this.applyTheme(isDark);
    }
  }

  /**
   * Cambia entre modo claro y oscuro
   */
  toggleDarkMode(): void {
    const newDarkMode = !this.isDarkModeSubject.value;
    this.setDarkMode(newDarkMode);
  }

  /**
   * Establece el modo oscuro
   * @param isDark - true para modo oscuro, false para modo claro
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
    this.saveThemePreference(isDark);
  }

  /**
   * Aplica el tema al documento
   * @param isDark - true para modo oscuro, false para modo claro
   */
  private applyTheme(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  /**
   * Guarda la preferencia del tema en localStorage
   * @param isDark - true para modo oscuro, false para modo claro
   */
  private saveThemePreference(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', isDark.toString());
    }
  }
} 