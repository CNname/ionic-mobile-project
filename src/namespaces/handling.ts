import {Song} from "../classes/Song.class";
import {Artist} from "../classes/Artist.class";
import {imageUrls} from "../interfaces/interfaces";

export namespace Handling {

  export class HandleJson {

    static tracks(tracksArray: Array<any>): Song[] {

      console.log(tracksArray);

      let songs: Song[] = [];

      for (let i = 0; i < tracksArray.length; i++) {

        let song: Song = new Song(tracksArray[i].id, tracksArray[i].name, tracksArray[i].isPlayable);
        let images: imageUrls = {
          large: {
            height: 600,
            width: 600,
            url: "../../assets/img/sg-placeholder.jpg"
          }
        };

        for (let j=0; j<tracksArray[i].album.images.length; j++) {
          if (j===0) images.large = tracksArray[i].album.images[j];
          else if (j===1) images.medium = tracksArray[i].album.images[j];
          else if (j===2) images.small = tracksArray[i].album.images[j];
        }

        song.setAlbumImage(images);
        song.setAlbumId(tracksArray[i].album.id);
        song.setAlbumTitle(tracksArray[i].album.name);
        song.setUrl(tracksArray[i].preview_url);

        let artists: Artist[] = [];

        for (let j = 0; j < tracksArray[i].artists.length; j++) {
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

      console.log(artistsArray);

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
