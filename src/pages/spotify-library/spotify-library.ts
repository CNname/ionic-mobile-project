import {Component, ViewChild, OnInit, ApplicationRef} from '@angular/core';
import {
  NavController, ModalController, ViewController, MenuController, NavParams, InfiniteScroll,
  AlertController, ToastController
} from 'ionic-angular';
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
  // select the default tab
  playerNav: string = "spotify";
  offset: number = 30;
  playlist_items: Array<Object>;
  timeout: any;
  playing: Song;
  trackItems: any[] = [];
  artistItems: any[] = [];
  searchCategory: string;
  spotifyUser: Object;
  query: string;
  showUserStuff: false;
  usersPlaylists: Array<Playlist>;
  usersTotalPlaylists: number;
  justLoggedIn: any;



  constructor(
    public navCtrl: NavController,
    public spotifyservice: SpotifyService,
    public authenticationservice: AuthenticationService,
    public musicService: MusicService,
    private menu: MenuController,
    public userAccountService: UserAccountService,
    private applicationRef: ApplicationRef,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public spotifyService: SpotifyService
  ) {
    this.justLoggedIn = navParams.get('loggedIntoSpotify');
  }

  ionViewCanEnter(): boolean {
    return this.authenticationservice.isUserLoggedIn();
  }

  ionViewDidLoad(){

    this.menu.enable(true);

    let user = this.userAccountService.getSpotifyParams();

    if (user) {

      if (this.justLoggedIn === true) {
        let toast = this.toastCtrl.create({
          message: 'Logged in successfully',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }

      console.log('expireEnd: ' + (+user['tokenStart'] + +user['expiresIn'] * 1000));
      console.log('now: ' + Date.now());

      // access token is valid 3600 seconds,
      if (user['tokenStart'] + user['expiresIn'] * 1000 > Date.now()) {

          console.log('access token is valid');

          this.spotifyservice.getMe().subscribe(res => {
            console.log(res);
            this.spotifyUser = res;
          });


        this.spotifyservice.getCurrentUsersPlaylists().subscribe(res => {
          console.log(res);
          this.usersTotalPlaylists = res['total'];
          this.usersPlaylists = Handling.HandleJson.SpotifyPlaylists(res['items']);
        });

        this.spotifyservice.getFeaturedPlaylists().subscribe(res => {
          console.log(res);
          this.playlist_items = Handling.HandleJson.SpotifyPlaylists(res['playlists']['items']);
          console.log(this.playlist_items);
        });

      } else {
        console.log('access token has expired');
        this.createReAuthenticateAlert();
      }

    }

    //this.applicationRef.tick();



  }


  createReAuthenticateAlert(){
    let prompt = this.alertCtrl.create({
      title: 'Logged out',
      message: "Please reauthenticate to use spotify's user features.",

      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Reauthenticate',
          handler: () => {
            // redirect to spotify login
            window.location.href = this.spotifyService.generateAuthenticationHref();
          }
        }
      ]
    });
    prompt.present();
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
    this.navCtrl.push(PlaylistDetails, {item: item, referrer: "spotify"}).catch(()=> console.log('Something went wrong while opening playlist'));
  }

  doInfinite(infiniteScroll: InfiniteScroll){
    if (typeof this.query !== "undefined") {
      if (this.query.length >= 3) {
        this.spotifyservice.searchForItem(this.query, this.offset).subscribe((res) => {
          let trackitems: any[] = Handling.HandleJson.tracks(res.tracks.items);
          let artistitems: any[] = Handling.HandleJson.artists(res.artists.items);
          this.offset += 30;
          if (trackitems.length == 0 && artistitems.length == 0) {
            infiniteScroll.enable(false);
          } else {
            infiniteScroll.enable(true);
          }

          for (let i = 0; i < trackitems.length; i++) {
            this.trackItems.push(trackitems[i]);
          }

          for (let i = 0; i < artistitems.length; i++) {
            this.artistItems.push(artistitems[i]);
          }

          // activate segment if needed
          if (this.trackItems.length > 0) {
            this.searchCategory = "tracks";
          } else if (this.trackItems.length === 0 && this.artistItems.length > 0) {
            this.searchCategory = "artists";
          }
        });
      }
    }
  }

  goToDetails(playlist_id: string, playlist_title: string) {
    this.navCtrl.push(PlaylistDetails, {playlist_id, playlist_title});
  }


  // this an oddly named search
  getItemsByName(event:any) {
    clearTimeout(this.timeout);
    this.trackItems = [];
    this.artistItems = [];

    this.timeout = setTimeout(() => {

        this.query = event.target.value;

        if(this.query.length >= 3){
          // activate search segment if not active
          if (this.playerNav !== "search") this.playerNav = "search";

          this.spotifyservice.searchForItem(encodeURIComponent(this.query), 0).subscribe((res) => {

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
