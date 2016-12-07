import {IUser, SpotifyParams} from "../interfaces/interfaces";

export class User implements IUser {

  id: string;
  image: string;
  //private _spotifyParams?: SpotifyParams;
  private _soundCloudAccountId?: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  setId(value: string) {
    this.id = value;
  }

  getImage(): string {
    return this.image;
  }

  setImage(value: string) {
    this.image = value;
  }

  getSpotifyParams(): SpotifyParams {
    //return this._spotifyParams;
    return JSON.parse(window.localStorage.getItem("spotifyparams"));
  }

  setSpotifyParams(value: SpotifyParams) {
    //this._spotifyParams = value;
    window.localStorage.setItem("spotifyparams", JSON.stringify(value));
  }

  getSoundCloudAccountId(): string {
    return this._soundCloudAccountId;
  }

  /*private setSoundCloudAccountId(value: string) {
    this._soundCloudAccountId = value;
  }*/

}
