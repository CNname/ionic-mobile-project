import {IUser} from "../interfaces/interfaces";

export class User implements IUser {

  id: string;
  image: string;
  private _firstName: string;
  private _lastName: string;
  private _spotifyAccountId?: number;
  private _soundCloudAccountId?: number;

  constructor(firstName: string, lastName: string, id: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this.id = id;
  }

  getFirstName(): string {
    return this._firstName;
  }

  setFirstName(value: string) {
    this._firstName = value;
  }

  getLastName(): string {
    return this._lastName;
  }

  setLastName(value: string) {
    this._lastName = value;
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

  getSpotifyAccountId(): number {
    return this._spotifyAccountId;
  }

  private setSpotifyAccountId(value: number) {
    this._spotifyAccountId = value;
  }

  getSoundCloudAccountId(): number {
    return this._soundCloudAccountId;
  }

  private setSoundCloudAccountId(value: number) {
    this._soundCloudAccountId = value;
  }

}
