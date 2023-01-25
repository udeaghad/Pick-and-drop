import {Request, Response, NextFunction} from "express"
import { Types } from "mongoose";
import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";


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
    const allOfficers: OfficerType[] = await Officer.find({companyId: req.params.companyId});

    const result: AllOfficerType[] = allOfficers.map(officer => {     
    const {password, ...otherDetails } = officer._doc;
      return otherDetails;
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export const getOfficer = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const officer: OfficerType | null = await Officer.findOne({companyId: req.params.companyId, _id: req.params.officerId});
    if(!officer) return res.status(404).send("Record not found")
    const { password, ...otherDetails } = officer._doc;
    res.status(200).json(otherDetails)
  } catch (err) {
    next(err)
  }
}

export const updateOfficer = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {password, ...bodyDetails } = req.body;

    const officer: OfficerType | null= await Officer.findByIdAndUpdate(req.params.officerId, {$set: bodyDetails}, {new: true})
    
    if(!officer) return res.status(400).send("Record does not exist")
    
    const { password: officerPassword, ...otherDetails } = officer._doc;
    
    res.status(200).json(otherDetails);
  } catch (err) {
    next(err)
  }
}

export const deleteOfficer = async(req: Request, res: Response, next: NextFunction) => {
  try {
    
    const officer = await Officer.findById(req.params.officerId);
    await Company.findByIdAndUpdate(officer?.companyId, { $pull: {offices: req.params.officerId}})
    await officer?.deleteOne();
    res.status(200).send("Officer deleted successfully");

  } catch (err) {
    next(err)
  }
}