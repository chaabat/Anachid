import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDBService } from './indexed-db.service';
import {
  AudioMetadata,
  AudioFormat,
  ALLOWED_AUDIO_FORMATS,
  MAX_FILE_SIZE,
  MusicCategory,
} from '../models/audio-metadata.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AudioManagerService {
  private tracksSubject = new BehaviorSubject<AudioMetadata[]>([]);
  tracks$ = this.tracksSubject.asObservable();

  constructor(private indexedDB: IndexedDBService) {
    this.initializeDB();
  }

  private async initializeDB() {
    await this.indexedDB.initDB();
    await this.loadAllTracks();
  }

  async uploadAudio(
    audioFile: File,
    metadata: Partial<AudioMetadata>,
    imageFile?: File | null
  ): Promise<void> {
    // Ensure DB is initialized
    await this.indexedDB.initDB();

    // Validate file format
    if (!ALLOWED_AUDIO_FORMATS.includes(audioFile.type)) {
      throw new Error('Unsupported audio format');
    }

    // Validate file size
    if (audioFile.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 15MB limit');
    }

    const id = uuidv4();
    let imageUrl: string | undefined;

    // Process image if provided
    if (imageFile) {
      imageUrl = await this.processImage(imageFile);
    }

    // Get audio duration
    const duration = await this.getAudioDuration(audioFile);

    const audioMetadata: AudioMetadata = {
      id,
      title: metadata.title || audioFile.name,
      artist: metadata.artist || 'Unknown Artist',
      description: metadata.description,
      addedDate: new Date(),
      duration,
      category: metadata.category || MusicCategory.OTHER,
      format: this.getAudioFormat(audioFile.type),
      size: audioFile.size,
      imageUrl,
    };

    // Save to IndexedDB
    await this.indexedDB.saveAudio(audioFile, audioMetadata);
    await this.loadAllTracks();
  }

  async getAllTracks(): Promise<AudioMetadata[]> {
    const tracks = await this.indexedDB.getAllMetadata();
    this.tracksSubject.next(tracks);
    return tracks;
  }

  private async loadAllTracks(): Promise<void> {
    const tracks = await this.getAllTracks();
    this.tracksSubject.next(tracks);
  }

  private getAudioFormat(mimeType: string): AudioFormat {
    const format = mimeType.split('/')[1];
    return format as AudioFormat;
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      });

      audio.src = url;
    });
  }

  private async processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => reject(new Error('Failed to process image'));
      reader.readAsDataURL(file);
    });
  }

  async deleteTrack(id: string): Promise<void> {
    await this.indexedDB.deleteTrack(id);
    await this.loadAllTracks();
  }

  async updateTrack(
    id: string,
    updates: Partial<AudioMetadata>
  ): Promise<void> {
    const track = await this.indexedDB.getMetadata(id);
    const updatedTrack = { ...track, ...updates };
    await this.indexedDB.updateMetadata(id, updatedTrack);
    await this.loadAllTracks();
  }

  async getTrackById(id: string): Promise<AudioMetadata | null> {
    try {
      return await this.indexedDB.getMetadata(id);
    } catch (error) {
      console.error('Error fetching track:', error);
      return null;
    }
  }

  async getAudioFile(id: string): Promise<Blob> {
    try {
      return await this.indexedDB.getAudioFile(id);
    } catch (error) {
      console.error('Error fetching audio file:', error);
      throw error;
    }
  }
}
