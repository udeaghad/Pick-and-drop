import CompanyModel from "../models/CompanyModel";
import bcrypt from "bcryptjs";
import jwt, {Secret} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";

interface RegisterCompanyType {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: number;
  city: string;
  state: string;
  password: string;
  logo: string;
  rating?:number;
};


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
      logo,
    })

    await newCompany.save();
    res.status(201).send("User created successfully")
  } catch (err) {
    next(err);
  }
}

export const companyLogin = async(req: Request, res: Response, next: NextFunction) => {
  
  try {
    const company: RegisterCompanyType | null = await CompanyModel.findOne({email: req.body.email});
    if(!company) return {status: 404, message: "Company not found"};

    const validPassword = await bcrypt.compare(req.body.password, company.password);
    if(!validPassword) return {status: 404, message: "Invalid Password"}

    const token = jwt.sign({id: company._id}, secretKey)    

    const {password, ...otherDetails } = company;

    res
    .cookie("cookies", token, { httpOnly: true, sameSite: "none", secure: true})
    .status(200).json(otherDetails);
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