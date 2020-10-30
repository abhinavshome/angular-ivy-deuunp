export class User {
  constructor(
    public id: string,
    public name: string,
    public items: string[],
    public address: string,
    public pincode: string
  ) {}
}
