import mongoose from "mongoose";

const { Schema } = mongoose;

interface ICompany {
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  password: string;
  logo?: string;
  rating?:number;
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

  logo: {
    type: String,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  }
},
{timestamps: true});

export default mongoose.model("Company", CompanySchema);