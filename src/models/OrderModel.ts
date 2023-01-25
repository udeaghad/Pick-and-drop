import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

type DeliverPoint = "Park" | "Home";
type DeliveryStatus = "Pending" | "Viewed" | "Received" | "On Transit" | "Delivered";
interface OrderInterface {
  content: string;
  companyId: Types.ObjectId;
  receiverId: Types.ObjectId;
  senderId: Types.ObjectId;
  officerId: Types.ObjectId;
  deliveryPoint: DeliverPoint;
  serviceFee: number;
  RegisteredWaybill: boolean;
  status: DeliveryStatus;
  deliveryAgent: string;
  viewedBy: string;
  pickedBy: string;
  driverNumber: string;
  orderDate: number;
}


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

  officerId: {
    type: Schema.Types.ObjectId,
    ref: "Officer",
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

  driverNumber: {
    type: String,
  },

  orderDate: {
    type: Number,
    default: Date.now(),
  }
},
{timestamps: true}
);

export default mongoose.model("Order", OrderSchema);