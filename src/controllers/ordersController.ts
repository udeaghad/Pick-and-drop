import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import Order from "../models/OrderModel";
import Officer from "../models/OfficerModel";

type DeliverPoint = "Park" | "Home";
type DeliveryStatus = "Pending" | "Viewed" | "Received" | "On Transit" | "Delivered";

interface OrderInterface {
  _id?: string;
  content: string;
  companyId: Types.ObjectId;
  receiverId: Types.ObjectId;
  senderId: Types.ObjectId;
  officerId: Types.ObjectId;
  deliveryPoint: DeliverPoint;
  serviceFee: number;
  RegisteredWaybill: boolean;
  status: DeliveryStatus;
  deliveryAgent?: string;
  viewedBy?: string;
  pickedBy?: string;
  driverNumber?: string;
  orderDate: Date;
}

interface OrderType {
  _doc: OrderInterface;
}

export const createOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const order = new Order(req.body);
    await order.save();

    const officer = await Officer.findById(order.officerId);
    officer?.updateStatus("Pending");    
    officer?.save();

    res.status(200).json(order)
  } catch (err) {
    next(err)
  }
}

export const updateOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {

    const order = await Order.findByIdAndUpdate(req.params.orderId, { $set: req.body }, { new: true});
    const status: DeliveryStatus = req.body.status
    if(status){
      const officer = await Officer.findById(order?.officerId)
      officer?.updateStatus(status);
      officer?.save();
    }

    res.status(200).json(order)
  } catch (err) {
    next(err)
  }
}

export const getOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const order: OrderType | null = await Order.findById(req.params.orderId);

    if(!order) return res.status(400).send(`Order with ID-${req.params.orderId} does not exist`);

    res.status(200).json(order);

  } catch (err) {
    next(err)
  }
}

export const getOrdersByDates = async(req: Request, res: Response, next: NextFunction) => {
 
    try {
      const {startDate, endDate} = req.query;

      if(!startDate) return res.status(404).send("You need to enter the startDate and endDate in the query")
      
      if(startDate && !endDate){
        const todayOrder = await Order.find({
          orderDate: { $gte: Date.parse(startDate.toString())},
          companyId: req.params.companyId,         
        }).sort({orderDate: 'desc'})

        return res.status(200).json(todayOrder)
      }
      
      if(startDate && endDate){        
        const orderByDateRange = await Order.find({
          orderDate: {
            $gte: Date.parse(startDate.toString()),
            $lt: Date.parse(endDate.toString()) + 83000000,
          },
          companyId: req.params.companyId,
        }).sort({orderDate: 'desc'})

        return res.status(200).json(orderByDateRange);
      }
    } catch (err) {
      next(err)
    }
}