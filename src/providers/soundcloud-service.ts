import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var SC;

@Injectable()
export class SoundcloudService {

  private clientId: string = 'd51aa162fb2f62d2072b34da795b83a4';
  private redirect_uri: string = 'http://localhost/soundcloud-callback';

  constructor(public http: Http) {
    SC.initialize({
      client_id:  this.clientId,
      //redirect_uri:  this.redirect_uri
    });
   }

  startStreaming(){
    SC.stream('/tracks/195454163').then(player => {
      //console.log("you should hear something");
      //player.play();
    });
  }

  searchForItem(query: string): any {
    return SC.get('tracks', {  q: query, limit: 100, license: 'cc-by-sa' });
  }

}
