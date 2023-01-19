import {Request, Response, NextFunction} from "express"
import { Types } from "mongoose";
import CompanyModel from "../models/CompanyModel";

interface AllCompanyType {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  password?: string;
  logo?: string;
  rating?:number;
};

interface CompanyType {
  _doc: AllCompanyType;
}

export const getAllCompanies = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const allCompanies: CompanyType[] = await CompanyModel.find();

    const result: AllCompanyType[] = allCompanies.map(company => {     
    const {password, ...otherDetails } = company._doc;
      return otherDetails;
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
};