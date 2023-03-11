import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";
import jwt, {Secret} from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {Request, Response, NextFunction} from "express";
import { Types } from "mongoose";
import hashPassword from "../utils/hashPassword";
import { ICompany } from "../models/CompanyModel";
import { IOfficer } from "../models/OfficerModel";

interface Company extends ICompany {
  _id: Types.ObjectId
}

interface Officer extends IOfficer {
  _id: Types.ObjectId
}
const secretKey: Secret = String(process.env.JWT);

export const registerCompany = async(req:Request, res:Response, next:NextFunction) => {
  const {name, email, phoneNumber, city, state, password, confirmPassword, logo} = req.body;

  if(password !== confirmPassword) return res.status(401).send("Password does not match");

  try {

    const newCompany = new Company({
      name,
      email,
      phoneNumber,
      city,
      state,
      password: hashPassword(password),
    })

    const companyExist: Company | null = await Company.findOne({name});

    if(companyExist) return res.status(409).send("Company already exist");
   

    await newCompany.save();
    res.status(201).send("Company created successfully")
    

  } catch (err) {
    next(err);
  }
}


export const updateCompanyPassword = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id !== req.params.companyId) return res.status(401).send("You are not authorised to perform this action");

    const { currentPassword, newPassword } = req.body
  
    try {
      
      const company: Company | null  = await Company.findById(req.params.companyId).lean()

      if(company) {

        const { password } = company;
        const validPassword = await bcrypt.compare(currentPassword, password);
        if(!validPassword) return res.status(401).send("Invalid Login Details")

        await Company.findByIdAndUpdate(
          req.params.companyId, {$set: {password: hashPassword(newPassword)}}, {new: true} 
        )
        res.status(200).send("Password updated successfully");
      }
    } catch (err) {
      next(err)
    }
  
}

export const registerOfficer = async(req: Request, res: Response, next: NextFunction) => {
  
  const { name, address, company, location, phoneNumber, password, confirmPassword} = req.body;
   
  if(req.cookies.cookies.id !== company || !req.cookies.cookies.isAdmin) return res.status(401).send("You are not authorised to perform this action")
  
  if(password !== confirmPassword) return res.status(401).send("Password does not match");
    try {
      
      const newOfficer = new Officer({
        name,
        address, 
        company,
        location,
        phoneNumber,
        password: hashPassword(password),
      })
      
      const officerExist: Officer | null = await Officer.findOne({phoneNumber});
      
      if(officerExist){
        
        return res.status(409).send("Officer with the phone already exist")
      } else {
        await newOfficer.save();
        
        await Company.findByIdAndUpdate(company, { $push: {offices: newOfficer}})
        
        res.status(201).send("Officer created successfully");
      }
    } catch (err) {
      next(err)
    }    
  
}
      
export const updateOfficerPassword = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id !== req.params.officerId) return res.status(401).send("You are not authorised to perform this action")
      const { currentPassword, newPassword } = req.body
    try {
      const officer: Officer | null  = await Officer.findById(req.params.officerId).lean()

      if (officer) {
        const { password } = officer;
        const validPassword = await bcrypt.compare(currentPassword, password);
        if(!validPassword) return res.status(401).send("Invalid Login Details")

        await Officer.findByIdAndUpdate(
          req.params.officerId, {$set: {password: hashPassword(newPassword)}}, {new: true} 
          )
          res.status(200).send("Password updated successfully");
      }
  
    } catch (err) {
      next(err)
    }
  
}
  
export const Login = async(req: Request, res: Response, next: NextFunction) => { 
  
  const [company, officer] = await Promise.all([
    Company.findOne({email: req.body.email}).lean().populate("offices", ["name", "location"]),
    Officer.findOne({phoneNumber: req.body.phoneNumber}).lean().populate("company", ["name", "city" ]),
  ]);
 
  if(!company && !officer ) return res.status(401).send("Invalid Login Details")

  if(company){
    try {
        const {_id, password, ...otherDetails }  = company;
        
        const validPassword = await bcrypt.compare(req.body.password, password);
        if(!validPassword) return res.status(401).send("Invalid Login Details")
    
        const token = jwt.sign({id: _id, isAdmin: otherDetails.isAdmin}, secretKey)   
    
        res
        .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true})
        .status(200).json({ _id, ...otherDetails });
        
      } catch (err) {
        next(err)
      }
  }
  
  if(officer) {
    try {
          const {_id, password, ...otherDetails} = officer;
      
          const validPassword = await bcrypt.compare(req.body.password, password);
          if(!validPassword) return res.status(401).send("Invalid Login Details")
      
          const token = jwt.sign({id: _id, isAdmin: otherDetails.isAdmin}, secretKey)
      
          res
          .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true})
          .status(200).json({ _id, ...otherDetails });
      
        } catch (err) {
          next(err)
        }
  }
  
}
