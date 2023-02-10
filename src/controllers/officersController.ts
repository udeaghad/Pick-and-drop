import {Request, Response, NextFunction} from "express"
import { Types } from "mongoose";
import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";
import { IOfficer } from "../models/OfficerModel";

interface Officer extends IOfficer {
  _id: Types.ObjectId;
}

export const getAllOfficers = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const allOfficers: Officer[] = await Officer.find({company: req.params.companyId})
                                                .lean()
                                                .populate("company", "name");

    const result = allOfficers.map(officer => {     
    const {password, ...otherDetails } = officer;
      return otherDetails;
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export const getOfficer = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const officer: Officer | null = await Officer.findOne({company: req.params.companyId, _id: req.params.officerId})
                                                 .lean()
                                                 .populate("company", "name");
    if(!officer) return res.status(400).send("Record not found")
    const { password, ...otherDetails } = officer;
    res.status(200).json(otherDetails)
  } catch (err) {
    next(err)
  }
}

export const updateOfficer = async(req: Request, res: Response, next: NextFunction) => {
  if(req.cookies.cookies.id !== req.params.officerId && (req.cookies.cookies.id !== req.params.companyId || !req.cookies.cookies.isAdmin)){
    return res.status(401).send("You are not authorised to make changes")
  }
    try {
      const {password, ...bodyDetails } = req.body;
  
      const officer: Officer | null= await Officer.findByIdAndUpdate(req.params.officerId, {$set: bodyDetails}, {new: true})
                                                  .lean()
                                                  .populate("company", "name");
      
      if(!officer) return res.status(400).send("Record does not exist")
      
      const { password: officerPassword, ...otherDetails } = officer;
      
      res.status(200).json(otherDetails);
    } catch (err) {
      next(err)
    }
    
}

export const deleteOfficer = async(req: Request, res: Response, next: NextFunction) => {
  if(req.cookies.cookies.id !==req.params.companyId || !req.cookies.cookies.isAdmin) {
    return res.status(401).send("You are not authorised to perform this action")
  }

    try {
      
      const officer = await Officer.findById(req.params.officerId);
      await Company.findByIdAndUpdate(officer?.company, { $pull: {offices: req.params.officerId}})
      await officer?.deleteOne();
      res.status(200).send("Officer deleted successfully");
  
    } catch (err) {
      next(err)
    }
}