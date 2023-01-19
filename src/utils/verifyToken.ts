import {Request, Response, NextFunction} from "express";
import jwt, { Secret } from "jsonwebtoken";

const SecretKey: Secret = String(process.env.JWT)

export const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
  const token: string | null = req.cookies.cookies
  if(!token) return {status: 404, message: "You are not authenticated!"}

  // const decoded = jwt.verify(token, SecretKey)
  // req.cookies.cookies = decoded;

  jwt.verify(token, SecretKey, (err, user) => {
    if(err) return {status: 403, message: "Token is invalid"}
    req.cookies.cookies = user;
    next();
  } )
}

