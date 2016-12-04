/**
 * Created by Pedo on 3.12.2016.
 */

import {Component} from "@angular/core";
import {IONIC_DIRECTIVES, NavController, NavParams} from "ionic-angular";
import {Song} from "../classes/Song.class";
import {Playlist} from "../classes/Playlist.Class";
import {PlayerPage} from "../pages/playerPage/playerPage";
import {MusicService} from "../providers/music-service";
import {SoundcloudService} from "../providers/soundcloud-service";

@Component({
  selector: 'streamgull-miniplayer',
  template: `
    <ion-footer [hidden]="!musicService?.isPlayerInit()">
  <ion-toolbar class="librarySmallPlayer player" color="2nd_dark">
    <ion-list class="librarySmallPlayer" no-lines>
      <ion-item color="2nd_dark" (click)='openPlayerPage(playing)'>
        <h3><b>{{ playing?.getSongTitle() }}</b></h3>
        <h3><span *ngFor="let playing of playing?.getArtists(); let i = index">
          <span *ngIf="i > 0"> / </span> {{ playing?.getName() }}
        </span></h3>

        <ion-buttons end item-right>
          <button ion-button color="2nd_orange" [hidden]="!musicService?.getStatus()" class="larger" (click)="pausePlayer($event)">
            <ion-icon name="pause"></ion-icon>
          </button>
          <button ion-button color="2nd_orange" class="larger" [hidden]="musicService?.getStatus()" (click)="startPlayer($event)">
            <ion-icon name="play"></ion-icon>
          </button>
        </ion-buttons>
      </ion-item>
    </ion-list>
  </ion-toolbar>
</ion-footer>
  `
})

export class MiniPlayer {

  playing: Song;
  playingPlaylist: Playlist;
  referrer: string;

  constructor(public musicService: MusicService, public soundcloudService: SoundcloudService, public navCtrl: NavController){
    /*this.playing = null;
    this.playingPlaylist = null;
    this.referrer = "";*/
    console.log("moi miniplayeristä");
  }

  ionViewDidLoad(){
   /* console.log(this.navParams.get['miniPlayer']);
    if (this.navParams.get['miniPlayer']) {
      this.setMiniPlayerData(
        this.navParams.get['miniPlayer'].getPlaying(),
        this.navParams.get['miniPlayer'].getPlayingPlaylist(),
        this.navParams.get('referrer')
      );
    }*/
  }

  pausePlayer(e: Event){
    e.stopPropagation();
    console.log(this.referrer);
    if (this.referrer === "spotify") {
      if(this.musicService.isPlayerInit()){
        this.musicService.pausePlayback();
      }
    } else {
      this.soundcloudService.pauseStream();
    }
  }

  startPlayer(e: Event){
    e.stopPropagation();
    console.log(this.referrer);
    if (this.referrer === "spotify") {
      if(this.musicService.isPlayerInit()){
        this.musicService.startPlayback();
      }
    } else {
      this.soundcloudService.resumeStream();
    }
  }

  openPlayerPage(item: Song){
    //this.navCtrl.push(PlayerPage, {item: item, songs: this.playingPlaylist.getSongs(), referrer: this.referrer }).catch(()=> console.log('should I stay or should I go now'));
    this.navCtrl.push(PlayerPage, {miniPlayer: this, referrer: this.referrer }).catch(()=> console.log('should I stay or should I go now'));
  }

  setMiniPlayerData( playingSong: Song, playingPlaylist: Playlist, referrer: string){
    this.playing = playingSong;
    this.playingPlaylist = playingPlaylist;
    this.referrer = referrer;
  }

  getPlaying(): Song {
    return this.playing;
  }

  getPlayingPlaylist(): Playlist {
    return this.playingPlaylist;
  }

  getReferrer(): string {
    return this.referrer;
  }

  setPlaying(song: Song) {
    this.playing = song;
  }

  setPlayingPlaylist(playlist: Playlist){
    this.playingPlaylist = playlist;
  }

  setReferrer(ref: string) {
    this.referrer = ref;
  }


}
