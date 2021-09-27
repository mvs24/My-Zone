import { Subjects } from "../subjects/subjects";

export interface UserCreatedEvent {
  subject: Subjects.UserCreatedEvent;
  data: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    version: number;
  };
}
