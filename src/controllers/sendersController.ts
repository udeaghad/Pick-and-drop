import {Request, Response, NextFunction} from "express";
import { Types } from "mongoose";
import SenderModel from "../models/SenderModel";

interface SenderInterface {
  name: string;
  phoneNumber: string;
  Address: string;
  location: string;
  orders: Types.ObjectId[];
  customers: Types.ObjectId[];
}

export const createSender = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const sender = new SenderModel(req.body)

    await sender.save();

    res.send(200).json(sender)
  } catch (err) {
    next(err)
  }
}