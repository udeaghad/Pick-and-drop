import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IReceiver {
  name: string;
  phoneNumber: string;
  city: String;
}

const ReceiverModel = new Schema<IReceiver>({
  name: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  }
},
{timestamps: true})

export default mongoose.model("Receiver", ReceiverModel);