import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SpotifyService } from '../../providers/spotify-service';
import { PlaylistDetails } from '../playlist-details/playlist-details';
import { Song } from '../../classes/Song.class';
import { Artist } from '../../classes/Artist.class';

@Component({
  selector: 'page-player-page',
  templateUrl: 'player-page.html'
})
export class PlayerPage {
  // select the default tab
  playerNav: string = "playlists";
  playlist_id: string;
  playlist_title: string;
  playlist_length: number;
  playlist_owner: string;
  playlist_items: any;
  timeout: any;
  trackItems: any[] = [];
  artistItems: any[] = [];
  audioObject;
  private spotifyservice: SpotifyService;
  searchCategory: string;


  constructor(public navCtrl: NavController, spotifyservice: SpotifyService) {
    this.spotifyservice = spotifyservice;
    this.spotifyservice.loadPlaylist().subscribe(playlist => {
      console.log(playlist);
      this.playlist_items = playlist["items"];

    });
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
    console.log("pituus: " + event.target.value.length);
    if(event.target.value.length > 3){
    this.timeout = setTimeout(() => {

      // activate search segment if not active
      if (this.playerNav !== "search") this.playerNav = "search";

      this.spotifyservice.searchForItem(event.target.value).subscribe((res) => {
        this.trackItems = [];
        this.artistItems = [];

        console.log(res);

        for (let i=0; i<res.tracks.items.length; i++) {


          let song: Song = new Song(res.tracks.items[i].id, res.tracks.items[i].name, res.tracks.items[i].isPlayable);
          song.setAlbumImage({
            small: res.tracks.items[i].album.images[2],
            medium: res.tracks.items[i].album.images[1],
            large: res.tracks.items[i].album.images[0]
          });
          song.setAlbumId(res.tracks.items[i].album.id);
          song.setAlbumTitle(res.tracks.items[i].album.name);
          song.setUrl(res.tracks.items[i].preview_url);

          let artists: Artist[] = [];

          for (var j = 0; j < res.tracks.items[i].artists.length; j++) {
            artists.push(new Artist(
              res.tracks.items[i].artists[j].id,
              res.tracks.items[i].artists[j].name,
              res.tracks.items[i].artists[j].href
            ))
          }

          song.setArtists(artists);
          this.trackItems.push(song);

        }

        for (let i=0; i<res.artists.items.length; i++) {
          let artist = new Artist(res.artists.items[i].id, res.artists.items[i].name, res.artists.items[i].href); // korjaa!
          artist.setImages({
            small: res.artists.items[i].images[2],
            medium: res.artists.items[i].images[1],
            large: res.artists.items[i].images[0]
          });

          this.artistItems.push(artist);
        }

        // activate segment if needed
        if (this.trackItems.length>0) {
          this.searchCategory = "tracks";
        } else if (this.trackItems.length===0 && this.artistItems.length > 0) {
          this.searchCategory = "artists";
        }

      })
    }, 1000)
    }

}

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

    return artist;

  })
}


}
