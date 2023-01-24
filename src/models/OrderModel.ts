import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

interface OrderInterface {
  content: string;
  companyId: Types.ObjectId;
  receiverId: Types.ObjectId;
  senderId: Types.ObjectId;
  deliveryPoint: DeliverPoint;
  serviceFee: number;
  RegisteredWaybill: boolean;
  status: DeliveryStatus;
  deliveryAgent: string;
  viewedBy: string;
  pickedBy: string;
  DriverNumber: string;
}

type DeliverPoint = "Park" | "Home";
type DeliveryStatus = "Pending" | "Viewed" | "Received" | "On Transit" | "Delivered";

const OrderSchema = new Schema<OrderInterface>({
  content: {
    type: String,
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "Receiver",
    required: true
  },

  senderId: {
    type: Schema.Types.ObjectId,
    ref: "Sender",
    required: true,
  },

  deliveryPoint: {
    type: String,
    enum: ["Park", "Home"],
    required: true,
  },

  serviceFee: {
    type: Number,
    required: true,
  },

  RegisteredWaybill: {
    type: Boolean,
    required: true
  },

  status: {
    type: String,
    enum: [ "Pending","Viewed", "Received", "On Transit", "Delivered" ],
    default: "Pending",
    required: true,
  },

  deliveryAgent: {
    type: String,
  },

  viewedBy: {
    type: String,
  },

  pickedBy: {
    type: String,
  },

  DriverNumber: {
    type: String,
  }
},
{timestamps: true}
);

export default mongoose.model("Order", OrderSchema);