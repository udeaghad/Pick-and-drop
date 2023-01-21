import {Request, Response, NextFunction} from "express"
import { Types } from "mongoose";
import OfficerModel from "../models/OfficerModel";


interface AllOfficerType {
  _id: Types.ObjectId;
  name: string;
  password?: string;
  address: string;
  companyId: Types.ObjectId;
  location: string;
  phoneNumber: string;
  pending?: number;
  viewed?: number;
  picked?: number;
  transit?: number;
}

interface OfficerType {
  _doc: AllOfficerType;
}

export const getAllOfficers = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const allOfficers: OfficerType[] = await OfficerModel.find();

    const result: AllOfficerType[] = allOfficers.map(officer => {     
    const {password, ...otherDetails } = officer._doc;
      return otherDetails;
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}