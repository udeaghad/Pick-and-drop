import {Request, Response, NextFunction} from "express";
import Receiver from "../models/receiverModel";
import Sender from "../models/SenderModel";

interface ReceiverInterface {
  name: string;
  phoneNumber: string;
  city: String;
}

export const createReceiver = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const receiver = new Receiver(req.body)

     await receiver.save();
    try {
      await Sender.findByIdAndUpdate(req.params.senderId, {
        $push: {customers: receiver}
      })
    } catch (err) {
      next(err)
    }

    res.status(200).json(receiver)

  } catch (err) {
    next(err)
  }
}

export const updateReceiver = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const receiver = await Receiver.findByIdAndUpdate(req.params.receiverId, {$set: req.body}, {new: true})
    res.status(200).json(receiver);
  } catch (err) {
    next(err)
  }
}