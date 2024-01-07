import { searchTermRegex } from "../helpers";
import mongoose from "mongoose";

const leftOverSchema = new mongoose.Schema(
  {
    image: { type: String, require: true },
    customerName: { type: String, require: true },
    comments: { type: String, require: true },
    customerId: { type: String, require: true },
    uploadedBy: { type: String, require: true },
    brandName: { type: String, require: true },
    quantity: { type: String, require: true },
    expiryDate: { type: Date, require: true },
  },
  { timestamps: true }
);

const LeftOverModal = mongoose.model("leftOver", leftOverSchema);

const setSearchTermsOptions = (regex: RegExp) => {
  return {
    customerName: { $regex: regex },
  };
};

export const getLeftOverByCustomerId = (
  customerId: string,
  searchTerm?: string
) => {
  const regex = searchTermRegex(searchTerm);

  return LeftOverModal.find({
    customerId,
    brandName: { $regex: regex },
  }).sort({
    createdAt: -1,
  });
};

export const createLeftOver = async (values: Record<string, any>) => {
  const user = await new LeftOverModal(values).save();
  return user.toObject();
};

export const getLeftOverByUploadedBy = (
  uploadedBy: string,
  searchTerm?: string
) => {
  const regex = searchTermRegex(searchTerm);

  return LeftOverModal.find({
    uploadedBy: uploadedBy,
    customerName: { $regex: regex },
  }).sort({ createdAt: -1 });
};

export const deleteLeftOverById = (id: string) =>
  LeftOverModal.findOneAndDelete({ _id: id });

export const updatedLeftOverById = (id: string, values: Record<string, any>) =>
  LeftOverModal.findByIdAndUpdate(id, values);
