import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, ToastController } from 'ionic-angular';
import { Song } from '../../classes/Song.class';
import { UserAccountService } from '../../providers/user-account-service'
import { User } from '../../classes/User.class'
import { SoundcloudService } from '../../providers/soundcloud-service'
/*
  Generated class for the SoundcloudLibrary page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-soundcloud-library',
  templateUrl: 'soundcloud-library.html'
})
export class SoundcloudLibrary {
    playerNav: string = "feed";
    private tracks: any[] = [];
    private playTrack: number = 0;
    public currentTrack: Song;
    private userAccountService: UserAccountService
    private soundcloudService: SoundcloudService
    private user: User

  constructor(public navCtrl: NavController, userAccountService: UserAccountService, soundcloudService: SoundcloudService, private toastController: ToastController) {
      this.userAccountService = userAccountService;
      this.soundcloudService = soundcloudService;
  }

  ionViewCanEnter(): boolean{
    this.user = this.userAccountService.getCurrentUser();
    if(this.user.getSoundCloudAccountId() == null){
      //console.log(this.user.getId());
      let toast = this.toastController.create({
        message: 'You must first sign in to SoundCloud, you can do this in the settings',
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return false;
    } else { return true; }

  }

  fetchTracks(bpm: number, genre:string): void {

  }

  startStreaming(){

  }

}
