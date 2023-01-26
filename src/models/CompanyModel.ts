import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

interface ICompany {
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  password: string;
  offices?: Types.ObjectId[];
  logo?: string;
  rating?:number;
  isAdmin: boolean;
};

const CompanySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,    
  },

  offices: {
    type: [{type: Schema.Types.ObjectId, ref: "Officers", required: true}]
  },

  logo: {
    type: String,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  
  isAdmin: {
    type: Boolean,
    default: true
  }
},
{timestamps: true});

export default mongoose.model("Company", CompanySchema);