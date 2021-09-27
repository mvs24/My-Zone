import { NatsConnection, StringCodec } from "nats";
import { Event } from "./types";

export abstract class Publisher<T extends Event> {
  protected stan: NatsConnection;
  abstract subject: T["subject"];

  constructor(stan: NatsConnection) {
    this.stan = stan;
  }

  publish(data: T["data"]) {
    const stringCodec = StringCodec();

    this.stan.publish(this.subject, stringCodec.encode(JSON.stringify(data)));
  }
}
