import Company from "../models/CompanyModel";
import Officer from "../models/OfficerModel";
import bcrypt from "bcryptjs";
import jwt, {Secret} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import { Types } from "mongoose";

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
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt)

    const newCompany = new Company<RegisterCompanyType>({
      name,
      email,
      phoneNumber,
      city,
      state,
      password: hash,
    })

    const companyExist: RegisterCompanyType | null = await Company.findOne({name});

    if(companyExist){
      return res.send("Company already exist");
    } else { 

      await newCompany.save();
      res.status(201).send("Company created successfully")
    }

  } catch (err) {
    next(err);
  }
}


export const updateCompanyPassword = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id === req.params.companyId){

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      await Company.findByIdAndUpdate(
        req.params.companyId, {$set: {password: hash}}, {new: true} 
      )
      res.status(200).send("Password updated successfully");
    } catch (err) {
      next(err)
    }
  }else {
    res.status(401).send("You are not authorised to perform this action")
  }
}

export const registerOfficer = async(req: Request, res: Response, next: NextFunction) => {
  const { name, address, companyId, location, phoneNumber, password}: RegisterOfficerType = req.body;
   
  if(req.cookies.cookies.id === companyId && req.cookies.cookies.isAdmin){

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      
      const newOfficer = new Officer<RegisterOfficerType>({
        name,
        address, 
        companyId,
        location,
        phoneNumber,
        password: hash,
      })
      
      const officerExist: RegisterOfficerType | null = await Officer.findOne({phoneNumber});
      
      if(officerExist){
        return res.send("Officer with the phone number already exist")
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

// export const officerLogin = async(req: Request, res: Response, next: NextFunction) => {
  //   try {
    //     const officer: OfficerType | null = await Officer.findOne({email: req.body.phoneNumber});
    //     if(!officer) return res.status(404).send("Account doesnot exist");
    
    //     const {_id, password, ...otherDetails} = officer._doc;
    
    //     const validPassword = await bcrypt.compare(req.body.password, password);
    //     if(!validPassword) return res.status(404).send("Invalid password")
    
    //     const token = jwt.sign({id: _id}, secretKey)
    
    //     res
    //     .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true})
    //     .status(200).json({ _id, ...otherDetails });
    
    //   } catch (err) {
      //     next(err)
      //   }
      // }
      
export const updateOfficerPassword = async(req: Request, res: Response, next: NextFunction) => {
  
  if(req.cookies.cookies.id === req.params.officerId){

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
       await Officer.findByIdAndUpdate(
         req.params.officerId, {$set: {password: hash}}, {new: true} 
         )
      res.status(200).send("Password updated successfully");
    } catch (err) {
      next(err)
    }
  }else {
    res.status(401).send("You are not authorised to perform this action")
  }
}
  
export const companyLogin = async(req: Request, res: Response, next: NextFunction) => {  
    
  const company: CompanyType | null = await Company.findOne({email: req.body.email});
  const officer: OfficerType | null = await Officer.findOne({phoneNumber: req.body.phoneNumber});
  // if(!company) return res.status(404).json({status: 404, message: "Company not found"}) 
  
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
          // const officer: OfficerType | null = await Officer.findOne({email: req.body.phoneNumber});
          if(!officer) return res.status(404).send("Account doesnot exist");
      
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
