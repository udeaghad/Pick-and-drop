import {Request, Response, NextFunction} from "express";
import { Types } from "mongoose";
import Sender from "../models/SenderModel";

interface SenderInterface {
  _id?: Types.ObjectId;
  name: string;
  phoneNumber: string;
  address: string;
  location: string;
  orders: Types.ObjectId[];
  customers: Types.ObjectId[]; 
}

interface SenderType {
  _doc: SenderInterface;
}

export const createSender = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const senderExist: SenderType | null = await Sender.findOne({phoneNumber: req.body.phoneNumber});

    if(senderExist) return res.status(200).json({message: "Sender's record already exist", sender: senderExist._doc });

    const sender = new Sender(req.body)    

    await sender.save();
    res.status(200).json(sender)
  } catch (err) {
    next(err)
  }
}

export const updateSender = async(req: Request, res: Response, next: NextFunction) => {
   try {
     const sender = await Sender.findByIdAndUpdate(req.params.senderId, {$set: req.body}, {new: true})
     res.status(200).json(sender);
   } catch (err) {
     next(err)
   }
}

export const getSender = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const sender: SenderType | null = await Sender.findById(req.params.senderId)
    if(!sender) return res.status(404).send("Sender Info doesnot exist")
    res.status(200).json(sender)
  } catch (err) {
    next(err)
  }
}