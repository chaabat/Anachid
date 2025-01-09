import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Track } from '../models/audio.models';
import { IndexedDBService } from './indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class AudioManagerService {
  constructor(private indexedDB: IndexedDBService) {}

  getAllTracks(): Observable<Track[]> {
    return from(this.indexedDB.getAllMetadata());
  }

  getTrackById(id: string): Promise<Track> {
    return this.indexedDB.getMetadata(id);
  }

  async getAudioFile(id: string): Promise<Blob | null> {
    console.log('Getting audio file for ID:', id);
    const blob = await this.indexedDB.getAudioFile(id);
    if (!blob) {
      console.error('No audio file found for ID:', id);
      return null;
    }
    return blob;
  }

  updateTrack(id: string, updates: Partial<Track>): Promise<void> {
    return this.indexedDB.updateMetadata(id, { ...updates, id } as Track);
  }

  deleteTrack(id: string): Promise<void> {
    return this.indexedDB.deleteTrack(id);
  }

  async uploadAudio(audioFile: File, metadata: Track): Promise<void> {
    try {
      await this.indexedDB.saveAudio(audioFile, metadata);
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  }

  async updateTrackFavorite(
    trackId: string,
    isFavorite: boolean
  ): Promise<void> {
    const track = await this.indexedDB.getTrackById(trackId);
    if (track) {
      track.isFavorite = isFavorite;
      return this.indexedDB.updateTrack(track);
    }
  }
}
