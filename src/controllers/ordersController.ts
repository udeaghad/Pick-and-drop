import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Orders from "../models/OrderModel";

type DeliverPoint = "Park" | "Home";
type DeliveryStatus = "Pending" | "Viewed" | "Received" | "On Transit" | "Delivered";

interface OrderInterface {
  _id?: string;
  content: string;
  companyId: Types.ObjectId;
  receiverId: Types.ObjectId;
  senderId: Types.ObjectId;
  deliveryPoint: DeliverPoint;
  serviceFee: number;
  RegisteredWaybill: boolean;
  status: DeliveryStatus;
  deliveryAgent?: string;
  viewedBy?: string;
  pickedBy?: string;
  DriverNumber?: string;
}

interface OrderType {
  _doc: OrderInterface;
}

export const createOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const order = new Orders(req.body);
    await order.save();
    res.status(200).json(order)
  } catch (err) {
    next(err)
  }
}

export const updateOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const order: OrderType | null = await Orders.findByIdAndUpdate(req.params.orderId, { $set: req.body }, { new: true});

    res.status(200).json(order)
  } catch (err) {
    next(err)
  }
}

export const getOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const order: OrderType | null = await Orders.findById(req.params.orderId);

    if(!order) return res.status(400).send(`Order with ID-${req.params.orderId} does not exist`);
    
    res.status(200).json(order);

  } catch (err) {
    next(err)
  }
}