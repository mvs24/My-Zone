export interface SignupRequestBody {
  name: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
}
