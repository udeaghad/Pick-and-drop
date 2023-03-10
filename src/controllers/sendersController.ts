import {Request, Response, NextFunction} from "express";
import { Types } from "mongoose";
import client from "../utils/redisConnect";
import Sender from "../models/SenderModel";
import { ISender } from "../models/SenderModel";

interface Sender extends ISender {
  _id: Types.ObjectId;
}


export const createSender = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const senderExist: Sender | null = await Sender.findOne({phoneNumber: req.body.phoneNumber}).lean();

    if(senderExist) return res.status(409).json( senderExist );

    const sender = new Sender(req.body)    

    await sender.save();
    res.status(201).json(sender)
  } catch (err) {
    next(err)
  }
}

export const updateSender = async(req: Request, res: Response, next: NextFunction) => {
   try {
     const sender: Sender | null = await Sender.findByIdAndUpdate(req.params.senderId, {$set: req.body}, {new: true})
     res.status(200).json(sender);
   } catch (err) {
     next(err)
   }
}

export const getSender = async(req: Request, res: Response, next: NextFunction) => {
  try {

    const cachedResult = await client.get(`sender-${req.params.senderId}`);

    if(cachedResult) return res.status(200).json(JSON.parse(cachedResult));

    const sender: Sender | null = await Sender.findById(req.params.senderId)
                                              .lean()
                                              .populate("customers", ["name", "phoneNumber", "city"]);

    if(!sender) return res.status(404).send("Sender Info does not exist")

    await client.setEx(`sender-${req.params.senderId}`, 3600, JSON.stringify(sender));
    res.status(200).json(sender)
  } catch (err) {
    next(err)
  }
}