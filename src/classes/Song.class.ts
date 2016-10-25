import { SongInterface, imageUrls } from '../interfaces/interfaces';
import { Artist } from './Artist.class';

export class Song implements SongInterface {

  private _type: string;
  private _id: string;
  private _albumId: string;
  private _albumImage: imageUrls;
  private _songTitle: string;
  private _albumTitle: string;
  private _artists: Artist[];
  private _duration: number;
  private _isPlayable: boolean;
  private _url: string;

  constructor(id: string, songTitle: string, isPlayable: boolean) {
    this._id = id;
    this._songTitle = songTitle;
    this._isPlayable = isPlayable;
  }

  getType(): string {
    return this._type;
  }

  setType(value: string) {
    this._type = value;
  }

  getId(): string {
    return this._id;
  }

  setId(value: string) {
    this._id = value;
  }

  getAlbumId(): string {
    return this._albumId;
  }

  setAlbumId(value: string) {
    this._albumId = value;
  }

  getAlbumImage(): imageUrls {
    return this._albumImage;
  }

  setAlbumImage(value: imageUrls) {
    this._albumImage = value;
  }

  getSongTitle(): string {
    return this._songTitle;
  }

  setSongTitle(value: string) {
    this._songTitle = value;
  }

  getAlbumTitle(): string {
    return this._albumTitle;
  }

  setAlbumTitle(value: string) {
    this._albumTitle = value;
  }

  getArtists(): Artist[] {
    return this._artists;
  }

  setArtists(value: Artist[]) {
    this._artists = value;
  }

  getDuration(): number {
    return this._duration;
  }

  setDuration(value: number) {
    this._duration = value;
  }

  getIsPlayable(): boolean {
    return this._isPlayable;
  }

  setIsPlayable(value: boolean) {
    this._isPlayable = value;
  }

  getUrl(): string{
    return this._url;
  }

  setUrl(value: string){
    this._url = value;
  }

}
