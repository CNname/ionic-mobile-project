import { Component, ViewChild } from '@angular/core';
import {NavController, ModalController, ViewController, MenuController, NavParams} from 'ionic-angular';
import { SpotifyService } from '../../providers/spotify-service';
import { PlaylistDetails } from '../playlist-details/playlist-details';
import { Song } from '../../classes/Song.class';
import { Artist } from '../../classes/Artist.class';
import { PlayerPage } from '../playerPage/playerPage';
import { ArtistPage } from "../artist-page/artist-page";
import { Handling } from "../../namespaces/handling";
import { imageUrls } from "../../interfaces/interfaces";
import { MusicService } from '../../providers/music-service';
import { AuthenticationService } from '../../providers/authentication-service';
import {UserAccountService} from "../../providers/user-account-service";
import {Playlist} from "../../classes/Playlist.Class";

@Component({
  selector: 'spotify-library',
  templateUrl: 'spotify-library.html'
})
export class SpotifyLibrary {
  hideElement: boolean = false;
  isPlaying: boolean = false;
  pauseButton: boolean = false;
  private spotifyservice: SpotifyService;
  private authenticationservice: AuthenticationService;
  public musicService: MusicService;
  // select the default tab
  playerNav: string = "spotify";
  playlist_items: Array<Object>;
  timeout: any;
  playing: Song;
  trackItems: any[] = [];
  artistItems: any[] = [];
  searchCategory: string;
  spotifyUser: Object;

  constructor(
    public navCtrl: NavController,
    spotifyservice: SpotifyService,
    authservice: AuthenticationService,
    public modalCtrl: ModalController,
    musicService: MusicService,
    private menu: MenuController,
    public userAccountService: UserAccountService,
    private params: NavParams) {
      this.musicService = musicService;
      this.authenticationservice = authservice;
      this.spotifyservice = spotifyservice;
      /*this.spotifyservice.loadPlaylist().subscribe(playlist => {
        //noinspection TypeScriptValidateTypes
        this.playlist_items = playlist["items"];
        this.menu.enable(true);
      });*/

      console.log(params.get('params'));

  }

  ionViewCanEnter(): boolean {
    return this.authenticationservice.isUserLoggedIn();
  }

  ionViewDidLoad(){

    this.menu.enable(true);

    let user = this.userAccountService.getSpotifyParams();

    if (user) {
      this.spotifyservice.getMe().subscribe(res => {
        this.spotifyUser = res;
      })

      /*this.spotifyservice.getFeaturedPlaylists().subscribe(res => {
        this.playlist_items = res['playlists']['items'];
      });*/

      this.spotifyservice.getFeaturedPlaylists().subscribe(res =>{
        this.playlist_items = Handling.HandleJson.SpotifyPlaylists(res['playlists']['items']);
        console.log(this.playlist_items);
      });

    }




  }

  toggleSearchAndFocus(){
    this.hideElement = !this.hideElement;

    if (this.hideElement) {
      let sgInput = document.querySelector("ion-input.librarySearch > input");
      //sgInput.focus();
      console.log(sgInput);
    }

  }



openPlaylist(item: Playlist){
  this.navCtrl.push(PlaylistDetails, {item: item}).catch(()=> console.log('Something went wrong while opening playlist'));
}

 getPlaylistById(userId: string, playlistId: string){
   this.spotifyservice.getPlaylistById(userId, playlistId).subscribe(res => {
     console.time("Create playlist");

      let tracks: Song[] = [];
      for (var i=0; i<res.items.length; i++) {
        let song: Song = new Song(res.items[i].id, res.items[i].name, res.items[i].isPlayable)
        song.setAlbumImage({
          small: res.items[i].album.images[2],
          medium: res.items[i].album.images[1],
          large: res.items[i].album.images[0]
        });
        song.setAlbumId(res.items[i].album.id)
        song.setAlbumTitle(res.items[i].album.name);

        let artists: Artist[] = [];

        for(var j=0; j<res.tracks.items[i].artists.length; j++) {
            artists.push(new Artist(
              res.tracks.items[i].artists[j].id,
              res.tracks.items[i].artists[j].name,
              res.tracks.items[i].artists[j].href
            ));
        }

        song.setArtists(artists);

        tracks.push(song);
      }
      console.timeEnd("Create playlist")
      console.log(tracks);
      return tracks;

    })
 }

getItemsByName(event:any) {
  clearTimeout(this.timeout);
  this.trackItems = [];
  this.artistItems = [];

  this.timeout = setTimeout(() => {

      let query = event.target.value;

      if(query.length >= 3){
        // activate search segment if not active
        if (this.playerNav !== "search") this.playerNav = "search";

        this.spotifyservice.searchForItem(encodeURIComponent(query)).subscribe((res) => {

          this.trackItems = Handling.HandleJson.tracks(res.tracks.items);
          this.artistItems = Handling.HandleJson.artists(res.artists.items);

          // activate segment if needed
          if (this.trackItems.length > 0) {
            this.searchCategory = "tracks";
          } else if (this.trackItems.length === 0 && this.artistItems.length > 0) {
            this.searchCategory = "artists";
          }

        })
      }
  }, 1000);
}

artistClickEvent(id: string) {
  this.spotifyservice.getArtistById(id).subscribe((res) => {
    let artist = new Artist(res.id, res.name);
    let images: imageUrls = {
      large: {
        height: 600,
        width: 600,
        url: "../../assets/img/sg-placeholder.jpg"
      }
    };

    for (let i=0; i<res.images.length; i++) {
      if (i===0) images.large = res.images[i];
      else if (i===1) images.medium = res.images[i];
      else if (i===2) images.small = res.images[i];
    }

    artist.setImages(images);

    this.navCtrl.push(ArtistPage, {
      item: artist
    });

  })
}

startPlayer(e: Event) {

  e.stopPropagation();

  if(this.musicService.isPlayerInit()){
    this.musicService.startPlayback();
  }
}

openPagePlayer(item: Song){
  this.navCtrl.push(PlayerPage, {item: item, songs: this.trackItems }).catch(()=> console.log('should I stay or should I go now'));
}

startNewPlayer(item: Song){
  if(this.musicService.isPlayerInit()){
      this.playing = item;
      this.musicService.pausePlayback();
      this.musicService.resetAudio();
      this.musicService.setAudio(item.getUrl());
      this.musicService.startPlayback();
      this.isPlaying = true;
      this.pauseButton = true;
  } else {
      this.playing = item;
      this.musicService.setAudio(item.getUrl());
      this.musicService.startPlayback();
      this.isPlaying = true;
      this.pauseButton = true;
  }
}

pausePlayer(e: Event){

  e.stopPropagation();

  if(this.musicService.isPlayerInit()){
    this.musicService.pausePlayback();
  }
}

}
