import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Track, MusicCategory } from '../../../models/audio.models';
import { AudioManagerService } from '../../../services/audio-manager.service';
import { AudioService } from '../../../services/audio.service';

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
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.loadTrack();
  }

  async loadTrack() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.track = await this.audioManager.getTrackById(id);
      if (this.track) {
        // Get audio blob and create URL
        const audioBlob = await this.audioManager.getAudioFile(id);
        this.audioUrl = URL.createObjectURL(audioBlob);
      }
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
      await this.audioManager.updateTrack(this.track.id, this.editedTrack);
      this.track = await this.audioManager.getTrackById(this.track.id);
      this.isEditing = false;
    }
  }

  async deleteTrack() {
    if (this.track && confirm('Are you sure you want to delete this track?')) {
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

  async playTrack() {
    if (this.track) {
      await this.audioService.playTrack(this.track);
    }
  }

  ngOnDestroy() {
    // Clean up audio URL
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }
}
