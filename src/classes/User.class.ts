
export class User {

  private _firstName: string;
  private _lastName: string;
  private _id: string;
  private _image: string;
  private _spotifyAccountId?: number; // ? = ei pakollinen
  private _soundCloudAccountId?: number; // ? = ei pakollinen

  constructor(firstName: string, lastName: string, id: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._id = id;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get image(): string {
    return this._image;
  }

  set image(value: string) {
    this._image = value;
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