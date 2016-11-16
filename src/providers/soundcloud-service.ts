import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var SC;

@Injectable()
export class SoundcloudService {

  private clientId: string = 'YOUR_CLIENT_ID';
  private redirect_uri: string = 'http://localhost/soundcloud-callback';

  constructor(public http: Http) {
    //console.log('Hello SoundcloudService Provider');
    SC.initialize({
      client_id:  this.clientId,
      redirect_uri:  this.redirect_uri
    });
  }

}
