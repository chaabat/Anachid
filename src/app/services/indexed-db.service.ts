import { Injectable } from '@angular/core';
import { Track } from '../models/audio.models';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db!: IDBDatabase;
  private dbReady: Promise<void>;
  private dbName = 'musicStreamDB';

  constructor() {
    this.dbReady = this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Delete old stores if they exist
        if (db.objectStoreNames.contains('audioFiles')) {
          db.deleteObjectStore('audioFiles');
        }
        if (db.objectStoreNames.contains('metadata')) {
          db.deleteObjectStore('metadata');
        }

        // Create fresh stores
        db.createObjectStore('audioFiles', { keyPath: 'id' });
        const metadataStore = db.createObjectStore('metadata', {
          keyPath: 'id',
        });
        metadataStore.createIndex('title', 'title', { unique: false });
        metadataStore.createIndex('category', 'category', { unique: false });
        metadataStore.createIndex('isFavorite', 'isFavorite', {
          unique: false,
        });
      };
    });
  }

  async saveAudio(audioFile: File, metadata: Track): Promise<void> {
    console.log('Starting to save audio:', metadata.id, audioFile);
    await this.dbReady;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const transaction = this.db.transaction(
            ['metadata', 'audioFiles'],
            'readwrite'
          );

          // Save metadata
          const metadataStore = transaction.objectStore('metadata');
          await metadataStore.put(metadata);
          console.log('Metadata saved for:', metadata.id);

          // Save audio file
          const audioStore = transaction.objectStore('audioFiles');
          const audioData = {
            id: metadata.id,
            data: reader.result,
            type: audioFile.type,
          };
          await audioStore.put(audioData);
          console.log('Audio file saved for:', metadata.id);

          transaction.oncomplete = () => {
            console.log('Transaction completed successfully');
            resolve();
          };

          transaction.onerror = () => {
            console.error('Transaction failed:', transaction.error);
            reject(transaction.error);
          };
        } catch (error) {
          console.error('Error in saveAudio:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
        reject(reader.error);
      };

      reader.readAsArrayBuffer(audioFile);
    });
  }

  async getAllMetadata(): Promise<Track[]> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getMetadata(id: string): Promise<Track> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAudioFile(id: string): Promise<Blob | null> {
    console.log('Getting audio file:', id);
    await this.dbReady;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');
      const request = store.get(id);

      request.onerror = () => {
        console.error('Error getting audio:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const result = request.result;
        console.log('Audio file fetch result:', result ? 'found' : 'not found');

        if (!result) {
          resolve(null);
          return;
        }

        const blob = new Blob([result.data], { type: result.type });
        resolve(blob);
      };
    });
  }

  async updateMetadata(id: string, metadata: Track): Promise<void> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');
      const request = store.put(metadata);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteTrack(id: string): Promise<void> {
    await this.dbReady;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(
        ['metadata', 'audioFiles'],
        'readwrite'
      );

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();

      transaction.objectStore('metadata').delete(id);
      transaction.objectStore('audioFiles').delete(id);
    });
  }

  async getTrackById(id: string): Promise<Track> {
    return this.getMetadata(id);
  }

  async updateTrack(track: Track): Promise<void> {
    return this.updateMetadata(track.id, track);
  }
}
