import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Componente de barra de búsqueda para películas
 * Permite a los usuarios buscar películas por título
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  /** Evento emitido cuando se realiza una búsqueda */
  @Output() search = new EventEmitter<string>();
  
  /** Texto de búsqueda actual */
  searchQuery = '';

  /**
   * Ejecuta la búsqueda cuando se hace clic en el botón o se presiona Enter
   */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery.trim());
    }
  }

  /**
   * Limpia el campo de búsqueda y emite un evento vacío
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit('');
  }
}
