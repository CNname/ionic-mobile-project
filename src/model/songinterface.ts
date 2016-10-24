export interface SongInterface {
  id: string;
  albumId: string;
//  albumImage: AlbumImageUrls;
  songTitle: string;
  albumTitle: string;
  playlist_id: string;
  playlist_title: string;
  playlist_length: number;
  playlist_owner: string;
  playlist_items: Array<Object>;
  //artists: Artist[];
  duration: number; // in milliseconds
  isPlayable: boolean;
  setId(id: string): void; // private
  getId(): string;
  setAlbumId(id: string): void; // private
  getAlbumId(): string;
//  setAlbumImages(urls: AlbumImageUrls): void; // private
//  getAlbumImages(): AlbumImageUrls;
  setSongTitle(name: string): void; // private
  getSongTitle(): string;
  setAlbumTitle(name: string): void; // private
  getAlbumTitle(): string;
  setDuration(dur: number): void; // private
  getDuration(): number;
  setIsPlayable(val: boolean): void; // private
  getIsPlayable(): boolean;
//  setArtist(artist-page: Artist): void;
//  getArtists(): Artist[];
}
