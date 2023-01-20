import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

interface IOfficer {
  name: string;
  address: string;
  companyId: Types.ObjectId;
  location: string;
  phoneNumber: string;
}