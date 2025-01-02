export interface AudioMetadata {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedDate: Date;
  duration: number;
  category: MusicCategory;
  format: AudioFormat;
  size: number;
  imageUrl?: string;
}

export enum MusicCategory {
  POP = 'pop',
  ROCK = 'rock',
  RAP = 'rap',
  CHAABI = 'cha3bi',
  JAZZ = 'jazz',
  CLASSICAL = 'classical',
  OTHER = 'other',
}

export type AudioFormat = 'mp3' | 'wav' | 'ogg';

export const ALLOWED_AUDIO_FORMATS = [
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/wave',
  'audio/ogg',
  'audio/vorbis',
];
export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
