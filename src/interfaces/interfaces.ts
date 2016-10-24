import { Artist } from '../classes/Artist.class';
import { Song } from '../classes/Song.class';
import { User } from '../classes/User.class';

export interface PlayerInterface {
  playing: boolean;
  song: any;
  skin: string;
  prevSong(): any;
  nextSong(): any;
  shuffle(): any;
  play(): void;
  pause(): void;
}

export interface PlaylistInterface {
  name: string;
  ownerId: string;
  currentSong: Song;
  songs: Song[];
}

export interface UserInterface {
  firstName: string;
  lastName: string;
  id: string;
  image: string;
  spotifyAccountId?: number; // ? = ei pakollinen
  soundCloudAccountId?: number; // ? = ei pakollinen
}

export interface imageUrls {
  small?: any;
  medium?: any;
  large: any;
}

export interface ArtistInterface {
  name: string;
  id: string;
  href?: string;
}

export interface SongInterface {
   _id: string;
   _albumId: string;
   _albumImage: imageUrls;
   _songTitle: string;
   _albumTitle: string;
   _artists: Artist[];
   _duration: number; // in milliseconds
   _isPlayable: boolean;
}

export interface CallHandlerInterface {
  callUrl: string;
  apiKey: string;
  getSongById(id: string): Song;
  getPlaylistById(userId: string, playlistId: string): any;
  getUserById(id: string): User;
}
