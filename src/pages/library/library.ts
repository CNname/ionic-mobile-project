import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, ViewController } from 'ionic-angular';
import { SpotifyService } from '../../providers/spotify-service';
import { PlaylistDetails } from '../playlist-details/playlist-details';
import { Song } from '../../classes/Song.class';
import { Artist } from '../../classes/Artist.class';
import { Search } from '../search/search';
import { PlayerPage } from '../playerPage/playerPage';
import { ArtistPage } from "../artist-page/artist-page";
import { Handling } from "../../namespaces/handling";
import { imageUrls } from "../../interfaces/interfaces";
import { MusicService } from '../../providers/music-service';

@Component({
  selector: 'library',
  templateUrl: 'library.html'
})
export class Library {
  hideElement: boolean = false;
  isPlaying: boolean = false;
  private spotifyservice: SpotifyService;
  public musicService: MusicService;
  // select the default tab
  playerNav: string = "playlists";
  playlist_id: string;
  playlist_title: string;
  playlist_length: number;
  playlist_owner: string;
  playlist_items: Array<Object>;
  timeout: any;
  playing: Song;
  trackItems: any[] = [];
  artistItems: any[] = [];
  audioObject: any;
  searchCategory: string;

  constructor(public navCtrl: NavController, spotifyservice: SpotifyService, public modalCtrl: ModalController, musicService: MusicService  ) {
    this.musicService = musicService;
    this.spotifyservice = spotifyservice;
    this.spotifyservice.loadPlaylist().subscribe(playlist => {
      console.log(playlist);
      this.playlist_items = playlist["items"];
    });
  }

  ionViewDidLoad(){
    console.log("start of the page");
  }

  goToDetails(playlist_id: string, playlist_title: string) {
    this.navCtrl.push(PlaylistDetails, {playlist_id, playlist_title});
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

startPlayer() {
  if(this.musicService.isPlayerInit()){
    this.musicService.startPlayback();
  }
}

openPagePlayer(item: Song){
  this.navCtrl.push(PlayerPage, {item: item}).catch(()=> console.log('should I stay or should I go now'));
}

startNewPlayer(item: Song){
  if(this.musicService.isPlayerInit()){
      this.playing = item;
      this.musicService.pausePlayback();
      this.musicService.resetAudio();
      this.musicService.setAudio(item.getUrl());
      this.musicService.startPlayback();
      this.isPlaying = true;
  } else {
      this.playing = item;
      this.musicService.setAudio(item.getUrl());
      this.musicService.startPlayback();
      this.isPlaying = true;
  }
}

pausePlayer(){
  if(this.musicService.isPlayerInit()){
    this.musicService.pausePlayback();
  }
}

}
