import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { PlayerPage } from '../pages/player-page/player-page';
import { SpotifyService } from '../providers/spotify-service';
import { PlaylistDetails } from '../pages/playlist-details/playlist-details';
import { ArtistPage } from '../pages/artist-page/artist-page';


@NgModule({
  declarations: [
    MyApp,
    PlayerPage,
    PlaylistDetails,
    ArtistPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlayerPage,
    PlaylistDetails,
    ArtistPage
  ],
  providers: [ SpotifyService ]
})
export class AppModule {}
