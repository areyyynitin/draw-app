import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config";



export function authMiddleware(req:Request,res:Response,next:NextFunction){
    try {
        const authHeaders = req.headers.authorization;
        if(!authHeaders){
            return res.status(401).json({message:"Authorization header is missing"});
        }

        const token = authHeaders.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"token is missing"})
        }

        const decoded = jwt.verify(token,JWT_SECRET)  as jwt.JwtPayload;
        req.userId = decoded.userId;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}