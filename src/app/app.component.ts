import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { AudioPlayerComponent } from './components/audios/audio-player/audio-player.component';
import { UploadModalComponent } from './components/modals/upload-modal/upload-modal.component';
import { ModalService } from './services/modal.service';
import { FooterComponent } from './components/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    AudioPlayerComponent,
    UploadModalComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(public modalService: ModalService) {}
}
