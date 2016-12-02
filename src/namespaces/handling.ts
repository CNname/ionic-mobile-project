import { Song } from "../classes/Song.class";
import { Artist } from "../classes/Artist.class";
import { Playlist } from "../classes/Playlist.Class"
import {imageUrls} from "../interfaces/interfaces";

export namespace Handling {

  export class HandleJson {

    static tracks(tracksArray: Array<any>, trackContext = ""): Song[] {

      console.log(tracksArray);

      let songs: Song[] = [];


      for (let i = 0; i < tracksArray.length; i++) {

        let track;

        if (trackContext === "playlist") track = tracksArray[i]['track'];
        else track = tracksArray[i];

        let song: Song = new Song(track.id, track.name, track.isPlayable);
        let images: imageUrls = {
          large: {
            height: 600,
            width: 600,
            url: "../../assets/img/sg-placeholder.jpg"
          }
        };

        for (let j=0; j<track.album.images.length; j++) {
          if (j===0) images.large = track.album.images[j];
          else if (j===1) images.medium = track.album.images[j];
          else if (j===2) images.small = track.album.images[j];
        }

        song.setAlbumImage(images);
        song.setAlbumId(track.album.id);
        song.setAlbumTitle(track.album.name);
        song.setUrl(track.preview_url);

        let artists: Artist[] = [];

        for (let j = 0; j < track.artists.length; j++) {
          artists.push(new Artist(
           track.artists[j].id,
           track.artists[j].name,
           track.artists[j].href
          ))
         }

        song.setArtists(artists);
        songs.push(song);

      }

      return songs;

    }

    // handle SoundCloud tracks and return Songs Array
    static SoundCloudTracks(tracksArray: Array<any>): Song[]{
      let songs: Song[] = [];

      for (let i = 0; i < tracksArray.length; i++) {

        let song: Song = new Song(tracksArray[i].id, tracksArray[i].title, tracksArray[i].streamable);
      //  console.log(song);
        let images: imageUrls = {
          large: {
            height: 600,
            width: 600,
            url: "../../assets/img/sg-placeholder.jpg"
          }
        };
        if(  tracksArray[i].artwork_url != null) {
          images.large = tracksArray[i].artwork_url;
        } else{
          images.large = "../../assets/img/soundcloud-logo.jpg";
        }
        song.setDuration(tracksArray[i].duration);
        song.setAlbumImage(images);
        song.setAlbumId(tracksArray[i].id);
        song.setAlbumTitle(tracksArray[i].title);
        song.setUrl(tracksArray[i].stream_url);

        let artists: Artist[] = [];
        //console.log(tracksArray[i].user.username);
        //for (let j = 0; j < tracksArray[i].user.length; j++) {
          artists.push(new Artist(
           tracksArray[i].user_id,
           tracksArray[i].user.username,
           tracksArray[i].user.permalink_url
          ))
         //}

        song.setArtists(artists);
        songs.push(song);

      }
      //console.log(songs);
      return songs;
     }

    static SpotifyPlaylists(playlistArray: Array<any>): Playlist[] {
      let playlists: Playlist[] = [];

      //console.log("id: "tracksArray.);
      //console.log(playlistArray);

      for (let i = 0; i < playlistArray.length; i++) {

        let playlist: Playlist = new Playlist(playlistArray[i].id, playlistArray[i].name, playlistArray[i].tracks.count, "spotify");

        let images: imageUrls = {
          large: {
            height: 600,
            width: 600,
            url: "../../assets/img/sg-placeholder.jpg"
          }
        };


        if(  playlistArray[i].images[0] != null) {
          images.large = playlistArray[i].images[0];
        }

        /*if(playlistArray[i].tracks.length != 0){
          let tracks: Song[] = this.SoundCloudTracks(playlistArray[i].tracks);
          playlist.setSongs(tracks);
        }*/
        playlist.setPlaylistImage(images);
        //playlist.setOwnerName(playlistArray[i].user.username);
        playlist.setOwnerId(playlistArray[i].owner.id);

        playlists.push(playlist);

      }
      //console.log(songs);
      return playlists;
    }

     // handle SoundCloud tracks and return Songs Array
     static SoundCloudTrendingTracks(tracksArray: Array<any>): Song[]{

       let songs: Song[] = [];

       for (let i = 0; i < tracksArray.length; i++) {

         let song: Song = new Song(tracksArray[i].track.id, tracksArray[i].track.title, tracksArray[i].track.streamable);
       //  console.log(song);
         let images: imageUrls = {
           large: {
             height: 600,
             width: 600,
             url: "../../assets/img/sg-placeholder.jpg"
           }
         };
         if(  tracksArray[i].track.artwork_url != null) {
           images.large = tracksArray[i].track.artwork_url;
         } else{
           images.large = "../../assets/img/soundcloud-logo.jpg";
         }

         song.setAlbumImage(images);
         song.setAlbumId(tracksArray[i].track.id);
         song.setAlbumTitle(tracksArray[i].track.title);
         song.setUrl(tracksArray[i].track.stream_url);

         let artists: Artist[] = [];
         //console.log(tracksArray[i].user.username);
         //for (let j = 0; j < tracksArray[i].user.length; j++) {
           artists.push(new Artist(
            tracksArray[i].track.user_id,
            tracksArray[i].track.user.username,
            tracksArray[i].track.user.permalink_url
           ))
          //}

         song.setArtists(artists);
         songs.push(song);

       }
       //console.log(songs);
       return songs;
    }

    static SoundCloudPlaylists(playlistArray: Array<any>): Playlist[] {
      let playlists: Playlist[] = [];

      //console.log("id: "tracksArray.);
      //console.log(playlistArray);

      for (let i = 0; i < playlistArray.length; i++) {

        let playlist: Playlist = new Playlist(playlistArray[i].id, playlistArray[i].title, playlistArray[i].track_count, "soundcloud");

        let images: imageUrls = {
          large: {
            height: 600,
            width: 600,
            url: "../../assets/img/sg-placeholder.jpg"
          }
        };


        if(  playlistArray[i].artwork_url != null) {
          images.large = playlistArray[i].artwork_url;
        }else if(playlistArray[i].tracks[0].artwork_url != null ){
          images.large = playlistArray[i].tracks[0].artwork_url;
        }

        if(playlistArray[i].tracks.length != 0){
          let tracks: Song[] = this.SoundCloudTracks(playlistArray[i].tracks);
          playlist.setSongs(tracks);
        }
        playlist.setPlaylistImage(images);
        playlist.setOwnerImage(playlistArray[i].user.avatar_url);
        playlist.setOwnerName(playlistArray[i].user.username);
        playlist.setOwnerId(playlistArray[i].user.id);
        playlists.push(playlist);

      }
      //console.log(songs);
      return playlists;
    }

    static artists(artistsArray: Array<any>): Artist[] {

      //console.log(artistsArray);

      let artistItems: Artist[] = [];

      for (let i = 0; i < artistsArray.length; i++) {
        let artist = new Artist(artistsArray[i].id, artistsArray[i].name, artistsArray[i].href);

        let images: imageUrls = {
          large: {
            height: 600,
            width: 600,
            url: "../../assets/img/sg-placeholder.jpg"
          }
        };

        for (let j=0; j<artistsArray[i].images.length; j++) {
          if (j===0) images.large = artistsArray[i].images[j];
          else if (j===1) images.medium = artistsArray[i].images[j];
          else if (j===2) images.small = artistsArray[i].images[j];
        }

        artist.setImages(images);

        artistItems.push(artist);
      }

      return artistItems;

    }

  }

}
