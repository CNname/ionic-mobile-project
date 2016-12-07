import { IPlaylist, imageUrls } from '../interfaces/interfaces';
import { Song } from './Song.class'

export class Playlist implements IPlaylist {
  private _id: string;
  private _name: string;
  private _ownerId: string;
  private _songCount: number;
  private _songs: Song[];
  private _albumImage: imageUrls;
  private _ownerName: string;
  private _service: string; // spotify or soundcloud
  private _ownerImage : imageUrls;
  private _next_href: string;

  constructor(id: string, title: string, count: number, service: string){
    this._id = id;
    this._name = title;
    this._songCount = count;
    this._service = service;
  }

  setNext_href(href: string){
    this._next_href = href;
  }

  getNext_href():string{
    return this._next_href;
  }

  getId(): string {
    return this._id;
  }

  setId(value: string) {
    this._id = value;
  }

  getName(): string {
    return this._name;
  }

  setName(value: string) {
    this._name = value;
  }

  getSongCount(): number{
    return this._songCount;
  }

  setSongCount(songCount: number){
    this._songCount = songCount;
  }

  setOwnerId(id: string){
    this._ownerId = id;
  }

  setOwnerName(name: string){
    this._ownerName = name;
  }

  getOwnerName():string {
    return this._ownerName;
  }

  setOwnerImage(value: imageUrls){
    this._ownerImage = value;
  }

  getOwnerImage():imageUrls{
    return this._ownerImage;
  }

  getOwnerId(): string{
    return this._ownerId;
  }

  getSongs(): Song[]{
    return this._songs;
  }

  setSongs(songs: Song[]){
    this._songs = songs;
  }

  getPlaylistImage(): imageUrls{
    return this._albumImage;
  }

  setPlaylistImage(value: imageUrls){
    this._albumImage = value;
  }

  setService(service: string) {
    this._service = service;
  }

  getService(): string {
    return this._service;
  }

}
