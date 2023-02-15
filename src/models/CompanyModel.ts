import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

export interface ICompany {
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
    required: [true, "name must be provided"],
    unique: true,
  },

  email: {
    type: String,
    match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address.',
    ],
    required: [true, 'Email Address must be provided'],
    unique: true,
    lowercase: true,
    dropDups: true,
  },

  phoneNumber: {
    type: String,
    required: [true, 'Phone number must be provided'],
    unique: true,
  },

  city: {
    type: String,
    required: [true, "City must be provided"],
  },

  state: {
    type: String,
    required: [true, "State must be provided"],
  },

  password: {
    type: String,
    required: [true, "Password must be provided"],    
  },

  offices: {
    type: [{type: Schema.Types.ObjectId, ref: "Officer", required: true}]
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
    default: true, 
  }
},
{timestamps: true});

export default mongoose.model("Company", CompanySchema);