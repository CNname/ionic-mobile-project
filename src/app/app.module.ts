import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, DeepLinkConfig } from 'ionic-angular';
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
import {LoadingPage} from "../pages/loading-page/loading-page";
import {JsonpModule} from '@angular/http';

// http://ionicframework.com/docs/v2/2.0.0-rc.1/api/navigation/DeepLinker/
// https://forum.ionicframework.com/t/how-to-configure-deeplinks-in-appmodule-forroot/66058/15
/*export const deepLinkConfig: DeepLinkConfig = {
  links: [
    //{ component: SoundcloudLibrary, name: 'Soundcloud', segment: 'soundcloud-callback' },
    { component: SpotifyLibrary, name: 'Spotify', segment: 'spotify-callback' }
  ]
};*/

@NgModule({
  declarations: [
    MyApp,
    SpotifyLibrary,
    SoundcloudLibrary,
    Settings,
    PlayerPage,
    PlaylistDetails,
    Search,
    ArtistPage,
    LoginPage,
    LoadingPage
  ],
  imports: [
    //IonicModule.forRoot(MyApp, {}, deepLinkConfig),
    IonicModule.forRoot(MyApp),
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SpotifyLibrary,
    SoundcloudLibrary,
    PlayerPage,
    Settings,
    PlaylistDetails,
    Search,
    ArtistPage,
    LoginPage,
    LoadingPage
  ],
  providers: [ SpotifyService, SoundcloudService, MusicService, AuthenticationService, UserAccountService ]
})
export class AppModule {}
