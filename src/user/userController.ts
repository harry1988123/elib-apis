import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { User } from "./userType";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating user...");
    const { name, email, password } = req.body;

    //validation
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }

    //Database call
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            const error = createHttpError(409, "User already exists");
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, "Internal server error"));
    }

    //password -> hash
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser: User;
    try {
        newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });
    } catch (error) {
        return next(createHttpError(500, "Error while creating user."));
    }

    try {
        //Create the JWT token
        const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
            expiresIn: "7d",
            algorithm: "HS256",
        });
        res.status(201).json({ accessToken: token });
    } catch (error) {
        return next(createHttpError(500, "Error while signing the jwt token"));
    }
};
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = createHttpError(400, "Email and password are required");
        return next(error);
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            const error = createHttpError(404, "User not found.");
            return next(error);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = createHttpError(401, "Invalid credentials");
            return next(error);
        }
        const token = sign({ sub: user._id }, config.jwtSecret as string, {
            expiresIn: "7d",
            algorithm: "HS256",
        });
        res.status(200).json({ accessToken: token });
    } catch (error) {
        return next(createHttpError(500, "Internal server error"));
    }
};

export { createUser, loginUser };
