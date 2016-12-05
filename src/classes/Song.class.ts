import { ISong, imageUrls } from '../interfaces/interfaces';
import { Artist } from './Artist.class';
import { MiniPlayer } from "../components/miniplayer";
import { MusicService } from "../providers/music-service";
import { Playlist } from "./Playlist.Class";
import { SoundcloudService } from "../providers/soundcloud-service";
import { ActionSheetController } from "ionic-angular";
import { SpotifyService } from "../providers/spotify-service";

export class Song implements ISong {

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

  getDuration(): number { // duration in milliseconds
    return this._duration;
  }

  getDurationHours(): number{
   let hour = Math.floor((this._duration / (1000*60*60) )%24);
   return hour;
  }

  getDurationMinutes(): number {
    return new Date(this._duration).getMinutes();
  }

  getDurationSeconds():number{
    return new Date(this._duration).getSeconds();
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

  play(miniPlayerRef: MiniPlayer, referrer: string, musicServiceRef: MusicService, playlist: Playlist, soundCloudServiceRef: SoundcloudService){


    miniPlayerRef.setPlaying(this);
    miniPlayerRef.setPlayingPlaylist(playlist);
    miniPlayerRef.setReferrer(referrer);

    if (referrer === "spotify") {
      if (musicServiceRef.isPlayerInit()) {
        musicServiceRef.pausePlayback();
        musicServiceRef.resetAudio();
        musicServiceRef.setAudio(this.getUrl());
        musicServiceRef.startPlayback();
      } else {
        musicServiceRef.setAudio(this.getUrl());
        musicServiceRef.startPlayback();
      }
    } else if (referrer === "soundcloud") {
      soundCloudServiceRef.startStreaming(this.getId());
    }

  }

  pressEvent(actionSheetCtrlRef: ActionSheetController, spotifyServiceRef: SpotifyService, playlist: Playlist = null, currentUser: Object = null) {



    let buttons: Array<Object> = [
      {
        text: 'Add to playlist',
        handler: () => {
          console.log('Add to playlist clicked');
          spotifyServiceRef.addToPlaylist(this.getId(), this.getSongTitle());

        }
      }
    ];

    // if user is owner
    if (playlist !== null && currentUser !== null) {
      if (playlist.getOwnerId() === currentUser['id']) {
        buttons.push({
          text: 'Remove from a playlist',
          handler: () => {
            console.log('Remove from a playlist clicked');
            spotifyServiceRef.removeFromAPlaylistWithToasts(this.getId(), playlist.getId());
          }
        });
      }
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });


    let actionSheet = actionSheetCtrlRef.create({
      title: 'Song menu',
      buttons: buttons
    });
    actionSheet.present();

  }


}
