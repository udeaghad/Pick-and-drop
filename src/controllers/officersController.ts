import {Request, Response, NextFunction} from "express"
import { Types } from "mongoose";
import officerModel from "../models/OfficerModel";

interface RegisterOfficerType {
  _id: Types.ObjectId;
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
}

interface OfficerType {
  _doc: RegisterOfficerType;
}