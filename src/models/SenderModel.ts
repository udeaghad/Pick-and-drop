import mongoose, { Types } from "mongoose";

const {Schema} = mongoose;

interface SenderType {
  name: string;
  phoneNumber: string;
  address: string;
  location: string;
  orders: Types.ObjectId[];
  customers: Types.ObjectId[];
}

const senderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },

  address: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  orders: {
    type: [{type: Schema.Types.ObjectId, ref: "Order",required: true }],
  },

  customers: {
    type: [{type: Schema.Types.ObjectId, ref: "Receiver", required: true}]
  },
  
},
{timestamps: true});

export default mongoose.model("Sender", senderSchema);


