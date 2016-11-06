import {IUser} from "../interfaces/interfaces";

export class User implements IUser {

  id: string;
  image: string;
  private _spotifyAccountId?: string;
  private _soundCloudAccountId?: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

   private setId(value: string) {
    this.id = value;
  }

  getImage(): string {
    return this.image;
  }

  setImage(value: string) {
    this.image = value;
  }

  getSpotifyAccountId(): string {
    return this._spotifyAccountId;
  }

  private setSpotifyAccountId(value: string) {
    this._spotifyAccountId = value;
  }

  getSoundCloudAccountId(): string {
    return this._soundCloudAccountId;
  }

  private setSoundCloudAccountId(value: string) {
    this._soundCloudAccountId = value;
  }

}
