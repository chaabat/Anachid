import { Injectable } from '@angular/core';
import { AudioMetadata } from '../models/audio-metadata.model';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db!: IDBDatabase;
  private readonly DB_NAME = 'musicStreamDB';
  private readonly DB_VERSION = 1;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create audio files store
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id' });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          const metadataStore = db.createObjectStore('metadata', {
            keyPath: 'id',
          });
          metadataStore.createIndex('title', 'title', { unique: false });
          metadataStore.createIndex('artist', 'artist', { unique: false });
          metadataStore.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  async saveAudio(audioBlob: Blob, metadata: AudioMetadata): Promise<void> {
    await this.saveMetadata(metadata);
    await this.saveAudioFile(metadata.id, audioBlob);
  }

  private async saveMetadata(metadata: AudioMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');
      const request = store.put(metadata);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async saveAudioFile(id: string, audioBlob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['audioFiles'], 'readwrite');
      const store = transaction.objectStore('audioFiles');
      const request = store.put({ id, blob: audioBlob });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getMetadata(id: string): Promise<AudioMetadata> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAudioFile(id: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result.blob);
    });
  }

  async getAllMetadata(): Promise<AudioMetadata[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteTrack(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        ['metadata', 'audioFiles'],
        'readwrite'
      );
      const metadataStore = transaction.objectStore('metadata');
      const audioStore = transaction.objectStore('audioFiles');

      const metadataRequest = metadataStore.delete(id);
      const audioRequest = audioStore.delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async updateMetadata(id: string, metadata: AudioMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');
      const request = store.put(metadata);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}
