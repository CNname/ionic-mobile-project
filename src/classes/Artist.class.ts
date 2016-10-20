
export class Artist  {

  private _name: string;
  private _id: string;
  private _href?: string;

  constructor(id: string, name: string, href?: string) {
    this._name = name;
    this._id = id;
    this._href = href;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get href(): string {
    return this._href;
  }

  set href(value: string) {
    this._href = value;
  }

}