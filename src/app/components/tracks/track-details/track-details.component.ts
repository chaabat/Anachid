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
  template: `
    <div class="container mx-auto px-4 py-8">
      @if (track) {
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="relative h-64">
          <img
            [src]="track.imageUrl || 'assets/default-album.png'"
            [alt]="track.title"
            class="w-full h-full object-cover"
          />
          @if (isEditing) {
          <div class="absolute top-4 right-4">
            <input
              type="file"
              accept="image/*"
              (change)="onImageSelected($event)"
              class="hidden"
              #imageInput
            />
            <button
              (click)="imageInput.click()"
              class="px-3 py-1 bg-white text-gray-700 rounded-md shadow text-sm"
            >
              Change Image
            </button>
          </div>
          }
        </div>
        <div class="p-6">
          @if (isEditing) {
          <input
            [(ngModel)]="editedTrack.title"
            class="text-3xl font-bold mb-2 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <input
            [(ngModel)]="editedTrack.artist"
            class="text-gray-600 text-lg mb-4 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <select
            [(ngModel)]="editedTrack.category"
            class="w-full mb-4 p-2 border rounded focus:outline-none focus:border-blue-500"
          >
            @for (category of categories; track category) {
            <option [value]="category">{{ category }}</option>
            }
          </select>
          <textarea
            [(ngModel)]="editedTrack.description"
            class="w-full h-24 p-2 border rounded focus:outline-none focus:border-blue-500"
          ></textarea>
          } @else {
          <h1 class="text-3xl font-bold mb-2">{{ track.title }}</h1>
          <p class="text-gray-600 text-lg mb-4">{{ track.artist }}</p>
          <p class="text-blue-500 mb-4">Category: {{ track.category }}</p>
          @if (track.description) {
          <p class="text-gray-700 mb-4">{{ track.description }}</p>
          } }
          <div class="flex items-center justify-between mt-4">
            <span class="text-sm text-gray-500">
              Added {{ track.addedDate | date }}
            </span>
            <div class="space-x-2">
              @if (isEditing) {
              <button
                (click)="saveChanges()"
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                (click)="cancelEdit()"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              } @else {
              <button
                (click)="startEdit()"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                (click)="deleteTrack()"
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              }
              <button
                (click)="playTrack()"
                class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Play Track
              </button>
            </div>
          </div>
          <div class="mt-4">
            <audio #audioPlayer class="w-full" controls>
              <source [src]="audioUrl" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>
      }
    </div>
  `,
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
