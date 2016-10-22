import {imageUrls} from "../interfaces/interfaces";

export class Artist  {

  private _type: string;
  private _name: string;
  private _id: string;
  private _href: string;
  private _images: imageUrls;

  constructor(id: string, name: string, href?: string) {
    this._name = name;
    this._id = id;
    this._href = href;
  }

  getType(): string {
    return this._type;
  }

  setType(value: string) {
    this._type = value;
  }

  getName(): string {
    return this._name;
  }

  setName(value: string) {
    this._name = value;
  }

  getId(): string {
    return this._id;
  }

  setId(value: string) {
    this._id = value;
  }

  getHref(): string {
    return this._href;
  }

  setHref(value: string) {
    this._href = value;
  }

  getImages(): imageUrls {
    return this._images;
  }

  setImages(value: imageUrls) {
    this._images = value;
  }

}
