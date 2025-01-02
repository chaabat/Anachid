import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioManagerService } from '../../../services/audio-manager.service';
import { ModalService } from '../../../services/modal.service';
import {
  AudioMetadata,
  MusicCategory,
} from '../../../models/audio-metadata.model';

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

  metadata: Partial<AudioMetadata> = {
    title: '',
    artist: '',
    description: '',
    category: MusicCategory.OTHER,
  };

  isUploading = false;
  error: string | null = null;

  constructor(
    private audioManager: AudioManagerService,
    private modalService: ModalService
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
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  async onUpload() {
    if (!this.selectedFile) {
      this.error = 'Please select a file';
      return;
    }

    try {
      this.isUploading = true;
      this.error = null;
      await this.audioManager.uploadAudio(
        this.selectedFile,
        this.metadata,
        this.selectedImage
      );
      this.modalService.close();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Upload failed';
    } finally {
      this.isUploading = false;
    }
  }

  close() {
    this.modalService.close();
  }
}
