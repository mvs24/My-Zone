import { StringCodec, Msg, NatsConnection, NatsError } from "nats";
import { Event } from "./types";

export abstract class Listener<T extends Event> {
  protected stan: NatsConnection;
  protected abstract eventHandler(data: T["data"], msg: Msg): any;
  abstract queueGroupName: string;
  abstract subject: T["subject"];

  constructor(stan: NatsConnection) {
    this.stan = stan;
  }

  listen() {
    const subscription = this.stan.subscribe(this.subject, {
      queue: this.queueGroupName,
      timeout: 5,
    });

    subscription.callback = (err: NatsError | null, msg: Msg) => {
      if (err) throw err;

      const stringCodec = StringCodec();
      const decodedData = stringCodec.decode(msg.data);
      this.eventHandler(decodedData, msg);
    };
  }
}
