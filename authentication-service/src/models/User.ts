import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface UserAttributes {
  name: string;
  lastName: string;
  photo?: string;
  email: string;
  password: string;
  passwordConfirm?: string;
}

export interface UserDocument extends mongoose.Document {
  id: string;
  name: string;
  lastName: string;
  photo?: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  isPasswordCorrect(candidatePassword: string): Promise<boolean>;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = doc.id;
      },
    },
  }
);

userSchema.statics.build = function (attributes: UserAttributes) {
  return new User(attributes);
};

const getEncryptedPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

const handlePasswordEncryption = async function (
  userDocument: UserDocument,
  next: (err?: mongoose.CallbackError | undefined) => void
) {
  if (!userDocument.isModified("password")) return next();

  const encryptedPassword = await getEncryptedPassword(userDocument.password);

  userDocument.password = encryptedPassword;
  userDocument.passwordConfirm = undefined;

  next();
};

userSchema.pre("save", function (next) {
  handlePasswordEncryption(this, next);
});

userSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
