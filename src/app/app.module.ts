import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Library } from '../pages/library/library';
import { SpotifyService } from '../providers/spotify-service';
import { PlaylistDetails } from '../pages/playlist-details/playlist-details';
import { Search } from '../pages/search/search';
import { PlayerPage } from '../pages/playerPage/playerPage';


@NgModule({
  declarations: [
    MyApp,
    Library,
    PlayerPage,
    PlaylistDetails,
    Search
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
    Search
  ],
  providers: [ SpotifyService ]
})
export class AppModule {}
