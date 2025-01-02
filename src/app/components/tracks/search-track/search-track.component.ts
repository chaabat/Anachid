import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-track',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <div class="relative flex items-center">
        <!-- Search Icon -->
        <svg
          class="w-5 h-5 absolute left-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <!-- Search Input -->
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch($event)"
          placeholder="Search by title, artist or description..."
          class="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <!-- Clear Button -->
        @if (searchTerm) {
        <button
          (click)="clearSearch()"
          class="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        }
      </div>
    </div>
  `,
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
