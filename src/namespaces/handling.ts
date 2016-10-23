import {Song} from "../classes/Song.class";
import {Artist} from "../classes/Artist.class";

export namespace Handling {

  export class HandleJson {

    static tracks(tracksArray: Array<any>): Song[] {

      let songs: Song[] = [];

      for (let i = 0; i < tracksArray.length; i++) {

        let song: Song = new Song(tracksArray[i].id, tracksArray[i].name, tracksArray[i].isPlayable);
        song.setAlbumImage({
          small: tracksArray[i].album.images[2],
          medium: tracksArray[i].album.images[1],
          large: tracksArray[i].album.images[0]
        });
        song.setAlbumId(tracksArray[i].album.id);
        song.setAlbumTitle(tracksArray[i].album.name);
        song.setUrl(tracksArray[i].preview_url);

        let artists: Artist[] = [];

        for (var j = 0; j < tracksArray[i].artists.length; j++) {
          artists.push(new Artist(
           tracksArray[i].artists[j].id,
           tracksArray[i].artists[j].name,
           tracksArray[i].artists[j].href
          ))
         }

        song.setArtists(artists);
        songs.push(song);

      }

      return songs;

    }

    static artists(artistsArray: Array<any>): Artist[] {

      let artistItems: Artist[] = [];

      for (let i = 0; i < artistsArray.length; i++) {
        let artist = new Artist(artistsArray[i].id, artistsArray[i].name, artistsArray[i].href);
        artist.setImages({
          small: artistsArray[i].images[2],
          medium: artistsArray[i].images[1],
          large: artistsArray[i].images[0]
        });

        artistItems.push(artist);
      }

      return artistItems;

    }

  }

}
