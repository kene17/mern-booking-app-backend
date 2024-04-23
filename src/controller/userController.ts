import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const createNewUser = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }
    user = new User(req.body);

    await user.save();
    //store userId in the token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    //were setting the token, so we dont need to send anything to the frontend
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1,
      secure: process.env.NODE_ENV === "production",
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export default { createNewUser };