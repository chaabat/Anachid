import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-track',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-track.component.html',
})
export class SearchTrackComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm: string = '';

  onSearch(term: string) {
    this.search.emit(term);
  }

  clearSearch() {
    this.searchTerm = '';
    this.search.emit('');
  }
}
