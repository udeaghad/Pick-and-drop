import {Request, Response, NextFunction} from "express"
import { Types } from "mongoose";
import client from "../utils/redisConnect";
import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";
import { ICompany } from "../models/CompanyModel";

interface Company extends ICompany {
  _id: Types.ObjectId;
}

export const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cachedResult = await client.get('allCompanies')
      
    if(cachedResult) { 
      return res.status(200).json(JSON.parse(cachedResult))
    }
    const allCompanies: Company[] = await Company.find().lean().populate("offices", ["name", "location"]);

    const result = allCompanies.map(company => {     
    const {password, ...otherDetails } = company;
    return otherDetails;

    })
    await client.setEx("allCompanies", 60, JSON.stringify(result))
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
};

export const getCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {

    const cachedResult = await client.get(`company-${req.params.companyId}`)
      
    if(cachedResult) { 
      return res.status(200).json(JSON.parse(cachedResult))
    }
    const company: Company | null = await Company.findById(req.params.companyId).lean().populate("offices", ["name", "location"]);
    if(!company) return res.status(404).send("Record not found")
    const { password, ...otherDetails } = company;

    await client.setEx(`company-${req.params.companyId}`, 60, JSON.stringify(otherDetails))
    res.status(200).json(otherDetails)
  } catch (err) {
    next(err)
  }
}

export const updateCompany = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id !== req.params.companyId || !req.cookies.cookies.isAdmin){
    return res.status(401).send("You are not authorised to make changes")
  }
    try {
      const {password, ...bodyDetails } = req.body;
  
      const company: Company | null = await Company.findByIdAndUpdate(req.params.companyId, {$set: bodyDetails}, {new: true}).lean().populate("offices", ["name", "location"]);
      
      if(!company) return res.status(400).send("Record does not exist")
      
      const { password: companyPassword, ...otherDetails } = company;
      
      res.status(200).json(otherDetails);
    } catch (err) {
      next(err)
    }
    
}

export const deleteCompany = async(req: Request, res: Response, next: NextFunction) => {

  if(req.cookies.cookies.id !== req.params.companyId || !req.cookies.cookies.isAdmin) {
    return res.status(401).send("You are not authorised to perform this action")
  }

    try {
      
      await Company.findByIdAndDelete(req.params.companyId);
      const offices = await Officer.find({company: req.params.companyId})
  
      offices.forEach(item => item.deleteOne())
      
      res.status(200).send("Company deleted successfully");
  
    } catch (err) {
      next(err)
    }
  
}