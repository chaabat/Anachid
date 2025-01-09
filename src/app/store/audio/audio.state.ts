import { Track, PlayerStatus } from '../../models/audio.models';

export interface AudioState {
  tracks: Track[];
  currentTrack: Track | null;
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  error: string | null;
  loading: boolean;
  currentCategory: string;
  searchTerm: string;
  filteredTracks: Track[];
}

export const initialState: AudioState = {
  tracks: [],
  currentTrack: null,
  status: PlayerStatus.PLAYING,
  currentTime: 0,
  duration: 0,
  error: null,
  loading: false,
  currentCategory: 'all',
  searchTerm: '',
  filteredTracks: [],
};
