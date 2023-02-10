import { Request, Response, NextFunction } from "express";
import Order from "../models/OrderModel";
import Officer from "../models/OfficerModel";
import { IOrder, Status } from "../models/OrderModel";

interface Order extends IOrder {
  _id: string;
}

export const createOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const order = new Order(req.body);
    await order.save();

    const officer = await Officer.findById(order.officer);
    officer?.updateStatus("Pending");    
    officer?.save();

    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
}

export const updateOrder = async(req: Request, res: Response, next: NextFunction) => {
  try {

    const order = await Order.findByIdAndUpdate(req.params.orderId, { $set: req.body }, { new: true})
                             .lean()
                             .populate("receiver", ["name", "phoneNumber", "city"])
                             .populate("sender", ["name", "phoneNumber", "address", "location"])
                             .populate("company", "name")
                             .populate("officer", ["name", "phoneNumber", "location"]);
    const status: Status = req.body.status
    if(status){
      const officer = await Officer.findById(order?.officer)
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
    const order: Order | null = await Order.findById(req.params.orderId)
                                           .lean()
                                           .populate("receiver", ["name", "phoneNumber", "city" ])
                                           .populate("sender", ["name", "phoneNumber", "address", "location"])
                                           .populate("company", "name")
                                           .populate("officer", ["name", "phoneNumber", "location"]);;

    if(!order) return res.status(404).send(`Order with ID-${req.params.orderId} does not exist`);

    res.status(200).json(order);

  } catch (err) {
    next(err)
  }
}

export const getOrdersByDates = async(req: Request, res: Response, next: NextFunction) => {
 
    try {
      const {startDate, endDate} = req.query;
      const OneDayValue: number = 83000000;
      
      if(!startDate) return res.status(400).send("You need to enter the startDate and endDate in the query")
      
      if(startDate && !endDate){
        const todayOrder = await Order.find({
          orderDate: { $gte: Date.parse(startDate.toString())},
          company: req.params.companyId,         
        })
        .lean()
        .populate("receiver", ["name", "phoneNumber", "city"])
        .populate("sender", ["name", "phoneNumber", "address", "location"])
        .populate("company", "name")
        .populate("officer", ["name", "phoneNumber", "location"])
        .sort({orderDate: 'desc'})

        return res.status(200).json(todayOrder)
      }
      
      if(startDate && endDate){        
        const orderByDateRange = await Order.find({
          orderDate: {
            $gte: Date.parse(startDate.toString()),
            $lt: Date.parse(endDate.toString()) + OneDayValue,
          },
          company: req.params.companyId,
        })
        .lean()
        .populate("receiver", ["name", "phoneNumber", "city"])
        .populate("sender", ["name", "phoneNumber", "address", "location"])
        .populate("company", "name")
        .populate("officer", ["name", "phoneNumber", "location"]).sort({orderDate: 'desc'})

        return res.status(200).json(orderByDateRange);
      }
    } catch (err) {
      next(err)
    }
}