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

export const getCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const company: CompanyType | null = await CompanyModel.findById(req.params.companyId);
    if(!company) return res.status(404).send("Record not found")
    const { password, ...otherDetails } = company._doc;
    res.status(200).json(otherDetails)
  } catch (err) {
    next(err)
  }
}

export const updateCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {password, ...bodyDetails } = req.body;
    const company: CompanyType | null= await CompanyModel.findByIdAndUpdate(req.params.companyId, {$set: bodyDetails}, {new: true})
    if(!company) return res.status(400).send("Record does not exist")
    const { password: companyPassword, ...otherDetails } = company._doc;
    res.status(200).json(otherDetails);
  } catch (err) {
    next(err)
  }
}