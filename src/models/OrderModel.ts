import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const status = ["Pending", "Viewed", "Received", "On Transit", "Delivered"] as const;

export type Status = typeof status[number];

export type DeliverPoint = "Park" | "Home";

export interface IOrder {
  content: string;
  company: Types.ObjectId;
  receiver: Types.ObjectId;
  sender: Types.ObjectId;
  officer: Types.ObjectId;
  deliveryPoint: DeliverPoint;
  deliveryAddress: string;
  serviceFee: number;
  RegisteredWaybill: boolean;
  status: Status;
  deliveryAgent: string;
  viewedBy: string;
  pickedBy: string;
  driverNumber: string;
  orderDate: Date;
}


const OrderSchema = new Schema<IOrder>({
  content: {
    type: String,
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  receiver: {
    type: Schema.Types.ObjectId,
    ref: "Receiver",
    required: true
  },

  sender: {
    type: Schema.Types.ObjectId,
    ref: "Sender",
    required: true,
  },

  officer: {
    type: Schema.Types.ObjectId,
    ref: "Officer",
    required: true,
  },

  deliveryPoint: {
    type: String,
    enum: ["Park", "Home"],
    required: true,
  },

  deliveryAddress: {
    type: String,
    required: true
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
    enum: status,
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
    type: Date,
    default: Date.now(),
  }
},
{timestamps: true}
);

export default mongoose.model("Order", OrderSchema);