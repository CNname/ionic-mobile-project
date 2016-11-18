import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SpotifyLibrary } from '../pages/spotify-library/spotify-library';
import { SpotifyService } from '../providers/spotify-service';
import { PlaylistDetails } from '../pages/playlist-details/playlist-details';
import { Search } from '../pages/search/search';
import { PlayerPage } from '../pages/playerPage/playerPage';
import { ArtistPage } from '../pages/artist-page/artist-page';
import { MusicService } from '../providers/music-service';
import { SoundcloudService } from "../providers/soundcloud-service";
import { AuthenticationService } from "../providers/authentication-service";
import {LoginPage} from "../pages/login-page/login-page";
import {UserAccountService} from "../providers/user-account-service";
import { SoundcloudLibrary } from '../pages/soundcloud-library/soundcloud-library';
import { Settings } from '../pages/settings/settings';
import {ImageSelectionModalPage} from "../pages/image-selection-modal-page/image-selection-modal-page";

@NgModule({
  declarations: [
    MyApp,
    SpotifyLibrary,
    SoundcloudLibrary,
    Settings,
    ImageSelectionModalPage,
    PlayerPage,
    PlaylistDetails,
    Search,
    ArtistPage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SpotifyLibrary,
    SoundcloudLibrary,
    PlayerPage,
    Settings,
    ImageSelectionModalPage,
    PlaylistDetails,
    Search,
    ArtistPage,
    LoginPage
  ],
  providers: [ SpotifyService, SoundcloudService, MusicService, AuthenticationService, UserAccountService ]
})
export class AppModule {}
