import mongoose, { Types } from "mongoose";
import { type } from "os";

const { Schema } = mongoose;

interface IOfficer {
  name: string;
  password: string;
  address: string;
  companyId: Types.ObjectId;
  location: string;
  phoneNumber: string;
  pending: number;
  viewed: number;
  picked: number;
  transit: number;
}

const OfficerSchema = new Schema<IOfficer>({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true,
  },

  companyId: {
    type: Schema.Types.ObjectId, 
    ref: "Company", 
    requird: true
  },

  location: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  pending: {
    type: Number,
    default: 0,
  },
  viewed: {
    type: Number,
    default: 0,
  },
  picked: {
    type: Number,
    default: 0,
  },
  transit: {
    type: Number,
    default: 0,
  },
},
{timestamps: true});

export default mongoose.model("Officer", OfficerSchema);