import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Track,
  MusicCategory,
  PlayerStatus,
} from '../../../models/audio.models';
import { AudioManagerService } from '../../../services/audio-manager.service';
import { AudioService } from '../../../services/audio.service';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import * as AudioActions from '../../../store/audio/audio.actions';

@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-details.component.html',
})
export class TrackDetailsComponent implements OnInit, OnDestroy {
  track: Track | null = null;
  isEditing = false;
  editedTrack: Partial<Track> = {};
  selectedImage: File | null = null;
  categories = Object.values(MusicCategory);
  audioUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private audioManager: AudioManagerService,
    private audioService: AudioService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.loadTrack(params['id']);
      }
    });
  }

  async loadTrack(id: string) {
    try {
      this.track = await this.audioManager.getTrackById(id);
      console.log('Loaded track:', this.track);
    } catch (error) {
      console.error('Error loading track:', error);
    }
  }

  startEdit() {
    if (this.track) {
      this.editedTrack = { ...this.track };
      this.isEditing = true;
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedImage = null;
  }

  async saveChanges() {
    if (this.track && this.editedTrack) {
      // Check if this track is currently playing
      const currentTrack = await this.audioService.currentTrack$
        .pipe(take(1))
        .toPromise();
      if (currentTrack?.id === this.track.id) {
        // Stop playback if this track is playing
        this.audioService.stop();
      }

      await this.audioManager.updateTrack(this.track.id, this.editedTrack);
      this.track = await this.audioManager.getTrackById(this.track.id);
      this.isEditing = false;
    }
  }

  async deleteTrack() {
    if (this.track && confirm('Are you sure you want to delete this track?')) {
      // Check if this track is currently playing
      const currentTrack = await this.audioService.currentTrack$
        .pipe(take(1))
        .toPromise();
      if (currentTrack?.id === this.track.id) {
        // Stop playback if this track is playing
        this.audioService.stop();
      }

      await this.audioManager.deleteTrack(this.track.id);
      this.router.navigate(['/tracks']);
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.editedTrack) {
          this.editedTrack.imageUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  playTrack(track: Track) {
    if (!track) return;
    this.store.dispatch(AudioActions.loadAudioFile({ track }));
  }

  ngOnDestroy() {
    // Clean up audio URL
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }
}
