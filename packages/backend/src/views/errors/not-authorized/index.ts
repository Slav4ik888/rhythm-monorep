export class NotAutorized extends Error {
  status: number

  constructor(message: string) {
    super();
    this.status  = 401;
    this.message = message;
  }
}
