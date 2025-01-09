import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioManagerService } from '../../../services/audio-manager.service';
import { ModalService } from '../../../services/modal.service';
import {
  Track,
  MusicCategory,
  AudioFormat,
  VALIDATION_RULES,
} from '../../../models/audio.models';
import { Store } from '@ngrx/store';
import * as AudioActions from '../../../store/audio/audio.actions';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-modal.component.html',
})
export class UploadModalComponent {
  selectedFile: File | null = null;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  categories = Object.values(MusicCategory);

  metadata: Partial<Track> = {
    title: '',
    artist: '',
    description: '',
    category: MusicCategory.OTHER,
  };

  isUploading = false;
  error: string | null = null;

  constructor(
    private audioManager: AudioManagerService,
    private modalService: ModalService,
    private store: Store
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.metadata.title = this.selectedFile.name.replace(/\.[^/.]+$/, '');
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  validateFile(file: File): string | null {
    if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
      return 'File size exceeds 15MB limit';
    }
    if (!VALIDATION_RULES.ALLOWED_AUDIO_FORMATS.includes(file.type)) {
      return 'Invalid file format. Supported formats: MP3, WAV, OGG';
    }
    return null;
  }

  validateMetadata(): string | null {
    if (!this.metadata.title) {
      return 'Title is required';
    }

    if (!this.metadata.artist) {
      return 'Artist is required';
    }

    if (this.metadata.title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
      return 'Title exceeds 50 characters';
    }

    if (
      this.metadata.description &&
      this.metadata.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH
    ) {
      return 'Description exceeds 200 characters';
    }

    return null;
  }

  async onUpload() {
    if (!this.selectedFile) {
      this.error = 'Please select a file';
      return;
    }

    const fileError = this.validateFile(this.selectedFile);
    if (fileError) {
      this.error = fileError;
      return;
    }

    const metadataError = this.validateMetadata();
    if (metadataError) {
      this.error = metadataError;
      return;
    }

    try {
      this.isUploading = true;
      this.error = null;

      let imageUrl = 'assets/default-album.png';
      if (this.selectedImage && this.imagePreview) {
        imageUrl = this.imagePreview;
      }

      const track: Track = {
        ...this.metadata,
        id: crypto.randomUUID(),
        addedDate: new Date(),
        imageUrl,
        format: this.getAudioFormat(this.selectedFile.type),
        size: this.selectedFile.size,
        duration: 0,
      } as Track;

      await this.audioManager.uploadAudio(this.selectedFile, track);
      this.store.dispatch(AudioActions.loadTracks());
      this.modalService.close();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Upload failed';
    } finally {
      this.isUploading = false;
    }
  }

  private getAudioFormat(mimeType: string): AudioFormat {
    switch (mimeType) {
      case 'audio/mp3':
      case 'audio/mpeg':
        return 'mp3';
      case 'audio/wav':
      case 'audio/wave':
        return 'wav';
      case 'audio/ogg':
      case 'audio/vorbis':
        return 'ogg';
      default:
        return 'mp3';
    }
  }

  close() {
    this.modalService.close();
  }
}
