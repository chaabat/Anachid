import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { SearchTrackComponent } from '../../tracks/search-track/search-track.component';
import { Store } from '@ngrx/store';
import * as AudioActions from '../../../store/audio/audio.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SearchTrackComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(
    private modalService: ModalService,
    private store: Store
  ) {}

  onSearch(term: string) {
    this.store.dispatch(AudioActions.searchTracks({ term }));
  }

  openUploadModal() {
    this.modalService.open();
  }
}
