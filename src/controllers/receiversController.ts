import {Request, Response, NextFunction} from "express";
import client from "../utils/redisConnect";
import { Types } from "mongoose";
import Receiver from "../models/receiverModel";
import Sender from "../models/SenderModel";
import { IReceiver } from "../models/receiverModel";

interface Receiver extends IReceiver {
  _id: Types.ObjectId;
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

    res.status(201).json(receiver)

  } catch (err) {
    next(err)
  }
}

export const updateReceiver = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const receiver: Receiver | null = await Receiver.findByIdAndUpdate(req.params.receiverId, {$set: req.body}, {new: true})
    res.status(200).json(receiver);
  } catch (err) {
    next(err)
  }
}

export const getReceiver = async(req: Request, res: Response, next: NextFunction) => {
  try {

    const cachedResult = await client.get(`receiver-${req.params.receiverId}`)

    if(cachedResult) return res.status(200).json(JSON.parse(cachedResult))

    const receiver: Receiver | null = await Receiver.findById(req.params.receiverId).lean();

    if(!receiver) return res.status(404).send("Receiver records does not exisit")

    await client.setEx(`receiver-${req.params.receiverId}`, 60, JSON.stringify(receiver))

    res.status(200).json(receiver)
  } catch (err) {
    next(err)
  }
}