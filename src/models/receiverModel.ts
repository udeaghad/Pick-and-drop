import mongoose from "mongoose";

const { Schema } = mongoose;

interface ReceiverInterface {
  name: string,
  phoneNumber: string;
  city: String;
}

interface ReceiverMethod extends ReceiverInterface {
  updateSender: () => void;
}

const ReceiverModel = new Schema<ReceiverInterface, ReceiverMethod>({
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