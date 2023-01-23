import {Request, Response, NextFunction} from "express";
import Receiver from "../models/receiverModel";
import Sender from "../models/SenderModel";

export const createReceiver = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const receiver = new Receiver(req.body)

    const newReceiver = await receiver.save();
    try {
      await Sender.findByIdAndUpdate(req.params.senderId, {
        $push: {customers: newReceiver}
      })
    } catch (err) {
      next(err)
    }

    res.status(200).json(newReceiver)

  } catch (err) {
    next(err)
  }
}