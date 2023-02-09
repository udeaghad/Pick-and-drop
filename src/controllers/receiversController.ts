import {Request, Response, NextFunction} from "express";
import Receiver from "../models/receiverModel";
import Sender from "../models/SenderModel";
import { IReceiver } from "../models/receiverModel";

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
    const receiver: IReceiver | null = await Receiver.findByIdAndUpdate(req.params.receiverId, {$set: req.body}, {new: true})
    res.status(200).json(receiver);
  } catch (err) {
    next(err)
  }
}

export const getReceiver = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const receiver: IReceiver | null = await Receiver.findById(req.params.receiverId).lean();
    if(!receiver) return res.status(404).send("Receiver records does not exisit")

    res.status(200).json(receiver)
  } catch (err) {
    next(err)
  }
}