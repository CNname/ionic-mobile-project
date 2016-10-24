import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MusicService {
  
  constructor() {
      
  }
  startPlayback(url: string){
    this.audioObject = new Audio(url);
    
  }

}
// https://blog.budacode.com/2016/06/02/angular-2-services/