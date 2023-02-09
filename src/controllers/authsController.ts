import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";
import jwt, {Secret} from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {Request, Response, NextFunction} from "express";
import { Types } from "mongoose";
import hashPassword from "../utils/hashPassword";
import { ICompany } from "../models/CompanyModel";
import { IOfficer } from "../models/OfficerModel";

interface RegisterCompanyType {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  password: string;
  offices?: Types.ObjectId[],
  logo?: string;
  rating?:number;
  isAdmin?: boolean;
};

interface CompanyType {
  _doc: RegisterCompanyType;
}

interface RegisterOfficerType {
  _id?: Types.ObjectId;
  name: string;
  password: string;
  address: string;
  companyId: Types.ObjectId;
  location: string;
  phoneNumber: string;
  pending?: number;
  viewed?: number;
  picked?: number;
  transit?: number;
  isAdmin?: boolean;
}

interface OfficerType {
  _doc: RegisterOfficerType;
}

const secretKey: Secret = String(process.env.JWT);

export const registerCompany = async(req:Request, res:Response, next:NextFunction) => {
  const {name, email, phoneNumber, city, state, password, logo}: RegisterCompanyType = req.body;
  try {

    const newCompany = new Company<RegisterCompanyType>({
      name,
      email,
      phoneNumber,
      city,
      state,
      password: hashPassword(password),
    })

    const companyExist: RegisterCompanyType | null = await Company.findOne({name});

    if(companyExist) return res.status(200).send("Company already exist");
   

    await newCompany.save();
    res.status(200).send("Company created successfully")
    

  } catch (err) {
    next(err);
  }
}


export const updateCompanyPassword = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id !== req.params.companyId){

    return res.status(401).send("You are not authorised to perform this action");

  } else {
    try {

      await Company.findByIdAndUpdate(
        req.params.companyId, {$set: {password: hashPassword(req.body.password)}}, {new: true} 
      )
      res.status(200).send("Password updated successfully");
    } catch (err) {
      next(err)
    }
  }
}

export const registerOfficer = async(req: Request, res: Response, next: NextFunction) => {
  const { name, address, companyId, location, phoneNumber, password}: RegisterOfficerType = req.body;
   
  if(req.cookies.cookies.id === companyId && req.cookies.cookies.isAdmin){

    try {
      
      const newOfficer = new Officer<RegisterOfficerType>({
        name,
        address, 
        companyId,
        location,
        phoneNumber,
        password: hashPassword(password),
      })
      
      const officerExist: OfficerType | null = await Officer.findOne({phoneNumber});
      
      if(officerExist){
        
        return res.status(302).send("Officer with the phone already exist")
      } else {
        await newOfficer.save();
        
        await Company.findByIdAndUpdate(companyId, { $push: {offices: newOfficer}})
        
        res.status(200).send("Officer created successfully");
      }
    } catch (err) {
      next(err)
    }    
  }else{
    res.status(401).send("You are not authorised to perform this action")
  }
}
      
export const updateOfficerPassword = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id === req.params.officerId){

    try {
  
       await Officer.findByIdAndUpdate(
         req.params.officerId, {$set: {password: hashPassword(req.body.password)}}, {new: true} 
         )
      res.status(200).send("Password updated successfully");
    } catch (err) {
      next(err)
    }
  }else {
    res.status(401).send("You are not authorised to perform this action")
  }
}
  
export const Login = async(req: Request, res: Response, next: NextFunction) => {  
    
  const company: CompanyType | null = await Company.findOne({email: req.body.email});
  const officer: OfficerType | null = await Officer.findOne({phoneNumber: req.body.phoneNumber});
 
  
  if(company){
    try {
        const {_id, password, ...otherDetails }  = company._doc;
    
        const validPassword = await bcrypt.compare(req.body.password, password);
        if(!validPassword) return res.status(404).json({status: 404, message: "Invalid Password"})
    
        const token = jwt.sign({id: _id, isAdmin: otherDetails.isAdmin}, secretKey)   
    
        res
        .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true})
        .status(200).json({ _id, ...otherDetails });
      } catch (err) {
        next(err)
      }
  }else if(officer) {
    try {
          const {_id, password, ...otherDetails} = officer._doc;
      
          const validPassword = await bcrypt.compare(req.body.password, password);
          if(!validPassword) return res.status(404).send("Invalid password")
      
          const token = jwt.sign({id: _id, isAdmin: otherDetails.isAdmin}, secretKey)
      
          res
          .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true})
          .status(200).json({ _id, ...otherDetails });
      
        } catch (err) {
          next(err)
        }
  }else {
    res.status(404).send("Account does not exist")
  }  
  
}
