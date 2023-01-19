import CompanyModel from "../models/CompanyModel";
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
  logo?: string;
  rating?:number;
};

interface CompanyType {
  _doc: RegisterCompanyType;
}

const secretKey: Secret = String(process.env.JWT);

export const registerCompany = async(req:Request, res:Response, next:NextFunction): Promise<void> => {
  const {name, email, phoneNumber, city, state, password, logo}: RegisterCompanyType = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt)

    const newCompany = new CompanyModel<RegisterCompanyType>({
      name,
      email,
      phoneNumber,
      city,
      state,
      password: hash,
    })

    await newCompany.save();
    res.status(201).send("User created successfully")
  } catch (err) {
    next(err);
  }
}

export const companyLogin = async(req: Request, res: Response, next: NextFunction) => {
  
  try {
    const company: CompanyType | null = await CompanyModel.findOne({email: req.body.email});
    
    if(!company) return res.status(404).json({status: 404, message: "Company not found"}) 

    const {_id, name, email, phoneNumber, city, state, password, logo, rating}  = company._doc;

    const validPassword = await bcrypt.compare(req.body.password, password);
    if(!validPassword) return res.status(404).json({status: 404, message: "Invalid Password"})

    const token = jwt.sign({id: _id}, secretKey)   

    res
    .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true})
    .status(200).json({ _id, name, email, phoneNumber, city, state, logo, rating });
  } catch (err) {
    next(err)
  }
}

export const updateCompanyPassword = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

     await CompanyModel.findByIdAndUpdate(
      req.params.companyId, {$set: {password: hash}}, {new: true} 
    )
    res.status(200).send("Password updated successfully");
  } catch (err) {
    next(err)
  }
}