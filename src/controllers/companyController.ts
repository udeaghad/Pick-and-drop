import {Request, Response, NextFunction} from "express"
import { Types } from "mongoose";
import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";

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
  isAdmin?: boolean;
};

interface CompanyType {
  _doc: AllCompanyType;
}

export const getAllCompanies = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const allCompanies: CompanyType[] = await Company.find();

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
    const company: CompanyType | null = await Company.findById(req.params.companyId);
    if(!company) return res.status(404).send("Record not found")
    const { password, ...otherDetails } = company._doc;
    res.status(200).json(otherDetails)
  } catch (err) {
    next(err)
  }
}

export const updateCompany = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id === req.params.companyId && req.cookies.cookies.isAdmin){

    try {
      const {password, ...bodyDetails } = req.body;
  
      const company: CompanyType | null= await Company.findByIdAndUpdate(req.params.companyId, {$set: bodyDetails}, {new: true})
      
      if(!company) return res.status(400).send("Record does not exist")
      
      const { password: companyPassword, ...otherDetails } = company._doc;
      
      res.status(200).json(otherDetails);
    } catch (err) {
      next(err)
    }
  }else {
    res.status(401).send("You are not authorised to make changes")
  }
}

export const deleteCompany = async(req: Request, res: Response, next: NextFunction) => {
  if(req.cookies.cookies.id === req.params.companyId && req.cookies.cookies.isAdmin){

    try {
      
      await Company.findByIdAndDelete(req.params.companyId);
      const offices = await Officer.find({companyId: req.params.companyId})
  
      offices.forEach(item => item.deleteOne())
      
      res.status(200).send("Company deleted successfully");
  
    } catch (err) {
      next(err)
    }
  }else {
    res.status(401).send("You are not authorised to perform this action")
  }
}