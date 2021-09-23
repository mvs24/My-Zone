import mongoose from "mongoose";

interface UserAttributes {
  name: string;
  lastName: string;
  photo?: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface UserDocument extends mongoose.Document {
  name: string;
  lastName: string;
  photo?: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  photo: String,
  role: String,
  email: String,
  password: String,
  passwordConfirm: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

userSchema.statics.build = function (attributes: UserAttributes) {
  return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
