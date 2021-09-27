import {
  Publisher,
  UserCreatedEvent,
  Subjects,
} from "@marius98/myzone-common-package";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: UserCreatedEvent["subject"] = Subjects.UserCreatedEvent;
}
