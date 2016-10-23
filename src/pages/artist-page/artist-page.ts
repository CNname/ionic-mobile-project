import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SpotifyService} from "../../providers/spotify-service";
import {Artist} from "../../classes/Artist.class";
import {Song} from "../../classes/Song.class";
import {Handling} from "../../namespaces/handling";

/*
  Generated class for the Artist page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-artist',
  templateUrl: 'artist-page.html'
})
export class ArtistPage {
  audioObject: any;
  artist: Artist;
  popularTracks: Song[];
  private spotifyservice: SpotifyService;


  constructor(public navCtrl: NavController, navParams: NavParams, spotifyservice: SpotifyService) {
    this.spotifyservice = spotifyservice;
    this.artist = navParams.get("item");
  }

  ionViewDidLoad() {
    //console.log('Hello Artist Page');
    this.getPopularSongs();

  }

  getPopularSongs() {
    this.spotifyservice.getPopularSongsByArtist(this.artist.getId()).subscribe((res) => {
      this.popularTracks = Handling.HandleJson.tracks(res.tracks);
    })
  }

  // should not be here!!! Create a namespace etc to control player
  startPlayer(url: string) {
    //if(this.audioObject.playing() != 'true'){
    this.audioObject = new Audio(url);
    this.audioObject.play();
    //}else{
    //    this.audioObject.stop();
    //}
  }

  artistClickEvent(id: string) {
    this.spotifyservice.getArtistById(id).subscribe((res) => {
      let artist = new Artist(res.id, res.name);
      artist.setImages({
        small: res.images[2],
        medium: res.images[1],
        large: res.images[0]
      });

      this.navCtrl.push(ArtistPage, {
        item: artist
      });

    })
  }

}
