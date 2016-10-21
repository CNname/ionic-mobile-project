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
  playlist_items: Array<Object>;
  timeout: any;
  songs: any[];
  audioObject;
  private spotifyservice: SpotifyService;


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
          })
            //.setAlbumId(res.items[i].album.id)
            //.setAlbumTitle(res.items[i].album.name);

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

getSongByName(event:any) {

    clearTimeout(this.timeout);
    console.log("pituus: " + event.target.value.length);
    if(event.target.value.length > 3){
    this.timeout = setTimeout(() => {
      this.spotifyservice.searchForItem(event.target.value).subscribe((res) => {
        this.songs = [];

        for (var i=0; i<res.tracks.items.length; i++) {

          let song: Song = new Song(res.tracks.items[i].id, res.tracks.items[i].name, res.tracks.items[i].isPlayable)

          song.setAlbumImage({
            small: res.tracks.items[i].album.images[2],
            medium: res.tracks.items[i].album.images[1],
            large: res.tracks.items[i].album.images[0]
          });
          song.setAlbumId(res.tracks.items[i].album.id);
          song.setAlbumTitle(res.tracks.items[i].album.name);
          song.setUrl(res.tracks.items[i].preview_url);

          let artists: Artist[] = [];

          for(var j=0; j<res.tracks.items[i].artists.length; j++) {
              artists.push(new Artist(
                res.tracks.items[i].artists[j].id,
                res.tracks.items[i].artists[j].name,
                res.tracks.items[i].artists[j].href
              ))
          }

          song.setArtists(artists);
          this.songs.push(song);
        }
        console.log(this.songs);

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


}
