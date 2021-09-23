export class HTTPError extends Error {
  public isOperational: boolean = true;
  public status: string;

  constructor(public message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}
