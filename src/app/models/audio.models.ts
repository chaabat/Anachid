export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedDate: Date;
  duration: number;
  category: MusicCategory;
  audioUrl: string;
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

export interface PlayerState {
  currentTrack: Track | null;
  status: PlayerStatus;
  volume: number;
  currentTime: number;
  isLooping: boolean;
  isShuffling: boolean;
  playlist: Track[];
}

export enum PlayerStatus {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
}
