import { Artist } from '../classes/Artist.class';
import { Song } from '../classes/Song.class';
import {MusicService} from "../providers/music-service";
import {Observable} from "rxjs";
import {Playlist} from "../classes/Playlist.Class";

export interface IPlayer {
  musicService: MusicService;
  song: Song;
  songs: Playlist;
  previousSong(): void;
  nextSong(): void;
  shuffle(): void;
  startPlayback(): void;
  pausePlayback(): void;
}

export interface IPlaylist {
  /*name: string;
  ownerId: string;
  songs: Song[];
  songCount: number;*/
  getName(): string;
  getOwnerId(): string;
  getSongs(): Song[];
  getSongCount(): number;
  getPlaylistImage(): imageUrls;
  getOwnerName(): string;
}

export interface IUser {
  id: string;
  image: string;
}

export interface firebaseUser {
  email: string;
  photoURL?: string;
}

export interface spotifyAuthConfig {
  base: string,
  clientId: string;
  responseType: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

export interface SpotifyParams {
  accessToken: string;
  expiresIn: number;
  state: string;
  tokenType: string;
  tokenStart: number;
}

export interface imageUrls {
  small?: any;
  medium?: any;
  large: any;
}

export interface IArtist {
  getName(): string;
  getId(): string;
  getHref(): string;
  getImages(): imageUrls;
}

export interface ISong {
  getId(): string;
  getAlbumId(): string;
  getAlbumImage(): imageUrls;
  getSongTitle(): string;
  getAlbumTitle(): string;
  getArtists(): Artist[];
  getDuration(): number;
  getIsPlayable(): boolean;
  getUrl(): string;
}

export interface ICallHandler {
  getPlaylistById(userId: string, playlistId: string): Observable<any>;
  getUserById(id: string): Observable<any>;
  getArtistById(id: string): Observable<any>;
  getPopularSongsByArtist(id: string, country: string): Observable<any>;
  searchForItem(query: string, offset:number ): Observable<any>;
}
