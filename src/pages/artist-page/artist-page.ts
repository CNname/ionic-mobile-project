import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SpotifyService} from "../../providers/spotify-service";
import {Artist} from "../../classes/Artist.class";
import {Song} from "../../classes/Song.class";
import {Handling} from "../../namespaces/handling";
import {imageUrls} from "../../interfaces/interfaces";

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
      console.log(this.popularTracks);
    })
  }

  // should not be here!!! Create a namespace etc to control player
  startPlayer(url: string) {
    //if(this.audioObject.playing() != 'true'){
    //this.audioObject = new Audio(url);
    //this.audioObject.play();
    //}else{
    //    this.audioObject.stop();
    //}
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

}
