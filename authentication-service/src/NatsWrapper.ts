import { NatsConnection, connect } from "nats";

class NatsWrapper {
  public _stan: undefined | NatsConnection;

  get stan() {
    if (this._stan) return this._stan;

    throw new Error("Stan has not connected yet!");
  }

  async connect(connectionURI: string) {
    try {
      this._stan = await connect({ servers: connectionURI });
    } catch (error) {
      throw error;
    }
  }
}

export const natsWrapper = new NatsWrapper();
