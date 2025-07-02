import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

/**
 * Componente principal de la aplicación
 * Contiene el router outlet para la navegación entre páginas
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonToggleModule, MatIconModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /** Título de la aplicación */
  title = 'FilmNest';

  isDarkMode = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadThemePreference();
  }

  /**
   * Carga la preferencia de tema guardada en localStorage
   */
  loadThemePreference(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === 'true') {
        this.isDarkMode = true;
        document.body.classList.add('dark-mode');
      }
    }
  }

  /**
   * Cambia entre modo claro y oscuro
   */
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('darkMode', 'true');
      }
    } else {
      document.body.classList.remove('dark-mode');
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('darkMode', 'false');
      }
    }
  }
}
