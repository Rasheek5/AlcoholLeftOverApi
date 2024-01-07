import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    userType: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("Users", UserSchema);

export const getFullUsers = () => UserModel.find();
export const getUserByEmail = (email: String) => UserModel.findOne({ email });
export const getUserByUserType = (userType: String) =>
  UserModel.find({ userType });
export const getUserBySessionToken = (sT: String) =>
  UserModel.findOne({
    "authentication.sessionToken": sT,
  });

export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = async (values: Record<string, any>) => {
  const user = await new UserModel(values).save();
  return user.toObject();
};

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

export const updatedUserById = (id: string, values: Record<string, any>) => {
  UserModel.findByIdAndUpdate(id, values);
};
