import {Request, Response, NextFunction} from "express"
import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";
import { ICompany } from "../models/CompanyModel";

interface Company extends ICompany {
  _id: string;
}

export const getAllCompanies = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const allCompanies: Company[] = await Company.find().lean();

    const result = allCompanies.map(company => {     
    const {password, ...otherDetails } = company;
      return otherDetails;
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
};

export const getCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const company: Company | null = await Company.findById(req.params.companyId).lean();
    if(!company) return res.status(404).send("Record not found")
    const { password, ...otherDetails } = company;
    res.status(200).json(otherDetails)
  } catch (err) {
    next(err)
  }
}

export const updateCompany = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id === req.params.companyId && req.cookies.cookies.isAdmin){

    try {
      const {password, ...bodyDetails } = req.body;
  
      const company: Company | null = await Company.findByIdAndUpdate(req.params.companyId, {$set: bodyDetails}, {new: true}).lean();
      
      if(!company) return res.status(400).send("Record does not exist")
      
      const { password: companyPassword, ...otherDetails } = company;
      
      res.status(200).json(otherDetails);
    } catch (err) {
      next(err)
    }
  }else {
    res.status(401).send("You are not authorised to make changes")
  }
}

export const deleteCompany = async(req: Request, res: Response, next: NextFunction) => {

  if(req.cookies.cookies.id !== req.params.companyId || !req.cookies.cookies.isAdmin) {
    return res.status(401).send("You are not authorised to perform this action")
  }

    try {
      
      await Company.findByIdAndDelete(req.params.companyId);
      const offices = await Officer.find({companyId: req.params.companyId})
  
      offices.forEach(item => item.deleteOne())
      
      res.status(200).send("Company deleted successfully");
  
    } catch (err) {
      next(err)
    }
  
}