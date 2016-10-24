import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Library } from '../pages/library/library';
import { SpotifyService } from '../providers/spotify-service';
import { PlaylistDetails } from '../pages/playlist-details/playlist-details';
import { Search } from '../pages/search/search';
import { PlayerPage } from '../pages/playerPage/playerPage';
import { ArtistPage } from '../pages/artist-page/artist-page';
import { MusicService } from '../providers/music-service';


@NgModule({
  declarations: [
    MyApp,
    Library,
    PlayerPage,
    PlaylistDetails,
    Search,
    ArtistPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Library,
    PlayerPage,
    PlaylistDetails,
    Search,
    ArtistPage
  ],
  providers: [ SpotifyService, MusicService ]
})
export class AppModule {}
